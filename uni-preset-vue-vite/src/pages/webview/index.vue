<template>
  <view class="webview-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">{{ title }}</text>
    </view>
    
    <!-- WebView组件 -->
    <web-view :src="url" @message="handleMessage" @error="handleError"></web-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 链接地址
const url = ref('');
// 页面标题
const title = ref('网页浏览');

// 初始化页面
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options;
  
  if (options && options.url) {
    url.value = decodeURIComponent(options.url);
    
    // 如果有标题参数，使用传入的标题
    if (options.title) {
      title.value = decodeURIComponent(options.title);
    }
  } else {
    // 如果没有URL参数，默认打开一个页面或返回
    uni.showToast({
      title: '链接无效',
      icon: 'none'
    });
    
    // 延迟返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
});

// 处理WebView消息
const handleMessage = (event) => {
  console.log('WebView消息:', event);
};

// 处理WebView错误
const handleError = (event) => {
  console.error('WebView错误:', event);
  uni.showToast({
    title: '网页加载失败',
    icon: 'none'
  });
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.webview-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部导航栏 */
.nav-bar {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  color: #fff;
  
  .back-btn {
    padding: 10rpx;
    margin-right: 20rpx;
    
    .iconfont {
      font-size: 36rpx;
    }
  }
  
  .page-title {
    font-size: 32rpx;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 75%;
  }
}

/* WebView默认会占满剩余空间 */
web-view {
  flex: 1;
}
</style> 