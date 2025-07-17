<template>
  <view class="pet-management-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">宠物管理</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 宠物列表 -->
    <view class="pet-list">
      <view 
        v-for="(pet, index) in pets" 
        :key="index" 
        class="pet-item"
        @tap="selectPet(pet)"
      >
        <image class="pet-avatar" :src="pet.avatar || defaultPetAvatar"></image>
        <view class="pet-info">
          <view class="pet-name">{{ pet.name }}</view>
          <view class="pet-details">
            <text>{{ pet.breed }}</text>
            <text>{{ pet.age }}岁</text>
            <text>{{ pet.healthStatus }}</text>
          </view>
        </view>
        <view class="pet-actions">
          <text class="edit-btn iconfont icon-edit" @tap.stop="editPet(pet)"></text>
          <text class="delete-btn" @tap.stop="deletePet(pet)">删除</text>
        </view>
      </view>
    </view>

    <!-- 添加宠物按钮 -->
    <view class="add-pet-btn" @tap="addNewPet">
      <text class="iconfont icon-add"></text>
      <text>添加新宠物</text>
    </view>

    <!-- 宠物编辑弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <view class="pet-edit-form">
        <view class="form-header">
          <text class="form-title">{{ isEdit ? '编辑宠物' : '添加宠物' }}</text>
          <text class="close-btn iconfont icon-close" @tap="closePopup"></text>
        </view>
        
        <view class="form-content">
          <!-- 宠物头像 -->
          <view class="form-item">
            <text class="item-label">头像</text>
            <view class="avatar-upload" @tap="choosePetAvatar">
              <image 
                class="pet-avatar" 
                :src="currentPet.avatar || defaultPetAvatar"
              ></image>
              <text class="upload-hint">点击更换头像</text>
            </view>
          </view>

          <!-- 宠物名称 -->
          <view class="form-item">
            <text class="item-label">名称</text>
            <input 
              class="input-field" 
              type="text" 
              v-model="currentPet.name" 
              placeholder="请输入宠物名称"
              maxlength="20"
            />
          </view>

          <!-- 宠物品种 -->
          <view class="form-item">
            <text class="item-label">品种</text>
            <input 
              class="input-field" 
              type="text" 
              v-model="currentPet.breed" 
              placeholder="请输入宠物品种"
            />
          </view>

          <!-- 宠物年龄 -->
          <view class="form-item">
            <text class="item-label">年龄</text>
            <input 
              class="input-field" 
              type="number" 
              v-model="currentPet.age" 
              placeholder="请输入宠物年龄"
            />
          </view>

          <!-- 健康状况 -->
          <view class="form-item">
            <text class="item-label">健康状况</text>
            <picker 
              mode="selector" 
              :range="healthOptions" 
              @change="handleHealthChange"
            >
              <view class="picker-field">
                {{ currentPet.healthStatus || '请选择健康状况' }}
              </view>
            </picker>
          </view>
        </view>

        <view class="form-footer">
          <button class="cancel-btn" @tap="closePopup">取消</button>
          <button class="save-btn" @tap="savePet">保存</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { petApi, commonApi } from '../../utils/api';
import { USE_MOCK } from '../../utils/config';

// 宠物列表
const pets = ref([]);

// 当前编辑的宠物
const currentPet = ref({
  avatar: '',
  name: '',
  breed: '',
  age: '',
  healthStatus: ''
});

// 是否处于编辑模式
const isEdit = ref(false);

// 默认宠物头像
const defaultPetAvatar = '/static/images/pet.png';

// 弹窗组件引用
const popup = ref(null);

// 健康状况选项
const healthOptions = ['很好', '良好', '一般', '需要治疗', '正在恢复中'];

// 获取宠物列表
const getPetList = () => {
  if (USE_MOCK) {
    try {
      const list = uni.getStorageSync('petList') || [];
      pets.value = list;
    } catch (e) {
      console.error('获取宠物列表失败', e);
      pets.value = [];
    }
    return;
  }

  petApi.getPetList()
    .then(res => {
      pets.value = res.data || [];
    })
    .catch(err => {
      console.error('获取宠物列表失败', err);
      pets.value = [];
    });
};

