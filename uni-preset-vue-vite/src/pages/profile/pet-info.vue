<template>
  <view class="pet-info-container">
    <view class="pet-info-header">
      <view class="header-title">完善宠物信息</view>
      <view class="header-subtitle">帮助我们更好地了解您的宠物</view>
    </view>
    
    <view class="pet-form">
      <!-- 宠物头像 -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @tap="choosePetAvatar">
          <image v-if="petInfo.avatar" class="pet-avatar" :src="petInfo.avatar" mode="aspectFill"></image>
          <text v-else class="avatar-placeholder iconfont icon-add"></text>
        </view>
        <text class="avatar-tip">添加宠物头像</text>
      </view>
      
      <!-- 宠物名称 -->
      <view class="form-item">
        <text class="form-label">宠物名称</text>
        <view class="input-wrapper">
          <input 
            class="form-input"
            placeholder="请输入宠物名称"
            maxlength="12"
            v-model="petInfo.name"
          />
        </view>
      </view>
      
      <!-- 宠物类型 -->
      <view class="form-item">
        <text class="form-label">宠物类型</text>
        <view class="type-options">
          <view 
            class="type-option" 
            :class="{ 'option-active': petInfo.type === 'dog' }"
            @tap="petInfo.type = 'dog'"
          >
            <text class="option-icon iconfont icon-dog"></text>
            <text class="option-text">狗狗</text>
          </view>
          <view 
            class="type-option" 
            :class="{ 'option-active': petInfo.type === 'cat' }"
            @tap="petInfo.type = 'cat'"
          >
            <text class="option-icon iconfont icon-cat"></text>
            <text class="option-text">猫咪</text>
          </view>
          <view 
            class="type-option" 
            :class="{ 'option-active': petInfo.type === 'other' }"
            @tap="petInfo.type = 'other'"
          >
            <text class="option-icon iconfont icon-other-pet"></text>
            <text class="option-text">其他</text>
          </view>
        </view>
      </view>
      
      <!-- 性别 -->
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="radio-group">
          <view 
            class="radio-item" 
            :class="{ 'radio-active': petInfo.gender === 'male' }"
            @tap="petInfo.gender = 'male'"
          >
            <text class="radio-icon" :class="{ 'icon-active': petInfo.gender === 'male' }"></text>
            <text class="radio-text">公</text>
          </view>
          <view 
            class="radio-item" 
            :class="{ 'radio-active': petInfo.gender === 'female' }"
            @tap="petInfo.gender = 'female'"
          >
            <text class="radio-icon" :class="{ 'icon-active': petInfo.gender === 'female' }"></text>
            <text class="radio-text">母</text>
          </view>
        </view>
      </view>
      
      <!-- 年龄 -->
      <view class="form-item">
        <text class="form-label">年龄</text>
        <view class="input-wrapper age-wrapper">
          <input 
            class="form-input age-input"
            type="number"
            placeholder="年龄"
            v-model="petInfo.age"
          />
          <text class="unit-text">岁</text>
          <input 
            class="form-input age-input"
            type="number"
            placeholder="月份"
            v-model="petInfo.months"
          />
          <text class="unit-text">个月</text>
        </view>
      </view>
      
      <!-- 体重 -->
      <view class="form-item">
        <text class="form-label">体重</text>
        <view class="input-wrapper weight-wrapper">
          <input 
            class="form-input weight-input"
            type="digit"
            placeholder="体重"
            v-model="petInfo.weight"
          />
          <text class="unit-text">kg</text>
        </view>
      </view>
      
      <!-- 提交按钮 -->
      <button class="submit-btn" @tap="savePetInfo">保存</button>
      <button class="skip-btn" @tap="skipForNow">暂时跳过</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 宠物信息
const petInfo = ref({
  avatar: '',
  name: '',
  type: 'dog',  // 默认为狗狗
  gender: 'male',  // 默认为公
  age: '',
  months: '',
  weight: ''
});

// 选择宠物头像
const choosePetAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      petInfo.value.avatar = tempFilePath;
      
      // 实际应用中，这里应该上传图片到服务器
      console.log('选择了图片：', tempFilePath);
    }
  });
};

