/**
 * medicalApi 导入测试
 * 用于验证前端模块导入错误修复
 */

// 测试 medicalApi 导入
console.log('=== medicalApi 导入测试 ===');

try {
  // 测试从 index.js 导入 medicalApi
  import('../../utils/api/index.js').then(apiModule => {
    console.log('✅ API模块导入成功');
    console.log('可用API:', Object.keys(apiModule));
    
    if (apiModule.medicalApi) {
      console.log('✅ medicalApi 导入成功');
      console.log('medicalApi 方法:', Object.keys(apiModule.medicalApi));
      
      // 测试方法是否存在
      const requiredMethods = ['getHospitals', 'getHospitalDetail', 'recordHospitalClick'];
      requiredMethods.forEach(method => {
        if (typeof apiModule.medicalApi[method] === 'function') {
          console.log(`✅ ${method} 方法存在`);
        } else {
          console.error(`❌ ${method} 方法不存在`);
        }
      });
    } else {
      console.error('❌ medicalApi 未找到');
    }
  }).catch(error => {
    console.error('❌ API模块导入失败:', error);
  });

  // 测试解构导入
  import('../../utils/api/index.js').then(({ medicalApi }) => {
    if (medicalApi) {
      console.log('✅ 解构导入 medicalApi 成功');
    } else {
      console.error('❌ 解构导入 medicalApi 失败');
    }
  }).catch(error => {
    console.error('❌ 解构导入失败:', error);
  });

} catch (error) {
  console.error('❌ 测试过程中发生错误:', error);
}

export default {
  name: 'medicalApiTest'
};
