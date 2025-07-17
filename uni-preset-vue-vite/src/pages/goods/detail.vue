<template>
  <view class="detail-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">商品详情</text>
    </view>
    
    <!-- 商品轮播图 -->
    <swiper class="banner-swiper" indicator-dots circular :autoplay="true" interval="5000" duration="300">
      <swiper-item v-for="(image, index) in goodsDetail.images" :key="index">
        <image :src="image" mode="aspectFill" class="banner-image"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品基本信息 -->
    <view class="goods-info-section">
      <view class="goods-price">¥{{ totalPrice }}</view>
      <view class="goods-name">{{ goodsDetail.name }}</view>
      <view class="goods-brief">{{ goodsDetail.brief }}</view>
    </view>
    
    <!-- 规格选择 -->
    <view class="specs-section">
      <view class="section-title">规格选择</view>
      
      <!-- 规格选项 -->
      <view v-if="goodsDetail.specs && goodsDetail.specs.length > 0" class="specs-row">
        <text class="specs-label">规格：</text>
        <view class="specs-options">
          <text 
            v-for="(spec, index) in goodsDetail.specs" 
            :key="index"
            class="spec-option"
            :class="{ 'spec-selected': selectedSpec === spec }"
            @click="selectSpec(spec)"
          >
            {{ spec }}
          </text>
        </view>
      </view>
      
      <!-- 数量选择 -->
      <view class="specs-row">
        <text class="specs-label">数量：</text>
        <view class="quantity-control">
          <text class="quantity-btn" @click="decreaseQuantity">-</text>
          <text class="quantity-value">{{ quantity }}</text>
          <text class="quantity-btn" @click="increaseQuantity">+</text>
        </view>
      </view>
    </view>
    
    <!-- 商品详情 -->
    <view class="details-section">
      <view class="section-title">商品详情</view>
      <view class="details-content">
        <image v-for="(img, index) in goodsDetail.detailImages" 
               :key="index" 
               :src="img" 
               mode="widthFix" 
               class="detail-image"></image>
        <rich-text :nodes="goodsDetail.description"></rich-text>
      </view>
    </view>
    
    <!-- 用户评价 -->
    <view class="reviews-section">
      <view class="section-title">用户评价</view>
      <view class="reviews-list">
        <view class="review-item" v-for="(review, index) in goodsDetail.reviews" :key="index">
          <view class="review-header">
            <image :src="review.avatar" class="reviewer-avatar"></image>
            <view class="reviewer-info">
              <text class="reviewer-name">{{ review.nickname }}</text>
              <view class="rating">
                <text class="iconfont icon-star" 
                      v-for="star in 5" 
                      :key="star" 
                      :class="{ active: star <= review.rating }"></text>
              </view>
            </view>
          </view>
          <view class="review-content">{{ review.content }}</view>
          <view class="review-time">{{ review.time }}</view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="cart-btn" @click="addToCart">加入购物车</view>
      <view class="buy-btn" @click="buyNow">立即购买</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { goodsApi, cartApi } from '../../utils/api'
import { USE_MOCK } from '../../utils/config'
import * as cartUtils from '../../utils/cartUtils'

// 商品数量
const quantity = ref(1)

// 商品详情
const goodsDetail = ref({
  id: 0,
  name: '',
  price: 0,
  sales: 0,
  brand: '',
  category: '',
  brief: '',
  images: ['/static/images/pet.png'],
  specs: [],
  stock: 0,
  description: ''
})

// 选择的规格
const selectedSpec = ref('')

// 是否已收藏
const isFavorite = ref(false)

// 计算总价
const totalPrice = computed(() => {
  return (goodsDetail.value.price * quantity.value).toFixed(2)
})

// 增加数量
const increaseQuantity = () => {
  quantity.value++
}

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 切换收藏状态
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

// 选择规格
const selectSpec = (spec) => {
  selectedSpec.value = spec
}

// 加入购物车
const addToCart = () => {
  if (!goodsDetail.value.id) {
    uni.showToast({
      title: '商品信息不完整',
      icon: 'none'
    })
    return
  }
  
  if (goodsDetail.value.specs && goodsDetail.value.specs.length > 0 && !selectedSpec.value) {
    uni.showToast({
      title: '请选择规格',
      icon: 'none'
    })
    return
  }
  
  uni.showLoading({
    title: '加入中...'
  })
  
  if (USE_MOCK) {
    // Mock模式：使用本地存储
    const product = {
      id: goodsDetail.value.id,
      name: goodsDetail.value.name,
      price: goodsDetail.value.price,
      spec: selectedSpec.value,
      image: goodsDetail.value.images[0] || '/static/images/pet.png'
    }
    
    // 使用购物车工具函数添加到本地存储
    const success = cartUtils.addToCart(product, quantity.value)
    uni.hideLoading()
    
    if (success) {
      uni.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    } else {
      uni.showToast({
        title: '添加失败，请重试',
        icon: 'none'
      })
    }
  } else {
    // API模式：调用后端接口
    cartApi.addToCart(goodsDetail.value.id, quantity.value, selectedSpec.value)
      .then(res => {
        uni.hideLoading()
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        })
      })
      .catch(err => {
        uni.hideLoading()
        console.error('添加到购物车失败', err)
        
        let errorMessage = '添加失败，请重试'
        if (err.message) {
          if (err.message.includes('401')) {
            errorMessage = '请先登录'
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/login/login'
              })
            }, 1500)
          } else {
            errorMessage = err.message
          }
        }
        
        uni.showToast({
          title: errorMessage,
          icon: 'none'
        })
      })
  }
}

