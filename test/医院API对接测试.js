/**
 * 医院API对接测试脚本
 * 用于验证前端是否正确切换到真实API
 */

console.log('=== 医院API对接测试 ===');

// 测试配置
const testConfig = {
    // 根据API文档，本地开发服务器应该是localhost:8080
    localApiUrl: 'http://localhost:8080/api',
    remoteApiUrl: 'https://udrvmlsoncfg.sealosbja.site/api',
    endpoints: {
        hospitalList: '/medical/hospitals',
        hospitalDetail: '/medical/hospitals/1'
    }
};

// 测试API连接
async function testAPIConnection(baseUrl, endpoint, description) {
    console.log(`\n🔍 测试: ${description}`);
    console.log(`📡 URL: ${baseUrl}${endpoint}`);
    
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log(`📊 状态码: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${description} - 连接成功`);
            
            // 验证响应格式
            if (data.code === 200) {
                if (endpoint.includes('hospitals') && !endpoint.includes('/')) {
                    // 医院列表
                    console.log(`📋 返回医院数量: ${data.data?.list?.length || 0}`);
                    console.log(`📋 总数: ${data.data?.total || 'N/A'}`);
                } else {
                    // 医院详情
                    console.log(`🏥 医院名称: ${data.data?.name || 'N/A'}`);
                    console.log(`📍 医院地址: ${data.data?.address || 'N/A'}`);
                }
                console.log(`✅ API响应格式正确`);
                return { success: true, data };
            } else {
                console.log(`❌ API响应格式异常: code=${data.code}`);
                return { success: false, error: 'Invalid response format' };
            }
        } else {
            console.log(`❌ ${description} - HTTP错误: ${response.status}`);
            return { success: false, error: `HTTP ${response.status}` };
        }
    } catch (error) {
        console.log(`❌ ${description} - 连接失败: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// 主测试函数
async function runHospitalAPITest() {
    console.log('\n🚀 开始医院API对接测试...\n');
    
    const results = {
        local: {},
        remote: {}
    };
    
    // 测试本地API服务器
    console.log('📍 测试本地开发服务器 (localhost:8080)');
    results.local.list = await testAPIConnection(
        testConfig.localApiUrl, 
        testConfig.endpoints.hospitalList, 
        '本地医院列表API'
    );
    
    results.local.detail = await testAPIConnection(
        testConfig.localApiUrl, 
        testConfig.endpoints.hospitalDetail, 
        '本地医院详情API'
    );
    
    // 测试远程API服务器
    console.log('\n📍 测试远程服务器');
    results.remote.list = await testAPIConnection(
        testConfig.remoteApiUrl, 
        testConfig.endpoints.hospitalList, 
        '远程医院列表API'
    );
    
    results.remote.detail = await testAPIConnection(
        testConfig.remoteApiUrl, 
        testConfig.endpoints.hospitalDetail, 
        '远程医院详情API'
    );
    
    // 总结测试结果
    console.log('\n📊 测试结果总结:');
    console.log('==========================================');
    
    const localSuccess = results.local.list.success && results.local.detail.success;
    const remoteSuccess = results.remote.list.success && results.remote.detail.success;
    
    if (localSuccess) {
        console.log('✅ 本地API服务器可用 - 推荐使用');
        console.log('   前端将自动连接到 localhost:8080');
    } else {
        console.log('❌ 本地API服务器不可用');
        console.log('   原因可能: 服务器未启动、端口配置错误');
    }
    
    if (remoteSuccess) {
        console.log('✅ 远程API服务器可用 - 备用选项');
    } else {
        console.log('❌ 远程API服务器不可用');
    }
    
    // 给出建议
    console.log('\n💡 建议:');
    if (localSuccess) {
        console.log('✅ 当前配置正确，前端会优先使用本地API');
        console.log('✅ 医院页面将显示真实后端数据');
    } else if (remoteSuccess) {
        console.log('⚠️  本地API不可用，将使用远程API');
        console.log('⚠️  建议启动本地后端服务器进行开发');
    } else {
        console.log('❌ 所有API服务器都不可用');
        console.log('❌ 前端将显示"无法加载数据"的错误提示');
        console.log('❌ 需要启动后端服务器或检查网络连接');
    }
    
    console.log('\n🔧 前端配置:');
    console.log('• 开发环境: http://localhost:8080/api');
    console.log('• 生产环境: https://udrvmlsoncfg.sealosbja.site/api');
    console.log('• 配置文件: /src/utils/config.js');
    
    return {
        localAvailable: localSuccess,
        remoteAvailable: remoteSuccess,
        recommendedAction: localSuccess ? 'use-local' : remoteSuccess ? 'use-remote' : 'fix-servers'
    };
}

// 如果是在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.runHospitalAPITest = runHospitalAPITest;
    console.log('🌐 浏览器环境检测到');
    console.log('💡 在控制台运行: runHospitalAPITest()');
} else {
    // Node.js环境直接运行
    runHospitalAPITest().then(result => {
        console.log('\n🎯 最终结论:');
        console.log(`推荐操作: ${result.recommendedAction}`);
        process.exit(0);
    });
}
