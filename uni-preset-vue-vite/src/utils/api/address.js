import { get, post, put, del } from '../request'

// 地址管理API
export const addressApi = {
  // 获取地址列表
  getAddressList: (params = {}) => {
    return get('/address/list', params, true)
  },

  // 新增地址
  addAddress: (addressData) => {
    return post('/address/add', addressData, true)
  },

  // 更新地址
  updateAddress: (addressData) => {
    return put('/address/update', addressData, true)
  },

  // 删除地址
  deleteAddress: (id) => {
    return del('/address/delete', { id }, true)
  },

  // 设置默认地址
  setDefaultAddress: (id) => {
    return put('/address/set-default', { id }, true)
  },

  // 获取默认地址
  getDefaultAddress: () => {
    return get('/address/default', {}, true)
  }
}

// 添加默认导出
export default addressApi 