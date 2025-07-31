<template>
  <view class="goods-order-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">宠物用品订单</text>
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
    </view>

    <!-- 分类标签栏 -->
    <view class="tab-bar">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="tab-item" 
        :class="{ active: currentTab === index }"
        @tap="switchTab(index)"
      >
        <text>{{ tab }}</text>
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
        <text>暂无相关订单</text>
      </view>

      <!-- 订单列表 -->
      <view 
        v-for="(order, index) in orderList" 
        :key="index"
        class="order-item"
      >
        <view class="order-header">
          <text class="order-number">订单号: {{ order.orderNumber }}</text>
          <text class="order-status" :class="getStatusClass(order.status)">{{ order.status }}</text>
        </view>
        
        <view class="order-content">
          <!-- 处理商品信息缺失的情况 -->
          <template v-if="order.goodsInfo && order.goodsInfo.length > 0">
            <!-- 有商品信息时显示第一个商品 -->
            <image class="goods-image" :src="order.goodsInfo[0].image || '/static/images/empty-order.png'"></image>
            <view class="order-info">
              <view class="order-name">{{ order.goodsInfo[0].name || '商品信息缺失' }}</view>
              <view class="order-specs">{{ order.goodsInfo[0].specs || '规格信息缺失' }}</view>
              <view class="order-price">
                <text>¥{{ order.goodsInfo[0].price || 0 }}</text>
                <text class="order-quantity">x{{ order.goodsInfo[0].quantity || 1 }}</text>
              </view>
            </view>
          </template>
          <template v-else>
            <!-- 没有商品信息时显示默认内容 -->
            <image class="goods-image" src="/static/images/empty-order.png"></image>
            <view class="order-info">
              <view class="order-name">商品信息缺失</view>
              <view class="order-specs">规格信息缺失</view>
              <view class="order-price">
                <text>¥0</text>
                <text class="order-quantity">x1</text>
              </view>
            </view>
          </template>
        </view>
        
        <view class="order-footer">
          <view class="order-total">合计: ¥{{ order.totalAmount || order.totalPrice || order.amount || 0 }}</view>
          <view class="order-actions">
            <button 
              v-if="order.status === '待付款'" 
              class="action-btn primary-btn"
              @tap="payOrder(order)"
            >去付款</button>
            <button 
              v-if="['待发货', '待收货', '已完成'].includes(order.status)" 
              class="action-btn"
              @tap="viewLogistics(order)"
            >查看物流</button>
            <button 
              v-if="order.status === '待收货'" 
              class="action-btn primary-btn"
              @tap="confirmReceive(order)"
            >确认收货</button>
            <button 
              v-if="order.status === '已完成'" 
              class="action-btn"
              @tap="applyAfterSale(order)"
            >申请售后</button>
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
import { orderApi } from '../../utils/api';
import { USE_MOCK } from '../../utils/config';
import mockUser from '../../utils/mockUser.js';

// 标签栏标签
const tabs = ['全部', '待付款', '待发货', '待收货', '已完成', '售后'];

// 当前选中的标签索引
const currentTab = ref(0);

// 订单列表
const orderList = ref([]);

// 是否有更多数据
const hasMore = ref(false);

// 是否正在加载
const loading = ref(false);

// 当前页码
const page = ref(1);

// 每页数量
const pageSize = ref(10);

