<template>
  <view class="goods-list-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">宠物用品</text>
    </view>
    
    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="iconfont icon-search"></text>
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="搜索宠物用品" 
          @confirm="handleSearch"
        />
      </view>
    </view>
    
    <!-- 排序筛选栏 -->
    <view class="filter-bar">
      <view 
        class="filter-item" 
        :class="{ active: sortType === 'default' }"
        @click="changeSortType('default')"
      >
        <text>综合排序</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortType === 'sales' }"
        @click="changeSortType('sales')"
      >
        <text>销量</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortType === 'price' }"
        @click="changeSortType('price')"
      >
        <text>价格</text>
        <view class="price-arrows">
          <text class="arrow-up" :class="{ active: priceOrder === 'asc' }">▲</text>
          <text class="arrow-down" :class="{ active: priceOrder === 'desc' }">▼</text>
        </view>
      </view>
      <view class="filter-item" @click="showFilterDialog = true">
        <text>筛选</text>
        <text class="iconfont icon-filter"></text>
      </view>
    </view>
    
    <!-- 商品列表 -->
    <scroll-view 
      scroll-y 
      class="goods-scroll-view"
      @scrolltolower="loadMore"
      @refresherrefresh="refresh"
      refresher-enabled
      :refresher-triggered="isRefreshing"
    >
      <view class="goods-grid" v-if="filteredGoods.length > 0">
        <view 
          class="goods-item"
          v-for="(item, index) in filteredGoods" 
          :key="index"
          @click="navigateToDetail(item.id)"
        >
          <image :src="item.image" mode="aspectFill" class="goods-image"></image>
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-price">¥{{ item.price }}</text>
            <text class="goods-sales">{{ item.sales }}人已购买</text>
          </view>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-status" v-if="filteredGoods.length > 0">
        <text v-if="loading">正在加载更多...</text>
        <text v-else-if="!hasMore">已经到底了</text>
      </view>
      
      <!-- 无商品提示 -->
      <view class="no-goods" v-if="filteredGoods.length === 0 && !loading">
        <image src="/static/images/no-result.png" mode="aspectFit"></image>
        <text>暂无相关商品</text>
      </view>
    </scroll-view>
    
    <!-- 筛选弹窗 -->
    <view class="filter-dialog" v-if="showFilterDialog">
      <view class="filter-dialog-mask" @click="showFilterDialog = false"></view>
      <view class="filter-dialog-content">
        <view class="filter-dialog-header">
          <text>筛选</text>
          <text class="close-btn" @click="showFilterDialog = false">×</text>
        </view>
        
        <!-- 品牌筛选 -->
        <view class="filter-section">
          <view class="filter-section-title">品牌</view>
          <view class="filter-tags">
            <view 
              class="filter-tag" 
              v-for="(brand, index) in brands" 
              :key="index"
              :class="{ active: selectedBrand === brand }"
              @click="selectedBrand = selectedBrand === brand ? '' : brand"
            >
              {{ brand }}
            </view>
          </view>
        </view>
        
        <!-- 价格区间筛选 -->
        <view class="filter-section">
          <view class="filter-section-title">价格区间</view>
          <view class="filter-tags">
            <view 
              class="filter-tag" 
              v-for="(range, index) in priceRanges" 
              :key="index"
              :class="{ active: selectedPriceRange && selectedPriceRange.label === range.label }"
              @click="handlePriceRangeClick(range)"
            >
              {{ range.label }}
            </view>
          </view>
        </view>
        
        <!-- 分类筛选 -->
        <view class="filter-section">
          <view class="filter-section-title">分类</view>
          <view class="filter-tags">
            <view 
              class="filter-tag" 
              v-for="(category, index) in categories" 
              :key="index"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = selectedCategory === category ? '' : category"
            >
              {{ category }}
            </view>
          </view>
        </view>
        
        <!-- 筛选操作按钮 -->
        <view class="filter-dialog-footer">
          <view class="reset-btn" @click="resetFilter">重置</view>
          <view class="confirm-btn" @click="applyFilter">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { USE_MOCK, BASE_URL } from '../../utils/config'
import { goodsApi } from '../../utils/api'

// 搜索关键词
const searchKeyword = ref('')

// 排序相关状态
const sortType = ref('default') // default, sales, price
const priceOrder = ref('asc') // asc, desc

// 筛选相关状态
const showFilterDialog = ref(false)
const selectedBrand = ref('')
const selectedPriceRange = ref(null)
const selectedCategory = ref('')

