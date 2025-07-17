<template>
  <view class="cart-container">
    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载购物车数据中...</text>
    </view>
    
    <!-- 购物车为空的提示 -->
    <view class="empty-cart" v-else-if="cartItems.length === 0">
      <image src="/static/images/empty-cart.png" mode="aspectFit" class="empty-cart-image"></image>
      <text class="empty-cart-text">购物车还是空的</text>
      <view class="go-shopping-btn" @click="goShopping">去购物</view>
    </view>
    
    <!-- 购物车商品列表 -->
    <view class="cart-content" v-else-if="!loading && cartItems.length > 0">
      <view class="cart-list">
        <view class="cart-item" v-for="(item, index) in cartItems" :key="item.id">
          <view class="checkbox" @click="toggleItemSelect(item.id)">
            <text :class="['checkbox-inner', item.selected ? 'checked' : '']"></text>
          </view>
          <image :src="item.image" mode="aspectFill" class="item-image"></image>
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-spec">{{ item.spec }}</text>
            <view class="item-bottom">
              <text class="item-price">¥{{ item.price.toFixed(2) }}</text>
              <view class="quantity-control">
                <text class="quantity-btn" @click="decreaseQuantity(item.id)">-</text>
                <text class="quantity-value">{{ item.quantity }}</text>
                <text class="quantity-btn" @click="increaseQuantity(item.id)">+</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部结算栏 -->
    <view class="settlement-bar" v-if="cartItems.length > 0">
      <view class="select-all" @click="toggleSelectAll">
        <view class="checkbox">
          <text :class="['checkbox-inner', isAllSelected ? 'checked' : '']"></text>
        </view>
        <text class="select-all-text">全选</text>
      </view>
      <view class="price-section">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <view class="checkout-btn" @click="checkout">
        <text>结算({{ selectedCount }})</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as cartUtils from '../../utils/cartUtils.js'
import { cartApi } from '../../utils/api'
import { USE_MOCK } from '../../utils/config'

// 购物车商品数据
const cartItems = ref([])
// 加载状态
const loading = ref(false)

// 计算所有商品是否全选
const isAllSelected = computed(() => {
  if (cartItems.value.length === 0) return false
  return cartItems.value.every(item => item.selected)
})

// 计算选中商品数量
const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

// 计算选中商品总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    if (item.selected) {
      return total + (item.price * item.quantity)
    }
    return total
  }, 0)
})

// 切换商品选中状态
const toggleItemSelect = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (!item) return
  
  if (USE_MOCK) {
    // Mock模式：使用本地存储
    cartUtils.updateCartItemSelected(itemId, !item.selected)
    loadCartData()
  } else {
    // API模式：调用后端接口
    const newStatus = !item.selected
    cartApi.updateCartItemSelected(itemId, newStatus)
      .then(() => {
        item.selected = newStatus
      })
      .catch(err => {
        console.error('更新选中状态失败:', err)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      })
  }
}

// 切换全选状态
const toggleSelectAll = () => {
  const newStatus = !isAllSelected.value
  
  if (USE_MOCK) {
    // Mock模式：使用本地存储
    cartItems.value.forEach(item => {
      cartUtils.updateCartItemSelected(item.id, newStatus)
    })
    loadCartData()
  } else {
    // API模式：调用后端接口
    cartApi.selectAllCartItems(newStatus)
      .then(() => {
        cartItems.value.forEach(item => {
          item.selected = newStatus
        })
      })
      .catch(err => {
        console.error('全选操作失败:', err)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      })
  }
}

// 增加商品数量
const increaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (!item || item.quantity >= 99) return
  
  const newQuantity = item.quantity + 1
  
  if (USE_MOCK) {
    // Mock模式：使用本地存储
    cartUtils.updateCartItemQuantity(itemId, newQuantity)
    loadCartData()
  } else {
    // API模式：调用后端接口
    cartApi.updateCartItem(itemId, newQuantity)
      .then(() => {
        item.quantity = newQuantity
      })
      .catch(err => {
        console.error('更新数量失败:', err)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
      })
  }
}

// 减少商品数量
const decreaseQuantity = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (!item) return
  
  if (item.quantity > 1) {
    const newQuantity = item.quantity - 1
    
    if (USE_MOCK) {
      // Mock模式：使用本地存储
      cartUtils.updateCartItemQuantity(itemId, newQuantity)
      loadCartData()
    } else {
      // API模式：调用后端接口
      cartApi.updateCartItem(itemId, newQuantity)
        .then(() => {
          item.quantity = newQuantity
        })
        .catch(err => {
          console.error('更新数量失败:', err)
          uni.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          })
        })
    }
  } else {
    // 数量为1时，询问是否删除
    uni.showModal({
      title: '提示',
      content: '确定要移除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          if (USE_MOCK) {
            // Mock模式：使用本地存储
            cartUtils.removeFromCart(itemId)
            loadCartData()
          } else {
            // API模式：调用后端接口
            cartApi.deleteCartItems([itemId])
              .then(() => {
                cartItems.value = cartItems.value.filter(item => item.id !== itemId)
              })
              .catch(err => {
                console.error('删除商品失败:', err)
                uni.showToast({
                  title: '删除失败，请重试',
                  icon: 'none'
                })
              })
          }
        }
      }
    })
  }
}