// 选择宠物
const selectPet = (pet) => {
  // 设置当前宠物
  uni.setStorageSync('currentPet', pet);
  
  // 返回上一页
  uni.navigateBack();
};

// 编辑宠物信息
const editPet = (pet) => {
  isEdit.value = true;
  currentPet.value = { ...pet };
  popup.value.open();
};

// 删除宠物
const deletePet = (pet) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除宠物"${pet.name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        if (USE_MOCK) {
          const index = pets.value.findIndex(p => p.id === pet.id);
          if (index > -1) {
            // 检查是否是当前选中的宠物
            const currentPet = uni.getStorageSync('currentPet');
            if (currentPet && currentPet.id === pet.id) {
              // 如果删除的是当前选中的宠物，清除当前宠物
              uni.removeStorageSync('currentPet');
            }
            
            // 从列表中删除
            pets.value.splice(index, 1);
            
            // 更新本地存储
            uni.setStorageSync('petList', pets.value);
            
            // 通知个人中心页面更新宠物列表
            uni.$emit('updatePetList');
            
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
          return;
        }
        
        petApi.deletePet(pet.id)
          .then(res => {
            // 检查是否是当前选中的宠物
            const currentPet = uni.getStorageSync('currentPet');
            if (currentPet && currentPet.id === pet.id) {
              // 如果删除的是当前选中的宠物，清除当前宠物
              uni.removeStorageSync('currentPet');
            }
            
            // 从列表中删除
            const index = pets.value.findIndex(p => p.id === pet.id);
            if (index > -1) {
              pets.value.splice(index, 1);
            }
            
            // 通知个人中心页面更新宠物列表
            uni.$emit('updatePetList');
            
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          })
          .catch(err => {
            console.error('删除宠物失败', err);
            uni.showToast({
              title: err.message || '删除失败，请重试',
              icon: 'none'
            });
          });
      }
    }
  });
};

// 添加新宠物
const addNewPet = () => {
  isEdit.value = false;
  currentPet.value = {
    avatar: '',
    name: '',
    breed: '',
    age: '',
    healthStatus: ''
  };
  popup.value.open();
};

// 选择宠物头像
const choosePetAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      // 上传图片到服务器
      uploadPetAvatar(tempFilePath);
    }
  });
};

// 上传宠物头像
const uploadPetAvatar = (filePath) => {
  if (USE_MOCK) {
    // 模拟上传成功
    currentPet.value.avatar = filePath;
    return;
  }
  
  uni.showLoading({
    title: '上传中...'
  });
  
  petApi.uploadPetAvatar(filePath)
    .then(res => {
      uni.hideLoading();
      currentPet.value.avatar = res.data.url;
    })
    .catch(err => {
      uni.hideLoading();
      console.error('上传头像失败', err);
      uni.showToast({
        title: err.message || '上传失败，请重试',
        icon: 'none'
      });
    });
};

// 处理健康状况选择
const handleHealthChange = (e) => {
  currentPet.value.healthStatus = healthOptions[e.detail.value];
};

