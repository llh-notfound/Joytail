/**
 * 图片URL处理工具
 */

import { BASE_URL, IMAGE_BASE_URL } from './config';

/**
 * 格式化图片URL，确保是完整路径
 * @param {string} url - 原始图片URL
 * @param {string} fallbackImage - 图片加载失败时的备用图片
 * @returns {string} 格式化后的完整图片URL
 */
export const formatImageUrl = (url, fallbackImage = '/static/images/pet.png') => {
  // 如果URL为空，返回默认图片
  if (!url) return fallbackImage;
  
  // 强制替换所有localhost:8080为生产环境地址（无论URL格式如何）
  if (url.includes('localhost:8080')) {
    const correctedUrl = url.replace(/localhost:8080/g, 'ywzezvbcsivv.sealosbja.site');
    console.log('🖼️ [图片URL强制修正]', {
      原始URL: url,
      修正后URL: correctedUrl
    });
    return correctedUrl;
  }
  
  // 如果已经是完整URL，检查并修正为生产环境地址
  if (url.startsWith('http')) {
    // 修正本地开发地址为生产环境地址
    if (url.includes('localhost:5173')) {
      const correctedUrl = url.replace(/localhost:\d+/, 'ywzezvbcsivv.sealosbja.site');
      console.log('🖼️ [图片URL地址修正]', {
        原始URL: url,
        修正后URL: correctedUrl
      });
      return correctedUrl;
    }
    return url;
  }
  
  // 如果是静态资源路径，直接返回（用于本地开发环境）
  if (url.startsWith('/static')) {
    return url;
  }
  
  // 针对后端API返回的路径处理
  // 强制使用生产环境后端服务器地址
  const backendUrl = 'https://ywzezvbcsivv.sealosbja.site';
  
  // 添加更多调试信息
  console.log('🖼️ [图片URL处理]', {
    原始URL: url,
    处理后URL: `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`
  });
  
  // 处理URL路径，确保路径正确连接
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * 批量处理对象中的图片URL字段
 * @param {Object} object - 包含图片URL字段的对象
 * @param {Array} imageFields - 需要处理的图片字段名数组
 * @param {string} fallbackImage - 默认图片URL
 * @returns {Object} 处理后的对象
 */
export const processObjectImages = (object, imageFields = ['image', 'avatar', 'cover', 'termsImage', 'claimProcessImage'], fallbackImage = '/static/images/pet.png') => {
  if (!object) return object;
  
  const result = { ...object };
  
  imageFields.forEach(field => {
    if (result[field]) {
      result[field] = formatImageUrl(result[field], fallbackImage);
    }
  });
  
  return result;
};

/**
 * 批量处理对象数组中的图片URL字段
 * @param {Array} array - 包含图片URL字段的对象数组
 * @param {Array} imageFields - 需要处理的图片字段名数组
 * @param {string} fallbackImage - 默认图片URL
 * @returns {Array} 处理后的对象数组
 */
export const processArrayImages = (array, imageFields = ['image', 'avatar', 'cover'], fallbackImage = '/static/images/pet.png') => {
  if (!array || !Array.isArray(array)) return array;
  
  return array.map(item => processObjectImages(item, imageFields, fallbackImage));
};

/**
 * 专门处理社区数据的图片URL
 * @param {Array} communityData - 社区数据数组
 * @returns {Array} 处理后的社区数据
 */
export const processCommunityImages = (communityData) => {
  if (!communityData || !Array.isArray(communityData)) return communityData;
  
  return communityData.map(item => {
    const processed = { ...item };
    
    // 处理头像
    if (processed.avatar) {
      processed.avatar = formatImageUrl(processed.avatar, '/static/images/default-avatar-mao.jpg');
    }
    
    // 处理动态图片
    if (processed.images && Array.isArray(processed.images)) {
      processed.images = processed.images.map(img => formatImageUrl(img));
    }
    
    return processed;
  });
};

export default {
  formatImageUrl,
  processObjectImages,
  processArrayImages,
  processCommunityImages
};
