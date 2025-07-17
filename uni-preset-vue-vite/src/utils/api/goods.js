import { get } from '../request';
import { DEFAULT_PAGE_SIZE } from '../config';

/**
 * 获取商品列表
 * @param {object} params - 查询参数
 * @returns {Promise} 请求结果
 */
export const getGoodsList = (params = {}) => {
  const defaultParams = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  };
  
  return get('/goods/list', { ...defaultParams, ...params });
};

/**
 * 获取商品详情
 * @param {number|string} goodsId - 商品ID
 * @returns {Promise} 请求结果
 */
export const getGoodsDetail = (goodsId) => {
  return get(`/goods/detail/${goodsId}`);
};

/**
 * 获取热门商品
 * @param {number} limit - 获取数量
 * @returns {Promise} 请求结果
 */
export const getHotGoods = (limit = 5) => {
  return get('/goods/hot', { limit });
};

/**
 * 商品搜索
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} 请求结果
 */
export const searchGoods = (keyword, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/goods/search', { keyword, page, pageSize });
};

export default {
  getGoodsList,
  getGoodsDetail,
  getHotGoods,
  searchGoods
}; 