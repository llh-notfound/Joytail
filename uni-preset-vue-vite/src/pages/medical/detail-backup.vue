<template>
  <view class="detail-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">{{ hospital.name }}</text>
    </view>

    <!-- 医院基本信息 -->
    <view class="hospital-header">
      <image 
        class="hospital-logo" 
        :src="hospital.logo" 
        mode="aspectFit"
      ></image>
      <view class="hospital-basic-info">
        <text class="hospital-name">{{ hospital.name }}</text>
        <view class="contact-info">
          <view class="info-item">
            <text class="info-label">地址：</text>
            <text class="info-value">{{ hospital.address }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">电话：</text>
            <text class="info-value" @tap="makeCall">{{ hospital.phone }}</text>
          </view>
          <view class="info-item" v-if="hospital.website">
            <text class="info-label">网站：</text>
            <text class="info-value website-link" @tap="openWebsite">{{ hospital.website }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 医院介绍描述 -->
    <view class="hospital-description">
      <text class="description-title">医院介绍</text>
      <text class="description-content">{{ hospital.description }}</text>
    </view>

    <!-- 医院介绍图片 -->
    <view class="hospital-gallery">
      <text class="gallery-title">医院环境</text>
      <view class="image-grid">
        <view 
          v-for="(image, index) in hospital.images" 
          :key="index"
          class="image-item"
          @tap="previewImage(image, index)"
        >
          <image 
            class="gallery-image" 
            :src="image" 
            mode="aspectFill"
          ></image>
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
            images: response.data.images || []
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
    images: [
      'https://via.placeholder.com/400x400/f3e5f5/7b1fa2?text=诊疗室',
      'https://via.placeholder.com/400x400/e8f5e8/388e3c?text=等候区',
      'https://via.placeholder.com/400x400/fff3e0/f57c00?text=手术室',
      'https://via.placeholder.com/400x400/fce4ec/c2185b?text=检查室'
    ],
    description: '香港宠物医院是一家专业的宠物医疗机构，拥有先进的医疗设备和经验丰富的兽医团队。我们致力于为您的宠物提供最优质的医疗服务，包括常规检查、疫苗接种、手术治疗等。医院采用国际先进的诊疗标准，配备了数字化X光机、超声波设备、生化分析仪等现代化设备，确保为每一位宠物患者提供准确的诊断和有效的治疗。'
  },
  {
    id: 2,
    name: '旺角宠物诊所',
    address: '香港旺角弥敦道123号',
    phone: '+852 2345 6789',
    website: 'https://www.mkpetclinic.com',
    logo: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=MK+Clinic',
    cover: 'https://via.placeholder.com/750x300/e8f5e8/2e7d32?text=旺角宠物诊所',
    images: [
      'https://via.placeholder.com/400x400/e1f5fe/0277bd?text=接待区',
      'https://via.placeholder.com/400x400/f1f8e9/558b2f?text=诊断室',
      'https://via.placeholder.com/400x400/fef7e0/ef6c00?text=药房',
      'https://via.placeholder.com/400x400/f3e5f5/8e24aa?text=美容室'
    ],
    description: '旺角宠物诊所位于香港繁华地段，交通便利。我们提供全面的宠物医疗服务，包括内科、外科、皮肤科等专业科室。诊所环境舒适，设备先进，是您宠物健康的守护者。我们的专业团队由资深兽医师组成，每位医生都有丰富的临床经验，能够处理各种复杂的宠物疾病。诊所还提供宠物美容、寄养等增值服务。'
  },
  {
    id: 3,
    name: '铜锣湾动物医院',
    address: '香港铜锣湾轩尼诗道456号',
    phone: '+852 3456 7890',
    website: 'https://www.cwbanimalhospital.com',
    logo: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=CWB+Animal',
    cover: 'https://via.placeholder.com/750x300/fff3e0/e65100?text=铜锣湾动物医院',
    images: [
      'https://via.placeholder.com/400x400/e8eaf6/5e35b1?text=急诊室',
      'https://via.placeholder.com/400x400/e0f2f1/00695c?text=监护室',
      'https://via.placeholder.com/400x400/fce4ec/ad1457?text=化验室',
      'https://via.placeholder.com/400x400/f9fbe7/827717?text=康复室'
    ],
    description: '铜锣湾动物医院是香港知名的宠物医疗中心，拥有24小时急诊服务。我们的专业团队致力于为宠物提供最好的医疗护理，从预防保健到复杂手术，我们都能为您的爱宠提供专业服务。医院配备了完善的手术室、重症监护室、化验室等设施，并与多家国际宠物医疗机构建立合作关系，确保能够为宠物提供世界级的医疗服务。'
  }
];

// 页面加载时获取医院ID
onLoad((options) => {
  if (options.id) {
    const hospitalData = hospitalsData.find(h => h.id == options.id);
    if (hospitalData) {
      hospital.value = hospitalData;
    }
  }
});

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 拨打电话
const makeCall = () => {
  if (hospital.value.phone) {
    uni.makePhoneCall({
      phoneNumber: hospital.value.phone,
      fail: () => {
        uni.showToast({
          title: '拨号失败',
          icon: 'none'
        });
      }
    });
  }
};

// 打开网站
const openWebsite = () => {
  if (hospital.value.website) {
    // #ifdef H5
    window.open(hospital.value.website, '_blank');
    // #endif
    
    // #ifndef H5
    uni.setClipboardData({
      data: hospital.value.website,
      success: () => {
        uni.showToast({
          title: '网址已复制到剪贴板',
          icon: 'success'
        });
      }
    });
    // #endif
  }
};

// 预览图片
const previewImage = (currentImage, index) => {
  uni.previewImage({
    urls: hospital.value.images,
    current: index
  });
};

onMounted(() => {
  console.log('医院详情页加载完成', hospital.value);
});
</script>

<style lang="scss" scoped>
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
  top: calc(20rpx + var(--status-bar-height, 0));
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.icon-back {
  font-size: 32rpx;
  color: #fff;
}

.page-title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 36rpx;
  font-weight: 600;
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
  gap: 15rpx;
}

.info-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  min-width: 80rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.website-link {
  color: #6F87FF;
  text-decoration: underline;
}

/* 医院介绍 */
.hospital-description {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

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

/* 医院图片画廊 */
.hospital-gallery {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 120rpx;
}

.gallery-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

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
  .hospital-gallery {
    padding: 20rpx;
  }
  
  .action-buttons {
    padding: 15rpx 20rpx;
    padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
  }
  
  .image-grid {
    gap: 15rpx;
  }
}
</style>
