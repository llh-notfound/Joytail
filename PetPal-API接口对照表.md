# 🔗 PetPal 购物车结算流程 - API接口对照表

## 📋 接口总览

| 模块 | 接口 | 方法 | 路径 | 优先级 | 前端调用方法 |
|------|------|------|------|--------|------------|
| 购物车 | 获取购物车列表 | GET | `/cart/list` | ⭐⭐⭐ | `cartApi.getCartList()` |
| 购物车 | 添加商品 | POST | `/cart/add` | ⭐⭐⭐ | `cartApi.addToCart(goodsId, quantity, specs)` |
| 购物车 | 更新数量 | PUT | `/cart/update` | ⭐⭐⭐ | `cartApi.updateCartItem(cartItemId, quantity)` |
| 购物车 | 更新选中状态 | PUT | `/cart/select` | ⭐⭐ | `cartApi.updateCartItemSelected(cartItemId, selected)` |
| 购物车 | 删除商品 | DELETE | `/cart/items` | ⭐⭐ | `cartApi.deleteCartItems(cartItemIds)` |
| 订单 | 创建订单 | POST | `/order/create` | ⭐⭐⭐ | `orderApi.createOrder(cartItemIds, addressId, message)` |
| 订单 | 获取订单列表 | GET | `/order/goods-list` | ⭐⭐⭐ | `orderApi.getGoodsOrderList(status, page, pageSize)` |
| 订单 | 获取订单详情 | GET | `/order/detail/{orderNumber}` | ⭐⭐ | `orderApi.getOrderDetail(orderNumber)` |
| 支付 | 发起支付 | POST | `/order/pay/{orderNumber}` | ⭐⭐⭐ | `orderApi.payOrder(orderNumber, paymentMethod, paymentChannel)` |
| 支付 | 支付回调 | POST | `/order/pay-callback` | ⭐⭐⭐ | 第三方回调 |
| 支付 | 查询支付状态 | GET | `/order/pay-status/{orderNumber}` | ⭐⭐ | `orderApi.getPaymentStatus(orderNumber)` |
| 订单状态 | 取消订单 | POST | `/order/cancel/{orderNumber}` | ⭐ | `orderApi.cancelOrder(orderNumber, reason)` |
| 订单状态 | 确认收货 | POST | `/order/confirm/{orderNumber}` | ⭐ | `orderApi.confirmOrder(orderNumber)` |
| 统计 | 订单统计 | GET | `/order/stats` | ⭐ | `orderApi.getOrderStats()` |

---

## 🛒 购物车模块详细接口

### 1. GET /cart/list - 获取购物车列表

**请求：**
```http
GET /cart/list
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "items": [
      {
        "id": "cart_item_001",
        "goodsId": "goods_001",
        "name": "宠物狗粮 - 皇家小型犬成犬粮",
        "image": "https://example.com/images/dog-food.jpg",
        "price": 128.00,
        "quantity": 2,
        "specs": "2.5kg装",
        "selected": true,
        "stock": 100,
        "createTime": "2025-07-14T09:00:00Z"
      }
    ],
    "totalItems": 1,
    "totalAmount": 256.00,
    "selectedCount": 1,
    "selectedAmount": 256.00
  }
}
```

### 2. POST /cart/add - 添加商品到购物车

**请求：**
```json
{
  "goodsId": "goods_001",
  "quantity": 1,
  "specs": "2.5kg装"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "cartItemId": "cart_item_002",
    "totalQuantity": 3
  }
}
```

### 3. PUT /cart/update - 更新购物车商品数量

**请求：**
```json
{
  "cartItemId": "cart_item_001",
  "quantity": 3
}
```

**响应：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

### 4. PUT /cart/select - 更新商品选中状态

**请求：**
```json
{
  "cartItemId": "cart_item_001",
  "selected": true
}
```

**响应：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

### 5. DELETE /cart/items - 删除购物车商品

**请求：**
```json
{
  "cartItemIds": ["cart_item_001", "cart_item_002"]
}
```

**响应：**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

## 📝 订单模块详细接口

### 1. POST /order/create - 创建订单

**请求：**
```json
{
  "cartItemIds": ["cart_item_001", "cart_item_002"],
  "addressId": "addr_001",
  "message": "请小心轻放"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderNumber": "PO2025071400001",
    "totalAmount": 268.00,
    "goodsAmount": 256.00,
    "shippingFee": 12.00,
    "payableAmount": 268.00,
    "status": "pending_payment",
    "createTime": "2025-07-14T10:00:00Z",
    "items": [
      {
        "goodsId": "goods_001",
        "name": "宠物狗粮 - 皇家小型犬成犬粮",
        "image": "https://example.com/images/dog-food.jpg",
        "price": 128.00,
        "quantity": 2,
        "specs": "2.5kg装",
        "subtotal": 256.00
      }
    ]
  }
}
```

### 2. GET /order/goods-list - 获取订单列表

**请求：**
```http
GET /order/goods-list?status=all&page=1&pageSize=10
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "items": [
      {
        "id": "order_001",
        "orderNumber": "PO2025071400001",
        "status": "pending_payment",
        "statusText": "待付款",
        "totalAmount": 268.00,
        "goodsCount": 1,
        "createTime": "2025-07-14T10:00:00Z",
        "payExpireTime": "2025-07-14T11:00:00Z",
        "items": [
          {
            "goodsId": "goods_001",
            "name": "宠物狗粮 - 皇家小型犬成犬粮",
            "image": "https://example.com/images/dog-food.jpg",
            "price": 128.00,
            "quantity": 2,
            "specs": "2.5kg装"
          }
        ]
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "hasMore": false
  }
}
```

