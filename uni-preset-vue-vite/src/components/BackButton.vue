<template>
  <view class="back-btn" @tap="handleBack">
    <text class="back-text">←</text>
  </view>
</template>

<script setup>
// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.back-btn {
  position: absolute;
  left: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.back-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}
</style> 