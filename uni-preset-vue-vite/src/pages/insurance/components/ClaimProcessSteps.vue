<template>
  <view class="claim-process">
    <view 
      v-for="(step, index) in steps" 
      :key="index" 
      class="process-step"
    >
      <view class="step-icon-container">
        <view class="step-icon">
          <text class="iconfont" :class="step.icon"></text>
        </view>
        <view v-if="index < steps.length - 1" class="step-line"></view>
      </view>
      <view class="step-content">
        <view class="step-title">{{ index + 1 }}. {{ step.title }}</view>
        <view class="step-description">{{ step.description }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 定义props
const props = defineProps({
  steps: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style lang="scss">
.claim-process {
  padding: 10rpx 0;
}

.process-step {
  display: flex;
  margin-bottom: 40rpx;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.step-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
  position: relative;
}

.step-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  .iconfont {
    color: #fff;
    font-size: 40rpx;
  }
}

.step-line {
  width: 4rpx;
  background-color: #e0e0ff;
  flex: 1;
  position: absolute;
  top: 80rpx;
  bottom: -40rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

.step-content {
  flex: 1;
  padding-top: 10rpx;
}

.step-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.step-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
</style> 