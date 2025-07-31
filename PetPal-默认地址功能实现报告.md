# PetPal-默认地址功能实现报告

## 功能概述

实现了完整的默认地址功能，包括：
- 在确认订单页面自动加载默认地址
- 地址管理页面设置默认地址
- 实时更新确认订单页面的地址信息
- 支持从购物车跳转到确认订单页面时显示默认地址

## 实现方案

### 1. 确认订单页面 (`confirm-order.vue`)

#### 1.1 自动加载默认地址
```javascript
// 加载默认地址
const loadDefaultAddress = () => {
  try {
    // 从本地存储获取地址列表
    const addressListStr = uni.getStorageSync('addressList')
    if (addressListStr) {
      const addressList = JSON.parse(addressListStr)
      
      // 查找默认地址
      const defaultAddress = addressList.find(addr => addr.isDefault === true)
      
      if (defaultAddress) {
        // 将地址数据转换为确认订单页面需要的格式
        selectedAddress.value = {
          id: defaultAddress.id,
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          province: defaultAddress.regionArray?.[0] || '',
          city: defaultAddress.regionArray?.[1] || '',
          district: defaultAddress.regionArray?.[2] || '',
          detailAddress: defaultAddress.detail || '',
          isDefault: defaultAddress.isDefault
        }
      }
    }
  } catch (e) {
    console.error('加载默认地址失败:', e)
    selectedAddress.value = null
  }
}
```

#### 1.2 事件监听机制
```javascript
// 监听地址选择事件
uni.$on('addressSelected', handleAddressSelected)

// 监听默认地址更新事件
uni.$on('defaultAddressUpdated', handleDefaultAddressUpdated)

// 处理地址选择事件
const handleAddressSelected = (address) => {
  // 将地址数据转换为确认订单页面需要的格式
  selectedAddress.value = {
    id: address.id,
    name: address.name,
    phone: address.phone,
    province: address.regionArray?.[0] || '',
    city: address.regionArray?.[1] || '',
    district: address.regionArray?.[2] || '',
    detailAddress: address.detail || '',
    isDefault: address.isDefault
  }
}

// 处理默认地址更新事件
const handleDefaultAddressUpdated = (address) => {
  // 如果当前没有选择地址，或者当前选择的就是这个地址，则更新为新的默认地址
  if (!selectedAddress.value || selectedAddress.value.id === address.id) {
    selectedAddress.value = {
      id: address.id,
      name: address.name,
      phone: address.phone,
      province: address.regionArray?.[0] || '',
      city: address.regionArray?.[1] || '',
      district: address.regionArray?.[2] || '',
      detailAddress: address.detail || '',
      isDefault: address.isDefault
    }
  }
}
```

### 2. 地址管理页面 (`address.vue`)

#### 2.1 设置默认地址功能
```javascript
// 设置默认地址
const setDefault = (item) => {
  if (item.isDefault) return;
  
  uni.showModal({
    title: '设置默认地址',
    content: '确定要将该地址设为默认地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 更新默认地址
        addressList.value.forEach(addr => {
          addr.isDefault = addr.id === item.id;
        });
        
        // 更新本地存储
        uni.setStorageSync('addressList', addressList.value);
        
        // 发送默认地址更新事件
        uni.$emit('defaultAddressUpdated', item);
      }
    }
  });
};
```

#### 2.2 保存地址时的事件通知
```javascript
// 保存地址
const saveAddress = () => {
  // ... 表单验证逻辑 ...
  
  // 如果设为默认地址，需要将其他地址的默认状态取消
  if (addressForm.value.isDefault) {
    addressList.value.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // ... 保存地址逻辑 ...
  
  // 更新本地存储
  uni.setStorageSync('addressList', addressList.value);
  
  // 如果设置为默认地址，发送事件通知
  if (addressForm.value.isDefault) {
    const savedAddress = isEdit.value ? 
      addressList.value.find(addr => addr.id === currentAddress.value.id) :
      addressList.value[addressList.value.length - 1];
    
    if (savedAddress) {
      uni.$emit('defaultAddressUpdated', savedAddress);
    }
  }
};
```

#### 2.3 地址选择功能
```javascript
// 选择地址
const selectAddress = (item) => {
  // 如果是从订单页面进入，则选择地址后返回
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (prevPage && prevPage.route.includes('order')) {
    uni.$emit('addressSelected', item);
    uni.navigateBack();
  }
};
```

## 功能流程

### 1. 购物车跳转到确认订单页面
1. 用户在购物车页面点击"结算"
2. 系统保存选中的商品到本地存储
3. 跳转到确认订单页面
4. 确认订单页面自动加载默认地址
5. 显示默认地址信息

### 2. 设置默认地址
1. 用户在地址管理页面点击"默认地址"按钮
2. 系统弹出确认对话框
3. 用户确认后，更新地址列表中的默认状态
4. 保存到本地存储
5. 发送默认地址更新事件
6. 确认订单页面接收到事件后自动更新地址显示

### 3. 选择其他地址
1. 用户在确认订单页面点击地址区域
2. 跳转到地址管理页面
3. 用户点击某个地址
4. 系统发送地址选择事件
5. 返回确认订单页面
6. 确认订单页面接收到事件后更新地址显示

## 数据结构

### 地址数据格式
```javascript
{
  id: 'A001',
  name: '张三',
  phone: '13800138000',
  region: '广东省深圳市南山区',
  regionArray: ['广东省', '深圳市', '南山区'],
  detail: '科技园南区8栋101室',
  isDefault: true
}
```

### 确认订单页面地址格式
```javascript
{
  id: 'A001',
  name: '张三',
  phone: '13800138000',
  province: '广东省',
  city: '深圳市',
  district: '南山区',
  detailAddress: '科技园南区8栋101室',
  isDefault: true
}
```

## 事件机制

### 1. `addressSelected` 事件
- **触发时机**: 用户在地址管理页面选择地址
- **发送方**: 地址管理页面
- **接收方**: 确认订单页面
- **数据格式**: 完整的地址对象

### 2. `defaultAddressUpdated` 事件
- **触发时机**: 用户设置新的默认地址
- **发送方**: 地址管理页面
- **接收方**: 确认订单页面
- **数据格式**: 新的默认地址对象

## 测试验证

创建了测试页面 `default-address-test.html` 来验证功能：

1. **创建模拟地址数据**: 生成包含默认地址的测试数据
2. **测试加载默认地址**: 验证能正确加载和格式化默认地址
3. **测试设置默认地址**: 验证能正确设置新的默认地址
4. **显示地址列表**: 实时显示当前地址列表和默认状态

## 相关文件

- `uni-preset-vue-vite/src/pages/order/confirm-order.vue` - 确认订单页面
- `uni-preset-vue-vite/src/pages/account/address.vue` - 地址管理页面
- `default-address-test.html` - 功能测试页面

## 总结

通过实现默认地址功能，现在用户可以：

1. **自动显示默认地址**: 在确认订单页面自动加载并显示默认地址
2. **灵活设置默认地址**: 在地址管理页面可以随时更改默认地址
3. **实时更新**: 设置新的默认地址后，确认订单页面会实时更新
4. **选择其他地址**: 可以从地址管理页面选择其他地址作为收货地址

整个功能实现了完整的用户体验，确保用户在购物流程中能够方便地管理收货地址。 