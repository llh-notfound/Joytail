<template>
  <view class="community-home">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-back iconfont icon-back" @tap="goHome"></text>
      <text class="nav-title">宠物社区</text>
      <view class="nav-actions">
        <text class="publish-btn" @tap="goToPublish">
          <text class="iconfont icon-add"></text>
          <text>发布</text>
        </text>
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

    <!-- 瀑布流内容区域 -->
    <scroll-view 
      scroll-y 
      class="waterfall-container"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 空内容提示 -->
      <view v-if="contentList.length === 0 && !loading" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-community.png"></image>
        <text>暂无内容，快来发布第一条动态吧！</text>
      </view>

      <!-- 瀑布流布局 -->
      <view v-else class="waterfall-wrapper">
        <view class="waterfall-column">
          <view 
            v-for="(item, index) in leftColumn" 
            :key="item.id"
            class="content-card"
            @tap="goToDetail(item)"
          >
            <!-- 用户信息 -->
            <view class="user-info">
              <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
              <view class="user-details">
                <text class="username">{{ item.username }}</text>
                <text class="publish-time">{{ item.publishTime }}</text>
              </view>
            </view>
            
            <!-- 内容 -->
            <view class="content-body">
              <text v-if="item.content" class="content-text">{{ item.content }}</text>
              <view v-if="item.images && item.images.length > 0" class="content-images">
                <image 
                  v-for="(img, imgIndex) in item.images" 
                  :key="imgIndex"
                  class="content-image" 
                  :src="img"
                  mode="aspectFill"
                  @tap.stop="previewImage(item.images, imgIndex)"
                ></image>
              </view>
            </view>
            
            <!-- 互动信息 -->
            <view class="interaction-bar">
              <view class="interaction-item" @tap.stop="toggleLike(item)">
                <text class="iconfont" :class="item.isLiked ? 'icon-like-filled' : 'icon-like'"></text>
                <text class="count">{{ item.likes }}</text>
              </view>
              <view class="interaction-item" @tap.stop="goToDetail(item)">
                <text class="iconfont icon-comment"></text>
                <text class="count">{{ item.comments }}</text>
              </view>
              <view class="interaction-item" @tap.stop="toggleCollect(item)">
                <text class="iconfont" :class="item.isCollected ? 'icon-collect-filled' : 'icon-collect'"></text>
                <text class="count">{{ item.collects }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="waterfall-column">
          <view 
            v-for="(item, index) in rightColumn" 
            :key="item.id"
            class="content-card"
            @tap="goToDetail(item)"
          >
            <!-- 用户信息 -->
            <view class="user-info">
              <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
              <view class="user-details">
                <text class="username">{{ item.username }}</text>
                <text class="publish-time">{{ item.publishTime }}</text>
              </view>
            </view>
            
            <!-- 内容 -->
            <view class="content-body">
              <text v-if="item.content" class="content-text">{{ item.content }}</text>
              <view v-if="item.images && item.images.length > 0" class="content-images">
                <image 
                  v-for="(img, imgIndex) in item.images" 
                  :key="imgIndex"
                  class="content-image" 
                  :src="img"
                  mode="aspectFill"
                  @tap.stop="previewImage(item.images, imgIndex)"
                ></image>
              </view>
            </view>
            
            <!-- 互动信息 -->
            <view class="interaction-bar">
              <view class="interaction-item" @tap.stop="toggleLike(item)">
                <text class="iconfont" :class="item.isLiked ? 'icon-like-filled' : 'icon-like'"></text>
                <text class="count">{{ item.likes }}</text>
              </view>
              <view class="interaction-item" @tap.stop="goToDetail(item)">
                <text class="iconfont icon-comment"></text>
                <text class="count">{{ item.comments }}</text>
              </view>
              <view class="interaction-item" @tap.stop="toggleCollect(item)">
                <text class="iconfont" :class="item.isCollected ? 'icon-collect-filled' : 'icon-collect'"></text>
                <text class="count">{{ item.collects }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && contentList.length > 0" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '@/utils/api';

// 分类标签
const tabs = ['推荐', '最新'];
const currentTab = ref(0);

// 内容列表
const contentList = ref([]);
const hasMore = ref(true);
const loading = ref(false);
const refreshing = ref(false);
const page = ref(1);

// 瀑布流布局：将内容分为左右两列
const leftColumn = computed(() => {
  return contentList.value.filter((_, index) => index % 2 === 0);
});

const rightColumn = computed(() => {
  return contentList.value.filter((_, index) => index % 2 === 1);
});

// 获取内容列表
const getContentList = async () => {
  if (loading.value) return;
  
  loading.value = true;
  
  try {
    const type = currentTab.value === 0 ? 'recommend' : 'latest';
    const response = await api.community.getCommunityPosts(type, page.value, 10);
      if (response && response.code === 200) {
      const newData = response.data.list || [];
      
      if (page.value === 1) {
        contentList.value = newData;
      } else {
        contentList.value.push(...newData);
      }
      
      hasMore.value = response.data.hasMore || newData.length >= 10;
      page.value++;
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('获取社区内容失败:', error);
    
    // 显示错误提示
    uni.showToast({
      title: error.message || '加载失败，请重试',
      icon: 'none',
      duration: 3000
    });
    
    // 如果是首次加载失败，显示空状态
    if (page.value === 1) {
      contentList.value = [];
    }
    
    // 加载更多失败时，停止加载更多
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
};

// 切换标签
const switchTab = (index) => {
  if (currentTab.value === index) return;
  currentTab.value = index;
  page.value = 1;
  contentList.value = [];
  getContentList();
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  getContentList();
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  page.value = 1;
  contentList.value = [];
  
  try {
    await getContentList();
  } catch (error) {
    console.error('刷新失败:', error);
  } finally {
    refreshing.value = false;
  }
};

// 点赞/取消点赞
const toggleLike = async (item) => {
  try {
    const response = await api.community.togglePostLike(item.id);
    
    if (response && response.code === 200) {
      item.isLiked = !item.isLiked;
      item.likes += item.isLiked ? 1 : -1;
      
      uni.showToast({
        title: item.isLiked ? '点赞成功' : '取消点赞',
        icon: 'none'
      });
    } else {
      throw new Error(response?.message || 'API响应异常');
    }  } catch (error) {
    console.error('点赞操作失败:', error);
    
    // 显示错误提示
    uni.showToast({
      title: error.message || '操作失败，请重试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 收藏/取消收藏
const toggleCollect = async (item) => {
  try {
    const response = await api.community.togglePostCollect(item.id);
    
    if (response && response.code === 200) {
      item.isCollected = !item.isCollected;
      item.collects += item.isCollected ? 1 : -1;
      
      uni.showToast({
        title: item.isCollected ? '收藏成功' : '取消收藏',
        icon: 'none'
      });
    } else {
      throw new Error(response?.message || 'API响应异常');
    }  } catch (error) {
    console.error('收藏操作失败:', error);
    
    // 显示错误提示
    uni.showToast({
      title: error.message || '操作失败，请重试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 预览图片
const previewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current: images[current]
  });
};

// 跳转到详情页
const goToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/community/detail?id=${item.id}`
  });
};

// 跳转到发布页
const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/community/publish'
  });
};

// 跳转到首页
const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

onMounted(() => {
  getContentList();
  
  // 监听发布成功事件，刷新列表
  uni.$on('refreshCommunityList', () => {
    console.log('📝 接收到发布成功通知，刷新社区列表');
    page.value = 1;
    contentList.value = [];
    getContentList();
  });
});

onUnmounted(() => {
  // 清理事件监听
  uni.$off('refreshCommunityList');
});
</script>

<style lang="scss">
.community-home {
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
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 0 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.nav-back {
  position: absolute;
  left: 30rpx;
  font-size: 38rpx;
  color: #fff;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}

.nav-actions {
  position: absolute;
  right: 30rpx;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(255,255,255,0.15);
  color: #fff;
  padding: 12rpx 20rpx;
  border-radius: 25rpx;
  font-size: 28rpx;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  
  .iconfont {
    font-size: 26rpx;
    color: #fff;
    font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  }
}

/* 分类标签栏 */
.tab-bar {
  display: flex;
  background-color: #fff;
  padding: 0 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 28rpx;
  color: #666;
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
  border-radius: 4rpx;
}

/* 瀑布流容器 */
.waterfall-container {
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

/* 瀑布流布局 */
.waterfall-wrapper {
  display: flex;
  padding: 20rpx;
  gap: 20rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 内容卡片 */
.content-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 15rpx;
  background-color: #f5f5f5;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 4rpx;
}

.publish-time {
  font-size: 24rpx;
  color: #999;
}

.content-body {
  padding: 20rpx;
}

.content-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 15rpx;
}

.content-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 15rpx;
}

.content-image {
  width: calc(50% - 4rpx);
  height: 200rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
}

.content-image:only-child {
  width: 100%;
}

/* 互动栏 */
.interaction-bar {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #666;
  
  .iconfont {
    font-size: 32rpx;
  }
  
  .icon-like-filled,
  .icon-collect-filled {
    color: #FF6B6B;
  }
  
  .count {
    font-size: 24rpx;
  }
}

/* 加载更多 */
.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}
</style>