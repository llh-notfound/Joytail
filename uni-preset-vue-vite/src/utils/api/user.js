import { get, post, put, upload } from '../request';

/**
 * 用户注册
 * @param {object} data - 注册信息 {username, password, email}
 * @returns {Promise} 请求结果
 */
export const register = (data) => {
  return post('/user/register', data);
};

/**
 * 用户登录
 * @param {string} username - 用户名/手机号/邮箱
 * @param {string} password - 密码
 * @returns {Promise} 请求结果
 */
export const login = (username, password) => {
  return post('/user/login', { username, password });
};

/**
 * 手机号验证码登录
 * @param {string} phone - 手机号
 * @param {string} code - 验证码
 * @returns {Promise} 请求结果
 */
export const phoneLogin = (phone, code) => {
  return post('/user/phone-login', { phone, code });
};

/**
 * 发送手机验证码
 * @param {string} phone - 手机号
 * @returns {Promise} 请求结果
 */
export const sendVerifyCode = (phone) => {
  return post('/user/send-code', { phone });
};

/**
 * 微信登录
 * @param {string} code - 微信临时登录凭证
 * @param {object} userInfo - 用户信息(选填)
 * @returns {Promise} 请求结果
 */
export const wxLogin = (code, userInfo = {}) => {
  return post('/user/wxlogin', { code, userInfo });
};

/**
 * 获取用户信息
 * @returns {Promise} 请求结果
 */
export const getUserInfo = () => {
  return get('/user/info', {}, true);
};

/**
 * 修改用户信息
 * @param {object} data - 用户信息
 * @returns {Promise} 请求结果
 */
export const updateUserInfo = (data) => {
  return put('/user/update', data, true);
};

/**
 * 修改密码
 * @param {string} oldPassword - 旧密码
 * @param {string} newPassword - 新密码
 * @returns {Promise} 请求结果
 */
export const changePassword = (oldPassword, newPassword) => {
  return put('/user/change-password', { oldPassword, newPassword }, true);
};

/**
 * 上传用户头像
 * @param {string} filePath - 文件路径
 * @returns {Promise} 请求结果
 */
export const uploadAvatar = (filePath) => {
  return upload('/user/upload-avatar', filePath, 'file', {}, true);
};

/**
 * 退出登录
 * @returns {Promise} 请求结果
 */
export const logout = () => {
  return post('/user/logout', {}, true);
};

export default {
  register,
  login,
  phoneLogin,
  sendVerifyCode,
  wxLogin,
  getUserInfo,
  updateUserInfo,
  changePassword,
  uploadAvatar,
  logout
}; 