import { get, post, put, del } from '../request';

/**
 * 获取购物车列表
 * @returns {Promise} 请求结果
 */
export const getCartList = () => {
  return get('/cart/list', {}, true);
};

/**
 * 添加商品到购物车
 * @param {number|string} goodsId - 商品ID
 * @param {number} quantity - 数量
 * @param {string} specs - 规格(可选)
 * @returns {Promise} 请求结果
 */
export const addToCart = (goodsId, quantity, specs = '') => {
  return post('/cart/add', { goodsId, quantity, specs }, true);
};

/**
 * 更新购物车商品数量
 * @param {string} cartItemId - 购物车项ID
 * @param {number} quantity - 数量
 * @returns {Promise} 请求结果
 */
export const updateCartItem = (cartItemId, quantity) => {
  return put('/cart/update', { cartItemId, quantity }, true);
};

/**
 * 更新购物车商品选中状态
 * @param {string} cartItemId - 购物车项ID
 * @param {boolean} selected - 是否选中
 * @returns {Promise} 请求结果
 */
export const updateCartItemSelected = (cartItemId, selected) => {
  return put('/cart/select', { cartItemId, selected }, true);
};

/**
 * 全选/取消全选购物车商品
 * @param {boolean} selected - 是否全选
 * @returns {Promise} 请求结果
 */
export const selectAllCartItems = (selected) => {
  return put('/cart/select-all', { selected }, true);
};

/**
 * 删除购物车商品
 * @param {Array<string>} cartItemIds - 购物车项ID数组
 * @returns {Promise} 请求结果
 */
export const deleteCartItems = (cartItemIds) => {
  return del('/cart/delete', { cartItemIds }, true);
};

export default {
  getCartList,
  addToCart,
  updateCartItem,
  updateCartItemSelected,
  selectAllCartItems,
  deleteCartItems
}; 