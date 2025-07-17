<template>
  <view class="index-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="iconfont icon-search"></text>
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="搜索商品、医院、保险"
          @confirm="handleSearch"
        />
      </view>
      <!-- 开发者测试按钮 -->
      <view class="api-test-btn" @click="runAPITest" v-if="!USE_MOCK">
        <text>测试API</text>
      </view>
      <!-- 显示当前数据源状态 -->
      <view class="data-source-indicator">
        <text>{{ USE_MOCK ? 'Mock' : 'API' }}</text>
      </view>
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="category-item" @click="navigateToPetGoods">
        <text class="iconfont icon-goods"></text>
        <text>宠物用品</text>
      </view>
      <view class="category-item" @click="navigateToMedical">
        <text class="iconfont icon-medical"></text>
        <text>优质医院</text>
      </view>
      <view class="category-item" @click="navigateToInsurance">
        <text class="iconfont icon-insurance"></text>
        <text>宠物保险</text>
      </view>
      <view class="category-item" @click="navigateToCommunity">
        <text class="iconfont icon-community"></text>
        <text>宠物社区</text>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门推荐</text>
        <text class="section-more" @click="navigateToPetGoods">查看更多</text>
      </view>
      <scroll-view class="goods-scroll" scroll-x show-scrollbar="false">
        <view class="goods-scroll-container">
          <view class="goods-item" v-for="product in hotProducts" :key="product.id" @click="navigateToDetail(product.id)">
            <image :src="product.image" mode="aspectFill"></image>
            <text class="goods-name">{{ product.name }}</text>
            <text class="goods-price">¥{{ product.price }}</text>
            <text class="goods-sales">{{ product.sales }}人已购买</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 优质医院 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">优质医院</text>
        <text class="section-more" @click="navigateToMedical">查看更多</text>
      </view>
      <view class="hospital-list">
        <view class="hospital-item" @click="navigateToMedical">
          <image src="/static/images/pet.png" mode="aspectFill"></image>
          <view class="hospital-info">
            <text class="hospital-name">香港宠物医院</text>
            <text class="hospital-address">香港中环</text>
          </view>
        </view>
        <view class="hospital-item" @click="navigateToMedical">
          <image src="/static/images/pet.png" mode="aspectFill"></image>
          <view class="hospital-info">
            <text class="hospital-name">旺角宠物诊所</text>
            <text class="hospital-address">香港旺角</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 宠物保险 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">宠物保险</text>
        <text class="section-more" @click="navigateToInsurance">查看更多</text>
      </view>
      <view class="insurance-list">
        <view class="insurance-item" @click="navigateToInsurance">
          <text class="insurance-name">基础保障计划</text>
          <text class="insurance-desc">覆盖常见疾病和意外</text>
          <text class="insurance-price">¥299/年</text>
        </view>
        <view class="insurance-item" @click="navigateToInsurance">
          <text class="insurance-name">全面保障计划</text>
          <text class="insurance-desc">全方位保障，含体检</text>
          <text class="insurance-price">¥599/年</text>
        </view>
      </view>
    </view>

    <!-- 社区热门 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">社区热门</text>
        <text class="section-more" @click="navigateToCommunity">查看更多</text>
      </view>
      <view class="community-list">
        <view class="community-item" @click="navigateToCommunity">
          <text class="community-tag">宠物达人</text>
          <text class="community-title">2小时前</text>
          <text class="community-desc">分享我家宠物猫的日常，太可爱了！</text>
          <view class="community-stats">
            <text>128</text>
            <text>32</text>
          </view>
        </view>
        <view class="community-item" @click="navigateToCommunity">
          <text class="community-tag">养狗专家</text>
          <text class="community-title">4小时前</text>
          <text class="community-desc">新手养狗必看！这些注意事项你知道吗？</text>
          <view class="community-stats">
            <text>256</text>
            <text>48</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { goodsApi } from '../../utils/api'
import { USE_MOCK } from '../../utils/config'
import apiTest from '../../utils/apiTest'

const searchKeyword = ref('')
const hotProducts = ref([])

// 获取热门商品推荐
const getHotProducts = () => {
  uni.showLoading({
    title: '加载中...'
  });
  
  if (USE_MOCK) {
    // 使用与商品列表页一致的商品数据生成逻辑
    const brands = ['皇家', '冠能', '宝路', '萌能', '麦富迪']
    const categories = ['主食', '零食', '玩具', '日用品', '洗护用品']
    
    // 生成50个商品
    const mockGoods = []
    for (let i = 1; i <= 50; i++) {
      const brandIndex = i % brands.length
      const categoryIndex = (i * 2) % categories.length
      const price = (i * 10) % 300 + 10
      const sales = (i * 20) % 1000
      
      mockGoods.push({
        id: i,
        name: `${brands[brandIndex]}${categories[categoryIndex]} ${i}号`,
        price: price,
        sales: sales,
        image: '/static/images/pet.png',
        brand: brands[brandIndex],
        category: categories[categoryIndex]
      })
    }
    
    // 按销量排序并获取销量最高的5个商品
    hotProducts.value = mockGoods.sort((a, b) => b.sales - a.sales).slice(0, 5)
    uni.hideLoading();
  } else {
    // 从API获取热门商品
    goodsApi.getHotGoods(5)
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          hotProducts.value = res.data;
        } else {
          console.error('获取热门商品失败: 返回数据格式不正确', res);
          // 如果API未返回数据，使用空数组
          hotProducts.value = [];
        }
      })
      .catch(err => {
        console.error('获取热门商品失败:', err);
        // 发生错误时使用空数组
        hotProducts.value = [];
      })
      .finally(() => {
        uni.hideLoading();
      });
  }
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    })
    return
  }
  
  uni.navigateTo({
    url: `/pages/search/result?keyword=${encodeURIComponent(searchKeyword.value.trim())}`
  })
}

