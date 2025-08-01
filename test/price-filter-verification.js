// 价格区间按钮修复验证脚本
// 在浏览器控制台中运行此脚本来验证修复效果

console.log('🔧 开始价格区间按钮修复验证...');

// 验证函数集合
const verification = {
  // 检查页面元素是否存在
  checkElements() {
    console.log('📋 1. 检查页面元素...');
    
    const filterButton = document.querySelector('.filter-item:last-child');
    const filterDialog = document.querySelector('.filter-dialog');
    const priceSection = document.querySelector('.filter-section:nth-child(3)');
    const priceTags = document.querySelectorAll('.filter-section:nth-child(3) .filter-tag');
    
    console.log('筛选按钮:', filterButton ? '✅ 存在' : '❌ 不存在');
    console.log('筛选弹窗:', filterDialog ? '✅ 存在' : '❌ 不存在');
    console.log('价格区间部分:', priceSection ? '✅ 存在' : '❌ 不存在');
    console.log('价格标签数量:', priceTags.length);
    
    return { filterButton, filterDialog, priceSection, priceTags };
  },
  
  // 检查Vue实例和响应式数据
  checkVueData() {
    console.log('📋 2. 检查Vue响应式数据...');
    
    try {
      // 尝试获取Vue实例（这在生产环境中可能不可用）
      const app = window.__VUE__;
      if (app) {
        console.log('Vue实例:', '✅ 可访问');
      } else {
        console.log('Vue实例:', '⚠️ 不可直接访问（正常情况）');
      }
    } catch (e) {
      console.log('Vue实例:', '⚠️ 不可访问（正常情况）');
    }
  },
  
  // 模拟点击测试
  testClicks() {
    console.log('📋 3. 模拟点击测试...');
    
    const elements = this.checkElements();
    
    if (!elements.filterButton) {
      console.log('❌ 无法进行点击测试：找不到筛选按钮');
      return;
    }
    
    // 1. 点击筛选按钮打开弹窗
    console.log('🔄 模拟点击筛选按钮...');
    elements.filterButton.click();
    
    setTimeout(() => {
      const openDialog = document.querySelector('.filter-dialog');
      if (openDialog && openDialog.style.display !== 'none') {
        console.log('✅ 筛选弹窗成功打开');
        
        // 2. 测试价格区间按钮点击
        const priceTags = document.querySelectorAll('.filter-section:nth-child(3) .filter-tag');
        if (priceTags.length > 0) {
          console.log('🔄 测试价格区间按钮点击...');
          
          priceTags.forEach((tag, index) => {
            setTimeout(() => {
              console.log(`🔄 点击第 ${index + 1} 个价格区间按钮:`, tag.textContent);
              tag.click();
              
              // 检查按钮状态
              setTimeout(() => {
                const isActive = tag.classList.contains('active');
                console.log(`📊 按钮 "${tag.textContent}" 状态:`, isActive ? '✅ 已选中' : '⚠️ 未选中');
              }, 100);
              
            }, index * 500);
          });
        } else {
          console.log('❌ 找不到价格区间按钮');
        }
      } else {
        console.log('❌ 筛选弹窗未能打开');
      }
    }, 300);
  },
  
  // 检查样式和CSS
  checkStyles() {
    console.log('📋 4. 检查样式...');
    
    const priceTags = document.querySelectorAll('.filter-section:nth-child(3) .filter-tag');
    
    if (priceTags.length > 0) {
      const firstTag = priceTags[0];
      const styles = window.getComputedStyle(firstTag);
      
      console.log('价格按钮样式检查:');
      console.log('- cursor:', styles.cursor);
      console.log('- transition:', styles.transition);
      console.log('- position:', styles.position);
      console.log('- z-index:', styles.zIndex);
      console.log('- pointer-events:', styles.pointerEvents);
    }
  },
  
  // 监听控制台日志
  monitorLogs() {
    console.log('📋 5. 监听筛选相关日志...');
    
    // 重写console.log来捕获我们的调试信息
    const originalLog = console.log;
    console.log = function(...args) {
      const message = args.join(' ');
      if (message.includes('🔍 [价格筛选]') || message.includes('🔍 [筛选重置]')) {
        console.warn('📢 检测到筛选日志:', message);
      }
      originalLog.apply(console, args);
    };
    
    console.log('✅ 日志监听已启动，请手动操作筛选功能');
  },
  
  // 运行所有验证
  runAll() {
    console.log('🚀 运行完整验证流程...');
    
    this.checkElements();
    this.checkVueData();
    this.checkStyles();
    this.monitorLogs();
    
    // 延迟执行点击测试，给页面加载时间
    setTimeout(() => {
      this.testClicks();
    }, 1000);
  }
};

// 工具函数：快速测试价格按钮
window.testPriceButtons = function() {
  console.log('🧪 快速测试价格按钮功能...');
  
  // 打开筛选弹窗
  const filterBtn = document.querySelector('.filter-item:last-child');
  if (filterBtn) {
    filterBtn.click();
    
    setTimeout(() => {
      const priceTags = document.querySelectorAll('.filter-section:nth-child(3) .filter-tag');
      console.log(`找到 ${priceTags.length} 个价格按钮`);
      
      if (priceTags.length > 0) {
        // 点击第一个按钮
        console.log('点击第一个价格按钮...');
        priceTags[0].click();
        
        setTimeout(() => {
          const isActive = priceTags[0].classList.contains('active');
          console.log('第一个按钮状态:', isActive ? '✅ 已激活' : '❌ 未激活');
          
          // 再次点击同一个按钮（应该取消选择）
          console.log('再次点击第一个按钮（测试取消选择）...');
          priceTags[0].click();
          
          setTimeout(() => {
            const isStillActive = priceTags[0].classList.contains('active');
            console.log('第一个按钮状态:', isStillActive ? '❌ 仍然激活' : '✅ 已取消');
          }, 200);
        }, 200);
      }
    }, 300);
  }
};

// 工具函数：检查API请求
window.checkApiRequests = function() {
  console.log('🌐 监听API请求...');
  
  // 拦截fetch请求
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const options = args[1] || {};
    
    if (url.includes('/goods/list') || url.includes('goods')) {
      console.log('📡 检测到商品API请求:');
      console.log('- URL:', url);
      console.log('- 方法:', options.method || 'GET');
      console.log('- 参数:', options.body ? JSON.parse(options.body) : '无');
    }
    
    return originalFetch.apply(this, args);
  };
  
  console.log('✅ API请求监听已启动');
};

// 导出验证对象到全局
window.priceFilterVerification = verification;

// 自动运行基础检查
verification.checkElements();
verification.checkStyles();

console.log('🎯 验证脚本加载完成！');
console.log('📖 使用方法:');
console.log('- 运行完整验证: priceFilterVerification.runAll()');
console.log('- 快速测试按钮: testPriceButtons()');
console.log('- 监听API请求: checkApiRequests()');
console.log('- 单独测试点击: priceFilterVerification.testClicks()');