// 保存宠物信息
const savePetInfo = () => {
  // 表单验证
  if (!petInfo.value.name) {
    uni.showToast({
      title: '请输入宠物名称',
      icon: 'none'
    });
    return;
  }
  
  if (!petInfo.value.avatar) {
    uni.showToast({
      title: '请上传宠物头像',
      icon: 'none'
    });
    return;
  }
  
  // 显示加载中
  uni.showLoading({
    title: '保存中...'
  });
  
  // 模拟API请求
  setTimeout(() => {
    uni.hideLoading();
    
    try {
      // 获取当前用户信息
      const userInfoStr = uni.getStorageSync('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        
        // 添加宠物信息
        userInfo.petAvatar = petInfo.value.avatar;
        userInfo.hasPet = true;
        
        // 更新用户信息
        uni.setStorageSync('userInfo', JSON.stringify(userInfo));
        
        // 提示成功
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        // 返回个人中心页面
        setTimeout(() => {
          uni.navigateBack({
            delta: 2  // 返回两层，跳过登录页
          });
        }, 1500);
      }
    } catch (e) {
      console.error('保存宠物信息失败', e);
      uni.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      });
    }
  }, 1500);
};

// 暂时跳过
const skipForNow = () => {
  uni.showModal({
    title: '确认跳过',
    content: '完善宠物信息可以获得更个性化的体验，确定要跳过吗？',
    confirmColor: '#6F87FF',
    success: (res) => {
      if (res.confirm) {
        try {
          // 获取当前用户信息并设置默认宠物头像
          const userInfoStr = uni.getStorageSync('userInfo');
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            
            // 确保有默认宠物头像
            if (!userInfo.petAvatar) {
              userInfo.petAvatar = '/static/images/pet.png';
              // 更新用户信息
              uni.setStorageSync('userInfo', JSON.stringify(userInfo));
            }
          }
        } catch (e) {
          console.error('设置默认宠物头像失败', e);
        }
        
        // 返回个人中心页面
        uni.navigateBack({
          delta: 2  // 返回两层，跳过登录页
        });
      }
    }
  });
};
</script>

<style lang="scss">
.pet-info-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.pet-info-header {
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.header-subtitle {
  font-size: 28rpx;
  color: #999;
}

.pet-form {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-wrapper {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background-color: #f0f4ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15rpx;
  overflow: hidden;
  border: 1px dashed #6F87FF;
}

.pet-avatar {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  font-size: 60rpx;
  color: #6F87FF;
}

.avatar-tip {
  font-size: 28rpx;
  color: #6F87FF;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.input-wrapper {
  border-bottom: 1px solid #e0e0e0;
  height: 90rpx;
  display: flex;
  align-items: center;
}

.form-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
}

.type-options {
  display: flex;
  justify-content: space-between;
}

.type-option {
  width: 30%;
  height: 160rpx;
  background-color: #f7f7f7;
  border-radius: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
}

.option-active {
  background-color: #f0f4ff;
  border: 1px solid #6F87FF;
}

.option-icon {
  font-size: 60rpx;
  color: #6F87FF;
  margin-bottom: 15rpx;
}

.option-text {
  font-size: 28rpx;
  color: #666;
}

.radio-group {
  display: flex;
}

.radio-item {
  margin-right: 60rpx;
  display: flex;
  align-items: center;
}

.radio-icon {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-right: 15rpx;
  position: relative;
}

.icon-active {
  border-color: #6F87FF;
}

.icon-active::after {
  content: '';
  position: absolute;
  width: 24rpx;
  height: 24rpx;
  background-color: #6F87FF;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-text {
  font-size: 28rpx;
  color: #666;
}

.age-wrapper, .weight-wrapper {
  border-bottom: none;
}

.age-input {
  width: 100rpx;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.unit-text {
  margin: 0 20rpx;
  font-size: 28rpx;
  color: #666;
}

.weight-input {
  width: 120rpx;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.submit-btn {
  height: 90rpx;
  border-radius: 45rpx;
  background-color: #6F87FF;
  color: #fff;
  font-size: 32rpx;
  line-height: 90rpx;
  margin-top: 60rpx;
  margin-bottom: 20rpx;
}

.skip-btn {
  height: 90rpx;
  border-radius: 45rpx;
  background-color: #fff;
  color: #666;
  font-size: 32rpx;
  line-height: 90rpx;
  border: 1px solid #e0e0e0;
}
</style> 