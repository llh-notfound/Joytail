<template>
  <view class="feedback-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">投诉建议</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 表单区域 -->
    <scroll-view scroll-y class="form-area">
      <!-- 问题类型选择 -->
      <view class="form-section">
        <view class="section-title">问题类型</view>
        <view class="type-list">
          <view 
            v-for="(type, index) in feedbackTypes" 
            :key="index"
            class="type-item"
            :class="{ 'type-active': selectedType === type.value }"
            @tap="selectType(type.value)"
          >
            <text class="type-icon" :class="type.icon"></text>
            <text class="type-name">{{ type.name }}</text>
          </view>
        </view>
      </view>

      <!-- 问题描述 -->
      <view class="form-section">
        <view class="section-title">问题描述</view>
        <textarea 
          class="feedback-textarea" 
          v-model="feedbackContent" 
          placeholder="请详细描述您遇到的问题或建议，以便我们更好地为您服务"
          maxlength="500"
        ></textarea>
        <view class="word-count">{{ feedbackContent.length }}/500</view>
      </view>

      <!-- 图片上传 -->
      <view class="form-section">
        <view class="section-title">上传截图（选填）</view>
        <view class="upload-list">
          <view 
            v-for="(image, index) in uploadedImages" 
            :key="index"
            class="image-item"
          >
            <image 
              class="preview-image" 
              :src="image" 
              mode="aspectFill"
            ></image>
            <text class="delete-icon iconfont icon-close" @tap="deleteImage(index)"></text>
          </view>
          <view 
            class="upload-btn" 
            @tap="chooseImage" 
            v-if="uploadedImages.length < 3"
          >
            <text class="iconfont icon-camera"></text>
            <text class="upload-text">上传图片</text>
          </view>
        </view>
        <text class="upload-tip">最多上传3张图片，支持jpg、png格式</text>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <view class="section-title">联系方式（选填）</view>
        <input 
          class="contact-input" 
          v-model="contactInfo" 
          placeholder="请留下您的手机号或邮箱，方便我们联系您"
        />
      </view>
    </scroll-view>

    <!-- 提交按钮 -->
    <view class="submit-bar">
      <view class="submit-btn" @tap="submitFeedback">提交反馈</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 问题类型列表
const feedbackTypes = [
  { name: '功能异常', value: 'bug', icon: 'icon-bug' },
  { name: '服务态度', value: 'service', icon: 'icon-service' },
  { name: '商品问题', value: 'product', icon: 'icon-product' },
  { name: '物流问题', value: 'logistics', icon: 'icon-logistics' },
  { name: '支付问题', value: 'payment', icon: 'icon-payment' },
  { name: '其他问题', value: 'other', icon: 'icon-other' }
];

// 表单数据
const selectedType = ref('');
const feedbackContent = ref('');
const uploadedImages = ref([]);
const contactInfo = ref('');

// 选择问题类型
const selectType = (type) => {
  selectedType.value = type;
};

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 3 - uploadedImages.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uploadedImages.value = [...uploadedImages.value, ...res.tempFilePaths];
    }
  });
};

// 删除图片
const deleteImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

// 提交反馈
const submitFeedback = () => {
  // 表单验证
  if (!selectedType.value) {
    uni.showToast({
      title: '请选择问题类型',
      icon: 'none'
    });
    return;
  }
  
  if (!feedbackContent.value.trim()) {
    uni.showToast({
      title: '请描述您的问题或建议',
      icon: 'none'
    });
    return;
  }
  
  // 模拟提交
  uni.showLoading({
    title: '提交中...'
  });
  
  setTimeout(() => {
    uni.hideLoading();
    
    // 清空表单
    selectedType.value = '';
    feedbackContent.value = '';
    uploadedImages.value = [];
    contactInfo.value = '';
    
    // 显示成功提示
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    });
    
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1500);
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 检查登录状态
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }, 1500);
  }
});
</script>

<style lang="scss">
.feedback-container {
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

/* 表单区域 */
.form-area {
  flex: 1;
  padding: 30rpx;
}

.form-section {
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
}

/* 问题类型选择 */
.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.type-item {
  width: calc(33.33% - 14rpx);
  height: 160rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.type-active {
  background-color: rgba(111, 135, 255, 0.1);
  border: 2rpx solid #6F87FF;
}

.type-icon {
  font-size: 48rpx;
  color: #6F87FF;
  margin-bottom: 10rpx;
}

.type-name {
  font-size: 26rpx;
  color: #333;
}

/* 问题描述 */
.feedback-textarea {
  width: 100%;
  height: 300rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.word-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

/* 图片上传 */
.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
}

.delete-icon {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon-camera {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.upload-tip {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}

/* 联系方式 */
.contact-input {
  width: 100%;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

/* 提交按钮 */
.submit-bar {
  padding: 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  height: 80rpx;
  background-color: #6F87FF;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 