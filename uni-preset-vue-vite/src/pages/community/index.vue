<template>
  <view class="community-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">我的社区</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
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

    <!-- 内容列表 -->
    <scroll-view 
      scroll-y 
      class="content-scroll-view"
      @scrolltolower="loadMore"
    >
      <!-- 空内容提示 -->
      <view v-if="contentList.length === 0" class="empty-tip">
        <image class="empty-icon" src="/static/images/empty-community.png"></image>
        <text>暂无相关内容</text>
      </view>

      <!-- 我的发布 -->
      <view 
        v-for="(item, index) in contentList" 
        :key="index"
        class="content-item"
        v-if="currentTab === 0"
      >
        <view class="content-header">
          <text class="content-time">{{ item.publishTime }}</text>
          <view class="content-actions">
            <text class="action-btn edit-btn" @tap.stop="editContent(item)">编辑</text>
            <text class="action-btn delete-btn" @tap.stop="deleteContent(item)">删除</text>
          </view>
        </view>
        
        <view class="content-body">
          <view class="content-text">{{ item.content }}</view>
          <view class="content-images" v-if="item.images && item.images.length > 0">
            <image 
              v-for="(img, imgIndex) in item.images" 
              :key="imgIndex"
              class="content-image" 
              :src="img"
              mode="aspectFill"
              @tap="previewImage(item.images, imgIndex)"
            ></image>
          </view>
        </view>
        
        <view class="content-footer">
          <view class="interaction-info">
            <text class="interaction-item">
              <text class="iconfont icon-like"></text>
              <text>{{ item.likes }}</text>
            </text>
            <text class="interaction-item">
              <text class="iconfont icon-comment"></text>
              <text>{{ item.comments }}</text>
            </text>
            <text class="interaction-item">
              <text class="iconfont icon-collect"></text>
              <text>{{ item.collects }}</text>
            </text>
          </view>
        </view>
      </view>

      <!-- 我的收藏/点赞/评论 -->
      <view 
        v-for="(item, index) in contentList" 
        :key="index"
        class="content-item"
        v-if="currentTab !== 0"
      >
        <view class="content-header">
          <text class="content-time">{{ item.interactTime }}</text>
          <text class="content-type">{{ getInteractTypeText() }}</text>
        </view>
        
        <view class="content-body" @tap="goToOriginalPost(item)">
          <view class="content-cover">
            <image class="cover-image" :src="item.coverImage" mode="aspectFill"></image>
          </view>
          <view class="content-info">
            <view class="content-title">{{ item.title }}</view>
            <view class="content-summary">{{ item.summary }}</view>
          </view>
        </view>
        
        <view class="content-footer">
          <view class="content-actions">
            <text class="action-btn delete-btn" @tap.stop="deleteInteraction(item)">删除</text>
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
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/utils/api';

// 分类标签
const tabs = ['我的发布', '我的收藏', '我的点赞', '我的评论'];
const currentTab = ref(0);

// 内容列表
const contentList = ref([]);
const hasMore = ref(false);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

// 获取内容列表
const getContentList = async () => {
  if (loading.value) return;
  
  loading.value = true;
  
  try {
    const typeMap = {
      0: 'posts',
      1: 'collects', 
      2: 'likes',
      3: 'comments'
    };
    
    const type = typeMap[currentTab.value];
    const response = await api.community.getMyCommunityContent(type, page.value, pageSize.value);
    
    if (response && response.code === 200) {
      const newData = response.data.list || [];
      
      if (page.value === 1) {
        contentList.value = newData;
      } else {
        contentList.value.push(...newData);
      }
      
      hasMore.value = response.data.hasMore || false;
      page.value++;
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('获取我的社区内容失败:', error);
    
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
    
    // 加载失败时，停止加载更多
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

// 获取互动类型文本
const getInteractTypeText = () => {
  const typeMap = {
    1: '收藏',
    2: '点赞',
    3: '评论'
  };
  return typeMap[currentTab.value] || '';
};

// 编辑内容
const editContent = async (item) => {
  try {
    uni.navigateTo({
      url: `/pages/community/edit?id=${item.id}`
    });
  } catch (error) {
    console.error('跳转编辑页面失败:', error);
    uni.showToast({
      title: '页面跳转失败',
      icon: 'none'
    });
  }
};

// 删除内容
const deleteContent = async (item) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条内容吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const response = await api.community.deletePost(item.id);
          
          if (response && response.code === 200) {
            // 从列表中移除
            const index = contentList.value.findIndex(content => content.id === item.id);
            if (index > -1) {
              contentList.value.splice(index, 1);
            }
            
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } else {
            throw new Error(response?.message || 'API响应异常');
          }
        } catch (error) {
          console.error('删除失败:', error);
          uni.showToast({
            title: error.message || '删除失败，请重试',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 预览图片
const previewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current: images[current]
  });
};

// 跳转到原帖
const goToOriginalPost = (item) => {
  uni.navigateTo({
    url: `/pages/community/detail?id=${item.postId || item.originalId}`
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 删除互动内容
const deleteInteraction = async (item) => {
  const typeMap = {
    1: { text: '收藏', type: 'collects' },
    2: { text: '点赞', type: 'likes' },
    3: { text: '评论', type: 'comments' }
  };
  
  const currentType = typeMap[currentTab.value];
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除这条${currentType.text}吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          const response = await api.community.deleteCommunityRecord(currentType.type, item.id);
          
          if (response && response.code === 200) {
            // 从列表中移除
            const index = contentList.value.findIndex(content => content.id === item.id);
            if (index > -1) {
              contentList.value.splice(index, 1);
            }
            
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } else {
            throw new Error(response?.message || 'API响应异常');
          }
        } catch (error) {
          console.error('删除失败:', error);
          uni.showToast({
            title: error.message || '删除失败，请重试',
            icon: 'none'
          });
        }
      }
    }
  });
};

onMounted(() => {
  getContentList();
  
  // 监听发布成功事件，刷新我的内容
  uni.$on('refreshMyCommunity', () => {
    console.log('📝 接收到发布成功通知，刷新我的社区内容');
    page.value = 1;
    contentList.value = [];
    getContentList();
  });
});

onUnmounted(() => {
  // 清理事件监听
  uni.$off('refreshMyCommunity');
});
</script>

<style lang="scss">
.community-container {
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

.nav-back {
  position: absolute;
  left: 30rpx;
  font-size: 36rpx;
  color: #333;
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

/* 内容列表区域 */
.content-scroll-view {
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

.content-item {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.content-time {
  font-size: 26rpx;
  color: #999;
}

.content-type {
  font-size: 26rpx;
  color: #6F87FF;
  background-color: #f0f4ff;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.content-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  font-size: 26rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  background-color: #f5f5f5;
  color: #666;
}

.edit-btn {
  color: #6F87FF;
  background-color: #f0f4ff;
}

.delete-btn {
  color: #ff4d4f;
  background-color: #fff1f0;
}

.content-body {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.content-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.content-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.content-image {
  width: 220rpx;
  height: 220rpx;
  border-radius: 10rpx;
  background-color: #f5f5f5;
}

.content-cover {
  margin-bottom: 20rpx;
}

.cover-image {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
  background-color: #f5f5f5;
}

.content-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.content-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.content-summary {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.content-footer {
  padding: 20rpx 30rpx;
}

.interaction-info {
  display: flex;
  gap: 30rpx;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 26rpx;
  color: #999;
  
  .iconfont {
    font-size: 28rpx;
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