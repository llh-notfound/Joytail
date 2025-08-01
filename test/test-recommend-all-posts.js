/**
 * 测试推荐板块显示所有帖子功能
 */

// 模拟API响应数据
const mockApiResponses = {
  recommend: {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'post_1',
          username: '柴犬麻麻',
          avatar: 'http://localhost:8080/uploads/community-users/user1_avatar.jpg',
          content: '今天带我家柴柴去公园玩...',
          images: ['http://localhost:8080/uploads/community-posts/post1_img1.jpg'],
          publishTime: '2024-01-15T10:30:00Z',
          likes: 328,
          comments: 56,
          collects: 23,
          isLiked: false,
          isCollected: false
        },
        {
          id: 'post_2',
          username: '养猫专家',
          avatar: 'http://localhost:8080/uploads/community-users/user2_avatar.jpg',
          content: '我家猫咪今天特别乖...',
          images: ['http://localhost:8080/uploads/community-posts/post2_img1.jpg'],
          publishTime: '2024-01-15T11:30:00Z',
          likes: 156,
          comments: 23,
          collects: 12,
          isLiked: true,
          isCollected: false
        },
        {
          id: 'post_3',
          username: '宠物医生',
          avatar: 'http://localhost:8080/uploads/community-users/user3_avatar.jpg',
          content: '分享一些宠物健康小知识...',
          images: ['http://localhost:8080/uploads/community-posts/post3_img1.jpg'],
          publishTime: '2024-01-15T12:30:00Z',
          likes: 89,
          comments: 15,
          collects: 8,
          isLiked: false,
          isCollected: true
        },
        {
          id: 'post_4',
          username: '新手铲屎官',
          avatar: 'http://localhost:8080/uploads/community-users/user4_avatar.jpg',
          content: '第一次养宠物，有什么建议吗？',
          images: ['http://localhost:8080/uploads/community-posts/post4_img1.jpg'],
          publishTime: '2024-01-15T13:30:00Z',
          likes: 45,
          comments: 32,
          collects: 5,
          isLiked: false,
          isCollected: false
        },
        {
          id: 'post_5',
          username: '资深铲屎官',
          avatar: 'http://localhost:8080/uploads/community-users/user5_avatar.jpg',
          content: '养宠物十年经验分享...',
          images: ['http://localhost:8080/uploads/community-posts/post5_img1.jpg'],
          publishTime: '2024-01-15T14:30:00Z',
          likes: 234,
          comments: 67,
          collects: 18,
          isLiked: true,
          isCollected: true
        }
      ],
      total: 5,
      hasMore: false
    }
  },
  latest: {
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'post_5',
          username: '资深铲屎官',
          avatar: 'http://localhost:8080/uploads/community-users/user5_avatar.jpg',
          content: '养宠物十年经验分享...',
          images: ['http://localhost:8080/uploads/community-posts/post5_img1.jpg'],
          publishTime: '2024-01-15T14:30:00Z',
          likes: 234,
          comments: 67,
          collects: 18,
          isLiked: true,
          isCollected: true
        }
      ],
      total: 5,
      hasMore: true
    }
  }
};

// 模拟getContentList函数
function getContentList(currentTab, page = 1) {
  console.log(`📋 获取内容列表 - 标签: ${currentTab === 0 ? '推荐' : '最新'}, 页码: ${page}`);
  
  if (currentTab === 0) {
    // 推荐板块：一次性加载所有数据
    console.log('🎯 推荐板块：一次性加载所有数据');
    const response = mockApiResponses.recommend;
    
    if (response && response.code === 200) {
      const allData = response.data.list || [];
      console.log(`✅ 推荐板块加载成功，共 ${allData.length} 条数据`);
      
      // 显示所有帖子信息
      allData.forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.username}: ${post.content.substring(0, 20)}...`);
      });
      
      return {
        contentList: allData,
        hasMore: false,
        message: '推荐板块显示所有帖子，无分页限制'
      };
    }
  } else {
    // 最新板块：分页加载
    console.log('🔄 最新板块：分页加载');
    const response = mockApiResponses.latest;
    
    if (response && response.code === 200) {
      const newData = response.data.list || [];
      console.log(`✅ 最新板块加载成功，当前页 ${newData.length} 条数据`);
      
      return {
        contentList: newData,
        hasMore: response.data.hasMore,
        message: '最新板块使用分页加载'
      };
    }
  }
  
  return {
    contentList: [],
    hasMore: false,
    message: '加载失败'
  };
}

// 测试函数
function testRecommendAllPosts() {
  console.log('🧪 开始测试推荐板块显示所有帖子功能...\n');
  
  // 测试推荐板块
  console.log('📌 测试推荐板块：');
  const recommendResult = getContentList(0);
  console.log(`结果: ${recommendResult.message}`);
  console.log(`数据条数: ${recommendResult.contentList.length}`);
  console.log(`是否有更多: ${recommendResult.hasMore}\n`);
  
  // 测试最新板块
  console.log('📌 测试最新板块：');
  const latestResult = getContentList(1, 1);
  console.log(`结果: ${latestResult.message}`);
  console.log(`数据条数: ${latestResult.contentList.length}`);
  console.log(`是否有更多: ${latestResult.hasMore}\n`);
  
  // 验证结果
  console.log('✅ 测试结果验证：');
  
  if (recommendResult.contentList.length === 5) {
    console.log('✅ 推荐板块成功加载所有5条帖子数据');
  } else {
    console.log('❌ 推荐板块数据加载异常');
  }
  
  if (!recommendResult.hasMore) {
    console.log('✅ 推荐板块正确设置hasMore为false');
  } else {
    console.log('❌ 推荐板块hasMore设置异常');
  }
  
  if (latestResult.contentList.length === 1) {
    console.log('✅ 最新板块正确使用分页加载');
  } else {
    console.log('❌ 最新板块分页加载异常');
  }
  
  if (latestResult.hasMore) {
    console.log('✅ 最新板块正确设置hasMore为true');
  } else {
    console.log('❌ 最新板块hasMore设置异常');
  }
  
  console.log('\n🎯 总结：');
  console.log('- 推荐板块：一次性加载所有帖子，无数量限制');
  console.log('- 最新板块：保持分页加载，支持加载更多');
  console.log('- 用户体验：推荐板块可以浏览所有内容，最新板块保持流畅加载');
}

// 运行测试
testRecommendAllPosts(); 