// 获取订单列表
const getOrderList = async () => {
  loading.value = true;
  
  console.log('🛒 [订单列表] 开始获取订单列表')
  console.log('🛒 [订单列表] 当前标签:', currentTab.value, tabs[currentTab.value])
  console.log('🛒 [订单列表] 是否使用Mock:', USE_MOCK)
  
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
    loading.value = false;
    return;
  }
  
  // 检查是否为未实现的功能
  if (currentTab.value >= 2) {
    console.log('🛒 [订单列表] 功能开发中:', tabs[currentTab.value])
    orderList.value = [];
    loading.value = false;
    hasMore.value = false;
    uni.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  
  if (USE_MOCK) {
    // Mock模式保持原有逻辑
    setTimeout(() => {
      try {
        const mockOrders = [];
        try {
          const storageOrders = uni.getStorageSync('orderList') || [];
          const filteredOrders = storageOrders.filter(order => order.type === 'goods');
          mockOrders.push(...filteredOrders);
        } catch (e) {
          console.error('获取本地订单数据失败:', e);
          mockOrders.push(...(mockUser.mockOrderList || []).filter(order => order.type === 'goods'));
        }
        
        // 根据当前标签过滤订单
        if (currentTab.value === 0) { // 全部
          orderList.value = [...mockOrders];
        } else if (currentTab.value === 1) { // 待付款
          orderList.value = mockOrders.filter(order => order.status === '待付款');
        }
        
        console.log('✅ [订单列表] Mock模式获取成功，订单数量:', orderList.value.length)
      } catch (error) {
        console.error('❌ [订单列表] Mock模式获取失败:', error);
        orderList.value = [];
      } finally {
        loading.value = false;
        hasMore.value = false;
      }
    }, 500);
    return;
  }
  
  // API模式 - 只实现"全部"和"待付款"功能
  try {
    // 获取对应状态的参数
    const statusParams = {
      0: 'all',           // 全部
      1: 'pending_payment' // 待付款
    };
    
    const currentStatus = statusParams[currentTab.value];
    
    // 调用API获取订单列表
    const response = await orderApi.getGoodsOrderList(
      currentStatus,
      page.value,
      pageSize.value
    );
    
    if (response.code === 200) {
      if (page.value === 1) {
        orderList.value = response.data.list;
      } else {
        orderList.value = [...orderList.value, ...response.data.list];
      }
      hasMore.value = response.data.hasMore;
      console.log('✅ [订单列表] API模式获取成功，订单数量:', orderList.value.length)
      console.log('📊 [订单列表] 订单数据结构示例:', orderList.value[0])
      console.log('💰 [订单列表] 第一个订单金额字段:', {
        totalAmount: orderList.value[0]?.totalAmount,
        totalPrice: orderList.value[0]?.totalPrice,
        amount: orderList.value[0]?.amount
      })
      console.log('🔍 [订单列表] 第一个订单完整数据结构:', JSON.stringify(orderList.value[0], null, 2))
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('❌ [订单列表] API模式获取失败:', error);
    uni.showToast({
      title: '获取订单列表失败',
      icon: 'none'
    });
    orderList.value = [];
  } finally {
    loading.value = false;
  }
};

// 切换标签
const switchTab = (index) => {
  if (currentTab.value === index) return;
  currentTab.value = index;
  page.value = 1;
  getOrderList();
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  page.value++;
  getOrderList();
};

// 获取状态对应的样式类
const getStatusClass = (status) => {
  const classMap = {
    '待付款': 'status-pending',
    '待发货': 'status-processing',
    '待收货': 'status-shipping',
    '已完成': 'status-completed',
    '售后': 'status-aftersale'
  };
  return classMap[status] || '';
};

// 支付订单
const payOrder = (order) => {
  if (USE_MOCK) {
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
      }
    }));
    
    // 跳转到确认订单页面并传递订单数据
    uni.navigateTo({
      url: `/pages/order/confirm-order?orderData=${orderData}&fromPaymentPending=true`
    });
    return;
  }
  
  // API模式：处理真实数据结构
  console.log('开始支付订单:', order);
  
  // 构建商品信息（处理可能缺失的数据）
  let goodsInfo = null;
  if (order.goodsInfo && order.goodsInfo.length > 0) {
    goodsInfo = {
      id: order.goodsInfo[0].id || Date.now(),
      name: order.goodsInfo[0].name || '商品信息缺失',
      image: order.goodsInfo[0].image || '/static/images/empty-order.png',
      specs: order.goodsInfo[0].specs || '规格信息缺失',
      price: order.goodsInfo[0].price || 0,
      quantity: order.goodsInfo[0].quantity || 1
    };
  } else {
    goodsInfo = {
      id: Date.now(),
      name: '商品信息缺失',
      image: '/static/images/empty-order.png',
      specs: '规格信息缺失',
      price: 0,
      quantity: 1
    };
  }
  
  // 将订单数据转换为字符串并进行编码
  const orderData = encodeURIComponent(JSON.stringify({
    orderNumber: order.orderNumber,
    totalPrice: order.totalAmount || order.totalPrice || 0,
    goodsInfo: goodsInfo
  }));
  
  // 跳转到确认订单页面并传递订单数据
  uni.navigateTo({
    url: `/pages/order/confirm-order?orderData=${orderData}&fromPaymentPending=true`
  });
  
  // API模式：实际支付流程
  console.log('开始支付订单:', order);
  
  // 显示支付方式选择
  uni.showActionSheet({
    itemList: ['微信支付', '支付宝支付'],
    success: (res) => {
      const paymentMethod = res.tapIndex === 0 ? 'wechat' : 'alipay';
      console.log('选择支付方式:', paymentMethod);
      
      uni.showLoading({
        title: '发起支付中...'
      });
      
      // 调用支付接口
      orderApi.payOrder(order.orderNumber, paymentMethod, 'h5')
        .then(response => {
          uni.hideLoading();
          console.log('支付接口响应:', response);
          
          if (response.success) {
            // 支付成功
            uni.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
            
            // 更新订单状态为已支付
            const orderIndex = orderList.value.findIndex(o => o.orderNumber === order.orderNumber);
            if (orderIndex !== -1) {
              orderList.value[orderIndex].status = '待发货';
            }
            
            // 刷新订单列表
            setTimeout(() => {
              getOrderList();
            }, 2000);
            
          } else {
            // 支付失败
            console.error('支付失败:', response.message);
            uni.showToast({
              title: response.message || '支付失败',
              icon: 'none',
              duration: 3000
            });
          }
        })
        .catch(err => {
          uni.hideLoading();
          console.error('支付请求失败:', err);
          
          let errorMessage = '支付失败，请重试';
          if (err.status === 401) {
            errorMessage = '请先登录';
            // 跳转到登录页面
            uni.navigateTo({
              url: '/pages/login/login'
            });
          } else if (err.status === 400) {
            errorMessage = err.message || '订单信息有误';
          } else if (err.status === 500) {
            errorMessage = '服务器繁忙，请稍后重试';
          }
          
          uni.showToast({
            title: errorMessage,
            icon: 'none',
            duration: 3000
          });
        });
    },
    fail: () => {
      console.log('用户取消支付');
    }
  });
};

