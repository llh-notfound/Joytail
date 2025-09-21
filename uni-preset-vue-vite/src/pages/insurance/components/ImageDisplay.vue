<template>
  <view class="image-display">
    <image 
      class="display-image" 
      :src="imageUrl" 
      :style="{ height: height + 'rpx' }" 
      mode="widthFix" 
      @error="handleImageError"
      @load="handleImageLoad"
    ></image>
    
    <!-- 加载状态 -->
    <view v-if="isLoading" class="image-loading">
      <view class="loading-indicator"></view>
      <text class="loading-text">加载图片中...</text>
    </view>
    
    <!-- 错误状态 -->
    <view v-if="loadError" class="image-error">
      <text class="error-icon">!</text>
      <text class="error-text">图片加载失败</text>
      <view class="retry-btn" @click="reloadImage">重试</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatImageUrl } from '../../../utils/imageHelper';

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    default: 800
  },
  fallbackImage: {
    type: String,
    default: '/static/images/image-not-found.png'
  }
});

// 状态管理
const isLoading = ref(true);
const loadError = ref(false);
const imageLoadCount = ref(0);

// 格式化图片URL
const imageUrl = computed(() => {
  return formatImageUrl(props.image, props.fallbackImage);
});

// 处理图片加载事件
const handleImageLoad = () => {
  isLoading.value = false;
  loadError.value = false;
};

// 处理图片加载错误
const handleImageError = () => {
  isLoading.value = false;
  loadError.value = true;
  console.error('🖼️ [图片显示] 加载失败:', props.image);
};

// 重新加载图片
const reloadImage = () => {
  isLoading.value = true;
  loadError.value = false;
  imageLoadCount.value++;
  console.log('🔄 [图片显示] 尝试重新加载图片', imageLoadCount.value);
};

// 监听图片URL变化，重置加载状态
watch(() => props.image, () => {
  isLoading.value = true;
  loadError.value = false;
});
</script>

<style lang="scss">
.image-display {
  width: 100%;
  position: relative;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  overflow: hidden;
}

.display-image {
  width: 100%;
  display: block;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  
  .loading-indicator {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #e0e0ff;
    border-top: 4rpx solid #6F87FF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  .loading-text {
    font-size: 26rpx;
    color: #666;
  }
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  
  .error-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: #ff6b6b;
    color: #fff;
    font-size: 60rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
  }
  
  .error-text {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }
  
  .retry-btn {
    padding: 10rpx 30rpx;
    background-color: #6F87FF;
    color: #fff;
    border-radius: 30rpx;
    font-size: 26rpx;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
