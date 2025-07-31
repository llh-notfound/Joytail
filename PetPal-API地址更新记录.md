# PetPal API 地址更新记录

## 📅 更新信息

**更新时间**: 2025-01-27  
**更新内容**: 生产环境API地址配置  
**更新人**: 前端开发团队

## 🔄 更新详情

### 旧配置
```javascript
// 生产环境API地址
export const BASE_URL = 'https://your-production-api.com/api';
export const IMAGE_BASE_URL = 'https://your-production-api.com/public';
```

### 新配置
```javascript
// 生产环境API地址
export const BASE_URL = 'https://ywzezvbcsivv.sealosbja.site/api';
export const IMAGE_BASE_URL = 'https://ywzezvbcsivv.sealosbja.site/public';
```

## 📁 修改的文件

### 1. `uni-preset-vue-vite/src/utils/config.js`
- ✅ 更新了 `BASE_URL` 生产环境地址
- ✅ 更新了 `IMAGE_BASE_URL` 生产环境地址

### 2. `uni-preset-vue-vite/src/utils/imageHelper.js`
- ✅ 更新了图片处理函数中的后端URL配置
- ✅ 添加了环境判断逻辑

## 🌐 API服务信息

根据 [PetPal Backend API](https://ywzezvbcsivv.sealosbja.site) 的响应，当前后端服务包含以下模块：

### 可用的API端点
- **用户管理**: `/api/user/*`
- **宠物管理**: `/api/pet/*`
- **商品管理**: `/api/goods/*`
- **购物车**: `/api/cart/*`
- **订单管理**: `/api/order/*`
- **地址管理**: `/api/address/*`
- **积分系统**: `/api/points/*`
- **保险管理**: `/api/insurance/*`
- **保单管理**: `/api/policy/*`
- **社区功能**: `/api/community/*`
- **医疗服务**: `/api/medical/*`
- **咨询服务**: `/api/consult/*`
- **账户管理**: `/api/account/*`
- **通用功能**: `/api/common/*`
- **反馈系统**: `/api/feedback/*`

## 🧪 测试验证

### 测试脚本
创建了 `test-new-api.js` 脚本来验证新API地址的可用性。

### 测试内容
1. **基础连接测试** - 验证API服务器是否可访问
2. **用户接口测试** - 验证用户相关API是否正常
3. **商品接口测试** - 验证商品相关API是否正常

### 运行测试
```bash
node test-new-api.js
```

## ⚙️ 环境配置

### 开发环境
- **API地址**: `http://localhost:8080/api`
- **图片服务器**: `http://localhost:8080/public`

### 生产环境
- **API地址**: `https://ywzezvbcsivv.sealosbja.site/api`
- **图片服务器**: `https://ywzezvbcsivv.sealosbja.site/public`

## 🔧 配置说明

### 自动环境切换
前端代码会根据 `NODE_ENV` 环境变量自动切换API地址：

```javascript
// 开发环境使用本地服务器
const backendUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080' 
  : 'https://ywzezvbcsivv.sealosbja.site';
```

### 图片URL处理
`imageHelper.js` 中的图片URL处理函数已更新，支持新的生产环境地址。

## 📋 检查清单

- [x] 更新 `config.js` 中的API地址
- [x] 更新 `imageHelper.js` 中的后端URL
- [x] 创建API测试脚本
- [x] 验证生产环境API可访问性
- [x] 更新相关文档
- [x] 强制使用生产环境API地址（修复环境判断问题）
- [x] 重新构建项目并测试

## 🚀 部署建议

1. **构建生产版本**:
   ```bash
   npm run build
   ```

2. **验证API连接**:
   ```bash
   node test-new-api.js
   ```

3. **测试前端功能**:
   - 登录功能
   - 商品列表
   - 购物车功能
   - 订单管理

## 📞 技术支持

如果遇到API连接问题，请检查：

1. **网络连接** - 确保能够访问 `https://ywzezvbcsivv.sealosbja.site`
2. **CORS配置** - 确保后端已正确配置跨域访问
3. **认证状态** - 确保用户登录状态正常
4. **API版本** - 确保前端调用的API版本与后端一致

---

**文档版本**: v1.0  
**最后更新**: 2025-01-27 