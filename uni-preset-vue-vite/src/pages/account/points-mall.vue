<template>
  <view class="points-mall-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">积分商城</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 积分信息 -->
    <view class="points-info">
      <view class="points-header">
        <text class="points-label">我的积分</text>
        <text class="points-value">{{ userPoints }}</text>
      </view>
      <text class="points-desc">积分可用于兑换精美商品，每消费1元可获得1积分</text>
    </view>

    <!-- 商品列表 -->
    <scroll-view 
      scroll-y 
      class="products-scroll-view"
      @scrolltolower="loadMore"
    >
      <!-- 空内容提示 -->
      <view v-if="productsList.length === 0" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-products.png"></image>
        <text>暂无可兑换商品</text>
      </view>

      <!-- 商品列表 -->
      <view class="products-list">
        <view 
          v-for="(item, index) in productsList" 
          :key="index"
          class="product-item"
        >
          <image class="product-image" :src="item.image" mode="aspectFill"></image>
          <view class="product-info">
            <view class="product-name">{{ item.name }}</view>
            <view class="product-desc">{{ item.description }}</view>
            <view class="product-footer">
              <view class="points-required">
                <text class="points-icon">积分</text>
                <text class="points-number">{{ item.points }}</text>
              </view>
              <text 
                class="exchange-btn"
                :class="{ disabled: userPoints < item.points || item.stock === 0 }"
                @tap="exchangeProduct(item)"
              >
                {{ userPoints < item.points ? '积分不足' : item.stock === 0 ? '已抢光' : '立即兑换' }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && productsList.length > 0" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 用户积分
const userPoints = ref(1280);

// 商品列表
const productsList = ref([]);
const hasMore = ref(false);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 模拟商品数据
const mockProducts = [
  {
    id: 'P001',
    name: '宠物玩具套装',
    description: '包含球、绳、飞盘等多种玩具',
    points: 500,
    stock: 10,
    image: '/static/images/products/toy-set.jpg'
  },
  {
    id: 'P002',
    name: '高级猫砂',
    description: '除臭效果好，结团快',
    points: 300,
    stock: 20,
    image: '/static/images/products/cat-litter.jpg'
  },
  {
    id: 'P003',
    name: '宠物美容券',
    description: '专业宠物美容服务一次',
    points: 800,
    stock: 5,
    image: '/static/images/products/grooming.jpg'
  },
  {
    id: 'P004',
    name: '宠物零食礼包',
    description: '多种口味零食组合',
    points: 400,
    stock: 0,
    image: '/static/images/products/snacks.jpg'
  }
];

// 获取商品列表
const getProductsList = () => {
  loading.value = true;
  
  // 模拟接口请求
  setTimeout(() => {
    productsList.value = mockProducts;
    hasMore.value = false; // 模拟数据没有更多了
    loading.value = false;
    page.value++;
  }, 500);
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getProductsList();
};

// 兑换商品
const exchangeProduct = (item) => {
  if (userPoints.value < item.points || item.stock === 0) return;
  
  uni.showModal({
    title: '兑换确认',
    content: `确定要使用${item.points}积分兑换${item.name}吗？`,
    success: (res) => {
      if (res.confirm) {
        // 模拟兑换商品
        uni.showLoading({
          title: '兑换中...'
        });
        
        setTimeout(() => {
          // 更新积分和库存
          userPoints.value -= item.points;
          item.stock--;
          
          uni.hideLoading();
          uni.showToast({
            title: '兑换成功',
            icon: 'success'
          });
          
          // 更新本地存储的积分
          uni.setStorageSync('userPoints', userPoints.value);
        }, 1500);
      }
    }
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 获取本地存储的积分
  const storedPoints = uni.getStorageSync('userPoints');
  if (storedPoints) {
    userPoints.value = storedPoints;
  }
  
  getProductsList();
});
</script>

<style lang="scss">
.points-mall-container {
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

/* 积分信息 */
.points-info {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.points-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 10rpx;
}

.points-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.points-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #6F87FF;
}

.points-desc {
  font-size: 24rpx;
  color: #999;
}

/* 商品列表区域 */
.products-scroll-view {
  flex: 1;
  height: calc(100vh - 280rpx);
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

.products-list {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  background-color: #f5f5f5;
}

.product-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.product-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.points-required {
  display: flex;
  align-items: center;
}

.points-icon {
  font-size: 24rpx;
  color: #fff;
  background-color: #6F87FF;
  padding: 4rpx 10rpx;
  border-radius: 20rpx;
  margin-right: 6rpx;
}

.points-number {
  font-size: 28rpx;
  color: #6F87FF;
  font-weight: 500;
}

.exchange-btn {
  font-size: 26rpx;
  color: #fff;
  background-color: #6F87FF;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
}

.exchange-btn.disabled {
  background-color: #ccc;
}

/* 加载更多 */
.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}
</style> 