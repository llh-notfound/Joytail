<template>
  <view class="support-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">服务支持</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 功能入口列表 -->
    <view class="support-list">
      <!-- 在线客服 -->
      <view class="support-item" @tap="navigateTo('/pages/support/customer-service')">
        <view class="item-icon">
          <text class="iconfont icon-service"></text>
        </view>
        <view class="item-info">
          <text class="item-title">在线客服</text>
          <text class="item-desc">专业客服在线解答您的问题</text>
        </view>
        <text class="item-arrow iconfont icon-arrow-right"></text>
      </view>

      <!-- 帮助中心 -->
      <view class="support-item" @tap="navigateTo('/pages/support/help-center')">
        <view class="item-icon">
          <text class="iconfont icon-help"></text>
        </view>
        <view class="item-info">
          <text class="item-title">帮助中心</text>
          <text class="item-desc">常见问题解答与使用指南</text>
        </view>
        <text class="item-arrow iconfont icon-arrow-right"></text>
      </view>

      <!-- 投诉建议 -->
      <view class="support-item" @tap="navigateTo('/pages/support/feedback')">
        <view class="item-icon">
          <text class="iconfont icon-feedback"></text>
        </view>
        <view class="item-info">
          <text class="item-title">投诉建议</text>
          <text class="item-desc">您的反馈是我们进步的动力</text>
        </view>
        <text class="item-arrow iconfont icon-arrow-right"></text>
      </view>
    </view>

    <!-- 底部说明 -->
    <view class="support-footer">
      <text class="footer-text">工作时间：周一至周日 9:00-22:00</text>
      <text class="footer-text">客服电话：400-123-4567</text>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue';

// 页面跳转
const navigateTo = (url) => {
  uni.navigateTo({
    url
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 检查登录状态
  const token = uni.getStorageSync('token');
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
  }
});
</script>

<style lang="scss">
.support-container {
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

/* 功能入口列表 */
.support-list {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.support-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.support-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(111, 135, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.item-icon .iconfont {
  font-size: 40rpx;
  color: #6F87FF;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #999;
}

.item-arrow {
  font-size: 32rpx;
  color: #ccc;
}

/* 底部说明 */
.support-footer {
  margin: 40rpx 30rpx;
  text-align: center;
}

.footer-text {
  display: block;
  font-size: 24rpx;
  color: #999;
  line-height: 1.8;
}
</style> 