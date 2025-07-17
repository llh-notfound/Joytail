/**
 * PetPal 社区发布功能完整测试验证脚本
 * 测试发布帖子后的数据同步问题
 */

console.log('🐾 开始执行PetPal社区发布功能测试...');

// 测试配置
const TEST_CONFIG = {
    baseUrl: 'http://localhost:5174',
    apiUrl: 'http://localhost:8080/api',
    mockToken: 'mock_token_' + Date.now(),
    testContent: `测试帖子内容 - ${new Date().toLocaleString()}`
};

// 测试步骤
const testSteps = [
    '🔌 Step 1: 测试API连通性',
    '📝 Step 2: 发布测试帖子', 
    '📋 Step 3: 验证首页列表',
    '👤 Step 4: 验证我的发布',
    '🔄 Step 5: 测试数据同步'
];

console.log('📋 测试步骤:');
testSteps.forEach(step => console.log(step));

// API请求封装
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${TEST_CONFIG.apiUrl}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TEST_CONFIG.mockToken}`
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    if (method === 'GET' && data) {
        const params = new URLSearchParams(data);
        const separator = url.includes('?') ? '&' : '?';
        return fetch(`${url}${separator}${params}`, options);
    }
    
    return fetch(url, options);
}

// 测试结果记录
const testResults = {
    apiConnection: null,
    publishSuccess: null,
    publishedPostId: null,
    homePageSync: null,
    myPostsSync: null,
    overallSuccess: false
};

// Step 1: 测试API连通性
async function testApiConnection() {
    console.log('\n🔌 Step 1: 测试API连通性...');
    
    try {
        const response = await apiRequest('/community/posts', 'GET', {
            type: 'recommend',
            page: 1,
            pageSize: 1
        });
        
        const data = await response.json();
        testResults.apiConnection = {
            status: response.status,
            success: response.status === 200,
            data: data
        };
        
        if (response.status === 200) {
            console.log('✅ API连接成功');
        } else {
            console.log('❌ API连接失败:', response.status, data.message);
        }
        
        return response.status === 200;
        
    } catch (error) {
        console.log('❌ API连接异常:', error.message);
        testResults.apiConnection = {
            success: false,
            error: error.message
        };
        return false;
    }
}

// Step 2: 发布测试帖子
async function testPublishPost() {
    console.log('\n📝 Step 2: 发布测试帖子...');
    
    const postData = {
        content: TEST_CONFIG.testContent,
        images: [],
        tags: ['自动化测试', '功能验证']
    };
    
    try {
        const response = await apiRequest('/community/posts', 'POST', postData);
        const data = await response.json();
        
        testResults.publishSuccess = {
            status: response.status,
            success: response.status === 200,
            data: data,
            requestData: postData
        };
        
        if (response.status === 200 && data.data) {
            testResults.publishedPostId = data.data.id || data.data.postId;
            console.log('✅ 帖子发布成功, ID:', testResults.publishedPostId);
            return true;
        } else {
            console.log('❌ 帖子发布失败:', response.status, data.message);
            return false;
        }
        
    } catch (error) {
        console.log('❌ 发布请求异常:', error.message);
        testResults.publishSuccess = {
            success: false,
            error: error.message
        };
        return false;
    }
}

// Step 3: 验证首页列表
async function testHomePageSync() {
    console.log('\n📋 Step 3: 验证首页列表同步...');
    
    // 等待1秒确保数据同步
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const testTypes = ['recommend', 'latest'];
    const results = {};
    
    for (const type of testTypes) {
        try {
            const response = await apiRequest('/community/posts', 'GET', {
                type,
                page: 1,
                pageSize: 20
            });
            
            const data = await response.json();
            const postFound = data.data && data.data.list && 
                data.data.list.some(post => post.id === testResults.publishedPostId);
            
            results[type] = {
                status: response.status,
                success: response.status === 200,
                postCount: data.data?.list?.length || 0,
                foundMyPost: postFound,
                data: data
            };
            
            console.log(`${postFound ? '✅' : '⚠️'} ${type}列表: ${postFound ? '找到' : '未找到'}我的帖子 (共${results[type].postCount}条)`);
            
        } catch (error) {
            console.log(`❌ ${type}列表请求异常:`, error.message);
            results[type] = {
                success: false,
                error: error.message
            };
        }
    }
    
    testResults.homePageSync = results;
    return results.recommend?.foundMyPost || results.latest?.foundMyPost;
}

// Step 4: 验证我的发布
async function testMyPostsSync() {
    console.log('\n👤 Step 4: 验证我的发布同步...');
    
    try {
        const response = await apiRequest('/community/my', 'GET', {
            type: 'posts',
            page: 1,
            pageSize: 20
        });
        
        const data = await response.json();
        const postFound = data.data && data.data.list && 
            data.data.list.some(post => post.id === testResults.publishedPostId);
        
        testResults.myPostsSync = {
            status: response.status,
            success: response.status === 200,
            postCount: data.data?.list?.length || 0,
            foundMyPost: postFound,
            data: data
        };
        
        console.log(`${postFound ? '✅' : '❌'} 我的发布: ${postFound ? '找到' : '未找到'}我的帖子 (共${testResults.myPostsSync.postCount}条)`);
        
        return postFound;
        
    } catch (error) {
        console.log('❌ 我的发布请求异常:', error.message);
        testResults.myPostsSync = {
            success: false,
            error: error.message
        };
        return false;
    }
}

// Step 5: 生成测试报告
function generateTestReport() {
    console.log('\n🔄 Step 5: 生成测试报告...');
    console.log('=' .repeat(60));
    
    const apiOk = testResults.apiConnection?.success;
    const publishOk = testResults.publishSuccess?.success;
    const homeOk = testResults.homePageSync?.recommend?.foundMyPost || testResults.homePageSync?.latest?.foundMyPost;
    const myPostsOk = testResults.myPostsSync?.foundMyPost;
    
    console.log('📊 测试结果汇总:');
    console.log(`🔌 API连接: ${apiOk ? '✅ 正常' : '❌ 失败'}`);
    console.log(`📝 帖子发布: ${publishOk ? '✅ 成功' : '❌ 失败'}`);
    console.log(`📋 首页显示: ${homeOk ? '✅ 同步' : '⚠️ 未同步'}`);
    console.log(`👤 我的发布: ${myPostsOk ? '✅ 同步' : '❌ 未同步'}`);
    
    // 综合判断
    testResults.overallSuccess = apiOk && publishOk && myPostsOk;
    
    console.log(`\n🎯 整体评估: ${testResults.overallSuccess ? '✅ 功能正常' : '❌ 存在问题'}`);
    
    // 问题诊断
    if (!testResults.overallSuccess) {
        console.log('\n🔍 问题诊断:');
        
        if (!apiOk) {
            console.log('❌ API连接失败 - 检查后端服务是否启动');
        }
        
        if (!publishOk) {
            console.log('❌ 发布失败 - 检查认证或数据格式');
        }
        
        if (publishOk && !myPostsOk) {
            console.log('❌ 我的发布未同步 - 可能的原因:');
            console.log('   • 用户认证问题');
            console.log('   • 数据库写入失败');
            console.log('   • 用户ID关联错误');
        }
        
        if (myPostsOk && !homeOk) {
            console.log('⚠️ 首页未同步 - 可能的原因:');
            console.log('   • 推荐算法过滤');
            console.log('   • 时间排序问题');
            console.log('   • 分页逻辑错误');
        }
    }
    
    // 修复建议
    console.log('\n🛠️ 修复建议:');
    
    if (testResults.overallSuccess) {
        console.log('✅ 功能正常运行，建议:');
        console.log('   • 继续监控数据同步状况');
        console.log('   • 优化首页推荐算法');
        console.log('   • 添加更多自动化测试');
    } else {
        console.log('🔧 需要修复的问题:');
        
        if (!myPostsOk) {
            console.log('   1. 优先修复"我的发布"数据同步');
            console.log('   2. 检查用户认证和数据库写入逻辑');
            console.log('   3. 验证API返回的帖子ID格式');
        }
        
        if (!homeOk) {
            console.log('   4. 优化首页列表查询逻辑');
            console.log('   5. 确保新发布帖子能立即显示');
            console.log('   6. 检查推荐和最新列表的排序规则');
        }
    }
    
    return testResults;
}

// 主测试流程
async function runFullTest() {
    console.log('🚀 开始执行完整测试流程...\n');
    
    try {
        // 执行所有测试步骤
        const step1 = await testApiConnection();
        if (!step1) {
            console.log('❌ API连接失败，终止测试');
            return generateTestReport();
        }
        
        const step2 = await testPublishPost();
        if (!step2) {
            console.log('❌ 帖子发布失败，终止测试');
            return generateTestReport();
        }
        
        const step3 = await testHomePageSync();
        const step4 = await testMyPostsSync();
        
        // 生成最终报告
        return generateTestReport();
        
    } catch (error) {
        console.log('❌ 测试执行异常:', error);
        return null;
    }
}

// 导出测试功能
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runFullTest,
        testApiConnection,
        testPublishPost,
        testHomePageSync,
        testMyPostsSync,
        generateTestReport,
        testResults
    };
}

// 如果在浏览器环境中直接运行
if (typeof window !== 'undefined') {
    window.petpalCommunityTest = {
        runFullTest,
        testResults,
        TEST_CONFIG
    };
    
    console.log('📱 测试工具已加载到 window.petpalCommunityTest');
    console.log('💡 在控制台执行: await window.petpalCommunityTest.runFullTest()');
}

// 自动执行测试（如果不在浏览器环境中）
if (typeof window === 'undefined' && typeof require !== 'undefined') {
    runFullTest().then(results => {
        console.log('\n✅ 测试完成');
        process.exit(results?.overallSuccess ? 0 : 1);
    });
}
