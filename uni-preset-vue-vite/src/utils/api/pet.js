import { get, post, put, del, upload } from '../request';

/**
 * 获取宠物列表
 * @returns {Promise} 请求结果
 */
export const getPetList = () => {
  return get('/pet/list', {}, true);
};

/**
 * 获取宠物详情
 * @param {string} petId - 宠物ID
 * @returns {Promise} 请求结果
 */
export const getPetDetail = (petId) => {
  return get(`/pet/detail/${petId}`, {}, true);
};

/**
 * 新增宠物
 * @param {object} data - 宠物信息
 * @returns {Promise} 请求结果
 */
export const addPet = (data) => {
  return post('/pet/add', data, true);
};

/**
 * 更新宠物信息
 * @param {string} petId - 宠物ID
 * @param {object} data - 宠物信息
 * @returns {Promise} 请求结果
 */
export const updatePet = (petId, data) => {
  return put(`/pet/update/${petId}`, data, true);
};

/**
 * 删除宠物
 * @param {string} petId - 宠物ID
 * @returns {Promise} 请求结果
 */
export const deletePet = (petId) => {
  return del(`/pet/delete/${petId}`, {}, true);
};

/**
 * 上传宠物头像
 * @param {string} filePath - 文件路径
 * @returns {Promise} 请求结果
 */
export const uploadPetAvatar = (filePath) => {
  return upload('/pet/upload-avatar', filePath, 'file', {}, true);
};

export default {
  getPetList,
  getPetDetail,
  addPet,
  updatePet,
  deletePet,
  uploadPetAvatar
}; 