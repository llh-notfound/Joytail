/**
 * API基础配置
 */

// API基础URL - 强制使用生产环境API地址
export const BASE_URL = 'https://ywzezvbcsivv.sealosbja.site/api';

// 图片服务器基础URL - 强制使用生产环境图片服务器地址
export const IMAGE_BASE_URL = 'https://ywzezvbcsivv.sealosbja.site/public';

// API版本
export const API_VERSION = 'v1';

// 请求超时时间(ms)
export const TIMEOUT = 30000;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  PET_LIST: 'petList',
  ORDER_COUNTS: 'orderCounts',
  PENDING_ITEMS: 'pendingItems',
  ORDER_LIST: 'orderList'
};

// 默认分页大小
export const DEFAULT_PAGE_SIZE = 10;

// 是否启用模拟数据
export const USE_MOCK = false; // 确保设置为false以使用真实API 

/**
 * 生成商品图片URL
 * @param {string} category - 商品分类
 * @param {string} brand - 商品品牌  
 * @param {string} imageName - 图片名称，默认为'封面.png'
 * @returns {string} 完整的图片URL
 */
export const getGoodsImageUrl = (category, brand, imageName = '封面.png') => {
  return `${IMAGE_BASE_URL}/images/goods/${category}/${brand}/${imageName}`;
};

/**
 * 生成用户头像URL
 * @param {string} userId - 用户ID
 * @param {string} imageName - 图片名称
 * @returns {string} 完整的图片URL  
 */
export const getUserAvatarUrl = (userId, imageName) => {
  return `${IMAGE_BASE_URL}/images/users/${userId}/${imageName}`;
};

/**
 * 生成医院图片URL
 * @param {number} hospitalId - 医院ID
 * @param {string} imageName - 图片名称
 * @returns {string} 完整的图片URL
 */  
export const getHospitalImageUrl = (hospitalId, imageName) => {
  return `${IMAGE_BASE_URL}/images/hospitals/${hospitalId}/${imageName}`;
};