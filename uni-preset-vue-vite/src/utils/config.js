/**
 * API基础配置
 */

// API基础URL - 根据环境切换
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080/api' 
  : 'https://udrvmlsoncfg.sealosbja.site/api';

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
export const USE_MOCK = false; 