// 列表相关状态
const allGoods = ref([])
const pageSize = 10
const currentPage = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const isRefreshing = ref(false)

// 预定义的筛选选项
const brands = ['皇家', '冠能', '宝路', '萌能', '麦富迪']
const priceRanges = [
  { label: '0-50元', min: 0, max: 50 },
  { label: '50-100元', min: 50, max: 100 },
  { label: '100-200元', min: 100, max: 200 },
  { label: '200元以上', min: 200, max: Infinity }
]
const categories = ['猫粮', '狗粮', '玩具', '零食', '护毛素', '猫砂', '除臭剂', '沐浴露']

// 计算显示的商品列表
const filteredGoods = computed(() => {
  // 所有筛选和排序都由后端处理，前端直接显示数据
  return allGoods.value
})

// 改变排序方式
const changeSortType = (type) => {
  if (type === sortType.value) {
    // 如果点击的是价格排序且已经选中，则切换升降序
    if (type === 'price') {
      priceOrder.value = priceOrder.value === 'asc' ? 'desc' : 'asc'
      // 重新加载数据以应用新的排序
      reloadData()
    }
    return
  }
  
  sortType.value = type
  
  // 价格排序默认为升序
  if (type === 'price') {
    priceOrder.value = 'asc'
  }
  
  // 重新加载数据以应用新的排序
  reloadData()
}

// 处理价格区间点击
const handlePriceRangeClick = (range) => {
  console.log('🔍 [价格筛选] 点击价格区间:', range)
  
  // 如果点击的是当前选中的区间，则取消选择
  if (selectedPriceRange.value && selectedPriceRange.value.label === range.label) {
    selectedPriceRange.value = null
    console.log('🔍 [价格筛选] 取消价格区间选择')
  } else {
    selectedPriceRange.value = range
    console.log('🔍 [价格筛选] 选择价格区间:', range)
  }
}

// 搜索处理
const handleSearch = () => {
  // 使用重新加载函数
  reloadData()
}

// 加载数据
const loadData = () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  if (USE_MOCK) {
    // 模拟网络延迟
    setTimeout(() => {
      // 生成模拟商品数据
      const mockGoods = []
      const brands = ['皇家', '冠能', '宝路', '萌能', '麦富迪']
      const categories = ['猫粮', '狗粮', '玩具', '零食', '护毛素', '猫砂', '除臭剂', '沐浴露']
      
      // 生成当前页的商品数据
      for (let i = 0; i < pageSize; i++) {
        const index = (currentPage.value - 1) * pageSize + i
        const brandIndex = index % brands.length
        const categoryIndex = (index * 2) % categories.length
        const price = (index * 10) % 300 + 10
        const sales = (index * 20) % 1000
        
        mockGoods.push({
          id: index + 1,
          name: `${brands[brandIndex]}${categories[categoryIndex]} ${index + 1}号`,
          price: price,
          sales: sales,
          image: '/static/images/pet.png',
          brand: brands[brandIndex],
          category: categories[categoryIndex]
        })
      }
      
      // 更新商品列表
      allGoods.value = [...allGoods.value, ...mockGoods]
      currentPage.value++
      hasMore.value = currentPage.value <= 5 // 模拟最多5页数据
      
      loading.value = false
      isRefreshing.value = false
      uni.stopPullDownRefresh()
    }, 500)
    return
  }
  
  // 构建API请求参数
  const params = {
    page: currentPage.value,
    pageSize: pageSize
  }
  
  // 添加搜索关键词参数
  if (searchKeyword.value && searchKeyword.value.trim()) {
    params.keyword = searchKeyword.value.trim()
  }
  
  // 添加分类参数
  if (selectedCategory.value && selectedCategory.value !== '全部') {
    params.category = selectedCategory.value
  }
  
  // 添加品牌参数
  if (selectedBrand.value && selectedBrand.value !== '全部') {
    params.brand = selectedBrand.value
  }
  
  // 添加价格区间参数
  if (selectedPriceRange.value) {
    params.minPrice = selectedPriceRange.value.min
    params.maxPrice = selectedPriceRange.value.max === Infinity ? undefined : selectedPriceRange.value.max
  }
  
  // 添加排序参数
  if (sortType.value === 'sales') {
    params.sortBy = 'sales_desc'
  } else if (sortType.value === 'price') {
    params.sortBy = priceOrder.value === 'asc' ? 'price_asc' : 'price_desc'
  }
  
  // 添加调试日志
  console.log('🔍 [商品筛选] 发送API请求:', params)
  console.log('🔍 [商品筛选] API URL:', `${BASE_URL}/goods/list`)
  
  // 调用商品列表API
  goodsApi.getGoodsList(params)
    .then(res => {
      console.log('✅ [商品筛选] API响应:', res)
      
      if (res.data && res.data.items) {
        allGoods.value = [...allGoods.value, ...res.data.items]
        currentPage.value++
        hasMore.value = res.data.items.length < res.data.total
        
        console.log('✅ [商品筛选] 数据更新完成:', {
          新增商品数: res.data.items.length,
          总商品数: allGoods.value.length,
          是否还有更多: hasMore.value
        })
      } else {
        // API返回空数据
        console.log('⚠️ [商品筛选] API返回空数据')
        allGoods.value = []
        hasMore.value = false
        uni.showToast({
          title: '暂无商品数据',
          icon: 'none'
        })
      }
    })
    .catch(err => {
      console.error('❌ [商品筛选] API请求失败:', err)
      console.error('❌ [商品筛选] 请求参数:', params)
      
      // 显示错误提示
      uni.showToast({
        title: err.message || '获取商品列表失败',
        icon: 'none'
      })
      allGoods.value = []
      hasMore.value = false
    })
    .finally(() => {
      loading.value = false
      isRefreshing.value = false
      // 结束下拉刷新
      uni.stopPullDownRefresh()
    })
}