// 保存宠物信息
const savePet = () => {
  if (!currentPet.value.name) {
    uni.showToast({
      title: '请输入宠物名称',
      icon: 'none'
    });
    return;
  }

  if (!currentPet.value.breed) {
    uni.showToast({
      title: '请输入宠物品种',
      icon: 'none'
    });
    return;
  }

  if (!currentPet.value.age) {
    uni.showToast({
      title: '请输入宠物年龄',
      icon: 'none'
    });
    return;
  }

  if (!currentPet.value.healthStatus) {
    uni.showToast({
      title: '请选择健康状况',
      icon: 'none'
    });
    return;
  }

  if (USE_MOCK) {
    if (isEdit.value) {
      // 更新现有宠物
      const index = pets.value.findIndex(p => p.id === currentPet.value.id);
      if (index > -1) {
        pets.value[index] = { ...currentPet.value };
      }
    } else {
      // 添加新宠物
      currentPet.value.id = Date.now().toString();
      pets.value.push({ ...currentPet.value });
    }

    // 更新本地存储
    uni.setStorageSync('petList', pets.value);
    
    // 通知个人中心页面更新宠物列表
    uni.$emit('updatePetList');
    
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    });
    
    closePopup();
    return;
  }

  // 显示加载中
  uni.showLoading({
    title: '保存中...'
  });

  const petData = {
    name: currentPet.value.name,
    avatar: currentPet.value.avatar,
    type: currentPet.value.type || 'other',
    breed: currentPet.value.breed,
    age: Number(currentPet.value.age),
    gender: currentPet.value.gender || '未知',
    weight: Number(currentPet.value.weight) || 0,
    health: currentPet.value.healthStatus
  };

  const savePromise = isEdit.value
    ? petApi.updatePet(currentPet.value.id, petData)
    : petApi.addPet(petData);

  savePromise
    .then(res => {
      uni.hideLoading();
      
      if (!isEdit.value) {
        // 如果是新增，添加到宠物列表
        const newPet = {
          id: res.data.id,
          ...petData
        };
        pets.value.push(newPet);
      } else {
        // 如果是编辑，更新宠物列表
        const index = pets.value.findIndex(p => p.id === currentPet.value.id);
        if (index > -1) {
          pets.value[index] = {
            ...pets.value[index],
            ...petData
          };
        }
      }
      
      // 通知个人中心页面更新宠物列表
      uni.$emit('updatePetList');
      
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      
      closePopup();
    })
    .catch(err => {
      uni.hideLoading();
      console.error('保存宠物信息失败', err);
      uni.showToast({
        title: err.message || '保存失败，请重试',
        icon: 'none'
      });
    });
};

// 关闭弹窗
const closePopup = () => {
  popup.value.close();
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  getPetList();
});
</script>

<style lang="scss">
.pet-management-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background-color: #ffffff;
  position: relative;
  
  .nav-title {
    font-size: 32rpx;
    font-weight: 500;
  }
  
  .nav-back {
    position: absolute;
    left: 30rpx;
    font-size: 40rpx;
  }
}

.pet-list {
  padding: 20rpx;
}

.pet-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  
  .pet-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 30rpx;
  }
  
  .pet-info {
    flex: 1;
    
    .pet-name {
      font-size: 32rpx;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    
    .pet-details {
      display: flex;
      gap: 20rpx;
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .pet-actions {
    display: flex;
    gap: 30rpx;
    
    .edit-btn, .delete-btn {
      font-size: 32rpx;
      color: #999;
    }
    
    .delete-btn {
      color: #6F87FF;
    }
  }
}

.add-pet-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 40rpx;
  background-color: #6F87FF;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 28rpx;
  
  .iconfont {
    font-size: 32rpx;
  }
}

.pet-edit-form {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  
  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .form-title {
      font-size: 32rpx;
      font-weight: 500;
    }
    
    .close-btn {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .form-content {
    padding: 30rpx;
  }
  
  .form-item {
    margin-bottom: 30rpx;
    
    .item-label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
  }
  
  .avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .pet-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      margin-bottom: 20rpx;
    }
    
    .upload-hint {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .input-field {
    width: 100%;
    height: 80rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
  }
  
  .picker-field {
    width: 100%;
    height: 80rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    line-height: 80rpx;
  }
  
  .form-footer {
    display: flex;
    padding: 30rpx;
    gap: 20rpx;
    
    button {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 44rpx;
      font-size: 32rpx;
    }
    
    .cancel-btn {
      background-color: #f5f5f5;
      color: #666;
    }
    
    .save-btn {
      background-color: #6F87FF;
      color: #ffffff;
    }
  }
}
</style> 