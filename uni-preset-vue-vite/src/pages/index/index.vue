<template>
  <view class="index-container">

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="category-item" @click="navigateToPetGoods">
        <image 
          src="/static/images/category-icons/goods/icon.jpg"
          mode="aspectFit"
          class="category-icon"
        />
        <text>宠物用品</text>
      </view>
      <view class="category-item" @click="navigateToMedical">
        <image 
          src="/static/images/category-icons/medical/icon.jpg"
          mode="aspectFit"
          class="category-icon"
        />
        <text>优质医院</text>
      </view>
      <view class="category-item" @click="navigateToInsurance">
        <image 
          src="/static/images/category-icons/insurance/icon.jpg"
          mode="aspectFit"
          class="category-icon"
        />
        <text>宠物保险</text>
      </view>
      <view class="category-item" @click="navigateToCommunity">
        <image 
          src="/static/images/category-icons/community/icon.jpg"
          mode="aspectFit"
          class="category-icon"
        />
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
            <image 
              :src="(product.images && product.images[0]) || product.coverImage || product.image || '/static/images/pet.png'" 
              mode="aspectFill"
              @error="handleImageError"
            ></image>
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
          <image :src="babytangHospitalImg" mode="aspectFill"></image>
          <view class="hospital-info">
            <text class="hospital-name">芭比堂动物医院</text>
            <text class="hospital-address">香港中环</text>
          </view>
        </view>
        <view class="hospital-item" @click="navigateToMedical">
          <image :src="ruipengHospitalImg" mode="aspectFill"></image>
          <view class="hospital-info">
            <text class="hospital-name">瑞鹏宠物医院</text>
            <text class="hospital-address">香港九龙</text>
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
          <text class="insurance-name">中国平安爱宠意外险</text>
          <text class="insurance-desc">全方位保障，含体检</text>
          <text class="insurance-price">¥477/年</text>
        </view>
        <view class="insurance-item" @click="navigateToInsurance">
          <text class="insurance-name">蚂蚁保x国泰产险宠物意外医疗保险</text>
          <text class="insurance-desc">涵盖基础服务</text>
          <text class="insurance-price">¥60/年</text>
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
import { USE_MOCK, getGoodsImageUrl } from '../../utils/config'
import { formatImageUrl } from '../../utils/imageHelper'

// 导入医院图片
import babytangHospitalImg from '/src/static/images/hospital/babytang-hospital.jpg'
import ruipengHospitalImg from '/src/static/images/hospital/ruipeng-hospital.jpg'


const hotProducts = ref([])

// 获取热门商品推荐
const getHotProducts = () => {
  uni.showLoading({
    title: '加载中...'
  });
  
  if (USE_MOCK) {
    // 使用与商品列表页完全一致的商品数据生成逻辑
    const brands = ['皇家', '冠能', '宝路', '萌能', '麦富迪']
    const categories = ['猫粮', '狗粮', '玩具', '零食', '护毛素', '猫砂', '除臭剂', '沐浴露']
    
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
        // 🎯 使用配置化的图片URL生成函数，支持环境切换
        images: [
          getGoodsImageUrl(categories[categoryIndex], brands[brandIndex])
        ],
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
          // 处理API返回的图片URL，确保使用生产环境地址
          const processedData = res.data.map(item => {
            if (item.images && Array.isArray(item.images)) {
              item.images = item.images.map(img => {
                // 使用imageHelper处理图片URL
                return formatImageUrl(img);
              });
            }
            return item;
          });
          hotProducts.value = processedData;
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

// 处理图片加载错误 - 与商品列表页面保持一致
const handleImageError = (e) => {
  console.error('❌ [首页热门推荐] 图片加载失败:', {
    原始URL: e.target.src,
    元素: e.target
  })
  
  // 图片加载失败时使用默认图片
  e.target.src = '/static/images/pet.png'
}



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
  
  .category-icon {
    width: 100rpx;
    height: 100rpx;
    margin-bottom: 10rpx;
    transition: all 0.3s ease;
  }
  
  &:hover .category-icon {
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
