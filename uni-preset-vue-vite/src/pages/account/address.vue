<template>
  <view class="address-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">地址管理</text>
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
    </view>

    <!-- 地址列表 -->
    <scroll-view 
      scroll-y 
      class="address-scroll-view"
      @scrolltolower="loadMore"
      :style="{ height: showAddressFormFlag ? 'calc(100vh - 180rpx - 80vh)' : 'calc(100vh - 180rpx)' }"
    >
      <!-- 空内容提示 -->
      <view v-if="addressList.length === 0" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-address.png"></image>
        <text>暂无收货地址</text>
      </view>

      <!-- 地址列表 -->
      <view class="address-list">
        <view 
          v-for="(item, index) in addressList" 
          :key="index"
          class="address-item"
        >
          <view class="address-info" @tap="selectAddress(item)" style="cursor: pointer;">
            <view class="address-header">
              <text class="contact-name">{{ item.name }}</text>
              <text class="contact-phone">{{ item.phone }}</text>
              <text v-if="item.isDefault" class="default-tag">默认</text>
            </view>
            <view class="address-detail">
              <text class="region">{{ item.region }}</text>
              <text class="detail">{{ item.detail }}</text>
            </view>
          </view>
          <view class="address-actions">
            <view class="action-item" @tap="setDefault(item)">
              <text class="action-icon iconfont" :class="item.isDefault ? 'icon-check' : 'icon-circle'"></text>
              <text class="action-text">默认地址</text>
            </view>
            <view class="action-item" @tap="editAddress(item)">
              <text class="action-icon iconfont icon-edit"></text>
              <text class="action-text">编辑</text>
            </view>
            <view class="action-item" @tap="deleteAddress(item)">
              <text class="action-icon iconfont icon-delete"></text>
              <text class="action-text">删除</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && addressList.length > 0" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>

    <!-- 添加地址按钮 -->
    <view class="add-address" @tap="showAddressForm" :style="{ bottom: showAddressFormFlag ? '80vh' : '0' }">
      <text class="add-icon iconfont icon-add"></text>
      <text>新增收货地址</text>
    </view>

    <!-- 地址编辑表单区域 -->
    <view v-if="showAddressFormFlag" class="address-form-section">
      <view class="form-header">
        <text class="form-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
        <text class="form-close iconfont icon-close" @tap="hideAddressForm"></text>
      </view>
      
      <view class="form-content">
        <view class="form-item">
          <text class="form-label">收货人</text>
          <input 
            class="form-input" 
            v-model="addressForm.name" 
            placeholder="请输入收货人姓名"
            maxlength="20"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">手机号码</text>
          <input 
            class="form-input" 
            v-model="addressForm.phone" 
            placeholder="请输入手机号码"
            type="number"
            maxlength="11"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">所在地区</text>
          <view class="region-selector" @tap="showRegionSelector" style="cursor: pointer;">
            <text class="region-text">{{ addressForm.region || '请选择所在地区' }}</text>
            <text class="region-arrow iconfont icon-arrow-right"></text>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <textarea 
            class="form-textarea" 
            v-model="addressForm.detail" 
            placeholder="请输入详细地址，如街道、楼牌号等"
            maxlength="100"
          />
        </view>
        
        <view class="form-item switch-item">
          <text class="form-label">设为默认地址</text>
          <switch 
            :checked="addressForm.isDefault" 
            @change="handleDefaultChange"
            color="#6F87FF"
          />
        </view>
      </view>
      
      <view class="form-footer">
        <button class="save-btn" @tap="saveAddress">保存</button>
      </view>
    </view>

    <!-- 地区选择器区域 -->
    <view :class="['region-selector-section', { 'hidden': !showRegionSelectorFlag }]">
      <view class="region-header">
        <text class="region-title">选择地区</text>
        <text class="region-close iconfont icon-close" @tap="hideRegionSelector"></text>
      </view>
      
      <view class="region-tabs">
        <view 
          class="region-tab" 
          :class="{ active: currentTab === 'province' }"
          @tap="switchTab('province')"
        >
          {{ selectedProvince || '请选择' }}
        </view>
        <view 
          class="region-tab" 
          :class="{ active: currentTab === 'city' }"
          @tap="switchTab('city')"
          v-if="selectedProvince && cities.length > 0"
        >
          {{ selectedCity || '请选择' }}
        </view>
        <view 
          class="region-tab" 
          :class="{ active: currentTab === 'district' }"
          @tap="switchTab('district')"
          v-if="(selectedCity && districts.length > 0) || (selectedProvince && isDirectCity(selectedProvince))"
        >
          {{ selectedDistrict || '请选择' }}
        </view>
      </view>
      
      <scroll-view scroll-y class="region-list">
        <view 
          v-for="(item, index) in currentList" 
          :key="index"
          class="region-item"
          :class="{ active: isItemSelected(item) }"
          @tap="selectRegion(item)"
        >
          {{ item }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { getProvinces, getCities, getDistricts, regionData } from '../../utils/regionData';
import { addressApi } from '../../utils/api';
import { USE_MOCK } from '../../utils/config';

// 判断是否为直辖市或特别行政区
const isDirectCity = (province) => {
  const provinceData = regionData[province];
  return Array.isArray(provinceData);
};

// 地址列表
const addressList = ref([]);
const hasMore = ref(false);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 表单和选择器控制
const isEdit = ref(false);
const currentAddress = ref(null);

// 表单和选择器显示状态
const showAddressFormFlag = ref(false);
const showRegionSelectorFlag = ref(false);

// 地区选择相关
const currentTab = ref('province');
const selectedProvince = ref('');
const selectedCity = ref('');
const selectedDistrict = ref('');

// 地址表单
const addressForm = ref({
  name: '',
  phone: '',
  region: '',
  regionArray: [],
  detail: '',
  isDefault: false
});

// 获取地址列表
const getAddressList = async () => {
  loading.value = true;
  
  try {
    if (USE_MOCK) {
      // Mock模式：使用本地存储
      const storedAddresses = uni.getStorageSync('addressList');
      if (storedAddresses && storedAddresses.length > 0) {
        addressList.value = JSON.parse(storedAddresses);
      } else {
        // 模拟数据
        addressList.value = [
          {
            id: 'A001',
            name: '张三',
            phone: '13800138000',
            region: '广东省深圳市南山区',
            regionArray: ['广东省', '深圳市', '南山区'],
            detail: '科技园南区8栋101室',
            isDefault: true
          },
          {
            id: 'A002',
            name: '李四',
            phone: '13900139000',
            region: '广东省广州市天河区',
            regionArray: ['广东省', '广州市', '天河区'],
            detail: '天河路385号太古汇',
            isDefault: false
          }
        ];
      }
      hasMore.value = false;
    } else {
      // API模式：调用后端接口
      const response = await addressApi.getAddressList({
        page: page.value,
        pageSize: pageSize.value
      });
      
      if (response.code === 200) {
        if (page.value === 1) {
          addressList.value = response.data.list;
        } else {
          addressList.value = [...addressList.value, ...response.data.list];
        }
        hasMore.value = response.data.list.length === pageSize.value;
      } else {
        throw new Error(response.message);
      }
    }
  } catch (error) {
    console.error('获取地址列表失败:', error);
    uni.showToast({
      title: '获取地址列表失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getAddressList();
};

// 选择地址
const selectAddress = (item) => {
  console.log('地址被点击:', item);
  
  // 如果是从订单页面进入，则选择地址后返回
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (prevPage && prevPage.route.includes('order')) {
    uni.$emit('addressSelected', item);
    uni.navigateBack();
  } else {
    // 在地址管理页面，点击地址显示详情或提示
    uni.showToast({
      title: `已选择地址：${item.name}`,
      icon: 'none',
      duration: 2000
    });
    
    // 可以在这里添加更多逻辑，比如显示地址详情弹窗
    console.log('选择的地址:', item);
  }
};

// 设置默认地址
const setDefault = async (item) => {
  if (item.isDefault) return;
  
  uni.showModal({
    title: '设置默认地址',
    content: '确定要将该地址设为默认地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          if (USE_MOCK) {
            // Mock模式：使用本地存储
            addressList.value.forEach(addr => {
              addr.isDefault = addr.id === item.id;
            });
            
            uni.setStorageSync('addressList', addressList.value);
            
            uni.showToast({
              title: '设置成功',
              icon: 'success'
            });
            
            // 发送默认地址更新事件
            uni.$emit('defaultAddressUpdated', item);
          } else {
            // API模式：调用后端接口
            const response = await addressApi.setDefaultAddress(item.id);
            
            if (response.code === 200) {
              // 更新本地数据
              addressList.value.forEach(addr => {
                addr.isDefault = addr.id === item.id;
              });
              
              uni.showToast({
                title: '设置成功',
                icon: 'success'
              });
              
              // 发送默认地址更新事件
              uni.$emit('defaultAddressUpdated', response.data);
            } else {
              throw new Error(response.message);
            }
          }
        } catch (error) {
          console.error('设置默认地址失败:', error);
          uni.showToast({
            title: '设置失败，请重试',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 编辑地址
const editAddress = async (item) => {
  try {
    isEdit.value = true;
    currentAddress.value = item;
    
    // 填充表单
    addressForm.value = {
      name: item.name,
      phone: item.phone,
      region: item.region,
      regionArray: item.regionArray,
      detail: item.detail,
      isDefault: item.isDefault
    };

    // 如果地址包含地区信息，则尝试填充地区选择器
    if (item.regionArray && item.regionArray.length > 0) {
      selectedProvince.value = item.regionArray[0];
      if (item.regionArray.length > 1) {
        selectedCity.value = item.regionArray[1];
        if (item.regionArray.length > 2) {
          selectedDistrict.value = item.regionArray[2];
        }
      }
    }
    
    // 显示表单
    showAddressFormFlag.value = true;
  } catch (error) {
    console.error('编辑地址失败:', error);
    uni.showToast({
      title: '打开编辑表单失败',
      icon: 'none'
    });
  }
};

// 删除地址
const deleteAddress = (item) => {
  uni.showModal({
    title: '删除地址',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          if (USE_MOCK) {
            // Mock模式：使用本地存储
            const index = addressList.value.findIndex(addr => addr.id === item.id);
            if (index > -1) {
              addressList.value.splice(index, 1);
              
              // 如果删除的是默认地址，且还有其他地址，则将第一个地址设为默认
              if (item.isDefault && addressList.value.length > 0) {
                addressList.value[0].isDefault = true;
              }
              
              uni.setStorageSync('addressList', addressList.value);
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
            }
          } else {
            // API模式：调用后端接口
            const response = await addressApi.deleteAddress(item.id);
            
            if (response.code === 200) {
              // 从本地列表中移除
              const index = addressList.value.findIndex(addr => addr.id === item.id);
              if (index > -1) {
                addressList.value.splice(index, 1);
              }
              
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
            } else {
              throw new Error(response.message);
            }
          }
        } catch (error) {
          console.error('删除地址失败:', error);
          uni.showToast({
            title: '删除失败，请重试',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 显示地址表单
const showAddressForm = () => {
  try {
    isEdit.value = false;
    currentAddress.value = null;
    
    // 重置表单
    addressForm.value = {
      name: '',
      phone: '',
      region: '',
      regionArray: [],
      detail: '',
      isDefault: false
    };

    // 重置地区选择器
    selectedProvince.value = '';
    selectedCity.value = '';
    selectedDistrict.value = '';
    currentTab.value = 'province';
    
    // 显示表单
    showAddressFormFlag.value = true;
  } catch (error) {
    console.error('显示地址表单失败:', error);
    uni.showToast({
      title: '打开地址表单失败',
      icon: 'none'
    });
  }
};

// 隐藏地址表单
const hideAddressForm = () => {
  try {
    showAddressFormFlag.value = false;
    // 同时隐藏地区选择器
    showRegionSelectorFlag.value = false;
  } catch (error) {
    console.error('隐藏地址表单失败:', error);
  }
};

// 地区选择器变化
const handleRegionChange = (e) => {
  const regionArray = e.detail.value;
  addressForm.value.regionArray = regionArray;
  addressForm.value.region = regionArray.join('');
};

// 默认地址开关变化
const handleDefaultChange = (e) => {
  addressForm.value.isDefault = e.detail.value;
};

// 保存地址
const saveAddress = async () => {
  // 表单验证
  if (!addressForm.value.name) {
    uni.showToast({
      title: '请输入收货人姓名',
      icon: 'none'
    });
    return;
  }
  
  if (!addressForm.value.phone) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none'
    });
    return;
  }
  
  if (!/^1\d{10}$/.test(addressForm.value.phone)) {
    uni.showToast({
      title: '手机号码格式不正确',
      icon: 'none'
    });
    return;
  }
  
  if (!addressForm.value.region) {
    uni.showToast({
      title: '请选择所在地区',
      icon: 'none'
    });
    return;
  }
  
  if (!addressForm.value.detail) {
    uni.showToast({
      title: '请输入详细地址',
      icon: 'none'
    });
    return;
  }
  
  try {
    if (USE_MOCK) {
      // Mock模式：使用本地存储
      // 如果设为默认地址，需要将其他地址的默认状态取消
      if (addressForm.value.isDefault) {
        addressList.value.forEach(addr => {
          addr.isDefault = false;
        });
      }
      
      if (isEdit.value) {
        // 更新地址
        const index = addressList.value.findIndex(addr => addr.id === currentAddress.value.id);
        if (index > -1) {
          addressList.value[index] = {
            ...currentAddress.value,
            ...addressForm.value
          };
        }
      } else {
        // 新增地址
        const newAddress = {
          id: 'A' + Date.now().toString().slice(-6),
          ...addressForm.value
        };
        addressList.value.push(newAddress);
      }
      
      // 更新本地存储
      uni.setStorageSync('addressList', addressList.value);
      
      // 如果设置为默认地址，发送事件通知
      if (addressForm.value.isDefault) {
        const savedAddress = isEdit.value ? 
          addressList.value.find(addr => addr.id === currentAddress.value.id) :
          addressList.value[addressList.value.length - 1];
        
        if (savedAddress) {
          uni.$emit('defaultAddressUpdated', savedAddress);
        }
      }
    } else {
      // API模式：调用后端接口
      if (isEdit.value) {
        // 更新地址
        const response = await addressApi.updateAddress({
          id: currentAddress.value.id,
          ...addressForm.value
        });
        
        if (response.code === 200) {
          // 更新本地数据
          const index = addressList.value.findIndex(addr => addr.id === currentAddress.value.id);
          if (index > -1) {
            addressList.value[index] = response.data;
          }
          
          // 如果设置为默认地址，发送事件通知
          if (addressForm.value.isDefault) {
            uni.$emit('defaultAddressUpdated', response.data);
          }
        } else {
          throw new Error(response.message);
        }
      } else {
        // 新增地址
        const response = await addressApi.addAddress(addressForm.value);
        
        if (response.code === 200) {
          // 添加到本地列表
          addressList.value.push(response.data);
          
          // 如果设置为默认地址，发送事件通知
          if (addressForm.value.isDefault) {
            uni.$emit('defaultAddressUpdated', response.data);
          }
        } else {
          throw new Error(response.message);
        }
      }
    }
    
    // 隐藏表单
    hideAddressForm();
    
    // 提示成功
    uni.showToast({
      title: isEdit.value ? '修改成功' : '添加成功',
      icon: 'success'
    });
    
  } catch (error) {
    console.error('保存地址失败:', error);
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'none'
    });
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 计算当前显示的列表
const currentList = computed(() => {
  console.log('计算currentList, currentTab:', currentTab.value);
  let result = [];
  
  switch (currentTab.value) {
    case 'province':
      result = getProvinces();
      break;
    case 'city':
      result = selectedProvince.value ? getCities(selectedProvince.value) : [];
      break;
    case 'district':
      if (selectedCity.value) {
        result = getDistricts(selectedProvince.value, selectedCity.value);
      } else if (selectedProvince.value) {
        // 对于直辖市和特别行政区，直接从省份数据获取区列表
        const provinceData = regionData[selectedProvince.value];
        if (Array.isArray(provinceData)) {
          result = provinceData;
        }
      }
      break;
    default:
      result = [];
  }
  
  console.log('currentList结果:', result);
  return result;
});

// 计算城市列表
const cities = computed(() => {
  return selectedProvince.value ? getCities(selectedProvince.value) : [];
});

// 计算区域列表
const districts = computed(() => {
  return selectedCity.value ? getDistricts(selectedProvince.value, selectedCity.value) : [];
});

// 显示地区选择器
const showRegionSelector = () => {
  try {
    console.log('显示地区选择器');
    showRegionSelectorFlag.value = true;
  } catch (error) {
    console.error('显示地区选择器失败:', error);
    uni.showToast({
      title: '打开地区选择器失败',
      icon: 'none'
    });
  }
};

// 隐藏地区选择器
const hideRegionSelector = () => {
  try {
    console.log('隐藏地区选择器');
    showRegionSelectorFlag.value = false;
  } catch (error) {
    console.error('隐藏地区选择器失败:', error);
  }
};

// 切换标签页
const switchTab = (tab) => {
  currentTab.value = tab;
};

// 判断选项是否被选中
const isItemSelected = (item) => {
  switch (currentTab.value) {
    case 'province':
      return item === selectedProvince.value;
    case 'city':
      return item === selectedCity.value;
    case 'district':
      return item === selectedDistrict.value;
    default:
      return false;
  }
};

// 选择地区
const selectRegion = (item) => {
  console.log('选择地区:', item);
  switch (currentTab.value) {
    case 'province':
      selectedProvince.value = item;
      selectedCity.value = '';
      selectedDistrict.value = '';
      const provinceData = regionData[item];
      if (typeof provinceData === 'object' && !Array.isArray(provinceData)) {
        // 如果是省份（有下级城市），切换到城市选择
        currentTab.value = 'city';
      } else {
        // 如果是直辖市或特别行政区（直接是区数组），切换到区选择
        currentTab.value = 'district';
      }
      break;
    case 'city':
      selectedCity.value = item;
      selectedDistrict.value = '';
      const cityData = regionData[selectedProvince.value][item];
      if (Array.isArray(cityData) && cityData.length > 0) {
        currentTab.value = 'district';
      } else {
        updateRegion();
      }
      break;
    case 'district':
      selectedDistrict.value = item;
      updateRegion();
      break;
  }
};

// 更新地址表单的地区信息
const updateRegion = () => {
  const region = [selectedProvince.value];
  
  // 如果是省份，添加城市和区
  if (selectedCity.value) {
    region.push(selectedCity.value);
    if (selectedDistrict.value) {
      region.push(selectedDistrict.value);
    }
  } else if (selectedDistrict.value) {
    // 如果是直辖市或特别行政区，直接添加区
    region.push(selectedDistrict.value);
  }
  
  addressForm.value.region = region.join(' ');
  addressForm.value.regionArray = region;
  
  // 隐藏选择器
  hideRegionSelector();
};

onMounted(() => {
  // 获取地址列表
  getAddressList();
});
</script>

<style lang="scss">
.address-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.nav-bar {
  position: relative;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.back-btn {
  position: absolute;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.back-text {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

/* 地址列表区域 */
.address-scroll-view {
  flex: 1;
  transition: height 0.3s ease;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.address-list {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.address-item {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.address-info {
  padding: 20rpx;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.address-info:active {
  background-color: #f0f0f0;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.contact-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-right: 20rpx;
}

.contact-phone {
  font-size: 28rpx;
  color: #666;
}

.default-tag {
  font-size: 22rpx;
  color: #6F87FF;
  background-color: rgba(111, 135, 255, 0.1);
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  margin-left: 20rpx;
}

.address-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

.region {
  margin-right: 10rpx;
}

.address-actions {
  display: flex;
  border-top: 1rpx solid #f5f5f5;
}

.action-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #666;
}

.action-icon {
  font-size: 32rpx;
  margin-right: 6rpx;
}

.action-text {
  font-size: 26rpx;
}

/* 添加地址按钮 */
.add-address {
  position: fixed;
  left: 0;
  right: 0;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6F87FF;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  transition: bottom 0.3s ease;
  z-index: 100;
}

.add-icon {
  font-size: 36rpx;
  margin-right: 10rpx;
}

/* 地址编辑表单区域 */
.address-form-section {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.form-close {
  font-size: 36rpx;
  color: #999;
}

.form-content {
  padding: 30rpx;
  flex: 1;
  overflow-y: auto;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

/* 地区选择器样式 */
.region-selector {
  width: 100%;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.region-selector:active {
  background-color: #e0e0e0;
}

.region-text {
  font-size: 28rpx;
  color: #333;
}

.region-arrow {
  font-size: 24rpx;
  color: #999;
}

/* 地区选择器区域样式 */
.region-selector-section {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
  transition: transform 0.3s ease;
  transform: translateY(0);
}

.region-selector-section.hidden {
  transform: translateY(100%);
}

.region-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.region-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.region-close {
  font-size: 36rpx;
  color: #999;
}

.region-tabs {
  display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.region-tab {
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
  margin-right: 30rpx;
  
  &.active {
    color: #6F87FF;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -20rpx;
      left: 0;
      width: 100%;
      height: 4rpx;
      background-color: #6F87FF;
    }
  }
}

.region-list {
  flex: 1;
  padding: 20rpx 0;
}

.region-item {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  
  &.active {
    color: #6F87FF;
    background-color: #f0f4ff;
  }
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.switch-item .form-label {
  margin-bottom: 0;
}

.form-footer {
  padding: 30rpx;
  border-top: 1rpx solid #f5f5f5;
}

.save-btn {
  width: 100%;
  height: 80rpx;
  background-color: #6F87FF;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 加载更多 */
.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}
</style> 