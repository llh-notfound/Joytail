import { get, post, put, del } from '../request';

/**
 * 获取地址列表
 * @returns {Promise} 请求结果
 */
export const getAddressList = () => {
  return get('/address/list', {}, true);
};

/**
 * 添加地址
 * @param {object} addressData - 地址信息
 * @returns {Promise} 请求结果
 */
export const addAddress = (addressData) => {
  return post('/address/add', addressData, true);
};

/**
 * 更新地址
 * @param {string} addressId - 地址ID
 * @param {object} addressData - 地址信息
 * @returns {Promise} 请求结果
 */
export const updateAddress = (addressId, addressData) => {
  return put(`/address/update/${addressId}`, addressData, true);
};

/**
 * 删除地址
 * @param {string} addressId - 地址ID
 * @returns {Promise} 请求结果
 */
export const deleteAddress = (addressId) => {
  return del(`/address/delete/${addressId}`, {}, true);
};

/**
 * 设为默认地址
 * @param {string} addressId - 地址ID
 * @returns {Promise} 请求结果
 */
export const setDefaultAddress = (addressId) => {
  return put(`/address/set-default/${addressId}`, {}, true);
};

export default {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}; 