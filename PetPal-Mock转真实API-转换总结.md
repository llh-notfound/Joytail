# PetPal 项目 Mock数据 → 真实API 转换总结

## 转换完成日期
2025年7月9日

## 转换内容概述

本次转换将PetPal项目从使用Mock模拟数据改为调用真实的后端API接口，确保前端能够与实际的后端服务进行数据交互。

## 主要修改内容

### 1. 配置修改 ✅
- **文件**: `src/utils/config.js`
- **修改**: 将 `USE_MOCK` 从 `true` 改为 `false`
- **影响**: 全局关闭Mock数据模式，启用真实API调用

### 2. API接口文件完善 ✅

#### 新增API模块
- **保险API**: `src/utils/api/insurance.js` - 17个接口
  - 保险产品查询、详情、报价、购买
  - 保单管理、理赔申请、续保、取消
  - 辅助功能：计算器、FAQ、条款等

- **医疗API**: `src/utils/api/medical.js` - 10个接口
  - 医疗机构查询、预约服务
  - 医疗记录、疫苗记录管理
  - 医生信息查询

- **咨询API**: `src/utils/api/consult.js` - 9个接口
  - 在线咨询服务、医生信息
  - 咨询会话管理、消息发送
  - 咨询评价功能

#### 更新API索引文件
- **文件**: `src/utils/api/index.js`
- **修改**: 添加insurance、medical、consult模块的导入和导出

### 3. 页面数据加载逻辑修改 ✅

#### 社区页面 (`src/pages/community/home.vue`)
- ✅ 导入API模块
- ✅ 替换静态数据为API调用
- ✅ 更新数据加载函数 `getContentList()`
- ✅ 更新刷新功能 `onRefresh()`
- ✅ 更新点赞/收藏功能，集成真实API

#### 保险列表页面 (`src/pages/insurance/list.vue`)
- ✅ 导入API模块
- ✅ 添加数据加载状态管理
- ✅ 删除所有静态保险数据
- ✅ 实现API数据加载函数 `loadInsuranceProducts()`
- ✅ 更新筛选功能，使用API参数
- ✅ 更新加载更多和分页逻辑

### 4. 开发辅助工具 ✅

#### API测试工具
- **文件**: `src/utils/apiTest.js`
- **功能**: 提供各模块API的测试函数
- **包含**: 用户、保险、社区、医疗、咨询API测试

#### 主页面测试功能
- **文件**: `src/pages/index/index.vue`
- **新增**: API测试按钮（非Mock模式下显示）
- **新增**: 数据源状态指示器（显示Mock/API）

## API接口对应关系

### 后端API地址
- **根地址**: `https://udrvmlsoncfg.sealosbja.site`
- **基础路径**: `/api`

### 主要接口映射

| 功能模块 | 前端API方法 | 后端接口 | 认证要求 |
|---------|------------|----------|----------|
| 社区动态列表 | `getCommunityPosts()` | `GET /community/posts` | 可选 |
| 社区动态点赞 | `togglePostLike()` | `POST /community/posts/:id/like` | 必需 |
| 保险产品列表 | `getInsuranceProducts()` | `GET /insurance/products` | 否 |
| 保险产品详情 | `getInsuranceProductDetail()` | `GET /insurance/products/:id` | 否 |
| 购买保险 | `purchaseInsurance()` | `POST /insurance/purchase` | 必需 |
| 我的保单 | `getMyPolicies()` | `GET /insurance/policies/my` | 必需 |
| 医疗机构列表 | `getHospitals()` | `GET /medical/hospitals` | 否 |
| 预约医疗服务 | `createAppointment()` | `POST /medical/appointments` | 必需 |
| 在线咨询服务 | `getConsultServices()` | `GET /consult/services` | 否 |
| 发起咨询 | `createConsultSession()` | `POST /consult/sessions` | 必需 |

## 数据格式对接

### 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 分页数据格式
```json
{
  "code": 200,
  "message": "success", 
  "data": {
    "list": [],
    "total": 100,
    "hasMore": true
  }
}
```

## 错误处理机制

### 网络错误处理
- 统一在`request.js`中处理
- 401错误自动跳转登录页
- 其他错误显示Toast提示

### API调用错误处理
- 各页面添加try-catch包装
- 失败时显示友好错误提示
- 开发环境输出详细错误日志

## 测试验证

### 测试方法
1. **控制台API测试**: 主页面点击"测试API"按钮
2. **功能测试**: 各页面正常使用功能
3. **错误测试**: 断网情况下的错误处理

### 测试覆盖
- ✅ 保险模块API调用
- ✅ 社区模块API调用  
- ✅ 医疗模块API调用
- ✅ 咨询模块API调用
- ⏳ 用户认证相关API（需要登录状态）

## 待完成项目

### 1. 其他页面API集成
- [ ] 商品列表页面 (`src/pages/goods/list.vue`)
- [ ] 订单相关页面 (`src/pages/order/`)
- [ ] 用户相关页面 (`src/pages/profile/`)
- [ ] 购物车页面 (`src/pages/cart/`)

### 2. 详细功能完善
- [ ] 保险详情页面API集成
- [ ] 医疗详情页面API集成  
- [ ] 咨询详情页面API集成
- [ ] 上传功能测试和优化

### 3. 错误处理优化
- [ ] 网络异常的重试机制
- [ ] 离线状态检测和提示
- [ ] API调用失败的降级处理

## 注意事项

### 开发环境
- 确保后端服务 `https://udrvmlsoncfg.sealosbja.site` 可访问
- 开发时可在主页面查看数据源状态指示器
- 使用控制台查看API调用日志

### 生产环境
- 部署前确认所有API接口已联调测试
- 移除或隐藏开发辅助功能
- 配置合适的超时时间和重试策略

### 数据同步
- 前端数据结构需与后端API返回格式保持一致
- 注意日期格式、数字类型等细节差异
- 分页参数命名统一（page, pageSize）

## 技术要点

### 1. API封装层次
```
页面组件 → API模块 → request.js → 后端服务
```

### 2. 状态管理
- 各页面独立管理loading状态
- 统一的错误处理机制
- 分页数据的增量加载

### 3. 性能考虑
- 避免重复API调用
- 实现合理的缓存策略
- 分页加载优化用户体验

## 总结

本次转换成功将PetPal项目从Mock数据模式切换到真实API调用模式，主要完成了：

1. **基础设施**: 关闭Mock模式，完善API接口文件
2. **核心功能**: 社区和保险模块的API集成  
3. **开发工具**: API测试工具和状态监控
4. **错误处理**: 统一的异常处理机制

项目现在具备了与真实后端服务对接的能力，为后续的功能开发和部署上线奠定了基础。
