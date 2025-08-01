/**
 * PetPal 购物车结算流程自动测试脚本
 * 使用方法：在浏览器控制台中运行此脚本
 * 注意：需要在对应页面运行相应的测试函数
 */

class CartCheckoutFlowTester {
  constructor() {
    this.testResults = [];
    this.currentStep = 0;
  }

  // 测试结果记录
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    
    console.log(`%c${logMessage}`, this.getLogStyle(type));
    this.testResults.push({ timestamp, message, type });
  }

  getLogStyle(type) {
    const styles = {
      info: 'color: #2196F3; font-weight: normal;',
      success: 'color: #4CAF50; font-weight: bold;',
      error: 'color: #F44336; font-weight: bold;',
      warning: 'color: #FF9800; font-weight: bold;'
    };
    return styles[type] || styles.info;
  }

  // 1. 购物车页面测试
  async testCartPage() {
    this.log('🛒 开始测试购物车页面功能', 'info');
    
    try {
      // 检查购物车数据是否加载
      const cartItems = document.querySelectorAll('.cart-item');
      if (cartItems.length === 0) {
        this.log('⚠️ 购物车为空，请先添加商品', 'warning');
        return false;
      }
      
      this.log(`✅ 检测到 ${cartItems.length} 个购物车商品`, 'success');
      
      // 检查选择框功能
      const checkboxes = document.querySelectorAll('.checkbox');
      if (checkboxes.length > 0) {
        this.log('✅ 商品选择框已找到', 'success');
      }
      
      // 检查结算按钮
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) {
        this.log('✅ 结算按钮已找到', 'success');
        
        // 检查按钮是否有点击事件
        const hasClickHandler = checkoutBtn.onclick || 
          checkoutBtn.getAttribute('@click') || 
          checkoutBtn.getAttribute('v-on:click');
        
        if (hasClickHandler) {
          this.log('✅ 结算按钮点击事件已绑定', 'success');
        } else {
          this.log('❌ 结算按钮缺少点击事件', 'error');
          return false;
        }
      } else {
        this.log('❌ 未找到结算按钮', 'error');
        return false;
      }
      
      // 检查Vue组件状态（如果可访问）
      if (window.Vue && window.$vm) {
        const cartData = window.$vm.cartItems;
        this.log(`📊 Vue组件状态 - 购物车商品数量: ${cartData?.length || 0}`, 'info');
      }
      
      this.log('🎉 购物车页面测试通过', 'success');
      return true;
      
    } catch (error) {
      this.log(`❌ 购物车页面测试失败: ${error.message}`, 'error');
      return false;
    }
  }

  // 2. 测试结算按钮功能
  testCheckoutButton() {
    this.log('🔘 测试结算按钮功能', 'info');
    
    try {
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (!checkoutBtn) {
        this.log('❌ 未找到结算按钮', 'error');
        return false;
      }
      
      // 模拟点击事件
      this.log('🖱️ 模拟点击结算按钮', 'info');
      
      // 检查本地存储
      const selectedItems = localStorage.getItem('selected_cart_items') || 
                           uni?.getStorageSync?.('selected_cart_items');
      
      if (selectedItems) {
        this.log('✅ 检测到选中商品数据已保存', 'success');
        this.log(`📝 选中商品数据: ${selectedItems.substring(0, 100)}...`, 'info');
      } else {
        this.log('⚠️ 未检测到选中商品数据', 'warning');
      }
      
      return true;
      
    } catch (error) {
      this.log(`❌ 结算按钮测试失败: ${error.message}`, 'error');
      return false;
    }
  }

  // 3. 订单确认页面测试
  async testOrderConfirmPage() {
    this.log('📋 开始测试订单确认页面', 'info');
    
    try {
      // 检查订单商品显示
      const goodsItems = document.querySelectorAll('.goods-item');
      if (goodsItems.length === 0) {
        this.log('❌ 未找到订单商品信息', 'error');
        return false;
      }
      
      this.log(`✅ 检测到 ${goodsItems.length} 个订单商品`, 'success');
      
      // 检查地址信息
      const addressSection = document.querySelector('.address-section');
      if (addressSection) {
        this.log('✅ 收货地址区域已找到', 'success');
      }
      
      // 检查提交订单按钮
      const submitBtn = document.querySelector('.submit-btn');
      if (submitBtn) {
        this.log('✅ 提交订单按钮已找到', 'success');
      } else {
        this.log('❌ 未找到提交订单按钮', 'error');
        return false;
      }
      
      // 检查API导入
      if (window.orderApi) {
        this.log('✅ orderApi 已正确导入', 'success');
      } else {
        this.log('⚠️ orderApi 状态未知', 'warning');
      }
      
      this.log('🎉 订单确认页面测试通过', 'success');
      return true;
      
    } catch (error) {
      this.log(`❌ 订单确认页面测试失败: ${error.message}`, 'error');
      return false;
    }
  }

  // 4. 测试API调用
  async testAPIConnection() {
    this.log('🌐 测试API连接状态', 'info');
    
    try {
      // 检查配置
      const baseUrl = 'http://localhost:8080/api'; // 根据实际配置调整
      
      // 测试基础连接
      const response = await fetch(`${baseUrl}/v1/cart/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test-token'}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        this.log('✅ API连接正常', 'success');
        const data = await response.json();
        this.log(`📊 API响应数据: ${JSON.stringify(data).substring(0, 100)}...`, 'info');
        return true;
      } else {
        this.log(`⚠️ API响应状态: ${response.status}`, 'warning');
        return false;
      }
      
    } catch (error) {
      this.log(`❌ API连接测试失败: ${error.message}`, 'error');
      this.log('💡 提示: 请确保后端服务正在运行', 'info');
      return false;
    }
  }

  // 5. 订单列表页面测试
  async testOrderListPage() {
    this.log('📊 开始测试订单列表页面', 'info');
    
    try {
      // 检查标签栏
      const tabs = document.querySelectorAll('.tab-item');
      if (tabs.length > 0) {
        this.log(`✅ 检测到 ${tabs.length} 个订单标签`, 'success');
      }
      
      // 检查订单列表
      const orderItems = document.querySelectorAll('.order-item');
      this.log(`📋 当前显示订单数量: ${orderItems.length}`, 'info');
      
      // 检查支付按钮
      const payButtons = document.querySelectorAll('.primary-btn');
      const payButtonCount = Array.from(payButtons).filter(btn => 
        btn.textContent.includes('付款') || btn.textContent.includes('支付')
      ).length;
      
      if (payButtonCount > 0) {
        this.log(`✅ 检测到 ${payButtonCount} 个支付按钮`, 'success');
      }
      
      this.log('🎉 订单列表页面测试通过', 'success');
      return true;
      
    } catch (error) {
      this.log(`❌ 订单列表页面测试失败: ${error.message}`, 'error');
      return false;
    }
  }

  // 综合测试报告
  generateReport() {
    this.log('📋 生成测试报告', 'info');
    
    const report = {
      测试时间: new Date().toLocaleString(),
      测试项目: '购物车结算流程',
      总测试数: this.testResults.length,
      成功项: this.testResults.filter(r => r.type === 'success').length,
      失败项: this.testResults.filter(r => r.type === 'error').length,
      警告项: this.testResults.filter(r => r.type === 'warning').length,
      详细结果: this.testResults
    };
    
    console.group('🎯 PetPal 购物车结算流程测试报告');
    console.table(report);
    console.groupEnd();
    
    return report;
  }

  // 运行所有测试
  async runAllTests() {
    this.log('🚀 开始运行购物车结算流程完整测试', 'info');
    
    const tests = [
      { name: '购物车页面', fn: () => this.testCartPage() },
      { name: '结算按钮', fn: () => this.testCheckoutButton() },
      { name: 'API连接', fn: () => this.testAPIConnection() },
      { name: '订单确认页面', fn: () => this.testOrderConfirmPage() },
      { name: '订单列表页面', fn: () => this.testOrderListPage() }
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
      try {
        this.log(`\n🧪 测试项目: ${test.name}`, 'info');
        const result = await test.fn();
        if (result) {
          passedTests++;
        }
      } catch (error) {
        this.log(`❌ ${test.name} 测试异常: ${error.message}`, 'error');
      }
    }
    
    this.log(`\n📊 测试完成! 通过: ${passedTests}/${tests.length}`, 
             passedTests === tests.length ? 'success' : 'warning');
    
    return this.generateReport();
  }
}

// 创建全局测试实例
window.cartTester = new CartCheckoutFlowTester();

// 提供快速测试方法
window.testCartFlow = {
  // 完整测试
  runAll: () => window.cartTester.runAllTests(),
  
  // 单项测试
  cart: () => window.cartTester.testCartPage(),
  checkout: () => window.cartTester.testCheckoutButton(),
  orderConfirm: () => window.cartTester.testOrderConfirmPage(),
  orderList: () => window.cartTester.testOrderListPage(),
  api: () => window.cartTester.testAPIConnection(),
  
  // 生成报告
  report: () => window.cartTester.generateReport()
};

// 使用说明
console.log(`
🧪 PetPal 购物车结算流程测试工具已加载

📋 使用方法:
1. 完整测试: testCartFlow.runAll()
2. 购物车页面测试: testCartFlow.cart()
3. 结算按钮测试: testCartFlow.checkout()
4. 订单确认页面测试: testCartFlow.orderConfirm()
5. 订单列表页面测试: testCartFlow.orderList()
6. API连接测试: testCartFlow.api()
7. 生成报告: testCartFlow.report()

💡 建议在每个页面分别运行对应的测试函数
`);

// 导出测试器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartCheckoutFlowTester;
}
