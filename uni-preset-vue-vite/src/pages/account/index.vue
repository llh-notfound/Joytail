<template>
  <view class="account-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">账户工具</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 账户信息卡片 -->
    <view class="account-card">
      <view class="account-header">
        <image class="user-avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ userInfo.nickname || '未登录' }}</text>
          <text class="user-level">{{ userInfo.level || '普通会员' }}</text>
        </view>
      </view>
      <view class="account-stats">
        <view class="stat-item">
          <text class="stat-value">{{ userInfo.points || 0 }}</text>
          <text class="stat-label">积分</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userInfo.coupons || 0 }}</text>
          <text class="stat-label">优惠券</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userInfo.addresses || 0 }}</text>
          <text class="stat-label">收货地址</text>
        </view>
      </view>
    </view>

    <!-- 工具列表 -->
    <view class="tools-list">
      <view class="tool-item" @tap="navigateTo('/pages/account/coupons')">
        <view class="tool-icon">
          <text class="iconfont icon-coupon"></text>
        </view>
        <view class="tool-info">
          <text class="tool-name">我的优惠券</text>
          <text class="tool-desc">查看可用和已过期优惠券</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <view class="tool-item" @tap="navigateTo('/pages/account/points-mall')">
        <view class="tool-icon">
          <text class="iconfont icon-points"></text>
        </view>
        <view class="tool-info">
          <text class="tool-name">积分商城</text>
          <text class="tool-desc">使用积分兑换精美商品</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>

      <view class="tool-item" @tap="navigateTo('/pages/account/address')">
        <view class="tool-icon">
          <text class="iconfont icon-address"></text>
        </view>
        <view class="tool-info">
          <text class="tool-name">地址管理</text>
          <text class="tool-desc">管理收货地址信息</text>
        </view>
        <text class="iconfont icon-right"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 用户信息
const userInfo = ref({
  avatar: '',
  nickname: '',
  level: '普通会员',
  points: 1280,
  coupons: 3,
  addresses: 2
});

// 获取用户信息
const getUserInfo = () => {
  // 从本地存储获取用户信息
  const storedUserInfo = uni.getStorageSync('userInfo');
  if (storedUserInfo) {
    userInfo.value = { ...userInfo.value, ...JSON.parse(storedUserInfo) };
  }
};

// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({ url });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  getUserInfo();
});
</script>

<style lang="scss">
.account-container {
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

/* 账户信息卡片 */
.account-card {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding: 30rpx;
}

.account-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 6rpx;
}

.user-level {
  font-size: 24rpx;
  color: #6F87FF;
  background-color: rgba(111, 135, 255, 0.1);
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.account-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #f5f5f5;
  padding-top: 30rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 6rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

/* 工具列表 */
.tools-list {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.tool-item:last-child {
  border-bottom: none;
}

.tool-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(111, 135, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.tool-icon .iconfont {
  font-size: 40rpx;
  color: #6F87FF;
}

.tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tool-name {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.tool-desc {
  font-size: 24rpx;
  color: #999;
}

.tool-item .icon-right {
  font-size: 32rpx;
  color: #ccc;
}
</style> 