/**
 * 宠物保险API连接测试工具
 * 用于诊断保险相关功能的后端连接问题
 */

// 测试保险API连接
async function testInsuranceAPIs() {
  console.log('🔧 开始测试宠物保险API连接...');
  
  const BASE_URL = 'https://udrvmlsoncfg.sealosbja.site/api';
  const testResults = {
    baseUrl: BASE_URL,
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  // 测试用例配置
  const apiTests = [
    {
      name: '获取保险产品列表',
      url: '/insurance/products',
      method: 'GET',
      params: { page: 1, pageSize: 5 },
      needAuth: false
    },
    {
      name: '获取保险产品详情',
      url: '/insurance/products/1',
      method: 'GET',
      needAuth: false
    },
    {
      name: '获取我的保单列表',
      url: '/insurance/policies/my',
      method: 'GET',
      needAuth: true
    },
    {
      name: '获取保险报价',
      url: '/insurance/quote',
      method: 'POST',
      needAuth: true,
      data: {
        productId: '1',
        petType: 'dog',
        petAge: 3,
        petBreed: '金毛',
        isNeutered: true
      }
    }
  ];

  // 模拟用户token（如果有的话）
  const mockToken = 'test-token-12345';

  for (const test of apiTests) {
    testResults.summary.total++;
    console.log(`\n📋 测试: ${test.name}`);
    console.log(`🔗 URL: ${BASE_URL}${test.url}`);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (test.needAuth) {
        headers['Authorization'] = `Bearer ${mockToken}`;
      }

      const requestConfig = {
        method: test.method,
        headers: headers
      };

      // 添加请求参数
      let fullUrl = BASE_URL + test.url;
      if (test.method === 'GET' && test.params) {
        const searchParams = new URLSearchParams(test.params);
        fullUrl += '?' + searchParams.toString();
      } else if (test.method === 'POST' && test.data) {
        requestConfig.body = JSON.stringify(test.data);
      }

      console.log(`⏱️ 发送请求...`);
      const startTime = Date.now();
      
      const response = await fetch(fullUrl, requestConfig);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`⏱️ 响应时间: ${responseTime}ms`);
      console.log(`📊 状态码: ${response.status}`);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log(`📄 响应数据:`, responseData);
      } else {
        responseData = await response.text();
        console.log(`📄 响应文本:`, responseData.substring(0, 200) + '...');
      }

      // 判断测试结果
      const isSuccess = response.status >= 200 && response.status < 300;
      
      testResults.tests.push({
        name: test.name,
        url: test.url,
        method: test.method,
        status: response.status,
        responseTime: responseTime,
        success: isSuccess,
        error: isSuccess ? null : `HTTP ${response.status}: ${response.statusText}`,
        responseData: responseData
      });

      if (isSuccess) {
        testResults.summary.passed++;
        console.log(`✅ 测试通过`);
      } else {
        testResults.summary.failed++;
        console.log(`❌ 测试失败: HTTP ${response.status}`);
      }

    } catch (error) {
      testResults.summary.failed++;
      console.error(`❌ 测试失败:`, error.message);
      
      testResults.tests.push({
        name: test.name,
        url: test.url,
        method: test.method,
        success: false,
        error: error.message,
        responseTime: null,
        status: null
      });
    }
  }

  // 输出测试总结
  console.log(`\n📊 测试总结:`);
  console.log(`- 总计: ${testResults.summary.total} 个测试`);
  console.log(`- 成功: ${testResults.summary.passed} 个`);
  console.log(`- 失败: ${testResults.summary.failed} 个`);
  console.log(`- 成功率: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);

  // 检查网络连接
  console.log(`\n🌐 网络连接检查:`);
  try {
    const pingResponse = await fetch(BASE_URL.replace('/api', ''), { method: 'HEAD' });
    console.log(`✅ 服务器可达 (状态码: ${pingResponse.status})`);
  } catch (error) {
    console.log(`❌ 服务器不可达: ${error.message}`);
  }

  return testResults;
}

// 快速诊断函数
async function quickDiagnosis() {
  console.log('🩺 快速诊断保险API连接问题...\n');
  
  const issues = [];
  const fixes = [];

  // 1. 检查基础网络连接
  console.log('1️⃣ 检查基础网络连接...');
  try {
    const response = await fetch('https://www.baidu.com', { 
      method: 'HEAD',
      mode: 'no-cors'
    });
    console.log('✅ 网络连接正常');
  } catch (error) {
    console.log('❌ 网络连接异常');
    issues.push('网络连接问题');
    fixes.push('检查网络连接是否正常');
  }

  // 2. 检查API服务器连接
  console.log('\n2️⃣ 检查API服务器连接...');
  try {
    const baseUrl = 'https://udrvmlsoncfg.sealosbja.site';
    const response = await fetch(baseUrl, { method: 'HEAD' });
    console.log(`✅ API服务器可达 (状态码: ${response.status})`);
  } catch (error) {
    console.log(`❌ API服务器不可达: ${error.message}`);
    issues.push('API服务器连接问题');
    fixes.push('检查API服务器地址是否正确');
    fixes.push('联系后端开发者确认服务器状态');
  }

  // 3. 检查保险API端点
  console.log('\n3️⃣ 检查保险API端点...');
  try {
    const response = await fetch('https://udrvmlsoncfg.sealosbja.site/api/insurance/products?page=1&pageSize=1');
    console.log(`✅ 保险API端点可达 (状态码: ${response.status})`);
    
    if (response.status === 404) {
      issues.push('保险API端点不存在');
      fixes.push('确认后端已实现保险相关接口');
    }
  } catch (error) {
    console.log(`❌ 保险API端点不可达: ${error.message}`);
    issues.push('保险API端点问题');
    fixes.push('确认保险相关API路由已正确配置');
  }

  // 4. 检查CORS配置
  console.log('\n4️⃣ 检查CORS配置...');
  // 注意：在浏览器环境中，CORS错误会被fetch捕获，但错误信息可能不明确

  // 输出诊断结果
  console.log('\n🔍 诊断结果:');
  if (issues.length === 0) {
    console.log('✅ 未发现明显问题，API连接应该正常');
  } else {
    console.log('❌ 发现以下问题:');
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }

  console.log('\n🛠️ 建议修复方案:');
  if (fixes.length === 0) {
    console.log('💡 系统运行正常，无需修复');
  } else {
    fixes.forEach((fix, index) => {
      console.log(`   ${index + 1}. ${fix}`);
    });
  }

  return { issues, fixes };
}

// 生成后端对齐文档
function generateBackendAlignmentDoc() {
  return `
# 宠物保险API后端对齐文档

## 问题现象
- 用户反馈保险相关页面点击后无法连接后端服务器
- 可能出现网络请求失败、接口404、或CORS错误

## API端点检查清单

### 必需实现的保险API接口

#### 1. 获取保险产品列表
- **URL**: \`GET /api/insurance/products\`
- **参数**: page, pageSize, petType, ageRange, priceRange, sortBy
- **响应**: 产品列表数据

#### 2. 获取保险产品详情  
- **URL**: \`GET /api/insurance/products/{productId}\`
- **参数**: productId (路径参数)
- **响应**: 产品详细信息

#### 3. 获取我的保单列表
- **URL**: \`GET /api/insurance/policies/my\`
- **认证**: 需要JWT Token
- **参数**: page, pageSize, status
- **响应**: 用户保单列表

#### 4. 获取保单详情
- **URL**: \`GET /api/insurance/policies/{policyId}\`
- **认证**: 需要JWT Token
- **响应**: 保单详细信息

#### 5. 保险报价
- **URL**: \`POST /api/insurance/quote\`
- **认证**: 需要JWT Token
- **参数**: productId, petType, petAge, petBreed, isNeutered

## 服务器配置要求

### 1. CORS配置
\`\`\`javascript
// 允许的源
Access-Control-Allow-Origin: *
// 或者具体指定：https://your-frontend-domain.com

// 允许的方法
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

// 允许的头部
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
\`\`\`

### 2. 路由配置示例 (Express.js)
\`\`\`javascript
// 保险产品相关路由
app.get('/api/insurance/products', getInsuranceProducts);
app.get('/api/insurance/products/:id', getInsuranceProductDetail);
app.post('/api/insurance/quote', authenticateToken, getInsuranceQuote);

// 保单相关路由
app.get('/api/insurance/policies/my', authenticateToken, getMyPolicies);
app.get('/api/insurance/policies/:id', authenticateToken, getPolicyDetail);
\`\`\`

### 3. 数据库表结构建议
\`\`\`sql
-- 保险产品表
CREATE TABLE insurance_products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  company VARCHAR(100) NOT NULL,
  coverage TEXT,
  price DECIMAL(10,2),
  pet_types JSON,
  type ENUM('medical','accident','comprehensive','liability'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 保单表
CREATE TABLE policies (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  pet_id VARCHAR(50) NOT NULL,
  status ENUM('active','expired','cancelled') DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  premium DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 错误处理标准

### HTTP状态码约定
- 200: 成功
- 400: 请求参数错误
- 401: 未授权（未登录或token无效）
- 404: 资源不存在
- 500: 服务器内部错误

### 响应格式统一
\`\`\`javascript
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  }
}
\`\`\`

## 测试验证步骤

1. **基础连接测试**
   \`\`\`bash
   curl -X GET "https://udrvmlsoncfg.sealosbja.site/api/insurance/products?page=1&pageSize=5"
   \`\`\`

2. **CORS测试**
   - 在浏览器控制台执行测试脚本
   - 检查是否有CORS相关错误

3. **认证测试**
   \`\`\`bash
   curl -X GET "https://udrvmlsoncfg.sealosbja.site/api/insurance/policies/my" \\
        -H "Authorization: Bearer test-token"
   \`\`\`

## 部署检查清单

- [ ] 所有保险API接口已实现
- [ ] CORS配置正确
- [ ] 数据库连接正常
- [ ] JWT认证中间件工作正常
- [ ] 服务器防火墙允许HTTP/HTTPS访问
- [ ] SSL证书配置正确（如使用HTTPS）
- [ ] 负载均衡器配置正确（如有）

## 常见问题排查

### 1. 连接超时
- 检查服务器是否正常运行
- 检查防火墙设置
- 检查域名DNS解析

### 2. 404错误
- 确认API路由配置正确
- 检查路径大小写
- 确认服务器启动时加载了所有路由

### 3. CORS错误
- 检查Access-Control-Allow-Origin设置
- 确认预检请求(OPTIONS)正确处理
- 验证前端域名是否在允许列表中

### 4. 认证错误
- 检查JWT中间件配置
- 验证token格式和签名
- 确认token未过期

## 联系信息
如有问题请联系前端开发团队进行进一步调试。
`;
}

// 导出测试函数
if (typeof window !== 'undefined') {
  window.testInsuranceAPIs = testInsuranceAPIs;
  window.quickDiagnosis = quickDiagnosis;
  window.generateBackendAlignmentDoc = generateBackendAlignmentDoc;
}

// 自动执行快速诊断
console.log('📋 保险API连接测试工具已加载');
console.log('🔧 使用方法:');
console.log('- 完整测试: testInsuranceAPIs()');
console.log('- 快速诊断: quickDiagnosis()');
console.log('- 生成文档: console.log(generateBackendAlignmentDoc())');
