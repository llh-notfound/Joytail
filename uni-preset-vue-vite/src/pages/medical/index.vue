<template>
  <view class="hospital-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="handleBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title">优质医院</text>
    </view>
      <!-- 医院Logo轮播图 -->
    <view class="logo-carousel-wrapper">
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
      <swiper 
        v-else-if="hospitals.length > 0"
        class="logo-carousel" 
        indicator-dots 
        autoplay 
        interval="3000" 
        duration="500"
      >
        <swiper-item v-for="hospital in hospitals" :key="hospital.id">
          <view class="logo-slide">
            <image 
              class="hospital-logo" 
              :src="hospital.logo" 
              mode="aspectFit"
              @error="handleImageError"
            />
            <text class="hospital-name-overlay">{{ hospital.name }}</text>
          </view>
        </swiper-item>
      </swiper>
      <view v-else class="empty-state">
        <text class="empty-text">暂无医院数据</text>
        <view class="retry-btn" @tap="loadHospitals">重新加载</view>
      </view>
    </view>

    <!-- 医院封面介绍 -->
    <view class="hospital-list">
      <view v-if="loading" class="loading-cards">
        <view v-for="i in 3" :key="i" class="loading-card">
          <view class="loading-card-image"></view>
          <view class="loading-card-content">
            <view class="loading-line"></view>
            <view class="loading-line short"></view>
            <view class="loading-line shorter"></view>
          </view>
        </view>
      </view>
      <template v-else>
        <view 
          v-for="hospital in hospitals" 
          :key="hospital.id" 
          class="hospital-card"
          @tap="navigateToDetail(hospital)"
        >
          <image 
            class="hospital-cover" 
            :src="hospital.cover" 
            mode="aspectFill"
            @error="handleImageError"
          />
          <view class="hospital-info">
            <text class="hospital-name">{{ hospital.name }}</text>
            <text class="hospital-address">{{ hospital.address }}</text>
            <text class="hospital-phone">{{ hospital.phone }}</text>
            <view v-if="hospital.rating" class="hospital-rating">
              <text class="rating-text">⭐ {{ hospital.rating }}</text>
            </view>
            <view v-if="hospital.emergency_24h" class="emergency-badge">
              <text>24小时急诊</text>
            </view>
          </view>
          <view class="visit-btn">
            <text>查看详情</text>
          </view>
        </view>
        <view v-if="hospitals.length === 0" class="empty-state">
          <text class="empty-text">暂无医院数据</text>
          <view class="retry-btn" @tap="loadHospitals">重新加载</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import { getHospitals } from '@/utils/api/medical'

export default {
  name: 'HospitalIndex',
  data() {
    return {
      hospitals: [],
      loading: false,
      error: null
    }
  },
  async onLoad() {
    await this.loadHospitals();
  },  methods: {
    async loadHospitals() {
      this.loading = true;
      try {
        const response = await getHospitals();
        console.log('医院API响应:', response);
        
        if (response && response.code === 200 && response.data && response.data.list) {
          // 处理API响应数据，确保字段映射正确
          this.hospitals = response.data.list.map(hospital => ({
            id: hospital.id,
            name: hospital.name,
            address: hospital.address,
            phone: hospital.phone,
            website: hospital.website,
            description: hospital.description,
            // API文档中使用logo_url和cover_url
            logo: hospital.logo_url || hospital.logo,
            cover: hospital.cover_url || hospital.cover,
            images: hospital.images || [],
            rating: hospital.rating || 0,
            services: hospital.services || [],
            business_hours: hospital.business_hours,
            emergency_24h: hospital.emergency_24h || false
          }));
          
          console.log('处理后的医院数据:', this.hospitals);
        } else {
          throw new Error('API响应格式异常');
        }
      } catch (error) {
        console.error('医院列表加载失败:', error);
        uni.showToast({
          title: '无法加载医院数据，请检查网络连接',
          icon: 'none',
          duration: 3000
        });
        
        // 设置空数组，不再使用Mock数据
        this.hospitals = [];
      } finally {
        this.loading = false;
      }    },
    handleBack() {
      uni.navigateBack();
    },
    navigateToDetail(hospital) {
      uni.navigateTo({
        url: `/pages/medical/detail?id=${hospital.id}`
      });
    },
    handleImageError(e) {
      console.warn('图片加载失败:', e);
      // 可以设置默认图片
    }
  }
}
</script>

<style scoped>
.hospital-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.nav-bar {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  position: relative;
  padding-top: calc(20rpx + var(--status-bar-height, 0));
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

.page-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 36rpx;
  font-weight: 600;
}

/* Logo轮播图 */
.logo-carousel-wrapper {
  height: 400rpx;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
}

.logo-carousel {
  width: 100%;
  height: 100%;
}

.logo-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40rpx;
}

.hospital-logo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.hospital-name-overlay {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 30rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

/* 医院列表 */
.hospital-list {
  padding: 30rpx;
  flex: 1;
}

.hospital-card {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.hospital-card:active {
  transform: scale(0.98);
}

.hospital-cover {
  width: 100%;
  height: 300rpx;
}

.hospital-info {
  padding: 30rpx;
}

.hospital-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.hospital-address {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.hospital-phone {
  font-size: 26rpx;
  color: #6F87FF;
  margin-bottom: 8rpx;
  display: block;
}

.hospital-rating {
  margin-bottom: 8rpx;
}

.rating-text {
  font-size: 24rpx;
  color: #ff9500;
}

.emergency-badge {
  background: #ff4757;
  color: white;
  font-size: 22rpx;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  display: inline-block;
  margin-bottom: 12rpx;
}

.visit-btn {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 0 0 20rpx 20rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.visit-btn:active {
  opacity: 0.8;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top: 4rpx solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: white;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  color: white;
}

.empty-text {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30rpx;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.retry-btn:active {
  background: rgba(255, 255, 255, 0.3);
}

/* 加载卡片样式 */
.loading-cards {
  padding: 30rpx;
}

.loading-card {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.loading-card-image {
  width: 100%;
  height: 300rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.loading-card-content {
  padding: 30rpx;
}

.loading-line {
  height: 32rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 16rpx;
  border-radius: 4rpx;
}

.loading-line.short {
  width: 70%;
}

.loading-line.shorter {
  width: 50%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>