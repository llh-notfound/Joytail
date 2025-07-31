# 🐾 Joytail - 宠物电商小程序

## 项目简介

Joytail是一个专为宠物主人设计的综合性电商小程序，提供宠物用品购买、医疗服务、保险服务和社区交流等功能。

## 🚀 主要功能

### 🛒 电商购物
- 宠物用品浏览和购买
- 购物车管理
- 订单处理和支付
- 商品搜索和筛选

### 🏥 医疗服务
- 医院信息查看
- 在线咨询服务
- 预约挂号功能
- 医疗记录管理

### 🛡️ 保险服务
- 宠物保险产品浏览
- 保险购买和理赔
- 保单管理

### 👥 社区功能
- 宠物动态分享
- 经验交流
- 互动点赞评论

### 👤 个人中心
- 用户信息管理
- 宠物档案
- 订单历史
- 地址管理

## 🛠️ 技术栈

- **前端框架**: uni-app (Vue 3)
- **构建工具**: Vite
- **样式处理**: Sass
- **多端支持**: 微信小程序、H5、App
- **状态管理**: Vue 3 Composition API
- **UI组件**: uni-app内置组件

## 📁 项目结构

```
uni-preset-vue-vite/
├── src/
│   ├── pages/           # 页面文件
│   │   ├── index/      # 首页
│   │   ├── cart/       # 购物车
│   │   ├── goods/      # 商品相关
│   │   ├── medical/    # 医疗服务
│   │   ├── insurance/  # 保险服务
│   │   ├── community/  # 社区功能
│   │   ├── order/      # 订单管理
│   │   └── profile/    # 个人中心
│   ├── utils/          # 工具函数
│   │   ├── api/        # API接口
│   │   ├── config.js   # 配置文件
│   │   └── request.js  # 请求封装
│   ├── static/         # 静态资源
│   ├── App.vue         # 应用入口
│   ├── main.js         # 主入口文件
│   ├── pages.json      # 页面配置
│   └── manifest.json   # 应用配置
└── package.json        # 项目依赖
```

## 🔧 安装和运行

### 环境要求
- Node.js >= 14
- npm 或 yarn

### 安装依赖
```bash
cd uni-preset-vue-vite
npm install
```

### 开发运行
```bash
# H5开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# 其他平台
npm run dev:mp-alipay    # 支付宝小程序
npm run dev:app          # App
```

### 构建打包
```bash
# H5打包
npm run build:h5

# 微信小程序打包
npm run build:mp-weixin

# 其他平台打包
npm run build:mp-alipay  # 支付宝小程序
npm run build:app        # App
```

## 🌐 接口配置

项目支持开发和生产环境的接口切换：

- **开发环境**: `http://localhost:8080/api`
- **生产环境**: `https://udrvmlsoncfg.sealosbja.site/api`

配置文件位置：`src/utils/config.js`

## 📱 微信小程序部署

1. 使用微信开发者工具导入 `dist/build/mp-weixin` 目录
2. 配置小程序AppID
3. 在"详情" -> "本地设置"中启用：
   - ☑️ 不校验合法域名
   - ☑️ 启用调试
4. 预览和发布

## 🔍 API文档

详细的API接口文档请查看：
- [PetPal API文档](./petpal-backend-api.md)
- [API接口对照表](./PetPal-API接口对照表.md)

## 📋 开发文档

项目包含完整的开发文档和指南：
- 功能模块开发指南
- API对接文档
- 问题解决方案
- 测试指南

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📄 许可证

本项目采用 MIT 许可证。

## 👥 团队

本项目由HKU团队开发完成。

---

**注意**: 这是一个学术项目，用于展示uni-app跨平台开发能力和现代前端技术栈的应用。
