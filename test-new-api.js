// 测试新的API地址
const testNewApi = async () => {
  const apiUrl = 'https://ywzezvbcsivv.sealosbja.site';
  
  console.log('🧪 开始测试新的API地址...');
  console.log('📍 API地址:', apiUrl);
  
  try {
    // 测试基础连接
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API连接成功!');
      console.log('📊 服务器信息:', data);
      
      // 测试具体接口
      console.log('\n🧪 测试具体接口...');
      
      // 测试用户信息接口
      try {
        const userResponse = await fetch(`${apiUrl}/api/user/info`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (userResponse.status === 401) {
          console.log('✅ 用户接口正常 (需要认证)');
        } else if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('✅ 用户接口正常:', userData);
        } else {
          console.log('⚠️ 用户接口状态:', userResponse.status);
        }
      } catch (error) {
        console.log('❌ 用户接口测试失败:', error.message);
      }
      
      // 测试商品接口
      try {
        const goodsResponse = await fetch(`${apiUrl}/api/goods/list?page=1&pageSize=5`);
        
        if (goodsResponse.ok) {
          const goodsData = await goodsResponse.json();
          console.log('✅ 商品接口正常:', goodsData);
        } else {
          console.log('⚠️ 商品接口状态:', goodsResponse.status);
        }
      } catch (error) {
        console.log('❌ 商品接口测试失败:', error.message);
      }
      
    } else {
      console.log('❌ API连接失败:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.log('❌ 网络连接失败:', error.message);
  }
};

// 运行测试
testNewApi(); 