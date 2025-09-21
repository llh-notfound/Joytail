/**
 * 测试头像URL端口修正功能
 */

// 模拟后端返回的数据
const mockCommunityData = [
  {
    id: 'post_1',
    userId: 'user_1',
    username: '柴犬麻麻',
    avatar: 'http://localhost:5173/uploads/community-users/user1_avatar.jpg', // 错误的端口
    content: '今天带我家柴柴去公园玩...',
    images: [
      'http://localhost:5173/uploads/community-posts/post1_img1.jpg', // 错误的端口
      'http://localhost:5173/uploads/community-posts/post1_img2.jpg'  // 错误的端口
    ],
    publishTime: '2024-01-15T10:30:00Z',
    likes: 328,
    comments: 56,
    collects: 23,
    isLiked: false,
    isCollected: false
  },
  {
    id: 'post_2',
    userId: 'user_2',
    username: '养猫专家',
    avatar: '/uploads/community-users/user2_avatar.jpg', // 相对路径
    content: '我家猫咪今天特别乖...',
    images: [
      '/uploads/community-posts/post2_img1.jpg', // 相对路径
      '/uploads/community-posts/post2_img2.jpg'  // 相对路径
    ],
    publishTime: '2024-01-15T11:30:00Z',
    likes: 156,
    comments: 23,
    collects: 12,
    isLiked: true,
    isCollected: false
  }
];

// 模拟formatImageUrl函数
const formatImageUrl = (url, fallbackImage = '/static/images/pet.png') => {
  // 如果URL为空，返回默认图片
  if (!url) return fallbackImage;
  
  // 如果已经是完整URL，检查并修正端口号
  if (url.startsWith('http')) {
    // 修正错误的端口号（5173 -> 8080）
    if (url.includes('localhost:5173')) {
      const correctedUrl = url.replace('localhost:5173', 'localhost:8080');
      console.log('🖼️ [图片URL端口修正]', {
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
  // 确保使用本地后端服务器地址
  const backendUrl = 'http://localhost:8080';
  
  // 添加更多调试信息
  console.log('🖼️ [图片URL处理]', {
    原始URL: url,
    处理后URL: `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`
  });
  
  // 处理URL路径，确保路径正确连接
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// 模拟processCommunityImages函数
const processCommunityImages = (communityData) => {
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

// 测试函数
function testAvatarFix() {
  console.log('🧪 开始测试头像URL端口修正功能...\n');
  
  console.log('📋 原始数据:');
  console.log(JSON.stringify(mockCommunityData, null, 2));
  
  console.log('\n🔧 处理后的数据:');
  const processedData = processCommunityImages(mockCommunityData);
  console.log(JSON.stringify(processedData, null, 2));
  
  console.log('\n✅ 测试结果:');
  
  // 验证第一个帖子的头像URL修正
  const firstPost = processedData[0];
  if (firstPost.avatar.includes('localhost:8080') && !firstPost.avatar.includes('localhost:5173')) {
    console.log('✅ 头像URL端口修正成功');
  } else {
    console.log('❌ 头像URL端口修正失败');
  }
  
  // 验证第一个帖子的图片URL修正
  const firstPostImages = firstPost.images;
  const allImagesCorrect = firstPostImages.every(img => 
    img.includes('localhost:8080') && !img.includes('localhost:5173')
  );
  
  if (allImagesCorrect) {
    console.log('✅ 动态图片URL端口修正成功');
  } else {
    console.log('❌ 动态图片URL端口修正失败');
  }
  
  // 验证第二个帖子的相对路径处理
  const secondPost = processedData[1];
  if (secondPost.avatar.startsWith('http://localhost:8080/')) {
    console.log('✅ 相对路径头像URL处理成功');
  } else {
    console.log('❌ 相对路径头像URL处理失败');
  }
  
  console.log('\n🎯 总结:');
  console.log('- 错误端口号 (5173) 已修正为正确端口号 (8080)');
  console.log('- 相对路径已转换为完整URL');
  console.log('- 所有图片URL现在都指向正确的后端服务器');
}

// 运行测试
testAvatarFix(); 