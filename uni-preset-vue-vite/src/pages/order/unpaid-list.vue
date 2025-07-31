<template>
  <view class="unpaid-order-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">未付款订单</text>
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
    </view>

    <!-- 订单列表内容 -->
    <scroll-view 
      scroll-y 
      class="order-scroll-view"
      @scrolltolower="loadMore"
    >
      <!-- 空订单提示 -->
      <view v-if="orderList.length === 0" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-order.png"></image>
        <text>暂无未付款订单</text>
      </view>

      <!-- 订单列表 -->
      <view 
        v-for="(order, index) in orderList" 
        :key="index"
        class="order-item"
      >
        <view class="order-header">
          <text class="order-number">订单号: {{ order.orderNumber }}</text>
          <text class="order-status status-pending">{{ order.status }}</text>
        </view>
        
        <view class="order-content">
          <image class="goods-image" :src="order.image"></image>
          <view class="order-info">
            <view class="order-name">{{ order.name }}</view>
            <view class="order-specs">{{ order.specs }}</view>
            <view class="order-price">
              <text>¥{{ order.price }}</text>
              <text class="order-quantity">x{{ order.quantity }}</text>
            </view>
          </view>
        </view>
        
        <view class="order-footer">
          <view class="order-total">合计: ¥{{ order.totalPrice }}</view>
          <view class="order-actions">
            <button 
              class="action-btn primary-btn"
              @tap="payOrder(order, index)"
            >去付款</button>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && orderList.length > 0" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mockUser from '../../utils/mockUser.js';

// 订单列表
const orderList = ref([]);
const hasMore = ref(false);
const loading = ref(false);

// 获取订单列表
const getOrderList = () => {
  loading.value = true;
  
  // 模拟网络请求延迟
  setTimeout(() => {
    try {
      // 获取所有待付款订单
      const unpaidOrders = mockUser.mockOrderList.filter(order => order.status === '待付款');
      orderList.value = [...unpaidOrders];
    } catch (error) {
      console.error('获取订单列表失败:', error);
      orderList.value = [];
    } finally {
      loading.value = false;
      hasMore.value = false;
    }
  }, 500);
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getOrderList();
};

// 支付订单
const payOrder = (order, index) => {
  // 将订单数据转换为字符串并进行编码
  const orderData = encodeURIComponent(JSON.stringify({
    orderNumber: order.orderNumber,
    totalPrice: order.totalPrice,
    goodsInfo: {
      id: order.id || Date.now(),
      name: order.name,
      image: order.image,
      specs: order.specs,
      price: order.price,
      quantity: order.quantity
    },
    orderIndex: index // 添加订单在列表中的索引，用于支付后移除
  }));
  
  // 跳转到确认订单页面并传递订单数据
  uni.navigateTo({
    url: `/pages/order/confirm-order?orderData=${orderData}&fromPaymentPending=true&fromUnpaidList=true`,
    success: () => {
      console.log('跳转到确认订单页面成功');
    },
    fail: (err) => {
      console.error('跳转到确认订单页面失败:', err);
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      });
    }
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 从确认订单页面返回，并移除已支付的订单
uni.$on('orderPaid', (data) => {
  if (data && data.orderIndex !== undefined) {
    orderList.value.splice(data.orderIndex, 1);
    uni.showToast({
      title: '订单已支付',
      icon: 'success'
    });
  }
});

onMounted(() => {
  getOrderList();
  
  // 组件销毁时，需要移除事件监听
  return () => {
    uni.$off('orderPaid');
  };
});
</script>

<style lang="scss">
.unpaid-order-container {
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

/* 订单列表区域 */
.order-scroll-view {
  flex: 1;
  height: calc(100vh - 90rpx);
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.order-item {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-number {
  font-size: 26rpx;
  color: #666;
}

.order-status {
  font-size: 26rpx;
  font-weight: 500;
}

.status-pending {
  color: #ff9f00;
}

.order-content {
  display: flex;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.goods-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 10rpx;
  background-color: #f5f5f5;
  margin-right: 20rpx;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.order-specs {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.order-price {
  display: flex;
  justify-content: space-between;
  font-size: 30rpx;
  color: #333;
  margin-top: auto;
}

.order-quantity {
  font-size: 26rpx;
  color: #999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
}

.order-total {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.order-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  background-color: #f5f5f5;
  color: #666;
  line-height: 1.5;
  border: 1rpx solid #e0e0e0;
}

.primary-btn {
  background-color: #6F87FF;
  color: #fff;
  border: none;
}

/* 加载更多 */
.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}
</style> 