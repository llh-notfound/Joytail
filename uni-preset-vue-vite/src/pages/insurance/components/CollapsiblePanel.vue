<template>
  <view class="collapsible-panel">
    <view class="panel-header" @click="togglePanel">
      <text class="panel-title">{{ title }}</text>
      <text class="panel-icon" :class="{ 'icon-expanded': isExpanded }">{{ isExpanded ? '▼' : '▶' }}</text>
    </view>
    
    <view class="panel-content" :class="{ 'content-expanded': isExpanded }">
      <slot v-if="isExpanded"></slot>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 定义props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultExpanded: {
    type: Boolean,
    default: false
  }
});

// 是否展开状态
const isExpanded = ref(props.defaultExpanded);

// 切换展开/折叠状态
const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style lang="scss">
.collapsible-panel {
  background-color: #fff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid transparent;
  position: relative;
}

.panel-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.panel-icon {
  font-size: 24rpx;
  color: #999;
  transition: transform 0.3s;
  
  &.icon-expanded {
    transform: rotate(0deg);
  }
}

.panel-content {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
  
  &.content-expanded {
    height: auto;
    padding: 30rpx;
    border-top: 1rpx solid #eee;
  }
}
</style> 