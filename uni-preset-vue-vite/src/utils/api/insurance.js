/**
 * 宠物保险相关API
 */

import { get, post, put, del } from '../request';

/**
 * 获取保险产品列表
 * @param {object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.petType - 宠物类型
 * @param {string} params.ageRange - 年龄范围
 * @param {string} params.priceRange - 价格范围
 * @param {string} params.sortBy - 排序方式
 * @returns {Promise} 请求结果
 */
export const getInsuranceProducts = (params = {}) => {
  return get('/insurance/products', params);
};

/**
 * 获取保险产品详情
 * @param {string} productId - 产品ID
 * @returns {Promise} 请求结果
 */
export const getInsuranceProductDetail = (productId) => {
  return get(`/insurance/products/${productId}`);
};

/**
 * 获取保险报价
 * @param {object} data - 报价参数
 * @returns {Promise} 请求结果
 */
export const getInsuranceQuote = (data) => {
  return post('/insurance/quote', data, true);
};

/**
 * 购买保险
 * @param {object} data - 购买参数
 * @returns {Promise} 请求结果
 */
export const purchaseInsurance = (data) => {
  return post('/insurance/purchase', data, true);
};

/**
 * 获取我的保单列表
 * @param {object} params - 查询参数
 * @returns {Promise} 请求结果
 */
export const getMyPolicies = (params = {}) => {
  return get('/insurance/policies/my', params, true);
};

/**
 * 获取保单详情
 * @param {string} policyId - 保单ID
 * @returns {Promise} 请求结果
 */
export const getPolicyDetail = (policyId) => {
  return get(`/insurance/policies/${policyId}`, {}, true);
};

/**
 * 提交理赔申请
 * @param {object} data - 理赔参数
 * @returns {Promise} 请求结果
 */
export const submitClaim = (data) => {
  return post('/insurance/claims', data, true);
};

/**
 * 获取理赔记录
 * @param {object} params - 查询参数
 * @returns {Promise} 请求结果
 */
export const getClaimHistory = (params = {}) => {
  return get('/insurance/claims/my', params, true);
};

/**
 * 获取理赔详情
 * @param {string} claimId - 理赔ID
 * @returns {Promise} 请求结果
 */
export const getClaimDetail = (claimId) => {
  return get(`/insurance/claims/${claimId}`, {}, true);
};

/**
 * 续保
 * @param {object} data - 续保参数
 * @returns {Promise} 请求结果
 */
export const renewPolicy = (data) => {
  return post('/insurance/policies/renew', data, true);
};

/**
 * 取消保单
 * @param {object} data - 取消参数
 * @returns {Promise} 请求结果
 */
export const cancelPolicy = (data) => {
  return post('/insurance/policies/cancel', data, true);
};

/**
 * 获取保险计算器配置
 * @returns {Promise} 请求结果
 */
export const getCalculatorConfig = () => {
  return get('/insurance/calculator/config');
};

/**
 * 获取理赔指南
 * @param {string} incidentType - 事故类型
 * @returns {Promise} 请求结果
 */
export const getClaimGuide = (incidentType) => {
  return get('/insurance/claims/guide', { incidentType });
};

/**
 * 上传理赔文件
 * @param {FormData} formData - 文件数据
 * @returns {Promise} 请求结果
 */
export const uploadClaimDocument = (formData) => {
  return post('/insurance/claims/upload', formData, true, {
    'Content-Type': 'multipart/form-data'
  });
};

/**
 * 获取保险常见问题
 * @returns {Promise} 请求结果
 */
export const getInsuranceFAQ = () => {
  return get('/insurance/faq');
};

/**
 * 获取保险条款
 * @param {string} productId - 产品ID
 * @returns {Promise} 请求结果
 */
export const getInsuranceTerms = (productId) => {
  return get(`/insurance/products/${productId}/terms`);
};

export default {
  getInsuranceProducts,
  getInsuranceProductDetail,
  getInsuranceQuote,
  purchaseInsurance,
  getMyPolicies,
  getPolicyDetail,
  submitClaim,
  getClaimHistory,
  getClaimDetail,
  renewPolicy,
  cancelPolicy,
  getCalculatorConfig,
  getClaimGuide,
  uploadClaimDocument,
  getInsuranceFAQ,
  getInsuranceTerms
};