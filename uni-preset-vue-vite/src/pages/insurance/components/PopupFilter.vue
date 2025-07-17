<template>
  <view class="popup-filter">
    <view class="filter-mask" @click="handleClose"></view>
    <view class="filter-content">
      <view class="filter-header">
        <text class="filter-title">{{ title }}</text>
        <text class="close-btn" @click="handleClose">×</text>
      </view>
      
      <scroll-view scroll-y class="filter-options">
        <view 
          v-for="(option, index) in options" 
          :key="index"
          class="filter-option"
          :class="{ active: currentSelected === option }"
          @click="handleSelect(option)"
        >
          <text>{{ option }}</text>
          <text v-if="currentSelected === option" class="selected-icon">✓</text>
        </view>
      </scroll-view>
      
      <view class="filter-footer">
        <view class="reset-btn" @click="handleReset">重置</view>
        <view class="confirm-btn" @click="handleConfirm">确定</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';

// 接收父组件传递的属性
const props = defineProps({
  title: {
    type: String,
    default: '筛选'
  },
  options: {
    type: Array,
    default: () => []
  },
  selected: {
    type: String,
    default: ''
  }
});

// 定义事件
const emit = defineEmits(['confirm', 'close']);

// 当前选中的选项
const currentSelected = ref(props.selected);

// 监听 props.selected 变化，更新 currentSelected
watch(() => props.selected, (newVal) => {
  currentSelected.value = newVal;
}, { immediate: true });

// 处理选项选择
const handleSelect = (option) => {
  currentSelected.value = option;
};

// 处理确认
const handleConfirm = () => {
  emit('confirm', currentSelected.value);
};

// 处理重置
const handleReset = () => {
  currentSelected.value = props.options[0] || ''; // 默认选择第一个选项（通常是"全部"）
};

// 处理关闭
const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss">
.popup-filter {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.filter-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.filter-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 70%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.filter-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .filter-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
  
  .close-btn {
    font-size: 40rpx;
    color: #999;
    line-height: 1;
  }
}

.filter-options {
  flex: 1;
  max-height: calc(100vh - 200rpx);
}

.filter-option {
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  
  &.active {
    color: #6F87FF;
    background-color: rgba(111, 135, 255, 0.05);
    font-weight: 500;
  }
  
  .selected-icon {
    color: #6F87FF;
    font-size: 32rpx;
  }
}

.filter-footer {
  padding: 30rpx;
  display: flex;
  border-top: 1rpx solid #eee;
}

.reset-btn, .confirm-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #666;
  margin-right: 20rpx;
}

.confirm-btn {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
}
</style> 