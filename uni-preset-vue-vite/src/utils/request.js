import { BASE_URL } from './config.js';

/**
 * 封装请求方法
 * @param {string} url - 请求路径
 * @param {string} method - 请求方法
 * @param {object} data - 请求数据
 * @param {boolean} auth - 是否需要认证
 * @param {object} headers - 额外的请求头
 * @returns {Promise} 请求结果
 */
const request = (url, method = 'GET', data = {}, auth = false, headers = {}) => {
  return new Promise((resolve, reject) => {
    // 请求头
    const requestHeaders = { ...headers };
    
    // 添加认证头
    if (auth) {
      const token = uni.getStorageSync('token');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        // 如果需要认证但没有token，返回未授权错误
        reject({
          code: 401,
          message: '未授权，请先登录',
          data: null
        });
        return;
      }
    }
    
    // 发起请求
    const fullUrl = BASE_URL + url;
    console.log(`🔗 [请求] ${method} ${fullUrl}`, data);
    
    uni.request({
      url: fullUrl,
      method,
      data,
      header: requestHeaders,
      success: (res) => {
        if (res.statusCode === 200) {
          // 请求成功
          if (res.data.code === 200) {
            resolve(res.data);
          } else {
            // 业务错误
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 未授权
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          
          reject({
            code: 401,
            message: '登录已过期，请重新登录',
            data: null
          });
          
          // 跳转到登录页
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            });
          }, 1500);
        } else {
          // 其他错误
          reject({
            code: res.statusCode,
            message: '请求失败',
            data: null
          });
        }
      },
      fail: (err) => {
        // 请求失败
        reject({
          code: 500,
          message: '网络错误，请检查网络连接',
          data: null
        });
      }
    });
  });
};

/**
 * GET请求
 * @param {string} url - 请求路径
 * @param {object} params - 请求参数
 * @param {boolean} auth - 是否需要认证
 * @returns {Promise} 请求结果
 */
export const get = (url, params = {}, auth = false) => {
  // 将参数拼接到URL
  let requestUrl = url;
  if (Object.keys(params).length > 0) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    requestUrl = `${url}?${queryString}`;
  }
  
  return request(requestUrl, 'GET', {}, auth);
};

/**
 * POST请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求数据
 * @param {boolean} auth - 是否需要认证
 * @returns {Promise} 请求结果
 */
export const post = (url, data = {}, auth = false) => {
  return request(url, 'POST', data, auth);
};

/**
 * PUT请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求数据
 * @param {boolean} auth - 是否需要认证
 * @returns {Promise} 请求结果
 */
export const put = (url, data = {}, auth = false) => {
  return request(url, 'PUT', data, auth);
};

/**
 * DELETE请求
 * @param {string} url - 请求路径
 * @param {object} data - 请求数据
 * @param {boolean} auth - 是否需要认证
 * @returns {Promise} 请求结果
 */
export const del = (url, data = {}, auth = false) => {
  return request(url, 'DELETE', data, auth);
};

/**
 * 上传文件
 * @param {string} url - 请求路径
 * @param {string} filePath - 文件路径
 * @param {string} name - 文件名
 * @param {object} formData - 额外的表单数据
 * @param {boolean} auth - 是否需要认证
 * @returns {Promise} 请求结果
 */
export const upload = (url, filePath, name = 'file', formData = {}, auth = false) => {
  return new Promise((resolve, reject) => {
    // 请求头
    const requestHeaders = {};
    
    // 添加认证头
    if (auth) {
      const token = uni.getStorageSync('token');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        // 如果需要认证但没有token，返回未授权错误
        reject({
          code: 401,
          message: '未授权，请先登录',
          data: null
        });
        return;
      }
    }
    
    // 发起上传
    uni.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header: requestHeaders,
      success: (res) => {
        if (res.statusCode === 200) {
          // 上传成功，注意uploadFile返回的数据是字符串，需要解析
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            resolve(data);
          } else {
            // 业务错误
            reject(data);
          }
        } else if (res.statusCode === 401) {
          // 未授权
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          
          reject({
            code: 401,
            message: '登录已过期，请重新登录',
            data: null
          });
          
          // 跳转到登录页
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            });
          }, 1500);
        } else {
          // 其他错误
          reject({
            code: res.statusCode,
            message: '上传失败',
            data: null
          });
        }
      },
      fail: (err) => {
        // 上传失败
        reject({
          code: 500,
          message: '网络错误，请检查网络连接',
          data: null
        });
      }
    });
  });
};

export default {
  get,
  post,
  put,
  del,
  upload
}; 