// 重新加载数据（用于筛选、排序变化时）
const reloadData = () => {
  // 显示加载提示
  uni.showToast({
    title: '正在更新...',
    icon: 'loading',
    duration: 1000
  })
  
  // 重置分页和数据
  currentPage.value = 1
  allGoods.value = []
  hasMore.value = true
  loadData()
}

// 加载更多
const loadMore = () => {
  loadData()
}

// 刷新
const refresh = () => {
  isRefreshing.value = true
  currentPage.value = 1
  hasMore.value = true
  allGoods.value = []
  loadData()
}

// 重置筛选条件
const resetFilter = () => {
  selectedBrand.value = ''
  selectedPriceRange.value = null
  selectedCategory.value = ''
  console.log('🔍 [筛选重置] 重置所有筛选条件')
}

// 应用筛选条件
const applyFilter = () => {
  showFilterDialog.value = false
  
  // 使用重新加载函数
  reloadData()
}

// 返回上一页
const handleBack = () => {
  try {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
    } else {
      // 如果没有历史记录，直接跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  } catch (error) {
    // 出错时直接跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}

// 跳转到商品详情页
const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${id}`
  })
}

// 页面加载时初始化数据
onMounted(() => {
  loadData()
})
</script>

<style lang="scss">
.goods-list-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.search-bar {
  background-color: #fff;
  padding: 20rpx 30rpx;
}

.search-input {
  background-color: #f5f5f5;
  border-radius: 30rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  
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
  
  &.active {
    color: #6F87FF;
    font-weight: 500;
  }
  
  .iconfont {
    margin-left: 6rpx;
    font-size: 24rpx;
  }
  
  .price-arrows {
    display: flex;
    flex-direction: column;
    margin-left: 6rpx;
    
    .arrow-up, .arrow-down {
      font-size: 20rpx;
      line-height: 1;
      color: #999;
      
      &.active {
        color: #6F87FF;
      }
    }
  }
}

.goods-scroll-view {
  flex: 1;
  height: 0;
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.goods-item {
  width: 47%;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  margin-right: 0;
  
  &:nth-child(odd) {
    margin-right: 6%;
  }
  
  .goods-image {
    width: 100%;
    height: 345rpx;
    background-color: #f5f5f5;
  }
  
  .goods-info {
    padding: 16rpx;
    
    .goods-name {
      font-size: 28rpx;
      color: #333;
      display: block;
      margin-bottom: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 80rpx;
    }
    
    .goods-price {
      font-size: 32rpx;
      color: #FF6B6B;
      font-weight: 500;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .goods-sales {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.loading-status {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.no-goods {
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

.filter-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.filter-dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.filter-dialog-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.filter-dialog-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  text {
    font-size: 32rpx;
    font-weight: 500;
  }
  
  .close-btn {
    font-size: 40rpx;
    color: #999;
  }
}

.filter-section {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.filter-section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 10rpx 20rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  
  &:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
  
  &.active {
    background-color: #6F87FF;
    color: #fff;
  }
}

.filter-dialog-footer {
  padding: 30rpx;
  display: flex;
  border-top: 1rpx solid #eee;
  margin-top: auto;
}

.reset-btn, .confirm-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #666;
  margin-right: 20rpx;
}

.confirm-btn {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
}
</style>