<template>
  <view class="order-management-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">订单管理</text>
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
    </view>

    <!-- 订单类型列表 -->
    <view class="order-type-list">
      <!-- 宠物用品订单 -->
      <view class="order-type-item" @tap="navigateTo('/pages/order/goods-list')">
        <view class="type-icon">
          <text class="iconfont icon-order"></text>
        </view>
        <view class="type-info">
          <text class="type-title">宠物用品订单</text>
          <text class="type-desc">查看您的宠物用品订单记录</text>
        </view>
        <text class="type-arrow iconfont icon-arrow-right"></text>
      </view>

      <!-- 保险订单 -->
      <view class="order-type-item" @tap="navigateTo('/pages/order/insurance-list')">
        <view class="type-icon">
          <text class="iconfont icon-insurance"></text>
        </view>
        <view class="type-info">
          <text class="type-title">保险订单</text>
          <text class="type-desc">查看您的宠物保险订单记录</text>
        </view>
        <text class="type-arrow iconfont icon-arrow-right"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue';
import mockUser from '../../utils/mockUser.js';

// 检查登录状态
const checkLoginStatus = () => {
  // 从本地存储中获取token
  const token = uni.getStorageSync('token');
  
  // 如果没有token或token无效，则提示用户登录
  if (!token) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }, 1500);
    return false;
  }
  return true;
};

// 页面跳转
const navigateTo = (url) => {
  if (checkLoginStatus()) {
    uni.navigateTo({ url });
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  checkLoginStatus();
});
</script>

<style lang="scss">
.order-management-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

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

.order-type-list {
  padding: 20rpx;
}

.order-type-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.type-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f3ff;
  border-radius: 50%;
  
  .iconfont {
    font-size: 48rpx;
    color: #6F87FF;
  }
}

.type-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.type-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.type-desc {
  font-size: 26rpx;
  color: #999;
}

.type-arrow {
  font-size: 32rpx;
  color: #999;
}
</style> 