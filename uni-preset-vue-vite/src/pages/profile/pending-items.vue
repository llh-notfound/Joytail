<template>
  <view class="pending-items-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">待处理事项</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 待处理事项列表 -->
    <view class="pending-list">
      <!-- 未付款订单 -->
      <view class="pending-item" @tap="navigateToOrders">
        <view class="item-left">
          <view class="item-icon-wrap">
            <text class="item-icon iconfont icon-order"></text>
          </view>
          <view class="item-info">
            <text class="item-title">未付款订单</text>
            <text class="item-desc">您有{{ unpaidOrders }}个未付款订单</text>
          </view>
        </view>
        <view class="item-right">
          <text class="item-count">{{ unpaidOrders }}</text>
          <text class="item-arrow iconfont icon-right"></text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="isEmpty">
      <image class="empty-image" src="/static/images/empty.png" mode="aspectFit"></image>
      <text class="empty-text">暂无待处理事项</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import mockUser from '@/utils/mockUser.js';

// 待处理数据
const unpaidOrders = ref(0);

// 判断是否为空
const isEmpty = computed(() => {
  return unpaidOrders.value === 0;
});

// 获取待处理数据
const getPendingItems = () => {
  // 从mockUser中获取数据
  try {
    // 检查用户是否登录
    if (mockUser.isMockUserLoggedIn()) {
      // 获取订单列表数据
      const orderList = uni.getStorageSync('orderList') || [];
      
      // 计算未付款订单数量
      const unpaidCount = orderList.filter(order => order.status === '待付款').length;
      
      // 创建待处理事项数据对象
      const pendingItems = {
        unpaidOrders: unpaidCount
      };
      
      // 将数据保存到本地存储
      uni.setStorageSync('pendingItems', pendingItems);
      
      // 更新状态
      unpaidOrders.value = pendingItems.unpaidOrders;
      
      console.log('待处理事项数据:', pendingItems);
    } else {
      // 未登录
      unpaidOrders.value = 0;
    }
  } catch (e) {
    console.error('获取待处理数据失败', e);
    
    // 发生错误时，使用默认数据
    unpaidOrders.value = 0;
  }
};

// 跳转到订单列表
const navigateToOrders = () => {
  uni.navigateTo({
    url: '/pages/order/unpaid-list'
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 检查登录状态
const checkLoginStatus = () => {
  // 使用mockUser检查登录状态
  if (!mockUser.isMockUserLoggedIn()) {
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

onMounted(() => {
  // 检查登录状态
  if (checkLoginStatus()) {
    // 获取待处理数据
    getPendingItems();
  }
  
  // 监听用户登录事件
  uni.$on('userLogin', () => {
    getPendingItems();
  });
  
  // 监听用户登出事件
  uni.$on('userLogout', () => {
    // 用户登出时将数据清零
    unpaidOrders.value = 0;
  });
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  uni.$off('userLogin');
  uni.$off('userLogout');
});
</script>

<style lang="scss">
.pending-items-container {
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

/* 待处理事项列表 */
.pending-list {
  padding: 30rpx;
}

.pending-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-left {
  display: flex;
  align-items: center;
}

.item-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(111, 135, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.item-icon {
  font-size: 40rpx;
  color: #6F87FF;
}

.item-info {
  display: flex;
  flex-direction: column;
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

.item-right {
  display: flex;
  align-items: center;
}

.item-count {
  font-size: 32rpx;
  color: #6F87FF;
  font-weight: 600;
  margin-right: 10rpx;
}

.item-arrow {
  font-size: 28rpx;
  color: #ccc;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style> 