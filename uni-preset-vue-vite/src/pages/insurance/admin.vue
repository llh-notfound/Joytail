<template>
  <view class="admin-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">保险产品管理</text>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-text">加载保险产品中...</view>
    </view>
    
    <!-- 产品列表 -->
    <view v-else class="product-list">
      <view 
        v-for="product in products" 
        :key="product.id" 
        class="product-item"
      >
        <view class="product-basic-info">
          <image class="product-image" :src="product.image" mode="aspectFill"></image>
          <view class="product-details">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-company">{{ product.company }}</text>
          </view>
          <view class="expand-btn" @click="toggleExpand(product)">
            <text class="iconfont" :class="product.expanded ? 'icon-up' : 'icon-down'"></text>
          </view>
        </view>
        
        <!-- 展开的详情内容 -->
        <view v-if="product.expanded" class="product-expanded-content">
          <!-- 保险条款图片 -->
          <view class="image-section">
            <text class="section-title">条款说明图片</text>
            <image 
              v-if="product.termsImage" 
              class="terms-image" 
              :src="product.termsImage" 
              mode="widthFix" 
              @click="previewImage(product.termsImage)"
            ></image>
            <view v-else class="no-image">
              <text class="no-image-text">暂无条款图片</text>
            </view>
            <view class="upload-btn" @click="chooseImage('terms', product.id)">
              {{ product.termsImage ? '更新图片' : '上传图片' }}
            </view>
          </view>
          
          <!-- 理赔流程图片 -->
          <view class="image-section">
            <text class="section-title">理赔流程图片</text>
            <image 
              v-if="product.claimProcessImage" 
              class="claim-image" 
              :src="product.claimProcessImage" 
              mode="widthFix"
              @click="previewImage(product.claimProcessImage)"
            ></image>
            <view v-else class="no-image">
              <text class="no-image-text">暂无流程图片</text>
            </view>
            <view class="upload-btn" @click="chooseImage('claim', product.id)">
              {{ product.claimProcessImage ? '更新图片' : '上传图片' }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../utils/api';

// 状态变量
const isLoading = ref(true);
const products = ref([]);
const currentImageType = ref('');
const currentProductId = ref(null);

// 获取保险产品列表
const loadProducts = async () => {
  isLoading.value = true;
  try {
    const response = await api.insurance.getInsuranceProducts({
      page: 1,
      pageSize: 100 // 获取所有产品
    });
    
    if (response.code === 200 && response.data && response.data.list) {
      // 为每个产品添加expanded属性，用于控制展开/收起
      products.value = response.data.list.map(product => ({
        ...product,
        expanded: false
      }));
    } else {
      uni.showToast({
        title: '获取产品列表失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('获取产品列表错误:', error);
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

// 切换产品详情展开/收起
const toggleExpand = (product) => {
  product.expanded = !product.expanded;
};

// 选择图片
const chooseImage = (type, productId) => {
  currentImageType.value = type;
  currentProductId.value = productId;
  
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uploadImage(tempFilePath, type, productId);
    },
    fail: () => {
      console.log('用户取消选择图片');
    }
  });
};

// 上传图片
const uploadImage = async (filePath, type, productId) => {
  uni.showLoading({
    title: '正在上传...',
    mask: true
  });
  
  try {
    let response;
    if (type === 'terms') {
      response = await api.insurance.uploadTermsImage(productId, filePath);
    } else if (type === 'claim') {
      response = await api.insurance.uploadClaimProcessImage(productId, filePath);
    }
    
    if (response && response.code === 200) {
      uni.showToast({
        title: '上传成功',
        icon: 'success'
      });
      
      // 更新产品列表中的图片URL
      const productIndex = products.value.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        if (type === 'terms') {
          products.value[productIndex].termsImage = response.data.imageUrl;
        } else if (type === 'claim') {
          products.value[productIndex].claimProcessImage = response.data.imageUrl;
        }
      }
    } else {
      uni.showToast({
        title: response?.message || '上传失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('上传图片错误:', error);
    uni.showToast({
      title: '上传失败，请重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: 0
  });
};

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 初始化
onMounted(() => {
  loadProducts();
});
</script>

<style lang="scss">
.admin-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
}

.nav-bar {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  color: #fff;
  
  .back-btn {
    padding: 10rpx;
    margin-right: 20rpx;
    
    .iconfont {
      font-size: 36rpx;
    }
  }
  
  .page-title {
    font-size: 32rpx;
    font-weight: 500;
  }
}

.loading-container {
  padding: 50rpx 0;
  text-align: center;
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
}

.product-list {
  padding: 20rpx;
}

.product-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.product-basic-info {
  padding: 24rpx;
  display: flex;
  align-items: center;
}

.product-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.product-details {
  flex: 1;
  
  .product-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }
  
  .product-company {
    font-size: 24rpx;
    color: #666;
  }
}

.expand-btn {
  padding: 10rpx;
  
  .iconfont {
    font-size: 28rpx;
    color: #666;
  }
}

.product-expanded-content {
  padding: 0 24rpx 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.image-section {
  margin-top: 20rpx;
  
  .section-title {
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .terms-image,
  .claim-image {
    width: 100%;
    border-radius: 8rpx;
    border: 1rpx solid #eee;
  }
  
  .no-image {
    height: 200rpx;
    background-color: #f9f9f9;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    
    .no-image-text {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .upload-btn {
    margin-top: 16rpx;
    background-color: #6F87FF;
    color: #fff;
    padding: 16rpx 0;
    border-radius: 8rpx;
    text-align: center;
    font-size: 26rpx;
  }
}
</style>
