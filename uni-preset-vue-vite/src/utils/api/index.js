import userApi from './user';
import petApi from './pet';
import goodsApi from './goods';
import cartApi from './cart';
import orderApi from './order';
import addressApi from './address';
import accountApi from './account';
import commonApi from './common';
import communityApi from './community';
import insuranceApi from './insurance';
import medicalApi from './medical';
import { USE_MOCK } from '../config';
import mockUser from '../mockUser';

// 如果启用模拟数据，将覆盖真实API请求
if (USE_MOCK) {
  console.log('正在使用模拟数据，API请求将被拦截');
  
  // 重写用户相关API
  userApi.login = (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = mockUser.createMockUser({}, false);
        resolve({
          code: 200,
          data: userData,
          message: '登录成功'
        });
      }, 500); // 模拟网络延迟
    });
  };
  
  userApi.register = (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = mockUser.createMockUser({
          nickname: params.nickname || '新用户',
          phone: params.phone || '13800138000'
        }, false);
        resolve({
          code: 200,
          data: userData,
          message: '注册成功'
        });
      }, 500);
    });
  };
  
  userApi.logout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser.logoutMockUser(false);
        resolve({
          code: 200,
          data: null,
          message: '退出成功'
        });
      }, 300);
    });
  };
  
  userApi.getUserInfo = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userInfo = mockUser.getMockUserInfo();
        resolve({
          code: 200,
          data: userInfo,
          message: '获取成功'
        });
      }, 300);
    });
  };
  
  // 可以根据需要添加更多模拟API
}

export {
  userApi,
  petApi,
  goodsApi,
  cartApi,
  orderApi,
  addressApi,
  accountApi,
  commonApi,
  communityApi,
  insuranceApi,
  medicalApi
};

export default {
  user: userApi,
  pet: petApi,
  goods: goodsApi,
  cart: cartApi,
  order: orderApi,
  address: addressApi,
  account: accountApi,
  common: commonApi,
  community: communityApi,
  insurance: insuranceApi,
  medical: medicalApi
}; 