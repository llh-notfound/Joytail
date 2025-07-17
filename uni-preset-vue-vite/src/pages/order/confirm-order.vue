<template>
  <view class="confirm-order-container">
    <!-- 收货地址 -->
    <view class="address-section" @click="goToAddressManagement">
      <view class="address-info" v-if="selectedAddress">
        <view class="address-header">
          <text class="recipient-name">{{ selectedAddress.name }}</text>
          <text class="recipient-phone">{{ selectedAddress.phone }}</text>
        </view>
        <text class="address-detail">{{ selectedAddress.province + selectedAddress.city + selectedAddress.district + selectedAddress.detailAddress }}</text>
      </view>
      <view class="no-address" v-else>
        <text>请选择收货地址</text>
      </view>
      <view class="address-right">
        <text class="iconfont icon-right"></text>
      </view>
    </view>
    
    <!-- 订单商品列表 -->
    <view class="order-goods-section">
      <view class="section-title">商品信息</view>
      <view class="goods-list">
        <view class="goods-item" v-for="(item, index) in orderItems" :key="index">
          <image :src="item.image" mode="aspectFill" class="goods-image"></image>
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-spec">{{ item.spec }}</text>
            <view class="goods-price-quantity">
              <text class="goods-price">¥{{ item.price.toFixed(2) }}</text>
              <text class="goods-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
          <text class="goods-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 支付方式选择 -->
    <view class="payment-section">
      <text class="section-title">支付方式</text>
      <view class="payment-options">
        <view 
          class="payment-option" 
          v-for="(option, index) in paymentOptions" 
          :key="index"
          @click="selectPayment(option.id)"
        >
          <view class="option-left">
            <text class="payment-icon" :class="option.icon"></text>
            <text class="payment-name">{{ option.name }}</text>
          </view>
          <view class="option-radio" :class="{ active: selectedPayment === option.id }">
            <view class="radio-inner" v-if="selectedPayment === option.id"></view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 订单金额信息 -->
    <view class="order-amount-section">
      <view class="amount-item">
        <text>商品金额</text>
        <text>¥{{ totalGoodsAmount.toFixed(2) }}</text>
      </view>
      <view class="amount-item">
        <text>运费</text>
        <text>¥{{ shippingFee.toFixed(2) }}</text>
      </view>
      <view class="amount-total">
        <text>实付金额</text>
        <text class="final-price">¥{{ finalAmount.toFixed(2) }}</text>
      </view>
    </view>
    
    <!-- 底部提交栏 -->
    <view class="submit-bar">
      <view class="total-section">
        <text class="total-label">合计:</text>
        <text class="total-amount">¥{{ finalAmount.toFixed(2) }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orderApi } from '../../utils/api'

// 订单商品
const orderItems = ref([])
// 是否来自待付款订单
const fromPaymentPending = ref(false)
// 原始订单数据（从待付款订单来）
const originalOrderData = ref(null)

// 收货地址
const selectedAddress = ref(null)

// 支付方式
const paymentOptions = [
  { id: 'wechat', name: '微信支付', icon: 'icon-wechat' },
  { id: 'alipay', name: '支付宝支付', icon: 'icon-alipay' }
]
const selectedPayment = ref('wechat')

// 运费
const shippingFee = ref(10)

// 计算商品总金额
const totalGoodsAmount = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

// 计算最终支付金额
const finalAmount = computed(() => {
  return totalGoodsAmount.value + shippingFee.value
})

// 跳转到地址管理页面
const goToAddressManagement = () => {
  uni.navigateTo({
    url: '/pages/account/address'
  })
}

// 选择支付方式
const selectPayment = (paymentId) => {
  selectedPayment.value = paymentId
}

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return
  }
  
  console.log('🛒 [确认订单] 开始提交订单')
  console.log('🛒 [确认订单] 订单商品:', orderItems.value)
  console.log('🛒 [确认订单] 是否来自待付款:', fromPaymentPending.value)
  
  uni.showLoading({
    title: fromPaymentPending.value ? '支付中...' : '提交中...'
  })
  
  try {
    if (fromPaymentPending.value) {
      // 来自待付款订单的支付流程
      if (!originalOrderData.value || !originalOrderData.value.orderNumber) {
        throw new Error('缺少订单信息')
      }
      
      console.log('🛒 [确认订单] 执行支付操作，订单号:', originalOrderData.value.orderNumber)
      
      // 调用支付API
      const paymentResult = await orderApi.payOrder(
        originalOrderData.value.orderNumber, 
        selectedPayment.value,
        'h5'
      )
      
      console.log('✅ [确认订单] 支付成功:', paymentResult)
      
      uni.hideLoading()
      uni.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            // 发送支付成功事件通知
            if (originalOrderData.value && originalOrderData.value.orderIndex !== undefined) {
              uni.$emit('orderPaid', {
                orderIndex: originalOrderData.value.orderIndex
              })
            }
            // 返回未付款订单列表页面
            uni.navigateBack()
          }, 2000)
        }
      })
    } else {
      // 新订单创建流程
      console.log('🛒 [确认订单] 创建新订单')
      
      // 从本地存储获取选中的购物车商品ID
      const selectedItemsStr = uni.getStorageSync('selected_cart_items')
      if (!selectedItemsStr) {
        throw new Error('没有找到选中的商品')
      }
      
      const selectedItems = JSON.parse(selectedItemsStr)
      console.log('🛒 [确认订单] 选中的购物车商品:', selectedItems)
      
      // 构建购物车项ID数组（这里暂时使用商品ID模拟）
      const cartItemIds = selectedItems.map(item => item.id.toString())
      
      // 调用创建订单API
      const orderResult = await orderApi.createOrder(
        cartItemIds,
        selectedAddress.value.id.toString(),
        '' // 订单留言暂时为空
      )
      
      console.log('✅ [确认订单] 订单创建成功:', orderResult)
      
      // 清除购物车中已下单的商品
      uni.removeStorageSync('selected_cart_items')
      
      uni.hideLoading()
      uni.showToast({
        title: '订单提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            // 跳转到订单列表页面
            uni.redirectTo({
              url: '/pages/order/goods-list'
            })
          }, 2000)
        }
      })
    }
  } catch (err) {
    console.error('❌ [确认订单] 提交失败:', err)
    uni.hideLoading()
    
    let errorMessage = '提交失败，请重试'
    if (err.message) {
      if (err.message.includes('401')) {
        errorMessage = '请先登录'
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }, 1500)
      } else if (err.message.includes('400')) {
        errorMessage = err.data?.message || '参数错误，请检查订单信息'
      } else {
        errorMessage = err.message
      }
    }
    
    uni.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 3000
    })
  }
}

