<template>
  <view class="insurance-list-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">宠物保险</text>
    </view>
    
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <!-- 保险类型筛选 -->
      <view class="filter-item" 
            :class="{ 'filter-item-active': selectedType && selectedType !== '全部' }" 
            @click="showTypeFilter = true">
        <text>保险类型: {{ selectedType || '全部' }}</text>
        <text class="iconfont icon-down"></text>
      </view>
      
      <!-- 价格区间筛选 -->
      <view class="filter-item" 
            :class="{ 'filter-item-active': selectedPriceRange.label && selectedPriceRange.label !== '全部' }" 
            @click="showPriceFilter = true">
        <text>价格区间: {{ selectedPriceRange.label || '全部' }}</text>
        <text class="iconfont icon-down"></text>
      </view>
    </view>
    
    <!-- 保险列表 -->
    <scroll-view 
      scroll-y 
      class="insurance-scroll-view"
      @scrolltolower="loadMore"
    >
      <view class="insurance-list" v-if="filteredInsurances.length > 0">
        <insurance-card 
          v-for="(item, index) in filteredInsurances" 
          :key="index"
          :insurance="item"
          @click="navigateToDetail(item.id)"
        />
      </view>
      
      <!-- 无保险产品提示 -->
      <view class="no-insurance" v-if="filteredInsurances.length === 0">
        <image src="/static/images/no-result.png" mode="aspectFit"></image>
        <text>暂无相关保险产品</text>
      </view>
    </scroll-view>
    
    <!-- 保险类型筛选弹窗 -->
    <popup-filter 
      v-if="showTypeFilter" 
      title="保险类型"
      :options="insuranceTypes"
      :selected="selectedType"
      @confirm="confirmTypeFilter"
      @close="showTypeFilter = false"
    />
    
    <!-- 价格区间筛选弹窗 -->
    <popup-filter 
      v-if="showPriceFilter" 
      title="价格区间"
      :options="priceRanges.map(item => item.label)"
      :selected="selectedPriceRange.label"
      @confirm="confirmPriceFilter"
      @close="showPriceFilter = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import InsuranceCard from './components/InsuranceCard.vue';
import PopupFilter from './components/PopupFilter.vue';
import api from '@/utils/api';
import { BASE_URL } from '@/utils/config';

// 筛选状态
const showTypeFilter = ref(false);
const showPriceFilter = ref(false);
const selectedType = ref('');
const selectedPriceRange = ref({});

// 数据加载状态
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const hasMore = ref(true);

// 保险产品数据
const insurances = ref([]);

// 保险类型选项
const insuranceTypes = [
  '全部',
  '意外险',
  '医疗险',
  '综合险',
  '责任险'
];

// 价格区间选项
const priceRanges = [
  { label: '全部', min: 0, max: Infinity },
  { label: '0-500元', min: 0, max: 500 },
  { label: '500-1000元', min: 500, max: 1000 },
  { label: '1000-2000元', min: 1000, max: 2000 },
  { label: '2000元以上', min: 2000, max: Infinity }
];

// 加载保险产品数据
const loadInsuranceProducts = async (reset = false) => {
  if (loading.value) return;
  
  try {
    loading.value = true;
    console.log('🔄 [保险列表] 开始加载保险产品...', { reset });
    
    if (reset) {
      currentPage.value = 1;
      insurances.value = [];
    }
    
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    };
    
    // 添加筛选条件
    if (selectedType.value && selectedType.value !== '全部') {
      // 将中文类型名映射为英文类型
      const typeMap = {
        '意外险': 'accident',
        '医疗险': 'medical', 
        '综合险': 'comprehensive',
        '责任险': 'liability'
      };
      params.petType = typeMap[selectedType.value];
    }
    
    if (selectedPriceRange.value && selectedPriceRange.value.label !== '全部') {
      params.priceRange = `${selectedPriceRange.value.min}-${selectedPriceRange.value.max}`;
    }
    
    console.log('📤 [保险列表] API请求参数:', params);
    console.log('📍 [保险列表] API地址:', `${BASE_URL}/insurance/products`);
    
    const response = await api.insurance.getInsuranceProducts(params);
    
    console.log('📥 [保险列表] API响应:', response);
    
    if (response.code === 200) {
      const newProducts = response.data.list || [];
      
      if (reset) {
        insurances.value = newProducts;
      } else {
        insurances.value = [...insurances.value, ...newProducts];
      }
      
      // 更新分页信息
      hasMore.value = newProducts.length === pageSize.value;
      if (!reset) {
        currentPage.value++;
      }    } else {
      console.error('保险产品API返回错误:', response);
      uni.showToast({
        title: response.message || '加载失败',
        icon: 'none',
        duration: 2000
      });
    }
  } catch (error) {
    console.error('加载保险产品失败:', error);
    
    // 更具体的错误处理
    let errorMessage = '网络错误，请稍后重试';
    
    if (error.code === 401) {
      errorMessage = '登录已过期，请重新登录';
    } else if (error.code === 404) {
      errorMessage = '保险服务暂不可用';
    } else if (error.code === 500) {
      errorMessage = '服务器错误，请稍后重试';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    uni.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 3000
    });
    
    // 如果是网络错误，提供重试选项
    if (!error.code || error.code >= 500) {
      setTimeout(() => {
        uni.showModal({
          title: '加载失败',
          content: '是否重新加载保险产品？',
          success: (res) => {
            if (res.confirm) {
              loadInsuranceProducts(true);
            }
          }
        });
      }, 1000);
    }
  } finally {
    loading.value = false;
  }
};

// 计算筛选后的保险产品
const filteredInsurances = computed(() => {
  return insurances.value; // 筛选现在在API请求中进行
});

// 确认保险类型筛选
const confirmTypeFilter = (type) => {
  selectedType.value = type;
  showTypeFilter.value = false;
  // 重新加载数据
  loadInsuranceProducts(true);
};

// 确认价格区间筛选
const confirmPriceFilter = (label) => {
  selectedPriceRange.value = priceRanges.find(item => item.label === label) || {};
  showPriceFilter.value = false;
  // 重新加载数据
  loadInsuranceProducts(true);
};

// 加载更多数据
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    loadInsuranceProducts(false);
  }
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 跳转到保险详情页
const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/insurance/detail?id=${id}`
  });
};

// 页面加载
onMounted(() => {
  // 默认选择"全部"
  selectedType.value = '全部';
  selectedPriceRange.value = priceRanges[0];
  
  // 加载保险产品数据
  loadInsuranceProducts(true);
});
</script>

<style lang="scss">
.insurance-list-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
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
  }
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}

.filter-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
  padding: 12rpx 0;
  transition: all 0.3s;
  border-bottom: 2rpx solid transparent;
  
  .iconfont {
    margin-left: 6rpx;
    font-size: 24rpx;
  }
}

.filter-item-active {
  color: #6F87FF;
  font-weight: 500;
  border-bottom: 2rpx solid #6F87FF;
}

/* 保险列表滚动区域 */
.insurance-scroll-view {
  flex: 1;
}

/* 保险列表 */
.insurance-list {
  padding: 20rpx;
}

/* 无保险产品提示 */
.no-insurance {
  padding: 100rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  text {
    font-size: 28rpx;
    color: #999;
  }
}
</style> 