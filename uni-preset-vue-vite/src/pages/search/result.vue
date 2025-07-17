<template>
  <view class="search-result">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="search-keyword">
        搜索："{{ keyword }}"
      </view>
    </view>

    <!-- 搜索结果列表 -->
    <view class="result-list" v-if="searchResults.length > 0">
      <view 
        class="result-item"
        v-for="(item, index) in searchResults" 
        :key="index"
      >
        <image :src="item.image" mode="aspectFill" class="item-image"></image>
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-desc">{{ item.description }}</text>
          <text class="item-price" v-if="item.price">¥{{ item.price }}</text>
        </view>
      </view>
    </view>

    <!-- 无搜索结果 -->
    <view class="no-result" v-else>
      <image src="/static/images/no-result.png" mode="aspectFit"></image>
      <text>未找到相关内容</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const keyword = ref('')
const searchResults = ref([])

// 模拟搜索数据
const mockData = [
  {
    name: '高级狗粮5kg装',
    description: '优质蛋白质，营养均衡',
    price: '129',
    image: '/static/images/pet.png',
    type: 'goods'
  },
  {
    name: '香港宠物医院',
    description: '香港中环 | 专业兽医团队',
    image: '/static/images/pet.png',
    type: 'hospital'
  },
  {
    name: '基础保障计划',
    description: '覆盖常见疾病和意外',
    price: '299/年',
    image: '/static/images/pet.png',
    type: 'insurance'
  }
]

// 模拟搜索功能
const searchMockData = (keyword) => {
  return mockData.filter(item => {
    return item.name.includes(keyword) || 
           item.description.includes(keyword)
  })
}

const handleBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const query = currentPage.$page.options
  
  if (query.keyword) {
    keyword.value = decodeURIComponent(query.keyword)
    // 模拟搜索
    searchResults.value = searchMockData(keyword.value)
  }
})
</script>

<style lang="scss">
.search-result {
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
  
  .search-keyword {
    font-size: 28rpx;
  }
}

.result-list {
  padding: 20rpx;
}

.result-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  
  .item-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }
  
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .item-name {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .item-desc {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 10rpx;
    }
    
    .item-price {
      font-size: 28rpx;
      color: #FF6B6B;
    }
  }
}

.no-result {
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