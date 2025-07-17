/**
 * 商品API测试工具
 * 用于测试商品相关接口和新的分类功能
 */

import { goodsApi } from './api'
import { BASE_URL } from './config'

// 新的商品分类列表
const NEW_CATEGORIES = ['猫粮', '狗粮', '玩具', '零食', '护毛素', '猫砂', '除臭剂', '沐浴露']

/**
 * 测试商品列表API
 */
export const testGoodsListAPI = async () => {
  console.log('=== 测试商品列表API ===')
  console.log('API基础URL:', BASE_URL)
  
  try {
    // 测试基础商品列表
    console.log('1. 测试基础商品列表...')
    const basicResult = await goodsApi.getGoodsList()
    console.log('基础列表结果:', basicResult)
    
    // 测试每个新分类的商品筛选
    console.log('2. 测试新分类筛选...')
    for (const category of NEW_CATEGORIES) {
      console.log(`测试分类: ${category}`)
      try {
        const categoryResult = await goodsApi.getGoodsList({ category })
        console.log(`${category} 分类结果:`, categoryResult)
      } catch (error) {
        console.error(`${category} 分类测试失败:`, error.message)
      }
    }
    
    // 测试搜索功能
    console.log('3. 测试搜索功能...')
    const searchResult = await goodsApi.searchGoods('猫粮')
    console.log('搜索结果:', searchResult)
    
    // 测试热门商品
    console.log('4. 测试热门商品...')
    const hotResult = await goodsApi.getHotGoods()
    console.log('热门商品结果:', hotResult)
    
    return {
      success: true,
      message: 'API测试完成',
      categories: NEW_CATEGORIES
    }
  } catch (error) {
    console.error('API测试失败:', error)
    return {
      success: false,
      message: `API测试失败: ${error.message}`,
      error: error
    }
  }
}

/**
 * 测试商品详情API
 */
export const testGoodsDetailAPI = async (goodsId = 1) => {
  console.log('=== 测试商品详情API ===')
  console.log(`测试商品ID: ${goodsId}`)
  
  try {
    const result = await goodsApi.getGoodsDetail(goodsId)
    console.log('商品详情结果:', result)
    return {
      success: true,
      data: result,
      message: '商品详情获取成功'
    }
  } catch (error) {
    console.error('商品详情测试失败:', error)
    return {
      success: false,
      message: `商品详情获取失败: ${error.message}`,
      error: error
    }
  }
}

/**
 * 检查API连接状态
 */
export const checkAPIConnection = async () => {
  console.log('=== 检查API连接状态 ===')
  
  try {
    // 尝试获取商品列表来检查连接
    const result = await goodsApi.getGoodsList({ pageSize: 1 })
    
    const status = {
      connected: true,
      baseUrl: BASE_URL,
      timestamp: new Date().toISOString(),
      categories: NEW_CATEGORIES,
      response: result
    }
    
    console.log('API连接状态:', status)
    return status
  } catch (error) {
    const status = {
      connected: false,
      baseUrl: BASE_URL,
      timestamp: new Date().toISOString(),
      error: error.message,
      categories: NEW_CATEGORIES
    }
    
    console.error('API连接失败:', status)
    return status
  }
}

// 导出所有测试函数
export default {
  testGoodsListAPI,
  testGoodsDetailAPI,
  checkAPIConnection,
  NEW_CATEGORIES
}
