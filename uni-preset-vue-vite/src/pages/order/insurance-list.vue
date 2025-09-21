<template>
  <view class="insurance-policy-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">保险保单</text>
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
    </view>

    <!-- 保单列表 -->
    <scroll-view 
      scroll-y 
      class="policy-scroll-view"
      @scrolltolower="loadMore"
    >
      <!-- 空保单提示 -->
      <view v-if="policyList.length === 0" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-policy.png"></image>
        <text>暂无保险保单</text>
      </view>

      <!-- 保单列表 -->
      <view 
        v-for="(policy, index) in policyList" 
        :key="index"
        class="policy-item"
      >
        <view class="policy-header">
          <text class="policy-number">保单号: {{ policy.policyNumber }}</text>
          <text class="policy-status" :class="getStatusClass(policy.status)">{{ policy.status }}</text>
        </view>
        
        <view class="policy-content">
          <view class="insurance-info">
            <view class="insurance-type">险种: {{ policy.insuranceType }}</view>
            <view class="effective-date">生效日期: {{ policy.effectiveDate }}</view>
            <view class="expiry-date">到期日期: {{ policy.expiryDate }}</view>
            <view class="insured-pet">投保宠物: {{ policy.insuredPet }}</view>
          </view>
        </view>
        
        <view class="policy-footer">
          <view class="policy-total">保费: ¥{{ policy.premium }}/年</view>
          <view class="policy-actions">
            <button 
              v-if="policy.status === '已生效'" 
              class="action-btn"
              @tap="viewPolicy(policy)"
            >查看保单</button>
            <button 
              v-if="policy.status === '已生效'" 
              class="action-btn primary-btn"
              @tap="claimInsurance(policy)"
            >申请理赔</button>
            <button 
              v-if="policy.status === '待付款'" 
              class="action-btn primary-btn"
              @tap="payOrder(policy)"
            >去付款</button>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && policyList.length > 0" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mockUser from '../../utils/mockUser.js';

// 保单列表
const policyList = ref([]);
const hasMore = ref(false);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 使用 mockUser 中的模拟订单数据
const mockPolicies = mockUser.mockOrderList.filter(order => order.type === 'insurance');

// 获取保单列表
const getPolicyList = () => {
  loading.value = true;
  
  // 模拟网络请求延迟
  setTimeout(() => {
    try {
      policyList.value = [...mockPolicies];
    } catch (error) {
      console.error('获取保单列表失败:', error);
      policyList.value = [];
    } finally {
      loading.value = false;
      hasMore.value = false;
    }
  }, 500);
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getPolicyList();
};

// 获取状态对应的样式类
const getStatusClass = (status) => {
  const classMap = {
    '待付款': 'status-pending',
    '已生效': 'status-active'
  };
  return classMap[status] || '';
};

// 支付订单
const payOrder = (policy) => {
  uni.navigateTo({
    url: `/pages/order/payment?orderNumber=${policy.policyNumber}`
  });
};

// 查看保单详情
const viewPolicy = (policy) => {
  uni.navigateTo({
    url: `/pages/insurance/policy-detail?policyNumber=${policy.policyNumber}`
  });
};

// 申请理赔
const claimInsurance = (policy) => {
  uni.navigateTo({
    url: `/pages/insurance/claim?policyNumber=${policy.policyNumber}`
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  getPolicyList();
});
</script>

<style lang="scss">
.insurance-policy-container {
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

/* 保单列表区域 */
.policy-scroll-view {
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

.policy-item {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.policy-number {
  font-size: 26rpx;
  color: #666;
}

.policy-status {
  font-size: 26rpx;
  font-weight: 500;
}

.status-pending {
  color: #ff9f00;
}

.status-active {
  color: #00b578;
}

.policy-content {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.insurance-info {
  line-height: 1.8;
}

.insurance-type, .effective-date, .expiry-date, .insured-pet {
  font-size: 28rpx;
  color: #333;
}

.policy-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
}

.policy-total {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.policy-actions {
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