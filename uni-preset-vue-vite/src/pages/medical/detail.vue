<template>
  <view class="detail-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="handleBack">
        <text class="back-text">←</text>
      </view>
      <text class="page-title" v-if="!loading">{{ hospital.name }}</text>
      <text class="page-title" v-else>加载中...</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载医院详情中...</text>
    </view>

    <!-- 医院详情内容 -->
    <template v-else>
      <!-- 医院基本信息 -->
      <view class="hospital-header">
        <image 
          class="hospital-logo" 
          :src="hospital.logo || hospital.logo_url" 
          mode="aspectFit"
          @error="handleImageError"
        />
        <view class="hospital-basic-info">
          <text class="hospital-name">{{ hospital.name }}</text>
          <view class="contact-info">
            <view class="info-item">
              <text class="info-label">地址：</text>
              <text class="info-value">{{ hospital.address }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">电话：</text>
              <text class="info-value phone-link" @tap="makeCall">{{ hospital.phone }}</text>
            </view>
            <view class="info-item" v-if="hospital.website">
              <text class="info-label">网站：</text>
              <text class="info-value website-link" @tap="openWebsite">{{ hospital.website }}</text>
            </view>
            <view class="info-item" v-if="hospital.rating">
              <text class="info-label">评分：</text>
              <text class="info-value rating">⭐ {{ hospital.rating }}</text>
            </view>
            <view class="info-item" v-if="hospital.business_hours">
              <text class="info-label">营业时间：</text>
              <text class="info-value">{{ hospital.business_hours }}</text>
            </view>
            <view v-if="hospital.emergency_24h" class="emergency-badge">
              <text>24小时急诊</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 医院图片轮播 -->
      <view class="hospital-carousel">
        <swiper 
          class="carousel" 
          indicator-dots 
          autoplay 
          circular 
          interval="3000" 
          duration="500"
        >
          <swiper-item v-for="(image, index) in hospital.images" :key="index" @tap="previewImage(image, index)">
            <image 
              class="carousel-image" 
              :src="typeof image === 'string' ? image : image.url" 
              mode="aspectFill"
              @error="handleImageError"
            />
          </swiper-item>
          
          <!-- 如果图片不足4张，显示占位图 -->
          <swiper-item v-if="hospital.images.length < 1">
            <image class="carousel-image placeholder" src="/static/images/hospital-placeholder.png" mode="aspectFill" />
          </swiper-item>
          <swiper-item v-if="hospital.images.length < 2">
            <image class="carousel-image placeholder" src="/static/images/hospital-placeholder.png" mode="aspectFill" />
          </swiper-item>
          <swiper-item v-if="hospital.images.length < 3">
            <image class="carousel-image placeholder" src="/static/images/hospital-placeholder.png" mode="aspectFill" />
          </swiper-item>
          <swiper-item v-if="hospital.images.length < 4">
            <image class="carousel-image placeholder" src="/static/images/hospital-placeholder.png" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>
      
      <!-- 医院介绍描述 -->
      <view class="hospital-description">
        <text class="description-title">医院介绍</text>
        <text class="description-content">{{ hospital.description || '暂无介绍' }}</text>
      </view>
    </template>
  </view>
</template>

<script>
import { getHospitalDetail } from '@/utils/api/medical'

export default {
  name: 'HospitalDetail',
  data() {
    return {
      hospital: {
        id: null,
        name: '',
        address: '',
        phone: '',
        website: '',
        logo_url: '',
        cover_url: '',
        images: [],
        description: '',
        services: [],
        doctors: [],
        rating: 0,
        business_hours: '',
        emergency_24h: false,
        parking: false,
        wifi: false
      },
      loading: true,
      hospitalId: null
    }
  },
  async onLoad(options) {
    if (options.id) {
      this.hospitalId = options.id;
      await this.loadHospitalDetail();
    } else {
      uni.showToast({
        title: '医院ID不能为空',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  methods: {
    async loadHospitalDetail() {
      this.loading = true;
      try {
        const response = await getHospitalDetail(this.hospitalId);
        console.log('医院详情API响应:', response);
        
        if (response && response.code === 200 && response.data) {
          // 导入图片处理工具
          const { formatImageUrl } = await import('@/utils/imageHelper');
          
          // 处理API响应数据
          this.hospital = {
            ...response.data,
            // 确保字段映射正确并处理图片URL
            logo: formatImageUrl(response.data.logo_url || response.data.logo),
            cover: formatImageUrl(response.data.cover_url || response.data.cover),
            // 处理图片数组，支持字符串数组和对象数组，同时格式化图片URL
            images: (response.data.images || []).map(img => {
              if (typeof img === 'string') return formatImageUrl(img);
              return formatImageUrl(img.url || img);
            })
          };
          
          console.log('处理后的医院详情:', this.hospital);
        } else if (response && response.code === 404) {
          uni.showToast({
            title: '医院不存在',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          throw new Error('API响应格式异常');
        }
      } catch (error) {
        console.error('医院详情加载失败:', error);
        uni.showToast({
          title: '无法加载医院详情，请检查网络连接',
          icon: 'none',
          duration: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    handleBack() {
      uni.navigateBack();
    },
    makeCall() {
      if (this.hospital.phone) {
        uni.makePhoneCall({
          phoneNumber: this.hospital.phone,
          fail: () => {
            uni.showToast({
              title: '拨号失败',
              icon: 'none'
            });
          }
        });
      }
    },
    openWebsite() {
      if (this.hospital.website) {
        // #ifdef H5
        window.open(this.hospital.website, '_blank');
        // #endif
        
        // #ifndef H5
        uni.setClipboardData({
          data: this.hospital.website,
          success: () => {
            uni.showToast({
              title: '网址已复制到剪贴板',
              icon: 'success'
            });
          }
        });
        // #endif
      }
    },
    previewImage(image, index) {
      // 这里不需要再处理图片URL，因为hospital.images已经在loadHospitalDetail中处理过了
      const images = this.hospital.images;
      
      uni.previewImage({
        urls: images,
        current: index
      });
    },
    handleImageError(e) {
      console.warn('图片加载失败:', e);
    }
  }
}
</script>

<style scoped>
.detail-container {
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

/* 加载状态 */
.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #e0e0e0;
  border-top: 4rpx solid #6F87FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 医院基本信息 */
.hospital-header {
  background-color: #fff;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.hospital-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 15rpx;
  margin-right: 30rpx;
  background-color: #f8f9fa;
}

.hospital-basic-info {
  flex: 1;
}

.hospital-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  min-width: 120rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.phone-link {
  color: #6F87FF;
}

.website-link {
  color: #6F87FF;
  text-decoration: underline;
}

.rating {
  color: #ff9500;
}

.emergency-badge {
  background: #ff4757;
  color: white;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 15rpx;
  display: inline-block;
  margin-top: 10rpx;
}

/* 通用section样式 */
.hospital-description,
.hospital-services,
.hospital-doctors,
.hospital-gallery,
.hospital-facilities {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title,
.description-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.description-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
}

/* 医院轮播图 */
.hospital-carousel {
  background-color: #fff;
  margin: 20rpx 0;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.carousel {
  height: 400rpx;
  width: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.carousel-image.placeholder {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #aaa;
  text-align: center;
}

.carousel .wx-swiper-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.5);
  margin-left: 8rpx;
  margin-right: 8rpx;
}

.carousel .wx-swiper-dot-active {
  width: 30rpx;
  background: #fff;
}

/* 服务项目 */
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.service-item {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 10rpx;
  border-left: 4rpx solid #6F87FF;
}

.service-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

/* 医生团队 */
.doctors-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.doctor-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 10rpx;
}

.doctor-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.doctor-title {
  font-size: 24rpx;
  color: #6F87FF;
  display: block;
  margin-bottom: 5rpx;
}

.doctor-experience {
  font-size: 24rpx;
  color: #666;
  display: block;
}

/* 医院图片画廊 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.image-item {
  position: relative;
  border-radius: 15rpx;
  overflow: hidden;
  aspect-ratio: 1;
}

.gallery-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.image-item:active .gallery-image {
  transform: scale(0.95);
}

.image-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 20rpx 15rpx 15rpx;
  font-size: 24rpx;
}

/* 设施信息 */
.facilities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.facility-item {
  background: #f0f9ff;
  color: #0369a1;
  padding: 12rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  border: 1rpx solid #e0f2fe;
}

.facility-item.emergency {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* 响应式设计 */

/* 响应式设计 */
@media (max-width: 750rpx) {
  .hospital-header {
    padding: 30rpx 20rpx;
  }
  
  .hospital-description,
  .hospital-services,
  .hospital-doctors,
  .hospital-gallery,
  .hospital-facilities {
    padding: 20rpx;
  }
  
  .image-grid,
  .services-grid {
    gap: 15rpx;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>