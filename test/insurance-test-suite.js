/**
 * 宠物保险功能修复验证脚本
 * 使用方法：在浏览器控制台中加载此脚本进行测试
 */

console.log('🧪 宠物保险功能修复验证脚本已加载');

const insuranceTest = {
  baseUrl: 'https://udrvmlsoncfg.sealosbja.site/api',
  
  // 测试API连接
  async testApiConnection() {
    console.log('\n🔍 1. 测试API连接状态...');
    
    const tests = [
      {
        name: '保险产品列表',
        url: '/insurance/products?page=1&pageSize=3',
        needAuth: false
      },
      {
        name: '保险产品详情',
        url: '/insurance/products/product_1',
        needAuth: false
      },
      {
        name: '我的保单列表',
        url: '/insurance/policies/my?page=1&pageSize=3',
        needAuth: true
      }
    ];
    
    for (const test of tests) {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (test.needAuth) {
          const token = uni?.getStorageSync('token') || 'test-token';
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(this.baseUrl + test.url, { headers });
        const data = await response.json();
        
        console.log(`📊 ${test.name}:`, {
          状态码: response.status,
          响应: data.code === 200 ? '✅ 成功' : `❌ ${data.message}`,
          数据: test.needAuth && data.code === 401 ? '需要登录' : data.data ? '有数据' : '无数据'
        });
      } catch (error) {
        console.log(`❌ ${test.name}: 连接失败 - ${error.message}`);
      }
    }
  },
  
  // 测试页面功能
  async testPageFunctions() {
    console.log('\n🔍 2. 测试页面功能...');
    
    // 检查当前页面
    const pages = getCurrentPages?.() || [];
    const currentPage = pages[pages.length - 1];
    const route = currentPage?.route || window.location.pathname;
    
    console.log('📍 当前页面:', route);
    
    if (route.includes('insurance')) {
      console.log('✅ 在保险相关页面');
      
      // 检查页面元素
      const elements = {
        '保险卡片': document.querySelectorAll('.insurance-card, .policy-card'),
        '筛选按钮': document.querySelectorAll('.filter-item, .tab-item'),
        '加载提示': document.querySelectorAll('.loading-container, .load-more'),
        '空状态': document.querySelectorAll('.empty-state, .no-insurance')
      };
      
      Object.entries(elements).forEach(([name, nodeList]) => {
        console.log(`📋 ${name}: ${nodeList.length > 0 ? `✅ 找到${nodeList.length}个` : '❌ 未找到'}`);
      });
    } else {
      console.log('⚠️ 不在保险页面，请导航到保险相关页面进行测试');
    }
  },
  
  // 测试用户认证状态
  testAuthStatus() {
    console.log('\n🔍 3. 测试用户认证状态...');
    
    const token = uni?.getStorageSync('token') || localStorage.getItem('token');
    const userInfo = uni?.getStorageSync('userInfo') || localStorage.getItem('userInfo');
    
    console.log('🔐 认证状态:', {
      Token: token ? `✅ 已设置 (${token.substring(0, 10)}...)` : '❌ 未设置',
      用户信息: userInfo ? '✅ 已设置' : '❌ 未设置',
      登录状态: (token && userInfo) ? '✅ 已登录' : '❌ 未登录'
    });
    
    if (!token || !userInfo) {
      console.log('💡 建议: 先登录账号以测试需要认证的保险功能');
    }
  },
  
  // 模拟保险功能点击
  async simulateInsuranceActions() {
    console.log('\n🔍 4. 模拟保险功能点击...');
    
    // 查找保险相关按钮
    const buttons = document.querySelectorAll('button, .btn, .action-btn');
    const insuranceButtons = Array.from(buttons).filter(btn => {
      const text = btn.textContent || '';
      return text.includes('保险') || text.includes('保单') || text.includes('理赔') || text.includes('续保');
    });
    
    console.log(`📋 找到${insuranceButtons.length}个保险相关按钮`);
    
    if (insuranceButtons.length > 0) {
      insuranceButtons.forEach((btn, index) => {
        console.log(`📌 按钮${index + 1}: "${btn.textContent.trim()}"`);
        
        // 模拟点击事件（仅检测，不实际点击）
        const hasClickHandler = btn.onclick || btn.getAttribute('onclick') || 
                               btn.getAttribute('@click') || btn.getAttribute('v-on:click');
        console.log(`   点击处理: ${hasClickHandler ? '✅ 已配置' : '❌ 未配置'}`);
      });
    }
  },
  
  // 生成问题报告
  generateReport() {
    console.log('\n📋 5. 生成问题报告...');
    
    const report = {
      测试时间: new Date().toLocaleString('zh-CN'),
      API状态: '需要运行testApiConnection()查看',
      页面状态: '需要运行testPageFunctions()查看',
      认证状态: '需要运行testAuthStatus()查看',
      建议操作: []
    };
    
    // 基础建议
    report.建议操作.push('1. 运行完整测试: insuranceTest.runAllTests()');
    report.建议操作.push('2. 确保已登录用户账号');
    report.建议操作.push('3. 在保险列表或我的保单页面进行测试');
    
    console.log('📊 测试报告:', report);
    return report;
  },
  
  // 运行所有测试
  async runAllTests() {
    console.log('🚀 开始运行保险功能完整测试...\n');
    
    try {
      await this.testApiConnection();
      await this.testPageFunctions();
      this.testAuthStatus();
      await this.simulateInsuranceActions();
      this.generateReport();
      
      console.log('\n✅ 所有测试完成！');
      console.log('💡 如果发现问题，请查看上面的测试结果并按照建议进行修复。');
    } catch (error) {
      console.error('❌ 测试过程中出现错误:', error);
    }
  },
  
  // 快速诊断
  async quickDiagnosis() {
    console.log('⚡ 快速诊断保险功能问题...\n');
    
    const issues = [];
    const suggestions = [];
    
    // 检查API连接
    try {
      const response = await fetch(this.baseUrl + '/insurance/products?page=1&pageSize=1');
      if (response.ok) {
        console.log('✅ API服务器连接正常');
      } else {
        issues.push('API服务器连接异常');
        suggestions.push('检查服务器状态和网络连接');
      }
    } catch (error) {
      issues.push('无法连接到API服务器');
      suggestions.push('检查网络连接和服务器地址');
    }
    
    // 检查认证状态
    const token = uni?.getStorageSync('token') || localStorage.getItem('token');
    if (!token) {
      issues.push('用户未登录');
      suggestions.push('请先登录账号以使用完整功能');
    }
    
    // 检查页面状态
    const route = getCurrentPages?.()[getCurrentPages().length - 1]?.route || window.location.pathname;
    if (!route.includes('insurance')) {
      issues.push('不在保险页面');
      suggestions.push('请导航到保险列表或我的保单页面');
    }
    
    // 输出诊断结果
    console.log('🔍 诊断结果:');
    if (issues.length === 0) {
      console.log('✅ 未发现明显问题');
    } else {
      console.log('❌ 发现以下问题:');
      issues.forEach((issue, index) => console.log(`   ${index + 1}. ${issue}`));
    }
    
    console.log('\n💡 建议操作:');
    suggestions.forEach((suggestion, index) => console.log(`   ${index + 1}. ${suggestion}`));
    
    return { issues, suggestions };
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.insuranceTest = insuranceTest;
}

// 显示使用说明
console.log(`
📖 使用方法:
• 完整测试: insuranceTest.runAllTests()
• 快速诊断: insuranceTest.quickDiagnosis()
• API连接测试: insuranceTest.testApiConnection()
• 页面功能测试: insuranceTest.testPageFunctions()
• 认证状态检查: insuranceTest.testAuthStatus()
• 生成报告: insuranceTest.generateReport()

💡 建议在保险相关页面运行测试以获得最准确的结果。
`);

// 如果在uni-app环境中，自动运行快速诊断
if (typeof uni !== 'undefined') {
  setTimeout(() => {
    console.log('🔄 自动运行快速诊断...');
    insuranceTest.quickDiagnosis();
  }, 1000);
}
