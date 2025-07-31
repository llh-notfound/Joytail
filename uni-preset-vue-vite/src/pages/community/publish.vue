<template>
  <view class="publish-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="nav-title">发布动态</text>
      <text class="nav-publish" @tap="publishContent">发布</text>
    </view>    <!-- 发布内容区域 -->
    <view class="publish-content">
      <!-- 文本输入 -->
      <textarea 
        class="content-input"
        v-model="content"
        placeholder="分享你的宠物日常..."
        maxlength="500"
        auto-height
      ></textarea>
      
      <!-- 话题标签选择 -->
      <view class="topic-section">
        <text class="section-title">添加话题标签</text>
        <view class="topic-tags">
          <view 
            v-for="(tag, index) in availableTags" 
            :key="index"
            class="tag-item"
            :class="{ active: selectedTags.includes(tag) }"
            @tap="toggleTag(tag)"
          >
            <text>#{{ tag }}</text>
          </view>
        </view>
        <view v-if="selectedTags.length > 0" class="selected-tags">
          <text class="selected-title">已选择的标签：</text>
          <view class="selected-tag-list">
            <view 
              v-for="(tag, index) in selectedTags" 
              :key="index"
              class="selected-tag"
              @tap="removeTag(tag)"
            >
              <text>#{{ tag }}</text>
              <text class="remove-btn">×</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 图片上传区域 -->
      <view class="image-upload">
        <text class="section-title">添加图片（最多9张）</text>
        <view class="image-list">
          <view 
            v-for="(image, index) in images" 
            :key="index"
            class="image-item"
          >
            <image :src="image" mode="aspectFill"></image>
            <text class="delete-btn iconfont icon-close" @tap="deleteImage(index)"></text>
          </view>
          <view 
            v-if="images.length < 9" 
            class="upload-btn"
            @tap="chooseImage"
          >
            <text class="iconfont icon-camera"></text>
            <text class="upload-text">添加图片</text>
          </view>
        </view>
      </view>
      
      <!-- 字数统计 -->
      <view class="word-count">
        <text>{{ content.length }}/500</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/utils/api';

const content = ref('');
const images = ref([]);
const selectedTags = ref([]);

// 可选择的话题标签（类似小红书/贴吧的热门话题）
const availableTags = ref([
  '萌宠日常', '新手养宠', '宠物健康', '训练技巧', 
  '萌猫', '汪星人', '异宠', '宠物用品',
  '宠物医疗', '宠物美容', '遛宠日记', '宠物摄影',
  '柴犬', '金毛', '哈士奇', '布偶猫', '英短', '加菲猫'
]);

// 切换标签选择
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else if (selectedTags.value.length < 3) { // 最多选择3个标签
    selectedTags.value.push(tag);
  } else {
    uni.showToast({
      title: '最多选择3个标签',
      icon: 'none'
    });
  }
};

// 移除已选标签
const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  }
};

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value.push(...res.tempFilePaths);
    }
  });
};

// 删除图片
const deleteImage = (index) => {
  images.value.splice(index, 1);
};

// 发布内容
const publishContent = async () => {
  if (!content.value.trim() && images.value.length === 0) {
    uni.showToast({
      title: '请输入内容或上传图片',
      icon: 'none'
    });
    return;
  }
  
  uni.showLoading({
    title: '发布中...'
  });
  
  try {
    const response = await api.community.publishPost({
      content: content.value.trim(),
      images: images.value,
      tags: selectedTags.value // 包含标签信息
    });
      if (response && response.code === 200) {
      uni.hideLoading();
      uni.showToast({
        title: '发布成功',
        icon: 'success'
      });
      
      // 保存新发布的帖子信息
      const newPost = response.data;
      if (newPost && newPost.id) {
        uni.setStorageSync('lastPublishedPost', {
          id: newPost.id,
          timestamp: Date.now(),
          content: content.value.trim()
        });
      }
      
      // 通知其他页面刷新数据
      uni.$emit('refreshCommunityList');
      uni.$emit('refreshMyCommunity');
      
      // 清空输入内容
      content.value = '';
      images.value = [];
      selectedTags.value = [];
      
      // 返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      throw new Error(response?.message || 'API响应异常');
    }} catch (error) {
    console.error('发布失败:', error);
    
    // 显示错误提示
    uni.hideLoading();
    uni.showToast({
      title: error.message || '发布失败，请重试',
      icon: 'none',
      duration: 3000
    });
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.publish-page {
  min-height: 100vh;
  background-color: #fff;
}

/* 顶部导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
}

.nav-title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  height: 90rpx;
  line-height: 90rpx;
  pointer-events: none;
}

.nav-back {
  position: absolute;
  left: 30rpx;
  font-size: 38rpx;
  color: #fff;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.nav-publish {
  position: absolute;
  right: 30rpx;
  font-size: 28rpx;
  color: #fff;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-weight: bold;
}

/* 发布内容区域 */
.publish-content {
  padding: 30rpx;
}

.content-input {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  border: none;
  outline: none;
  resize: none;
}

/* 话题标签区域 */
.topic-section {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 20rpx;
  display: block;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.tag-item {
  padding: 12rpx 20rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  border: 1rpx solid #dee2e6;
  transition: all 0.3s ease;
}

.tag-item.active {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
  border-color: #6F87FF;
  transform: scale(1.05);
}

.selected-tags {
  margin-top: 20rpx;
}

.selected-title {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.selected-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.selected-tag {
  display: flex;
  align-items: center;
  padding: 8rpx 15rpx;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
  border-radius: 15rpx;
  font-size: 22rpx;
  gap: 8rpx;
}

.remove-btn {
  font-size: 24rpx;
  font-weight: bold;
  opacity: 0.8;
}

/* 图片上传区域 */
.image-upload {
  margin-top: 30rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  
  image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
  }
  
  .delete-btn {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
  }
}

.upload-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  
  .iconfont {
    font-size: 48rpx;
    margin-bottom: 10rpx;
  }
  
  .upload-text {
    font-size: 24rpx;
  }
}

/* 字数统计 */
.word-count {
  text-align: right;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}
</style>