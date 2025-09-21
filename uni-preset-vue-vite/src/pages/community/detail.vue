<template>
  <view class="detail-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="nav-title">动态详情</text>
    </view>

    <!-- 内容详情 -->
    <view class="content-detail">
      <!-- 用户信息 -->
      <view class="user-info">
        <image class="avatar" :src="contentDetail.avatar" mode="aspectFill"></image>
        <view class="user-details">
          <text class="username">{{ contentDetail.username }}</text>
          <text class="publish-time">{{ contentDetail.publishTime }}</text>
        </view>
      </view>
      
      <!-- 内容 -->
      <view class="content-body">
        <text v-if="contentDetail.content" class="content-text">{{ contentDetail.content }}</text>
        <view v-if="contentDetail.images && contentDetail.images.length > 0" class="content-images">
          <image 
            v-for="(img, imgIndex) in contentDetail.images" 
            :key="imgIndex"
            class="content-image" 
            :src="img"
            mode="aspectFill"
            @tap="previewImage(contentDetail.images, imgIndex)"
          ></image>
        </view>
      </view>
        <!-- 互动信息 -->
      <view class="interaction-bar">
        <view class="interaction-item" @tap="toggleLike">
          <image 
            class="interaction-icon" 
            :src="contentDetail.isLiked ? '/static/images/community/like-filled.png' : '/static/images/community/like.png'"
            mode="aspectFit"
          ></image>
          <text class="count">{{ contentDetail.likes }}</text>
        </view>
        <view class="interaction-item">
          <image 
            class="interaction-icon" 
            src="/static/images/community/comment.png"
            mode="aspectFit"
          ></image>
          <text class="count">{{ contentDetail.comments }}</text>
        </view>
        <view class="interaction-item" @tap="toggleCollect">
          <image 
            class="interaction-icon" 
            :src="contentDetail.isCollected ? '/static/images/community/collect-filled.png' : '/static/images/community/collect.png'"
            mode="aspectFit"
          ></image>
          <text class="count">{{ contentDetail.collects }}</text>
        </view>
      </view>
    </view>

    <!-- 评论区域 -->
    <view class="comments-section">
      <view class="section-title">评论 ({{ contentDetail.comments }})</view>
      
      <!-- 评论列表 -->
      <view v-if="comments.length > 0" class="comments-list">
        <view 
          v-for="(comment, index) in comments" 
          :key="index"
          class="comment-item"
        >
          <image class="comment-avatar" :src="comment.avatar" mode="aspectFill"></image>
          <view class="comment-content">
            <view class="comment-header">
              <text class="comment-username">{{ comment.username }}</text>
              <text class="comment-time">{{ comment.time }}</text>
            </view>
            <text class="comment-text">{{ comment.content }}</text>
          </view>
        </view>
      </view>
      
      <!-- 空评论提示 -->
      <view v-else class="empty-comments">
        <text>暂无评论，快来发表第一条评论吧！</text>
      </view>
    </view>

    <!-- 底部评论输入框 -->
    <view class="comment-input-bar">
      <input 
        class="comment-input"
        v-model="commentText"
        placeholder="说点什么..."
        @confirm="submitComment"
      />
      <text class="submit-btn" @tap="submitComment">发送</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/utils/api';
import { processCommunityImages } from '@/utils/imageHelper';

const contentDetail = ref({
  id: '',
  username: '',
  avatar: '',
  publishTime: '',
  content: '',
  images: [],
  likes: 0,
  comments: 0,
  collects: 0,
  isLiked: false,
  isCollected: false
});

const comments = ref([]);
const commentText = ref('');
const loading = ref(false);

// 获取动态详情
const getPostDetail = async (postId) => {
  if (!postId) return;
  
  loading.value = true;
  try {
    const response = await api.community.getPostDetail(postId);
    
    if (response && response.code === 200) {
      // 处理图片URL，修正端口号问题
      const processedData = processCommunityImages([response.data])[0];
      contentDetail.value = processedData;
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('获取动态详情失败:', error);
    uni.showToast({
      title: error.message || '加载失败，请重试',
      icon: 'none',
      duration: 3000
    });
  } finally {
    loading.value = false;
  }
};

// 获取评论列表
const getComments = async (postId) => {
  if (!postId) return;
  
  try {
    const response = await api.community.getPostComments(postId, 1, 20);
    
    if (response && response.code === 200) {
      comments.value = response.data.list || [];
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('获取评论失败:', error);
    // 评论加载失败不影响主要内容显示
  }
};

// 获取页面参数
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const id = currentPage.options.id;
  
  if (id) {
    contentDetail.value.id = id;
    getPostDetail(id);
    getComments(id);
  }
});

// 点赞/取消点赞
const toggleLike = async () => {
  if (!contentDetail.value.id) return;
  
  try {
    const response = await api.community.togglePostLike(contentDetail.value.id);
    
    if (response && response.code === 200) {
      contentDetail.value.isLiked = response.data.isLiked;
      contentDetail.value.likes = response.data.likesCount;
      
      uni.showToast({
        title: contentDetail.value.isLiked ? '点赞成功' : '取消点赞',
        icon: 'none'
      });
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    uni.showToast({
      title: error.message || '操作失败，请重试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 收藏/取消收藏
const toggleCollect = async () => {
  if (!contentDetail.value.id) return;
  
  try {
    const response = await api.community.togglePostCollect(contentDetail.value.id);
    
    if (response && response.code === 200) {
      contentDetail.value.isCollected = response.data.isCollected;
      contentDetail.value.collects = response.data.collectsCount;
      
      uni.showToast({
        title: contentDetail.value.isCollected ? '收藏成功' : '取消收藏',
        icon: 'none'
      });
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
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

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none'
    });
    return;
  }
  
  if (!contentDetail.value.id) return;
  
  try {
    const response = await api.community.addPostComment(contentDetail.value.id, commentText.value.trim());
    
    if (response && response.code === 200) {
      // 添加新评论到列表顶部
      const newComment = response.data;
      comments.value.unshift(newComment);
      contentDetail.value.comments += 1;
      commentText.value = '';
      
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      });
    } else {
      throw new Error(response?.message || 'API响应异常');
    }
  } catch (error) {
    console.error('评论失败:', error);
    uni.showToast({
      title: error.message || '评论失败，请重试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
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

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
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
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.back-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

/* 内容详情 */
.content-detail {
  background-color: #fff;
  margin: 20rpx;
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
  width: calc(33.33% - 6rpx);
  height: 200rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
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
  
  .interaction-icon {
    width: 32rpx;
    height: 32rpx;
  }
  
  .icon-like-filled,
  .icon-collect-filled {
    color: #FF6B6B;
  }
  
  .count {
    font-size: 24rpx;
  }
}

/* 评论区域 */
.comments-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.comment-item {
  display: flex;
  gap: 15rpx;
}

.comment-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.comment-username {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.comment-time {
  font-size: 22rpx;
  color: #999;
}

.comment-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.empty-comments {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 26rpx;
}

/* 底部评论输入框 */
.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.comment-input {
  flex: 1;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 26rpx;
  color: #333;
}

.submit-btn {
  font-size: 28rpx;
  color: #6F87FF;
  font-weight: 500;
}
</style> 