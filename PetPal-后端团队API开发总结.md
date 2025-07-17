# 🛒 PetPal 购物车结算流程 - 后端团队API开发总结

## 📋 任务概述

**项目状态：** 前端已完成，等待后端API实现  
**开发优先级：** 高  
**预计工期：** 3-5天  
**技术栈建议：** Node.js/Express 或 Spring Boot  

---

## 🎯 核心API清单（按优先级排序）

### 🔥 第一优先级（核心流程）- 1-2天

#### 1. 购物车管理 API
```
GET /cart/list                    # 获取购物车列表 ⭐⭐⭐
POST /cart/add                    # 添加商品到购物车 ⭐⭐⭐
PUT /cart/update                  # 更新购物车商品数量 ⭐⭐⭐
PUT /cart/select                  # 更新商品选中状态 ⭐⭐
DELETE /cart/items                # 删除购物车商品 ⭐⭐
```

#### 2. 订单创建 API
```
POST /order/create                # 创建订单 ⭐⭐⭐
GET /order/goods-list             # 获取订单列表 ⭐⭐⭐
GET /order/detail/{orderNumber}   # 获取订单详情 ⭐⭐
```

### 🔥 第二优先级（支付功能）- 1-2天

#### 3. 支付相关 API
```
POST /order/pay/{orderNumber}     # 发起支付 ⭐⭐⭐
POST /order/pay-callback          # 支付回调处理 ⭐⭐⭐
GET /order/pay-status/{orderNumber} # 查询支付状态 ⭐⭐
```

### 🔥 第三优先级（完善功能）- 1天

#### 4. 订单状态管理 API
```
POST /order/cancel/{orderNumber}  # 取消订单 ⭐
POST /order/confirm/{orderNumber} # 确认收货 ⭐
GET /order/stats                  # 订单统计 ⭐
```

---

## 🔑 关键技术要点

### 1. 认证授权
- **所有API都需要Bearer Token认证**
- 请求头格式：`Authorization: Bearer {token}`
- 401错误时前端会自动跳转登录页

### 2. 数据格式规范
```json
// 统一响应格式
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2025-07-14T10:00:00Z"
}

// 错误响应格式
{
  "code": 400,
  "message": "参数错误",
  "data": null
}
```

### 3. 核心数据表设计
```sql
-- 购物车表
CREATE TABLE cart_items (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL,
    goods_id VARCHAR(32) NOT NULL,
    quantity INT NOT NULL,
    selected BOOLEAN DEFAULT TRUE,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单主表
CREATE TABLE orders (
    id VARCHAR(32) PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    status ENUM('pending_payment', 'paid', 'shipped', 'delivered', 'completed') NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单商品表
CREATE TABLE order_items (
    id VARCHAR(32) PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL,
    goods_id VARCHAR(32) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
```

---

## 🚀 快速开始指南

### Step 1: 环境搭建（30分钟）
1. 初始化项目框架
2. 配置数据库连接
3. 设置JWT认证中间件
4. 配置CORS跨域

### Step 2: 实现核心API（2天）
1. **购物车API**：参考 `/购物车结算流程-后端API开发文档.md`
2. **订单API**：参考 `/购物车结算流程-后端开发快速指导.md`
3. **测试验证**：使用 `/PetPal-购物车结算流程-Postman测试集合.json`

### Step 3: 支付集成（1-2天）
1. 集成微信支付/支付宝
2. 实现支付回调处理
3. 订单状态同步

### Step 4: 联调测试（0.5天）
1. 与前端团队联调
2. 修复API接口问题
3. 性能优化

---

## 🔍 前端调用示例

### 购物车接口调用
```javascript
// 前端已实现的API调用
import { cartApi } from '../../utils/api'

// 获取购物车列表
const cartData = await cartApi.getCartList()

// 添加商品到购物车
await cartApi.addToCart(goodsId, quantity, specs)

// 更新商品选中状态
await cartApi.updateCartItemSelected(cartItemId, selected)
```

### 订单接口调用
```javascript
import { orderApi } from '../../utils/api'

// 创建订单
const orderResult = await orderApi.createOrder(cartItemIds, addressId, message)

// 获取订单列表
const orderList = await orderApi.getGoodsOrderList(status, page, pageSize)

// 发起支付
const paymentResult = await orderApi.payOrder(orderNumber, paymentMethod, paymentChannel)
```

---

## 📊 业务逻辑核心要点

### 1. 购物车商品添加逻辑
1. 验证商品是否存在
2. 检查库存是否充足
3. 如果已存在相同商品+规格，增加数量
4. 否则新增购物车项

### 2. 订单创建逻辑（重要！）
1. 验证购物车项归属
2. 验证收货地址
3. **锁定库存**（防止超卖）
4. 计算订单金额
5. 创建订单记录
6. **删除购物车项**
7. 返回订单信息

### 3. 支付处理逻辑
1. 验证订单状态
2. 调用第三方支付
3. 处理支付回调
4. 更新订单状态
5. **确认扣减库存**

---

## 🧪 测试资源

### 1. Postman测试集合
- 文件：`PetPal-购物车结算流程-Postman测试集合.json`
- 包含25+个测试用例
- 覆盖正常和异常场景

### 2. 数据库初始化脚本
- 文件：`database-schema.sql`
- 包含完整表结构
- 示例数据和索引

### 3. 前端测试页面
- 访问：`http://localhost:3000/pages/cart/index`
- 完整购物车→订单→支付流程

---

## ⚠️ 关键注意事项

### 1. 数据一致性
- 订单创建必须使用**数据库事务**
- 库存操作需要考虑**并发安全**
- 支付回调处理要**幂等性**

### 2. 错误处理
- 库存不足：返回400 + 具体库存数量
- 订单状态错误：返回400 + 状态说明
- 权限错误：返回403 + 权限说明

### 3. 性能优化
- 购物车数据可考虑Redis缓存
- 订单列表要支持分页
- 商品信息可以冗余存储

---

## 📞 支持资源

### 详细文档
1. `PetPal-购物车结算流程-后端API开发文档.md` - 完整API规范
2. `PetPal-购物车结算流程-后端开发快速指导.md` - 代码示例
3. `database-schema.sql` - 数据库设计
4. `PetPal-购物车结算流程-Postman测试集合.json` - API测试

### 联调支持
- **前端状态**：✅ 已完成，等待后端API
- **测试页面**：已可用，可直接测试
- **联调时间**：后端开发完成后即可开始

---

**开发成功标志：** 前端能够完整走通购物车→订单确认→支付→订单管理的完整流程

**预期交付：** 完整可用的购物车结算API服务 + 部署文档
