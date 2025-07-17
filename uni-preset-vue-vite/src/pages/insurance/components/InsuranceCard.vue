<template>
  <view class="insurance-card">
    <view class="card-left">
      <image class="insurance-image" :src="insurance.image" mode="aspectFill"></image>
    </view>
    <view class="card-right">
      <view class="insurance-name">{{ insurance.name }}</view>
      
      <view class="insurance-coverage">
        <text class="coverage-label">保障范围：</text>
        <text class="coverage-value">{{ insurance.coverage }}</text>
      </view>
      
      <view class="insurance-pet-types">
        <text class="pet-types-label">适用：</text>
        <text class="pet-types-value">{{ insurance.petTypes.join('、') }}</text>
      </view>
      
      <view class="insurance-company">
        <text class="company-label">承保：</text>
        <text class="company-value">{{ insurance.company }}</text>
      </view>
      
      <view class="insurance-price-row">
        <view class="insurance-price">
          <text class="price-value">¥{{ insurance.price }}</text>
          <text class="price-period">/{{ insurance.period }}</text>
          <text class="original-price">¥{{ insurance.originalPrice }}</text>
        </view>
        <view class="buy-btn">立即投保</view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 接收保险产品数据
const props = defineProps({
  insurance: {
    type: Object,
    required: true,
    default: () => ({})
  }
});
</script>

<style lang="scss">
.insurance-card {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.card-left {
  width: 180rpx;
  min-width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;
  overflow: hidden;
  
  .insurance-image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
  }
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.insurance-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.insurance-coverage,
.insurance-pet-types,
.insurance-company {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: flex;
  
  .coverage-label,
  .pet-types-label,
  .company-label {
    color: #999;
    min-width: 120rpx;
  }
  
  .coverage-value,
  .pet-types-value,
  .company-value {
    flex: 1;
  }
}

.insurance-coverage {
  .coverage-value {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.insurance-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
}

.insurance-price {
  display: flex;
  align-items: baseline;
  
  .price-value {
    font-size: 34rpx;
    font-weight: 600;
    color: #FF6B6B;
  }
  
  .price-period {
    font-size: 22rpx;
    color: #999;
    margin-left: 4rpx;
  }
  
  .original-price {
    font-size: 22rpx;
    color: #999;
    margin-left: 10rpx;
    text-decoration: line-through;
  }
}

.buy-btn {
  font-size: 24rpx;
  color: #fff;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
}
</style> 