// 加载购物车数据
const loadCartData = () => {
  loading.value = true
  
  if (USE_MOCK) {
    // Mock模式：从本地存储获取数据
    try {
      const cartData = uni.getStorageSync('cartItems')
      console.log('本地存储中的购物车数据:', cartData)
      
      if (cartData) {
        const parsedData = JSON.parse(cartData)
        console.log('解析后的购物车数据:', parsedData)
        cartItems.value = parsedData
      } else {
        console.log('购物车为空')
        cartItems.value = []
      }
      
      console.log('购物车数据已加载, 数量:', cartItems.value.length, '详情:', cartItems.value)
    } catch (e) {
      console.error('加载购物车数据失败', e)
      cartItems.value = []
    } finally {
      loading.value = false
    }
  } else {
    // API模式：从后端获取数据
    cartApi.getCartList()
      .then(res => {
        console.log('后端购物车数据:', res)
        if (res.data && Array.isArray(res.data)) {
          // 为每个商品添加selected属性（后端返回的数据可能不包含这个字段）
          cartItems.value = res.data.map(item => ({
            ...item,
            selected: item.selected !== undefined ? item.selected : true
          }))
        } else {
          cartItems.value = []
        }
      })
      .catch(err => {
        console.error('获取购物车数据失败:', err)
        if (err.message && err.message.includes('401')) {
          // 用户未登录，跳转到登录页
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: '获取购物车数据失败',
            icon: 'none'
          })
          cartItems.value = []
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}

// 结算
const checkout = () => {
  if (selectedCount.value === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none'
    })
    return
  }
  
  // 将选中的商品保存为订单，并跳转到订单确认页面
  const selectedItems = cartItems.value.filter(item => item.selected)
  
  // 保存选中的商品到本地存储，以便订单确认页面读取
  try {
    uni.setStorageSync('selected_cart_items', JSON.stringify(selectedItems))
    console.log('已保存选中商品到本地存储:', selectedItems)
    
    // 跳转到订单确认页面
    uni.navigateTo({
      url: '/pages/order/confirm-order',
      success: () => {
        console.log('跳转到订单确认页面成功')
      },
      fail: (err) => {
        console.error('跳转到订单确认页面失败:', err)
        uni.showToast({
          title: '跳转失败，请重试',
          icon: 'none'
        })
      }
    })
  } catch (e) {
    console.error('保存订单数据失败:', e)
    uni.showToast({
      title: '系统繁忙，请重试',
      icon: 'none'
    })
  }
}

// 去购物
const goShopping = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

// 页面首次加载时获取数据
onMounted(() => {
  loadCartData()
})

// 定义页面的onShow生命周期钩子
defineExpose({
  onShow() {
    loadCartData()
    console.log('购物车页面显示，重新加载数据')
  }
})
</script>

<style lang="scss">
.cart-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 150rpx;
}

// 加载状态样式
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #6F87FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 30rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 30rpx;
  
  .empty-cart-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-cart-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .go-shopping-btn {
    padding: 20rpx 60rpx;
    background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
  }
}

.cart-content {
  flex: 1;
}

.cart-list {
  padding: 20rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 1rpx solid #ddd;
  margin-right: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .checkbox-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &.checked {
      background-color: #6F87FF;
      
      &::after {
        content: '';
        width: 20rpx;
        height: 10rpx;
        border-left: 4rpx solid #fff;
        border-bottom: 4rpx solid #fff;
        transform: rotate(-45deg) translate(2rpx, -2rpx);
      }
    }
  }
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 32rpx;
  color: #FF6B6B;
  font-weight: 500;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  color: #333;
  background-color: #f5f5f5;
}

.quantity-value {
  width: 80rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  border-left: 1rpx solid #eee;
  border-right: 1rpx solid #eee;
}

.settlement-bar {
  position: fixed;
  bottom: 50rpx;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding: 0 20rpx;
  border-radius: 20rpx;
  margin: 0 20rpx;
  z-index: 99;
}

.select-all {
  display: flex;
  align-items: center;
}

.select-all-text {
  font-size: 28rpx;
  color: #333;
  margin-left: 10rpx;
}

.price-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  margin-right: 20rpx;
}

.total-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  color: #FF6B6B;
  font-weight: bold;
}

.checkout-btn {
  width: 220rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FF7043 0%, #FF5252 100%);
  color: #fff;
  font-size: 28rpx;
  border-radius: 40rpx;
}
</style> 