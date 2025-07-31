/**
 * 环境配置示例文件
 * 
 * 使用方法：
 * 1. 复制此文件为 config.local.js (用于本地覆盖配置)
 * 2. 根据实际环境修改对应的URL
 * 3. 在 src/utils/config.js 中导入使用
 */

// 🔧 开发环境配置
export const DEVELOPMENT_CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api',
  IMAGE_BASE_URL: 'http://localhost:8080/public',
  WEBSOCKET_URL: 'ws://localhost:8080/ws'
};

// 🚀 生产环境配置  
export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://api.yourapp.com/api',          // 🔥 请修改为您的生产API域名
  IMAGE_BASE_URL: 'https://cdn.yourapp.com/public',    // 🔥 请修改为您的CDN域名
  WEBSOCKET_URL: 'wss://api.yourapp.com/ws'             // 🔥 请修改为您的WebSocket地址
};

// 🧪 测试环境配置
export const TESTING_CONFIG = {
  API_BASE_URL: 'https://test-api.yourapp.com/api',
  IMAGE_BASE_URL: 'https://test-cdn.yourapp.com/public',
  WEBSOCKET_URL: 'wss://test-api.yourapp.com/ws'
};

// 📝 使用说明：
// 
// 部署到不同环境时，只需要修改 src/utils/config.js 中对应的URL即可：
//
// 开发环境（本地开发）：
// export const BASE_URL = 'http://localhost:8080/api'
// export const IMAGE_BASE_URL = 'http://localhost:8080/public'
//
// 生产环境（线上服务）：
// export const BASE_URL = 'https://api.yourapp.com/api'
// export const IMAGE_BASE_URL = 'https://cdn.yourapp.com/public'
//
// 也可以使用环境变量：
// export const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8080/api'
// export const IMAGE_BASE_URL = process.env.VUE_APP_IMAGE_URL || 'http://localhost:8080/public' 