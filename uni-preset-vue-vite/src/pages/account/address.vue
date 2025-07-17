<template>
  <view class="address-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">地址管理</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 地址列表 -->
    <scroll-view 
      scroll-y 
      class="address-scroll-view"
      @scrolltolower="loadMore"
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
          <view class="address-info" @tap="selectAddress(item)">
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
    <view class="add-address" @tap="showAddressPopup()">
      <text class="add-icon iconfont icon-add"></text>
      <text>新增收货地址</text>
    </view>

    <!-- 地址编辑弹窗 -->
    <uni-popup ref="addressPopup" type="bottom">
      <view class="address-popup">
        <view class="popup-header">
          <text class="popup-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
          <text class="popup-close iconfont icon-close" @tap="closeAddressPopup"></text>
        </view>
        <view class="popup-content">
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
            <picker 
              mode="region" 
              :value="addressForm.regionArray" 
              @change="handleRegionChange"
              class="region-picker"
            >
              <view class="picker-value">
                {{ addressForm.region || '请选择所在地区' }}
              </view>
            </picker>
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
        <view class="popup-footer">
          <button class="save-btn" @tap="saveAddress">保存</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 地址列表
const addressList = ref([]);
const hasMore = ref(false);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 弹窗控制
const addressPopup = ref(null);
const isEdit = ref(false);
const currentAddress = ref(null);

// 地址表单
const addressForm = ref({
  name: '',
  phone: '',
  region: '',
  regionArray: [],
  detail: '',
  isDefault: false
});

// 模拟地址数据
const mockAddresses = [
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

// 获取地址列表
const getAddressList = () => {
  loading.value = true;
  
  // 模拟接口请求
  setTimeout(() => {
    addressList.value = mockAddresses;
    hasMore.value = false; // 模拟数据没有更多了
    loading.value = false;
    page.value++;
  }, 500);
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getAddressList();
};

// 选择地址
const selectAddress = (item) => {
  // 如果是从订单页面进入，则选择地址后返回
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (prevPage && prevPage.route.includes('order')) {
    uni.$emit('addressSelected', item);
    uni.navigateBack();
  }
};

// 设置默认地址
const setDefault = (item) => {
  if (item.isDefault) return;
  
  uni.showModal({
    title: '设置默认地址',
    content: '确定要将该地址设为默认地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 更新默认地址
        addressList.value.forEach(addr => {
          addr.isDefault = addr.id === item.id;
        });
        
        uni.showToast({
          title: '设置成功',
          icon: 'success'
        });
        
        // 更新本地存储
        uni.setStorageSync('addressList', addressList.value);
      }
    }
  });
};

// 编辑地址
const editAddress = (item) => {
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
  
  // 显示弹窗
  addressPopup.value.open();
};

// 删除地址
const deleteAddress = (item) => {
  uni.showModal({
    title: '删除地址',
    content: '确定要删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 删除地址
        const index = addressList.value.findIndex(addr => addr.id === item.id);
        if (index > -1) {
          addressList.value.splice(index, 1);
          
          // 如果删除的是默认地址，且还有其他地址，则将第一个地址设为默认
          if (item.isDefault && addressList.value.length > 0) {
            addressList.value[0].isDefault = true;
          }
          
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          
          // 更新本地存储
          uni.setStorageSync('addressList', addressList.value);
        }
      }
    }
  });
};

// 显示地址弹窗
const showAddressPopup = () => {
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
  
  // 显示弹窗
  addressPopup.value.open();
};

// 关闭地址弹窗
const closeAddressPopup = () => {
  addressPopup.value.close();
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
const saveAddress = () => {
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
  
  // 关闭弹窗
  addressPopup.value.close();
  
  // 提示成功
  uni.showToast({
    title: isEdit.value ? '修改成功' : '添加成功',
    icon: 'success'
  });
  
  // 更新本地存储
  uni.setStorageSync('addressList', addressList.value);
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 获取本地存储的地址列表
  const storedAddresses = uni.getStorageSync('addressList');
  if (storedAddresses && storedAddresses.length > 0) {
    addressList.value = storedAddresses;
  } else {
    getAddressList();
  }
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

.nav-back {
  position: absolute;
  left: 30rpx;
  font-size: 36rpx;
  color: #333;
}

/* 地址列表区域 */
.address-scroll-view {
  flex: 1;
  height: calc(100vh - 180rpx);
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
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6F87FF;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}

.add-icon {
  font-size: 36rpx;
  margin-right: 10rpx;
}

/* 地址编辑弹窗 */
.address-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.popup-close {
  font-size: 36rpx;
  color: #999;
}

.popup-content {
  padding: 30rpx;
  max-height: 60vh;
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
.region-picker {
  width: 100%;
}

.picker-value {
  width: 100%;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
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

.popup-footer {
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