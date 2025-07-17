<template>
  <view class="my-policies-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">我的保单</text>
    </view>

    <!-- 登录提示区域 -->
    <view v-if="!isLoggedIn" class="login-prompt">
      <image src="/static/images/empty-order.png" mode="aspectFit" class="empty-image"></image>
      <text class="prompt-text">请先登录查看您的保单</text>
      <button class="login-btn" @click="goToLogin">立即登录</button>
    </view>

    <!-- 保单列表 -->
    <view v-else class="policies-content">
      <!-- 筛选标签 -->
      <view class="filter-tabs">
        <view 
          v-for="(tab, index) in statusTabs" 
          :key="index"
          class="tab-item" 
          :class="{ 'tab-active': selectedStatus === tab.value }"
          @click="changeStatus(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>

      <!-- 保单列表内容 -->
      <scroll-view 
        scroll-y 
        class="policies-scroll"
        @scrolltolower="loadMore"
        @refresherrefresh="refresh"
        refresher-enabled
        :refresher-triggered="isRefreshing"
      >
        <!-- 加载状态 -->
        <view v-if="loading && policies.length === 0" class="loading-container">
          <text>正在加载保单信息...</text>
        </view>

        <!-- 保单列表 -->
        <view v-if="policies.length > 0" class="policies-list">
          <view 
            v-for="(policy, index) in policies" 
            :key="index"
            class="policy-card"
            @click="viewPolicyDetail(policy)"
          >
            <view class="policy-header">
              <view class="policy-info">
                <text class="product-name">{{ policy.productName }}</text>
                <text class="company-name">{{ policy.company }}</text>
              </view>
              <view class="policy-status" :class="getStatusClass(policy.status)">
                {{ policy.statusText }}
              </view>
            </view>
            
            <view class="policy-details">
              <view class="detail-row">
                <text class="label">保单号：</text>
                <text class="value">{{ policy.policyId }}</text>
              </view>
              <view class="detail-row">
                <text class="label">投保宠物：</text>
                <text class="value">{{ policy.petName }}</text>
              </view>
              <view class="detail-row">
                <text class="label">保障期间：</text>
                <text class="value">{{ policy.startDate }} 至 {{ policy.endDate }}</text>
              </view>
              <view class="detail-row">
                <text class="label">保费：</text>
                <text class="value price">¥{{ policy.premium }}</text>
              </view>
            </view>

            <view class="policy-actions">
              <button 
                v-if="policy.status === 'active'" 
                class="action-btn secondary"
                @click.stop="renewPolicy(policy)"
              >续保</button>
              <button 
                v-if="policy.status === 'active'" 
                class="action-btn primary"
                @click.stop="submitClaim(policy)"
              >申请理赔</button>
              <button 
                v-if="policy.status === 'pending'" 
                class="action-btn primary"
                @click.stop="payPolicy(policy)"
              >去支付</button>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="!loading && policies.length === 0" class="empty-state">
          <image src="/static/images/empty-order.png" mode="aspectFit" class="empty-image"></image>
          <text class="empty-text">暂无相关保单</text>
          <button class="browse-btn" @click="browseInsurance">浏览保险产品</button>
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore && policies.length > 0" class="load-more">
          <text v-if="loading">正在加载更多...</text>
          <text v-else>上拉加载更多</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/api';

// 认证状态
const isLoggedIn = ref(false);

// 数据状态
const loading = ref(false);
const isRefreshing = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);
const policies = ref([]);

// 筛选状态
const selectedStatus = ref('all');
const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '生效中', value: 'active' },
  { label: '已到期', value: 'expired' },
  { label: '待付款', value: 'pending' },
  { label: '已取消', value: 'cancelled' }
];

// 检查登录状态
const checkLoginStatus = () => {
  const token = uni.getStorageSync('token');
  const userInfo = uni.getStorageSync('userInfo');
  isLoggedIn.value = !!(token && userInfo);
  
  console.log('🔍 [保单页面] 登录状态检查:', {
    hasToken: !!token,
    hasUserInfo: !!userInfo,
    isLoggedIn: isLoggedIn.value
  });
};

// 加载保单数据
const loadPolicies = async (reset = false) => {
  if (!isLoggedIn.value) {
    console.log('⚠️ [保单页面] 用户未登录，跳过数据加载');
    return;
  }

  if (loading.value) return;

  try {
    loading.value = true;
    console.log('🔄 [保单页面] 开始加载保单数据...');

    if (reset) {
      currentPage.value = 1;
      policies.value = [];
      hasMore.value = true;
    }

    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    };

    if (selectedStatus.value !== 'all') {
      params.status = selectedStatus.value;
    }

    console.log('📤 [保单页面] API请求参数:', params);

    const response = await api.insurance.getMyPolicies(params);
    
    console.log('📥 [保单页面] API响应:', response);

    if (response.code === 200) {
      const newPolicies = response.data.list || [];
      
      if (reset) {
        policies.value = newPolicies;
      } else {
        policies.value = [...policies.value, ...newPolicies];
      }

      // 更新分页信息
      hasMore.value = newPolicies.length === pageSize.value;
      if (!reset) {
        currentPage.value++;
      }

      console.log('✅ [保单页面] 数据加载成功:', {
        新增保单数: newPolicies.length,
        总保单数: policies.value.length,
        是否还有更多: hasMore.value
      });
    } else {
      throw new Error(response.message || '获取保单失败');
    }
  } catch (error) {
    console.error('❌ [保单页面] 加载保单失败:', error);
    
    // 根据错误类型显示不同提示
    if (error.code === 401) {
      // 认证失败，清除登录状态
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      isLoggedIn.value = false;
      
      uni.showModal({
        title: '登录已过期',
        content: '请重新登录后查看保单',
        showCancel: false,
        success: () => {
          goToLogin();
        }
      });
    } else {
      uni.showToast({
        title: error.message || '网络错误，请稍后重试',
        icon: 'none',
        duration: 2000
      });
    }
  } finally {
    loading.value = false;
    isRefreshing.value = false;
  }
};

