/**
 * 购物车工具函数，用于在本地存储中管理购物车数据
 */

// 从本地存储获取购物车数据
export const getCartItems = () => {
  try {
    const cartData = uni.getStorageSync('cartItems')
    return cartData ? JSON.parse(cartData) : []
  } catch (e) {
    console.error('获取购物车数据失败', e)
    return []
  }
}

// 保存购物车数据到本地存储
export const saveCartItems = (cartItems) => {
  try {
    const cartData = JSON.stringify(cartItems)
    console.log('保存购物车数据:', cartData)
    
    // 先清除旧数据，再保存新数据
    uni.removeStorageSync('cartItems')
    uni.setStorageSync('cartItems', cartData)
    
    // 验证数据是否保存成功
    const savedData = uni.getStorageSync('cartItems')
    const isSuccess = !!savedData
    console.log('保存后验证:', isSuccess ? '成功' : '失败', '保存的数据:', savedData)
    
    return isSuccess
  } catch (e) {
    console.error('保存购物车数据失败', e)
    return false
  }
}

// 添加商品到购物车
export const addToCart = (product, quantity = 1) => {
  try {
    console.log('添加商品到购物车:', product, '数量:', quantity)
    let cartItems = getCartItems()
    console.log('当前购物车商品:', cartItems)
    
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id)
    
    if (existingItemIndex > -1) {
      console.log('商品已存在，更新数量')
      // 如果商品已存在，增加数量
      cartItems[existingItemIndex].quantity += quantity
    } else {
      console.log('商品不存在，添加新商品')
      // 如果商品不存在，添加新商品
      cartItems.push({
        id: product.id,
        name: product.name,
        spec: product.spec || '',
        price: product.price,
        quantity: quantity,
        selected: true,
        image: product.image
      })
    }
    
    // 保存更新后的购物车商品
    const saveResult = saveCartItems(cartItems)
    console.log('保存结果:', saveResult, '保存后的购物车:', cartItems)
    return saveResult
  } catch (e) {
    console.error('添加商品到购物车失败', e)
    return false
  }
}

// 从购物车移除商品
export const removeFromCart = (productId) => {
  try {
    let cartItems = getCartItems()
    const newCartItems = cartItems.filter(item => item.id !== productId)
    saveCartItems(newCartItems)
    return true
  } catch (e) {
    console.error('从购物车移除商品失败', e)
    return false
  }
}

// 更新购物车商品数量
export const updateCartItemQuantity = (productId, quantity) => {
  try {
    let cartItems = getCartItems()
    const itemIndex = cartItems.findIndex(item => item.id === productId)
    
    if (itemIndex > -1) {
      cartItems[itemIndex].quantity = quantity
      saveCartItems(cartItems)
      return true
    }
    return false
  } catch (e) {
    console.error('更新购物车商品数量失败', e)
    return false
  }
}

// 更新购物车商品选中状态
export const updateCartItemSelected = (productId, selected) => {
  try {
    let cartItems = getCartItems()
    const itemIndex = cartItems.findIndex(item => item.id === productId)
    
    if (itemIndex > -1) {
      cartItems[itemIndex].selected = selected
      saveCartItems(cartItems)
      return true
    }
    return false
  } catch (e) {
    console.error('更新购物车商品选中状态失败', e)
    return false
  }
}

// 获取购物车商品总数
export const getCartItemCount = () => {
  try {
    const cartItems = getCartItems()
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  } catch (e) {
    console.error('获取购物车商品总数失败', e)
    return 0
  }
}

// 获取购物车选中商品总价
export const getCartTotalPrice = () => {
  try {
    const cartItems = getCartItems()
    return cartItems.reduce((total, item) => {
      if (item.selected) {
        return total + (item.price * item.quantity)
      }
      return total
    }, 0)
  } catch (e) {
    console.error('获取购物车选中商品总价失败', e)
    return 0
  }
}

// 清空购物车
export const clearCart = () => {
  try {
    uni.removeStorageSync('cartItems')
    return true
  } catch (e) {
    console.error('清空购物车失败', e)
    return false
  }
} 