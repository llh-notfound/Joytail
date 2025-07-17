/**
 * API测试工具 - 用于测试API是否正常工作
 */

import api from './api/index';

// 测试用户API
export const testUserAPI = async () => {
  try {
    console.log('=== 测试用户API ===');
    
    // 测试获取用户信息 (需要登录)
    // const userInfo = await api.user.getUserInfo();
    // console.log('用户信息:', userInfo);
    
    console.log('用户API测试完成');
  } catch (error) {
    console.error('用户API测试失败:', error);
  }
};

// 测试保险API
export const testInsuranceAPI = async () => {
  try {
    console.log('=== 测试保险API ===');
    
    // 测试获取保险产品列表
    const products = await api.insurance.getInsuranceProducts({
      page: 1,
      pageSize: 5
    });
    console.log('保险产品列表:', products);
    
    // 测试获取保险FAQ
    const faq = await api.insurance.getInsuranceFAQ();
    console.log('保险FAQ:', faq);
    
    console.log('保险API测试完成');
  } catch (error) {
    console.error('保险API测试失败:', error);
  }
};

// 测试社区API
export const testCommunityAPI = async () => {
  try {
    console.log('=== 测试社区API ===');
    
    // 测试获取社区动态
    const posts = await api.community.getCommunityPosts('recommend', 1, 5);
    console.log('社区动态:', posts);
    
    console.log('社区API测试完成');
  } catch (error) {
    console.error('社区API测试失败:', error);
  }
};

// 测试咨询API (已删除)
export const testConsultAPI = async () => {
  console.log('=== 咨询功能已删除 ===');
  console.log('咨询相关功能已从系统中移除');
};

// 测试医疗API (已删除)
export const testMedicalAPI = async () => {
  console.log('=== 测试医院广告位API ===');
  
  try {
    // 测试获取医院列表
    console.log('1. 测试医院列表API...');
    const listResponse = await request({
      url: '/medical/hospitals',
      method: 'GET',
      params: { page: 1, pageSize: 5 }
    });
    console.log('✅ 医院列表:', listResponse);
    
    if (listResponse.data?.list?.length > 0) {
      const hospitalId = listResponse.data.list[0].id;
      
      // 测试获取医院详情
      console.log('2. 测试医院详情API...');
      const detailResponse = await request({
        url: `/medical/hospitals/${hospitalId}`,
        method: 'GET'
      });
      console.log('✅ 医院详情:', detailResponse);
      
      // 测试记录点击
      console.log('3. 测试点击记录API...');
      const clickResponse = await request({
        url: `/medical/hospitals/${hospitalId}/click`,
        method: 'POST',
        data: { source: 'test' }
      });
      console.log('✅ 点击记录:', clickResponse);
    }
    
  } catch (error) {
    console.error('❌ 医院API测试失败:', error);
    console.log('💡 当前医疗功能使用静态广告位数据');
  }
};

// 运行所有API测试
export const runAllAPITests = async () => {
  console.log('开始API测试...');
  
  await testInsuranceAPI();
  await testCommunityAPI();
  await testMedicalAPI();
  await testConsultAPI();
  // await testUserAPI(); // 需要登录状态
  
  console.log('所有API测试完成');
};

export default {
  testUserAPI,
  testInsuranceAPI,
  testCommunityAPI,
  testMedicalAPI,
  testConsultAPI,
  runAllAPITests
};
