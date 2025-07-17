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

      <!-- 医院介绍描述 -->
      <view class="hospital-description" v-if="hospital.description">
        <text class="description-title">医院介绍</text>
        <text class="description-content">{{ hospital.description }}</text>
      </view>

      <!-- 服务项目 -->
      <view class="hospital-services" v-if="hospital.services && hospital.services.length > 0">
        <text class="section-title">服务项目</text>
        <view class="services-grid">
          <view v-for="(service, index) in hospital.services" :key="index" class="service-item">
            <text class="service-name">{{ typeof service === 'string' ? service : service.name }}</text>
            <text v-if="typeof service === 'object' && service.description" class="service-desc">{{ service.description }}</text>
          </view>
        </view>
      </view>

      <!-- 医生团队 -->
      <view class="hospital-doctors" v-if="hospital.doctors && hospital.doctors.length > 0">
        <text class="section-title">医生团队</text>
        <view class="doctors-grid">
          <view v-for="doctor in hospital.doctors" :key="doctor.id" class="doctor-item">
            <image v-if="doctor.avatar" class="doctor-avatar" :src="doctor.avatar" mode="aspectFill" />
            <view class="doctor-info">
              <text class="doctor-name">{{ doctor.name }}</text>
              <text v-if="doctor.title" class="doctor-title">{{ doctor.title }}</text>
              <text v-if="doctor.experience" class="doctor-experience">{{ doctor.experience }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 医院环境图片 -->
      <view class="hospital-gallery" v-if="hospital.images && hospital.images.length > 0">
        <text class="section-title">医院环境</text>
        <view class="image-grid">
          <view 
            v-for="(image, index) in hospital.images" 
            :key="index"
            class="image-item"
            @tap="previewImage(image, index)"
          >
            <image 
              class="gallery-image" 
              :src="typeof image === 'string' ? image : image.url" 
              mode="aspectFill"
              @error="handleImageError"
            />
            <view v-if="typeof image === 'object' && image.title" class="image-title">
              <text>{{ image.title }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 设施信息 -->
      <view class="hospital-facilities">
        <text class="section-title">设施服务</text>
        <view class="facilities-list">
          <view v-if="hospital.emergency_24h" class="facility-item emergency">
            <text>🚨 24小时急诊</text>
          </view>
          <view v-if="hospital.parking" class="facility-item">
            <text>🅿️ 停车位</text>
          </view>
          <view v-if="hospital.wifi" class="facility-item">
            <text>📶 免费WiFi</text>
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn call-btn" @tap="makeCall">
          <text class="btn-icon">📞</text>
          <text class="btn-text">拨打电话</text>
        </view>
        <view class="action-btn visit-btn" @tap="openWebsite" v-if="hospital.website">
          <text class="btn-icon">🌐</text>
          <text class="btn-text">访问官网</text>
        </view>
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
          // 处理API响应数据
          this.hospital = {
            ...response.data,
            // 确保字段映射正确
            logo: response.data.logo_url || response.data.logo,
            cover: response.data.cover_url || response.data.cover,
            // 处理图片数组，支持字符串数组和对象数组
            images: (response.data.images || []).map(img => {
              if (typeof img === 'string') return img;
              return img.url || img;
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
      const images = this.hospital.images.map(img => {
        if (typeof img === 'string') return img;
        return img.url || img;
      });
      
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

/* 底部操作按钮 */
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
  display: flex;
  gap: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.action-btn {
  flex: 1;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
  text-align: center;
  padding: 25rpx 20rpx;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.call-btn {
  background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 28rpx;
}

.action-btn:active {
  opacity: 0.8;
  transform: scale(0.98);
}

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
  
  .action-buttons {
    padding: 15rpx 20rpx;
    padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
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