### 3. GET /order/detail/{orderNumber} - 获取订单详情

**请求：**
```http
GET /order/detail/PO2025071400001
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "orderNumber": "PO2025071400001",
    "status": "pending_payment",
    "statusText": "待付款",
    "totalAmount": 268.00,
    "goodsAmount": 256.00,
    "shippingFee": 12.00,
    "createTime": "2025-07-14T10:00:00Z",
    "payExpireTime": "2025-07-14T11:00:00Z",
    "address": {
      "name": "张三",
      "phone": "138****1234",
      "address": "广东省深圳市南山区科技园1号楼101室"
    },
    "items": [
      {
        "goodsId": "goods_001",
        "name": "宠物狗粮 - 皇家小型犬成犬粮",
        "image": "https://example.com/images/dog-food.jpg",
        "price": 128.00,
        "quantity": 2,
        "specs": "2.5kg装",
        "subtotal": 256.00
      }
    ]
  }
}
```

---

## 💳 支付模块详细接口

### 1. POST /order/pay/{orderNumber} - 发起支付

**请求：**
```json
{
  "paymentMethod": "wechat",
  "paymentChannel": "h5"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "支付发起成功",
  "data": {
    "paymentOrderId": "pay_001",
    "paymentInfo": {
      "appId": "your_app_id",
      "timeStamp": "1642147200",
      "nonceStr": "random_string",
      "package": "prepay_id=prepay_id_value",
      "signType": "RSA",
      "paySign": "signature_value"
    },
    "paymentUrl": "https://pay.example.com/pay?id=pay_001",
    "expireTime": "2025-07-14T11:00:00Z"
  }
}
```

### 2. POST /order/pay-callback - 支付回调处理

**请求（第三方发起）：**
```json
{
  "orderNumber": "PO2025071400001",
  "paymentOrderId": "pay_001",
  "paymentStatus": "success",
  "transactionId": "wx_transaction_123",
  "paymentTime": "2025-07-14T10:30:00Z",
  "signature": "signature_value"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "处理成功",
  "data": null
}
```

### 3. GET /order/pay-status/{orderNumber} - 查询支付状态

**请求：**
```http
GET /order/pay-status/PO2025071400001
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "orderNumber": "PO2025071400001",
    "paymentStatus": "success",
    "paymentTime": "2025-07-14T10:30:00Z",
    "paymentMethod": "wechat",
    "paymentAmount": 268.00
  }
}
```

---

## 📊 订单状态管理接口

### 1. POST /order/cancel/{orderNumber} - 取消订单

**请求：**
```json
{
  "reason": "不想要了"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "订单取消成功",
  "data": {
    "orderNumber": "PO2025071400001",
    "status": "cancelled",
    "cancelTime": "2025-07-14T12:00:00Z"
  }
}
```

### 2. POST /order/confirm/{orderNumber} - 确认收货

**请求：**
```json
{}
```

**响应：**
```json
{
  "code": 200,
  "message": "确认收货成功",
  "data": {
    "orderNumber": "PO2025071400001",
    "status": "completed",
    "confirmTime": "2025-07-14T15:00:00Z"
  }
}
```

### 3. GET /order/stats - 订单统计

**请求：**
```http
GET /order/stats
Authorization: Bearer {token}
```

**响应：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "pendingPayment": 2,
    "paid": 1,
    "shipped": 0,
    "delivered": 3,
    "completed": 5,
    "totalOrders": 11
  }
}
```

---

## ⚠️ 错误响应格式

### 常见错误码

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| 400 | 参数错误 | 缺少必填参数、参数格式错误 |
| 401 | 未授权 | Token无效或过期 |
| 403 | 权限不足 | 访问其他用户数据 |
| 404 | 资源不存在 | 购物车项不存在、订单不存在 |
| 409 | 业务冲突 | 库存不足、订单状态不允许操作 |
| 500 | 服务器错误 | 数据库连接失败、第三方服务异常 |

### 错误响应示例

```json
{
  "code": 400,
  "message": "库存不足，当前剩余库存：5",
  "data": {
    "availableStock": 5,
    "requestedQuantity": 10
  },
  "timestamp": "2025-07-14T10:00:00Z"
}
```

---

## 🔄 业务状态流转

### 订单状态
```
pending_payment (待付款) → paid (已付款) → shipped (已发货) → delivered (已送达) → completed (已完成)
                     ↓
                cancelled (已取消)
```

### 购物车项状态
```
selected: true/false  (选中/未选中)
quantity: 1-99       (数量限制)
```

---

## 🧪 测试建议

### 1. 单元测试覆盖
- 参数验证
- 业务逻辑
- 错误处理
- 权限验证

### 2. 集成测试场景
- 完整购物流程
- 支付回调处理
- 并发库存操作
- 异常恢复

### 3. 性能测试
- 高并发下单
- 大量购物车数据
- 订单列表分页

---

**备注：** 所有接口都需要JWT认证，除了支付回调接口（由第三方调用）