// 页面加载时获取数据
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.$page?.options
  
  if (options) {
    // 检查是否从待付款页面跳转而来
    if (options.fromPaymentPending) {
      fromPaymentPending.value = true
      
      // 解析传递的订单数据
      try {
        if (options.orderData) {
          const decodedOrderData = JSON.parse(decodeURIComponent(options.orderData))
          originalOrderData.value = decodedOrderData
          
          // 设置订单商品
          const goodsInfo = decodedOrderData.goodsInfo
          if (goodsInfo) {
            orderItems.value = [{
              id: goodsInfo.id,
              name: goodsInfo.name,
              image: goodsInfo.image,
              spec: goodsInfo.specs,
              price: goodsInfo.price,
              quantity: goodsInfo.quantity
            }]
          }
          
          console.log('已加载来自待付款订单的数据:', orderItems.value)
        }
      } catch (e) {
        console.error('解析订单数据失败:', e)
      }
    } else {
      // 从购物车过来的情况
      try {
        const selectedItemsStr = uni.getStorageSync('selected_cart_items')
        if (selectedItemsStr) {
          orderItems.value = JSON.parse(selectedItemsStr)
        }
      } catch (e) {
        console.error('获取订单商品数据失败', e)
      }
    }
  } else {
    // 从购物车过来的情况
    try {
      const selectedItemsStr = uni.getStorageSync('selected_cart_items')
      if (selectedItemsStr) {
        orderItems.value = JSON.parse(selectedItemsStr)
      }
    } catch (e) {
      console.error('获取订单商品数据失败', e)
    }
  }
  
  // 获取默认地址（模拟数据）
  selectedAddress.value = {
    id: 1,
    name: '张三',
    phone: '138****1234',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detailAddress: '科技园1号楼101室',
    isDefault: true
  }
})

</script>

<style lang="scss">
.confirm-order-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 地址部分 */
.address-section {
  display: flex;
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.address-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.address-header {
  display: flex;
  margin-bottom: 10rpx;
}

.recipient-name {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-right: 20rpx;
}

.recipient-phone {
  font-size: 28rpx;
  color: #666;
}

.address-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
}

.no-address {
  flex: 1;
  font-size: 28rpx;
  color: #999;
}

.address-right {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}

/* 订单商品部分 */
.order-goods-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.goods-item {
  display: flex;
  align-items: center;
}

.goods-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.goods-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.goods-spec {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
}

.goods-price-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-price {
  font-size: 28rpx;
  color: #FF6B6B;
}

.goods-quantity {
  font-size: 26rpx;
  color: #666;
}

.goods-subtotal {
  font-size: 28rpx;
  color: #FF6B6B;
  font-weight: 500;
}

/* 支付方式部分 */
.payment-section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-label {
  font-size: 28rpx;
  color: #333;
}

.section-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}

.payment-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid #eee;
}

.option-left {
  display: flex;
  align-items: center;
}

.payment-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.payment-name {
  font-size: 28rpx;
  color: #333;
}

.option-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}

.option-radio.active {
  border-color: #6F87FF;
}

.radio-inner {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #6F87FF;
}

/* 订单金额信息 */
.order-amount-section {
  background-color: #fff;
  padding: 30rpx;
  margin: 20rpx 0;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  font-size: 28rpx;
  color: #666;
}

.amount-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15rpx;
  border-top: 1px solid #eee;
  font-size: 28rpx;
  color: #333;
}

.final-price {
  font-size: 32rpx;
  color: #FF6B6B;
  font-weight: bold;
}

/* 底部提交栏 */
.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.total-section {
  flex: 1;
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.total-amount {
  font-size: 36rpx;
  color: #FF6B6B;
  font-weight: bold;
}

.submit-btn {
  width: 240rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5252 100%);
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 