import { get, post } from '../request';
import { DEFAULT_PAGE_SIZE } from '../config';

/**
 * 获取优惠券列表
 * @param {string} status - 优惠券状态（可选，valid-有效，used-已使用，expired-已过期，all-全部）
 * @returns {Promise} 请求结果
 */
export const getCouponList = (status = 'all') => {
  return get('/coupon/list', { status }, true);
};

/**
 * 领取优惠券
 * @param {string} couponId - 优惠券ID
 * @returns {Promise} 请求结果
 */
export const receiveCoupon = (couponId) => {
  return post(`/coupon/receive/${couponId}`, {}, true);
};

/**
 * 获取积分记录
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} 请求结果
 */
export const getPointsRecord = (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/points/record', { page, pageSize }, true);
};

/**
 * 获取积分商城商品
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} 请求结果
 */
export const getPointsGoods = (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  return get('/points/goods', { page, pageSize }, true);
};

/**
 * 积分兑换商品
 * @param {string} goodsId - 商品ID
 * @param {number} quantity - 数量
 * @param {string} addressId - 地址ID
 * @returns {Promise} 请求结果
 */
export const exchangePoints = (goodsId, quantity, addressId) => {
  return post('/points/exchange', { goodsId, quantity, addressId }, true);
};

export default {
  getCouponList,
  receiveCoupon,
  getPointsRecord,
  getPointsGoods,
  exchangePoints
}; 