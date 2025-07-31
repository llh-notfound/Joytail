<template>
  <view class="coupons-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">我的优惠券</text>
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

    <!-- 优惠券列表 -->
    <scroll-view 
      scroll-y 
      class="coupons-scroll-view"
      @scrolltolower="loadMore"
    >
      <!-- 空内容提示 -->
      <view v-if="filteredCoupons.length === 0" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-coupon.png"></image>
        <text>暂无{{ currentTab === 0 ? '可用' : '已过期' }}优惠券</text>
      </view>

      <!-- 优惠券列表 -->
      <view class="coupons-list">
        <view 
          v-for="(item, index) in filteredCoupons" 
          :key="index"
          class="coupon-item"
          :class="{ expired: currentTab === 1 }"
        >
          <view class="coupon-left">
            <view class="coupon-amount">
              <text class="amount-symbol">¥</text>
              <text class="amount-value">{{ item.amount }}</text>
            </view>
            <view class="coupon-condition">满{{ item.condition }}元可用</view>
          </view>
          <view class="coupon-right">
            <view class="coupon-info">
              <view class="coupon-name">{{ item.name }}</view>
              <view class="coupon-desc">{{ item.description }}</view>
              <view class="coupon-time">{{ item.startTime }} - {{ item.endTime }}</view>
            </view>
            <view class="coupon-action">
              <text 
                v-if="currentTab === 0" 
                class="use-btn"
                @tap="useCoupon(item)"
              >立即使用</text>
              <text v-else class="expired-tag">已过期</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && filteredCoupons.length > 0" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 标签页
const tabs = ['可用优惠券', '已过期'];
const currentTab = ref(0);

// 优惠券列表
const couponsList = ref([]);
const hasMore = ref(false);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 模拟优惠券数据
const mockCoupons = [
  {
    id: 'C001',
    name: '新人专享券',
    description: '仅限新用户使用',
    amount: 10,
    condition: 100,
    startTime: '2023-01-01',
    endTime: '2023-12-31',
    status: 'valid'
  },
  {
    id: 'C002',
    name: '宠物用品券',
    description: '仅限购买宠物用品',
    amount: 20,
    condition: 200,
    startTime: '2023-06-01',
    endTime: '2023-06-30',
    status: 'valid'
  },
  {
    id: 'C003',
    name: '医疗咨询券',
    description: '仅限在线医疗咨询',
    amount: 50,
    condition: 0,
    startTime: '2023-05-01',
    endTime: '2023-05-31',
    status: 'expired'
  },
  {
    id: 'C004',
    name: '会员专享券',
    description: '仅限会员使用',
    amount: 30,
    condition: 150,
    startTime: '2023-04-01',
    endTime: '2023-04-30',
    status: 'expired'
  }
];

// 根据当前标签筛选优惠券
const filteredCoupons = computed(() => {
  return couponsList.value.filter(item => {
    return currentTab.value === 0 ? item.status === 'valid' : item.status === 'expired';
  });
});

// 获取优惠券列表
const getCouponsList = () => {
  loading.value = true;
  
  // 模拟接口请求
  setTimeout(() => {
    couponsList.value = mockCoupons;
    hasMore.value = false; // 模拟数据没有更多了
    loading.value = false;
    page.value++;
  }, 500);
};

// 切换标签
const switchTab = (index) => {
  currentTab.value = index;
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getCouponsList();
};

// 使用优惠券
const useCoupon = (item) => {
  uni.showModal({
    title: '使用优惠券',
    content: `确定要使用${item.name}吗？`,
    success: (res) => {
      if (res.confirm) {
        // 模拟使用优惠券
        uni.showToast({
          title: '使用成功',
          icon: 'success'
        });
        
        // 跳转到商品页面
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index'
          });
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
  getCouponsList();
});
</script>

<style lang="scss">
.coupons-container {
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
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.tab-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
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
  border-radius: 2rpx;
}

/* 优惠券列表区域 */
.coupons-scroll-view {
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

.coupons-list {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.coupon-item {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

.coupon-item.expired {
  opacity: 0.6;
}

.coupon-left {
  width: 220rpx;
  background-color: #6F87FF;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  position: relative;
}

.coupon-left::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20rpx;
  background-image: radial-gradient(circle at right, transparent 0, transparent 10rpx, #fff 10rpx);
  background-size: 20rpx 40rpx;
  background-repeat: repeat-y;
}

.coupon-amount {
  display: flex;
  align-items: baseline;
}

.amount-symbol {
  font-size: 32rpx;
  margin-right: 4rpx;
}

.amount-value {
  font-size: 60rpx;
  font-weight: 600;
}

.coupon-condition {
  font-size: 24rpx;
  margin-top: 10rpx;
  opacity: 0.8;
}

.coupon-right {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.coupon-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.coupon-time {
  font-size: 22rpx;
  color: #999;
}

.coupon-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 10rpx;
}

.use-btn {
  font-size: 26rpx;
  color: #fff;
  background-color: #6F87FF;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
}

.expired-tag {
  font-size: 26rpx;
  color: #999;
  background-color: #f5f5f5;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
}

/* 加载更多 */
.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}
</style> 