// 查看物流
const viewLogistics = (order) => {
  uni.navigateTo({
    url: `/pages/order/logistics?orderNumber=${order.orderNumber}`
  });
};

// 确认收货
const confirmReceive = (order) => {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到商品？',
    success: (res) => {
      if (res.confirm) {
        if (USE_MOCK) {
          // 模拟确认收货
          uni.showToast({
            title: '确认收货成功',
            icon: 'success'
          });
          
          // 更新订单状态
          const index = orderList.value.findIndex(o => o.orderNumber === order.orderNumber);
          if (index !== -1) {
            orderList.value[index].status = '已完成';
          }
          return;
        }
        
        uni.showLoading({
          title: '处理中...'
        });
        
        orderApi.confirmOrder(order.orderNumber)
          .then(res => {
            uni.hideLoading();
            uni.showToast({
              title: '确认收货成功',
              icon: 'success'
            });
            
            // 刷新订单列表
            page.value = 1;
            getOrderList();
          })
          .catch(err => {
            uni.hideLoading();
            console.error('确认收货失败:', err);
            uni.showToast({
              title: err.message || '确认收货失败，请重试',
              icon: 'none'
            });
          });
      }
    }
  });
};

// 申请售后
const applyAfterSale = (order) => {
  uni.navigateTo({
    url: `/pages/order/aftersale?orderNumber=${order.orderNumber}`
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options;
  
  // 检查是否有tab参数
  if (options && options.tab) {
    const tabIndex = parseInt(options.tab);
    if (tabIndex >= 0 && tabIndex < tabs.length) {
      currentTab.value = tabIndex;
      console.log('🛒 [订单列表] 根据参数切换到标签:', tabs[tabIndex]);
    }
  }
  
  getOrderList();
});
</script>

<style lang="scss">
.goods-order-container {
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

/* 分类标签栏 */
.tab-bar {
  display: flex;
  background-color: #fff;
  padding: 0 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #6F87FF;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #6F87FF;
  border-radius: 4rpx;
}

/* 订单列表区域 */
.order-scroll-view {
  flex: 1;
  height: calc(100vh - 170rpx);
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

.status-processing {
  color: #6F87FF;
}

.status-shipping {
  color: #00b578;
}

.status-completed {
  color: #999;
}

.status-aftersale {
  color: #ff4d4f;
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