// 立即购买
const buyNow = () => {
  if (!goodsDetail.value.id) {
    uni.showToast({
      title: '商品信息不完整',
      icon: 'none'
    })
    return
  }
  
  if (goodsDetail.value.specs && goodsDetail.value.specs.length > 0 && !selectedSpec.value) {
    uni.showToast({
      title: '请选择规格',
      icon: 'none'
    })
    return
  }
  
  // 将商品数据转换为字符串并进行编码
  const goodsData = encodeURIComponent(JSON.stringify({
    goodsId: goodsDetail.value.id,
    name: goodsDetail.value.name,
    image: goodsDetail.value.images[0],
    price: goodsDetail.value.price,
    specs: selectedSpec.value,
    quantity: quantity.value
  }))
  
  // 跳转到确认订单页面
  uni.navigateTo({
    url: `/pages/order/confirm-order?goodsData=${goodsData}`
  })
}

// 返回上一页
const handleBack = () => {
  uni.navigateBack()
}

// 获取商品详情
const getGoodsDetail = (id) => {
  uni.showLoading({
    title: '加载中...'
  });
  
  if (USE_MOCK) {
    // 模拟API请求
    setTimeout(() => {
      // 创建与商品列表页相同的模拟数据生成逻辑
      const brands = ['皇家', '冠能', '宝路', '萌能', '麦富迪']
      const categories = ['猫粮', '狗粮', '玩具', '零食', '护毛素', '猫砂', '除臭剂', '沐浴露']
      
      // 将ID转换为数字，确保类型匹配
      const numericId = parseInt(id, 10)
      
      // 使用与列表页完全相同的确定性算法，确保生成相同的商品数据
      const brandIndex = numericId % brands.length
      const categoryIndex = (numericId * 2) % categories.length
      const price = (numericId * 10) % 300 + 10
      const sales = (numericId * 20) % 1000
      
      // 构建与列表页一致的商品名称
      const mockItem = {
        id: numericId,
        name: `${brands[brandIndex]}${categories[categoryIndex]} ${numericId}号`,
        price: price,
        sales: sales,
        brand: brands[brandIndex],
        category: categories[categoryIndex],
        brief: `优质${brands[brandIndex]}品牌${categories[categoryIndex]}，适合各种宠物使用`,
        images: [
          '/static/images/pet.png',
          '/static/images/pet.png',
          '/static/images/pet.png'
        ],
        // 根据商品类型添加不同的规格
        specs: categories[categoryIndex] === '猫粮' || categories[categoryIndex] === '狗粮' 
          ? ['500g', '1kg', '2kg', '5kg']
          : categories[categoryIndex] === '玩具'
          ? ['小号', '中号', '大号']
          : categories[categoryIndex] === '零食'
          ? ['100g装', '200g装']
          : [], // 其他商品无规格
        stock: 999,
        description: `这是${brands[brandIndex]}品牌的优质${categories[categoryIndex]}产品，经过严格品质控制，为您的宠物提供最好的体验。`
      }
      
      // 更新商品详情，但保留默认值中的其他信息
      goodsDetail.value = {
        ...goodsDetail.value,
        ...mockItem
      }
      
      uni.hideLoading();
    }, 500);
  } else {
    // 使用真实API获取数据
    goodsApi.getGoodsDetail(id)
      .then(res => {
        if (res.data) {
          // 使用API返回的数据
          goodsDetail.value = {
            ...goodsDetail.value,
            ...res.data
          };
        } else {
          // API返回空数据
          uni.showToast({
            title: '商品详情不存在',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        console.error('获取商品详情失败:', err);
        // 显示错误提示
        uni.showToast({
          title: err.message || '获取商品详情失败',
          icon: 'none'
        });
      })
      .finally(() => {
        uni.hideLoading();
      });
  }
}

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const query = currentPage.$page.options
  
  if (query.id) {
    getGoodsDetail(query.id)
  }
})
</script>

<style lang="scss">
.detail-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
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

.banner-swiper {
  width: 100%;
  height: 750rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.goods-info-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.goods-price {
  font-size: 40rpx;
  color: #FF6B6B;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.goods-name {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.goods-brief {
  font-size: 26rpx;
  color: #999;
}

.specs-section, .details-section, .reviews-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
  border-left: 8rpx solid #6F87FF;
  padding-left: 20rpx;
}

.specs-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.specs-label {
  font-size: 28rpx;
  color: #666;
  width: 120rpx;
}

.specs-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.spec-option {
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: #666;
  background-color: #f5f5f5;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  transition: all 0.2s ease;
}

.spec-selected {
  color: #6F87FF;
  background-color: #f0f3ff;
  border-color: #6F87FF;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  color: #333;
  background-color: #f5f5f5;
}

.quantity-value {
  width: 80rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  border-left: 1rpx solid #eee;
  border-right: 1rpx solid #eee;
}

.details-content {
  padding: 20rpx 0;
}

.detail-image {
  width: 100%;
  margin-bottom: 20rpx;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.review-item {
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.review-header {
  display: flex;
  margin-bottom: 15rpx;
}

.reviewer-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 15rpx;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 5rpx;
  display: block;
}

.rating {
  display: flex;
  
  .iconfont {
    font-size: 24rpx;
    color: #ccc;
    margin-right: 5rpx;
    
    &.active {
      color: #FF9900;
    }
  }
}

.review-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin: 10rpx 0;
}

.review-time {
  font-size: 24rpx;
  color: #999;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.cart-btn, .buy-btn {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}

.cart-btn {
  background-color: #FFB74D;
  color: #fff;
}

.buy-btn {
  background: linear-gradient(135deg, #FF7043 0%, #FF5252 100%);
  color: #fff;
}
</style> 