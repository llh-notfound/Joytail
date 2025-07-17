/**
 * 商品筛选功能测试工具
 * 测试前端筛选改为后端筛选后的功能
 */

import { goodsApi } from './api'

/**
 * 测试商品筛选功能
 */
export const testGoodsFilter = async () => {
  console.log('=== 测试商品筛选功能 ===')
  
  const testCases = [
    {
      name: '测试分类筛选 - 猫粮',
      params: { category: '猫粮', page: 1, pageSize: 5 }
    },
    {
      name: '测试品牌筛选 - 皇家',
      params: { brand: '皇家', page: 1, pageSize: 5 }
    },
    {
      name: '测试价格区间筛选 - 50-100元',
      params: { minPrice: 50, maxPrice: 100, page: 1, pageSize: 5 }
    },
    {
      name: '测试搜索关键词 - 猫粮',
      params: { keyword: '猫粮', page: 1, pageSize: 5 }
    },
    {
      name: '测试排序 - 价格升序',
      params: { sortBy: 'price_asc', page: 1, pageSize: 5 }
    },
    {
      name: '测试排序 - 销量降序',
      params: { sortBy: 'sales_desc', page: 1, pageSize: 5 }
    },
    {
      name: '测试组合筛选 - 猫粮+皇家+价格区间',
      params: { 
        category: '猫粮', 
        brand: '皇家', 
        minPrice: 30, 
        maxPrice: 200, 
        sortBy: 'price_asc',
        page: 1, 
        pageSize: 5 
      }
    }
  ]
  
  const results = []
  
  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`)
    console.log('请求参数:', testCase.params)
    
    try {
      const result = await goodsApi.getGoodsList(testCase.params)
      console.log('✅ 成功:', result)
      
      results.push({
        testName: testCase.name,
        success: true,
        params: testCase.params,
        result: result.data
      })
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.error('❌ 失败:', error.message)
      
      results.push({
        testName: testCase.name,
        success: false,
        params: testCase.params,
        error: error.message
      })
    }
  }
  
  // 生成测试报告
  const report = {
    totalTests: testCases.length,
    successCount: results.filter(r => r.success).length,
    failureCount: results.filter(r => !r.success).length,
    results: results,
    timestamp: new Date().toISOString()
  }
  
  console.log('\n=== 测试报告 ===')
  console.log(`总测试数: ${report.totalTests}`)
  console.log(`成功: ${report.successCount}`)
  console.log(`失败: ${report.failureCount}`)
  console.log('详细结果:', report)
  
  return report
}

/**
 * 快速测试单个筛选条件
 */
export const quickTestFilter = async (filterType, filterValue) => {
  const params = { page: 1, pageSize: 3 }
  
  switch (filterType) {
    case 'category':
      params.category = filterValue
      break
    case 'brand':
      params.brand = filterValue
      break
    case 'keyword':
      params.keyword = filterValue
      break
    case 'price':
      const [min, max] = filterValue.split('-').map(Number)
      params.minPrice = min
      params.maxPrice = max
      break
    default:
      console.error('不支持的筛选类型:', filterType)
      return null
  }
  
  console.log(`快速测试 ${filterType}: ${filterValue}`)
  console.log('请求参数:', params)
  
  try {
    const result = await goodsApi.getGoodsList(params)
    console.log('✅ 结果:', result)
    return result
  } catch (error) {
    console.error('❌ 错误:', error.message)
    return { error: error.message }
  }
}

export default {
  testGoodsFilter,
  quickTestFilter
}
