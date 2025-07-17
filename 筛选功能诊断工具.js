/**
 * 筛选功能诊断工具
 * 用于检查当前筛选到底是前端还是后端实现
 */

// 在浏览器控制台中运行此代码来诊断筛选功能

function diagnoseFilterFunction() {
  console.log('=== PetPal 筛选功能诊断 ===')
  
  // 1. 检查配置
  console.log('1. 检查配置状态:')
  
  // 检查 USE_MOCK 配置
  try {
    // 尝试从页面中获取配置信息
    const configScript = document.querySelector('script[src*="config"]')
    console.log('配置文件:', configScript ? configScript.src : '未找到')
    
    // 检查网络请求
    console.log('2. 检查网络活动:')
    console.log('请打开开发者工具的Network面板，然后执行筛选操作')
    
    // 提供手动测试指南
    console.log('3. 手动测试指南:')
    console.log('a) 打开 Chrome DevTools (F12)')
    console.log('b) 切换到 Network 面板') 
    console.log('c) 清空请求列表')
    console.log('d) 在页面上点击"筛选"按钮并应用筛选条件')
    console.log('e) 观察是否有新的网络请求')
    
    console.log('4. 预期行为:')
    console.log('- 如果是后端筛选: 应该看到发往 /goods/list 的API请求')
    console.log('- 如果是前端筛选: 不会有新的网络请求')
    
  } catch (error) {
    console.error('诊断过程出错:', error)
  }
}

// 网络请求监控函数
function monitorNetworkRequests() {
  console.log('=== 开始监控网络请求 ===')
  
  // 保存原始的 fetch 函数
  const originalFetch = window.fetch
  
  // 重写 fetch 函数以监控请求
  window.fetch = function(...args) {
    const url = args[0]
    const options = args[1] || {}
    
    console.log('🌐 网络请求:', {
      url: url,
      method: options.method || 'GET',
      timestamp: new Date().toISOString()
    })
    
    // 调用原始 fetch 并返回结果
    return originalFetch.apply(this, args)
      .then(response => {
        console.log('✅ 请求完成:', {
          url: url,
          status: response.status,
          timestamp: new Date().toISOString()
        })
        return response
      })
      .catch(error => {
        console.error('❌ 请求失败:', {
          url: url,
          error: error.message,
          timestamp: new Date().toISOString()
        })
        throw error
      })
  }
  
  console.log('网络请求监控已启用，现在执行筛选操作来查看请求')
}

// 检查当前页面的Vue实例和数据
function checkPageState() {
  console.log('=== 检查页面状态 ===')
  
  try {
    // 尝试获取Vue实例（仅在开发模式下可用）
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('Vue DevTools 可用')
    }
    
    // 检查是否在uni-app环境中
    if (typeof uni !== 'undefined') {
      console.log('✅ 运行在 uni-app 环境中')
      console.log('当前页面栈:', getCurrentPages().length, '个页面')
    }
    
    // 检查API基础URL
    console.log('检查API配置...')
    
  } catch (error) {
    console.error('检查页面状态失败:', error)
  }
}

// 快速测试API连接
async function quickTestAPI() {
  console.log('=== 快速测试API连接 ===')
  
  const apiUrl = 'https://udrvmlsoncfg.sealosbja.site/api/goods/list'
  
  try {
    console.log('正在测试API连接...')
    const response = await fetch(apiUrl + '?page=1&pageSize=1')
    const data = await response.json()
    
    console.log('✅ API连接成功:', {
      status: response.status,
      data: data
    })
    
    return data
  } catch (error) {
    console.error('❌ API连接失败:', error)
    return null
  }
}

// 执行完整诊断
function runFullDiagnosis() {
  console.clear()
  console.log('🔍 PetPal 筛选功能完整诊断')
  console.log('=====================================')
  
  diagnoseFilterFunction()
  console.log('\n')
  checkPageState()
  console.log('\n')
  monitorNetworkRequests()
  console.log('\n')
  
  console.log('请在执行筛选操作后查看上方的网络请求日志')
  console.log('=====================================')
  
  // 测试API连接
  quickTestAPI().then(result => {
    if (result) {
      console.log('\n✅ API服务器可用，筛选应该使用后端处理')
    } else {
      console.log('\n❌ API服务器不可用，可能回退到前端筛选')
    }
  })
}

// 使用说明
console.log(`
🔧 PetPal 筛选诊断工具使用说明:

1. 在浏览器控制台中运行: runFullDiagnosis()
2. 然后在页面上执行筛选操作
3. 观察控制台的网络请求日志

或者分别运行:
- diagnoseFilterFunction() - 基础诊断
- monitorNetworkRequests() - 监控网络请求  
- quickTestAPI() - 测试API连接
- checkPageState() - 检查页面状态
`)

// 导出函数到全局，方便在控制台使用
window.diagnoseFilter = {
  runFullDiagnosis,
  diagnoseFilterFunction,
  monitorNetworkRequests,
  quickTestAPI,
  checkPageState
}
