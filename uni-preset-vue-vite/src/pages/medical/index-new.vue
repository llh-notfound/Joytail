<template>
  <view class="hospital-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">优质医院</text>
    </view>
    
    <!-- 医院Logo轮播图 -->
    <view class="logo-carousel-wrapper">
      <swiper 
        class="logo-carousel" 
        indicator-dots 
        autoplay 
        interval="3000" 
        duration="500"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#6F87FF"
      >
        <swiper-item v-for="hospital in hospitals" :key="hospital.id">
          <view class="logo-slide">
            <image 
              class="hospital-logo" 
              :src="hospital.logo" 
              mode="aspectFit"
            ></image>
            <text class="hospital-name-overlay">{{ hospital.name }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 医院封面介绍 -->
    <view class="hospital-list">
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
        ></image>
        <view class="hospital-info">
          <text class="hospital-name">{{ hospital.name }}</text>
          <text class="hospital-address">{{ hospital.address }}</text>
          <text class="hospital-phone">{{ hospital.phone }}</text>
        </view>
        <view class="visit-btn">
          <text>查看详情</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const hospitals = ref([
  {
    id: 1,
    name: '香港宠物医院',
    address: '香港中环干诺道中200号',
    phone: '+852 2234 5678',
    website: 'https://www.hkpethospital.com',
    logo: 'https://via.placeholder.com/200x200/6F87FF/FFFFFF?text=HK+Pet',
    cover: 'https://via.placeholder.com/750x300/e3f2fd/1976d2?text=香港宠物医院',
    images: [
      'https://via.placeholder.com/400x400/f3e5f5/7b1fa2?text=诊疗室',
      'https://via.placeholder.com/400x400/e8f5e8/388e3c?text=等候区',
      'https://via.placeholder.com/400x400/fff3e0/f57c00?text=手术室',
      'https://via.placeholder.com/400x400/fce4ec/c2185b?text=检查室'
    ],
    description: '香港宠物医院是一家专业的宠物医疗机构，拥有先进的医疗设备和经验丰富的兽医团队。我们致力于为您的宠物提供最优质的医疗服务，包括常规检查、疫苗接种、手术治疗等。'
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
    description: '旺角宠物诊所位于香港繁华地段，交通便利。我们提供全面的宠物医疗服务，包括内科、外科、皮肤科等专业科室。诊所环境舒适，设备先进，是您宠物健康的守护者。'
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
    description: '铜锣湾动物医院是香港知名的宠物医疗中心，拥有24小时急诊服务。我们的专业团队致力于为宠物提供最好的医疗护理，从预防保健到复杂手术，我们都能为您的爱宠提供专业服务。'
  }
]);

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 跳转到医院详情页
const navigateToDetail = (hospital) => {
  uni.navigateTo({
    url: `/pages/medical/detail?id=${hospital.id}`
  });
};

// 页面加载
onMounted(() => {
  console.log('医院页面加载完成');
});
</script>

<style lang="scss" scoped>
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
  margin-bottom: 20rpx;
  display: block;
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

/* 响应式设计 */
@media (max-width: 750rpx) {
  .hospital-card {
    margin: 0 20rpx 20rpx;
  }
  
  .hospital-list {
    padding: 20rpx;
  }
}
</style>
