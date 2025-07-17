import { get, post, upload } from '../request';

/**
 * 上传图片
 * @param {string} filePath - 文件路径
 * @param {string} type - 图片用途（可选，user-用户头像，pet-宠物头像，goods-商品图片）
 * @returns {Promise} 请求结果
 */
export const uploadImage = (filePath, type = '') => {
  return upload('/common/upload-image', filePath, 'file', { type }, true);
};

/**
 * 获取用户协议
 * @returns {Promise} 请求结果
 */
export const getUserPolicy = () => {
  return get('/common/user-policy');
};

/**
 * 获取隐私政策
 * @returns {Promise} 请求结果
 */
export const getPrivacyPolicy = () => {
  return get('/common/privacy-policy');
};

/**
 * 提交意见反馈
 * @param {string} type - 反馈类型
 * @param {string} content - 反馈内容
 * @param {Array<string>} images - 图片URL数组(选填)
 * @returns {Promise} 请求结果
 */
export const submitFeedback = (type, content, images = []) => {
  return post('/feedback/submit', { type, content, images }, true);
};

export default {
  uploadImage,
  getUserPolicy,
  getPrivacyPolicy,
  submitFeedback
}; 