import { get, post } from '../request';
import { DEFAULT_PAGE_SIZE } from '../config';

/**
 * 创建订单（商品购买）
 * @param {Array<string>} cartItemIds - 购物车项ID数组
 * @param {string} addressId - 地址ID
 * @param {string} message - 订单留言(可选)
 * @returns {Promise} 请求结果
 */
export const createOrder = (cartItemIds, addressId, message = '') => {
  return post('/order/create', { cartItemIds, addressId, message }, true);
};

/**
 * 获取订单列表（宠物用品订单）
 * @param {string} status - 订单状态(可选)
 * @param {number} page - 页码(可选)
 * @param {number} pageSize - 每页数量(可选)
 * @returns {Promise} 请求结果
 */
export const getGoodsOrderList = (status = 'all', page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/order/goods-list', { status, page, pageSize }, true);
};

/**
 * 获取订单详情
 * @param {string} orderNumber - 订单号
 * @returns {Promise} 请求结果
 */
export const getOrderDetail = (orderNumber) => {
  return get(`/order/detail/${orderNumber}`, {}, true);
};

/**
 * 取消订单
 * @param {string} orderNumber - 订单号
 * @param {string} reason - 取消原因
 * @returns {Promise} 请求结果
 */
export const cancelOrder = (orderNumber, reason) => {
  return post(`/order/cancel/${orderNumber}`, { reason }, true);
};

/**
 * 确认收货
 * @param {string} orderNumber - 订单号
 * @returns {Promise} 请求结果
 */
export const confirmOrder = (orderNumber) => {
  return post(`/order/confirm/${orderNumber}`, {}, true);
};

/**
 * 订单支付
 * @param {string} orderNumber - 订单号
 * @param {string} paymentMethod - 支付方式
 * @param {string} paymentChannel - 支付渠道
 * @returns {Promise} 请求结果
 */
export const payOrder = (orderNumber, paymentMethod, paymentChannel) => {
  return post(`/order/pay/${orderNumber}`, { paymentMethod, paymentChannel }, true);
};

/**
 * 获取订单统计
 * @returns {Promise} 请求结果
 */
export const getOrderStats = () => {
  return get('/order/stats', {}, true);
};

/**
 * 获取待处理事项
 * @returns {Promise} 请求结果
 */
export const getPendingItems = () => {
  return get('/order/pending-items', {}, true);
};

/**
 * 获取保险订单列表
 * @param {string} status - 订单状态(可选)
 * @param {number} page - 页码(可选)
 * @param {number} pageSize - 每页数量(可选)
 * @returns {Promise} 请求结果
 */
export const getInsuranceOrderList = (status = 'all', page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/order/insurance-list', { status, page, pageSize }, true);
};

export default {
  createOrder,
  getGoodsOrderList,
  getOrderDetail,
  cancelOrder,
  confirmOrder,
  payOrder,
  getOrderStats,
  getPendingItems,
  getInsuranceOrderList
}; 