// 跳转到宠物用品页面
const navigateToPetGoods = () => {
  uni.navigateTo({
    url: '/pages/goods/list'
  })
}

// 跳转到商品详情页
const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${id}`
  })
}

// 跳转到保险列表页面
const navigateToInsurance = () => {
  uni.navigateTo({
    url: '/pages/insurance/list'
  })
}

// 跳转到医院页面
const navigateToMedical = () => {
  uni.navigateTo({
    url: '/pages/medical/index'
  })
}

// 跳转到宠物社区页面
const navigateToCommunity = () => {
  uni.navigateTo({
    url: '/pages/community/home'
  })
}

// API测试函数
const runAPITest = async () => {
  try {
    uni.showLoading({
      title: '测试API中...'
    });
    
    await apiTest.runAllAPITests();
    
    uni.hideLoading();
    uni.showToast({
      title: 'API测试完成，请查看控制台',
      icon: 'none',
      duration: 3000
    });
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: 'API测试失败',
      icon: 'none'
    });
    console.error('API测试失败:', error);
  }
};

// 页面加载时获取热门商品数据
onMounted(() => {
  getHotProducts()
})
</script>

<style lang="scss">
.index-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
}

/* 搜索栏 */
.search-bar {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.search-input {
  background-color: #fff;
  border-radius: 30rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  flex: 1;
  
  .iconfont {
    font-size: 32rpx;
    color: #999;
    margin-right: 10rpx;
  }
  
  input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
}

.api-test-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 15rpx 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(1.02);
    background-color: rgba(255, 255, 255, 0.25);
  }
  
  text {
    color: #fff;
    font-size: 24rpx;
  }
}

.data-source-indicator {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15rpx;
  padding: 10rpx 15rpx;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
  
  text {
    color: #fff;
    font-size: 20rpx;
    font-weight: 500;
  }
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20rpx;
  border-radius: 12rpx;
  
  &:hover {
    background-color: #f8f9ff;
    transform: translateY(-3rpx);
  }
  
  &:active {
    transform: translateY(-1rpx);
    background-color: #f0f2ff;
  }
  
  .iconfont {
    font-size: 50rpx;
    color: #6F87FF;
    margin-bottom: 10rpx;
    transition: all 0.3s ease;
  }
  
  &:hover .iconfont {
    color: #5A6BF5;
    transform: scale(1.1);
  }
  
  text {
    font-size: 24rpx;
    color: #333;
    transition: all 0.3s ease;
  }
  
  &:hover text {
    color: #5A6BF5;
    font-weight: 500;
  }
}

/* 通用区块样式 */
.section {
  background-color: #fff;
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  
  &:hover {
    color: #6F87FF;
    background-color: rgba(111, 135, 255, 0.1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(1.02);
    background-color: rgba(111, 135, 255, 0.15);
  }
}

/* 商品滚动 */
.goods-scroll {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.goods-scroll-container {
  display: flex;
  gap: 20rpx;
  padding: 10rpx 0;
}

.goods-item {
  width: 220rpx;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.12);
    transform: translateY(-4rpx);
  }
  
  &:active {
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
  }
  
  image {
    width: 100%;
    height: 220rpx;
    background-color: #f5f5f5;
    transition: all 0.3s ease;
  }
  
  &:hover image {
    transform: scale(1.02);
  }
  
  .goods-name {
    font-size: 26rpx;
    color: #333;
    margin: 10rpx;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .goods-price {
    font-size: 28rpx;
    color: #FF6B6B;
    margin: 5rpx 10rpx;
    display: block;
    font-weight: bold;
  }
  
  .goods-sales {
    font-size: 22rpx;
    color: #999;
    margin: 0 10rpx 10rpx;
    display: block;
  }
}

/* 医院列表 */
.hospital-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.hospital-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    transform: translateY(-2rpx);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }
}

.hospital-info {
  flex: 1;
  
  .hospital-name {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 8rpx;
    display: block;
  }
  
  .hospital-address {
    font-size: 24rpx;
    color: #999;
  }
}

/* 保险列表 */
.insurance-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.insurance-item {
  background-color: #f9f9f9;
  padding: 20rpx;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    transform: translateY(-2rpx);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  .insurance-name {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-bottom: 8rpx;
    transition: all 0.3s ease;
  }
  
  .insurance-desc {
    font-size: 24rpx;
    color: #999;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .insurance-price {
    font-size: 28rpx;
    color: #FF6B6B;
    display: block;
    transition: all 0.3s ease;
  }
  
  &:hover .insurance-name {
    color: #6F87FF;
  }
  
  &:hover .insurance-price {
    color: #FF5252;
    font-weight: 600;
  }
}

/* 社区列表 */
.community-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.community-item {
  background-color: #f9f9f9;
  padding: 20rpx;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    transform: translateY(-2rpx);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  .community-tag {
    font-size: 24rpx;
    color: #6F87FF;
    background-color: rgba(111, 135, 255, 0.1);
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
    display: inline-block;
    margin-bottom: 10rpx;
    transition: all 0.3s ease;
  }
  
  .community-title {
    font-size: 24rpx;
    color: #999;
    margin-left: 10rpx;
  }
  
  .community-desc {
    font-size: 28rpx;
    color: #333;
    margin: 10rpx 0;
    display: block;
    transition: all 0.3s ease;
  }
  
  .community-stats {
    display: flex;
    gap: 20rpx;
    
    text {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  &:hover .community-tag {
    background-color: rgba(111, 135, 255, 0.15);
    color: #5A6BF5;
  }
  
  &:hover .community-desc {
    color: #6F87FF;
  }
}
</style>