// 切换状态筛选
const changeStatus = (status) => {
  if (selectedStatus.value === status) return;
  
  selectedStatus.value = status;
  console.log('🔄 [保单页面] 切换筛选状态:', status);
  loadPolicies(true);
};

// 刷新数据
const refresh = () => {
  isRefreshing.value = true;
  loadPolicies(true);
};

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return;
  loadPolicies(false);
};

// 获取状态样式类
const getStatusClass = (status) => {
  const classMap = {
    'active': 'status-active',
    'expired': 'status-expired',
    'pending': 'status-pending',
    'cancelled': 'status-cancelled'
  };
  return classMap[status] || '';
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};

// 查看保单详情
const viewPolicyDetail = (policy) => {
  uni.navigateTo({
    url: `/pages/insurance/policy-detail?policyId=${policy.policyId}`
  });
};

// 续保
const renewPolicy = (policy) => {
  uni.navigateTo({
    url: `/pages/insurance/renew?policyId=${policy.policyId}`
  });
};

// 申请理赔
const submitClaim = (policy) => {
  uni.navigateTo({
    url: `/pages/insurance/claim?policyId=${policy.policyId}`
  });
};

// 支付保单
const payPolicy = (policy) => {
  uni.navigateTo({
    url: `/pages/payment/index?orderId=${policy.orderId}&type=insurance`
  });
};

// 浏览保险产品
const browseInsurance = () => {
  uni.navigateTo({
    url: '/pages/insurance/list'
  });
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 页面加载时初始化
onMounted(() => {
  console.log('🚀 [保单页面] 页面初始化');
  checkLoginStatus();
  
  if (isLoggedIn.value) {
    loadPolicies(true);
  }
});
</script>

<style lang="scss">
.my-policies-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

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
  }
}

.login-prompt {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  
  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }
  
  .prompt-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .login-btn {
    background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
    color: #fff;
    border: none;
    border-radius: 40rpx;
    padding: 20rpx 60rpx;
    font-size: 28rpx;
  }
}

.policies-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.filter-tabs {
  background-color: #fff;
  display: flex;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #eee;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 30rpx 10rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.tab-active {
      color: #6F87FF;
      font-weight: 500;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background-color: #6F87FF;
        border-radius: 2rpx;
      }
    }
  }
}

.policies-scroll {
  flex: 1;
  height: 0;
}

.loading-container {
  text-align: center;
  padding: 100rpx 30rpx;
  color: #999;
  font-size: 28rpx;
}

.policies-list {
  padding: 20rpx 30rpx;
}

.policy-card {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  
  .policy-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
    
    .policy-info {
      flex: 1;
      
      .product-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .company-name {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .policy-status {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      
      &.status-active {
        background-color: #E8F5E8;
        color: #52C41A;
      }
      
      &.status-expired {
        background-color: #FFF1F0;
        color: #FF4D4F;
      }
      
      &.status-pending {
        background-color: #FFF7E6;
        color: #FA8C16;
      }
      
      &.status-cancelled {
        background-color: #F5F5F5;
        color: #999;
      }
    }
  }
  
  .policy-details {
    .detail-row {
      display: flex;
      margin-bottom: 12rpx;
      
      .label {
        font-size: 26rpx;
        color: #666;
        width: 140rpx;
      }
      
      .value {
        flex: 1;
        font-size: 26rpx;
        color: #333;
        
        &.price {
          color: #FF6B6B;
          font-weight: 500;
        }
      }
    }
  }
  
  .policy-actions {
    margin-top: 30rpx;
    display: flex;
    gap: 20rpx;
    
    .action-btn {
      flex: 1;
      height: 64rpx;
      border-radius: 32rpx;
      font-size: 26rpx;
      border: none;
      
      &.primary {
        background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
        color: #fff;
      }
      
      &.secondary {
        background-color: #f5f5f5;
        color: #666;
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 100rpx 40rpx;
  
  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
    display: block;
  }
  
  .browse-btn {
    background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
    color: #fff;
    border: none;
    border-radius: 40rpx;
    padding: 20rpx 60rpx;
    font-size: 28rpx;
  }
}

.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}
</style>