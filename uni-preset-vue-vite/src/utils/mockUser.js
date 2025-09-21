// 模拟用户数据和登录功能
const defaultUser = {
  userId: 'virtual_user_123456',
  nickname: '虚拟用户',
  avatar: '/static/images/default-avatar-mao.jpg',
  memberLevel: '黄金会员',
  token: 'mock_token_' + Date.now(),
  petAvatar: '/static/images/pet.png',
  phone: '13800138000',
  email: 'virtual@example.com',
  points: 2580,
  coupons: 8
};

// 虚拟宠物数据
const defaultPets = [
  {
    id: 'pet_001',
    name: '小白',
    avatar: '/static/images/pet.png',
    type: 'dog',
    breed: '金毛',
    age: 2,
    gender: '公',
    weight: 25.5,
    vaccines: ['狂犬疫苗', '五联疫苗'],
    health: '良好'
  },
  {
    id: 'pet_002',
    name: '花花',
    avatar: '/static/images/pet.png',
    type: 'cat',
    breed: '美短',
    age: 1,
    gender: '母',
    weight: 3.8,
    vaccines: ['三联疫苗'],
    health: '良好'
  }
];

// 默认订单数据
const defaultOrders = {
  unpaid: 3,
  shipping: 2,
  delivered: 1,
  completed: 5
};

// 默认待处理数据
const defaultPendingItems = {
  unpaidOrders: 3,
  processingClaims: 1
};

// 模拟订单列表数据
const mockOrderList = [
  // 宠物用品订单
  {
    type: 'goods',
    orderNumber: 'PO2023112501',
    status: '待付款',
    image: '/static/images/pet.png',
    name: '宠物狗粮5kg装',
    specs: '成犬通用型',
    price: 199,
    quantity: 1,
    totalPrice: 199
  },
  {
    type: 'goods',
    orderNumber: 'PO2023112401',
    status: '待发货',
    image: '/static/images/pet.png',
    name: '宠物猫砂10L装',
    specs: '除臭型豆腐猫砂',
    price: 88,
    quantity: 2,
    totalPrice: 176
  },
  {
    type: 'goods',
    orderNumber: 'PO2023112301',
    status: '待收货',
    image: '/static/images/pet.png',
    name: '宠物玩具套装',
    specs: '小型犬专用',
    price: 59,
    quantity: 1,
    totalPrice: 59
  },
  {
    type: 'goods',
    orderNumber: 'PO2023112201',
    status: '已完成',
    image: '/static/images/pet.png',
    name: '宠物清洁用品套装',
    specs: '通用型',
    price: 129,
    quantity: 1,
    totalPrice: 129
  },
  // 保险保单
  {
    type: 'insurance',
    policyNumber: 'IN2023112501',
    status: '待付款',
    insuranceType: '宠物综合医疗险',
    effectiveDate: '2023-12-01',
    expiryDate: '2024-11-30',
    insuredPet: '小白',
    premium: 1200
  },
  {
    type: 'insurance',
    policyNumber: 'IN2023112401',
    status: '已生效',
    insuranceType: '宠物意外险',
    effectiveDate: '2023-11-24',
    expiryDate: '2024-11-23',
    insuredPet: '小黑',
    premium: 800
  }
];

/**
 * 创建虚拟用户并登录
 * @param {Object} customUser - 自定义用户数据（可选）
 * @param {Boolean} showToast - 是否显示登录成功提示
 * @returns {Object} 用户信息
 */
const createMockUser = (customUser = {}, showToast = true) => {
  // 合并默认用户数据和自定义数据
  const userData = {
    ...defaultUser,
    ...customUser,
    // 确保token是唯一的
    token: 'mock_token_' + Date.now()
  };
  
  // 保存用户信息到本地存储
  uni.setStorageSync('userInfo', JSON.stringify(userData));
  uni.setStorageSync('token', userData.token);
  
  // 保存宠物数据
  uni.setStorageSync('petList', defaultPets);
  
  // 保存订单数据
  uni.setStorageSync('orderCounts', defaultOrders);
  
  // 保存订单列表数据
  uni.setStorageSync('orderList', mockOrderList);
  
  // 计算各类待处理事项的数量
  const unpaidCount = mockOrderList.filter(order => order.status === '待付款').length;
  const processingClaimsCount = mockOrderList.filter(order => 
    order.type === 'insurance' && order.status === '处理中').length;
  
  // 保存待处理事项数据
  const pendingItems = {
    unpaidOrders: unpaidCount,
    processingClaims: processingClaimsCount || 1
  };
  uni.setStorageSync('pendingItems', pendingItems);
  
  if (showToast) {
    uni.showToast({
      title: '已创建虚拟用户',
      icon: 'success'
    });
  }
  
  // 触发用户信息更新事件
  uni.$emit('userLogin', userData);
  
  return userData;
};

/**
 * 检查是否有虚拟用户登录
 * @returns {Boolean} 是否已登录
 */
const isMockUserLoggedIn = () => {
  const token = uni.getStorageSync('token');
  return !!token && token.startsWith('mock_token_');
};

/**
 * 登出虚拟用户
 * @param {Boolean} showToast - 是否显示登出成功提示
 */
const logoutMockUser = (showToast = true) => {
  // 清除用户相关数据
  uni.removeStorageSync('userInfo');
  uni.removeStorageSync('token');
  uni.removeStorageSync('petList');
  uni.removeStorageSync('orderCounts');
  uni.removeStorageSync('pendingItems');
  uni.removeStorageSync('orderList');
  
  if (showToast) {
    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  }
  
  // 触发用户登出事件
  uni.$emit('userLogout');
};

/**
 * 获取当前登录的虚拟用户信息
 * @returns {Object|null} 用户信息或null
 */
const getMockUserInfo = () => {
  if (!isMockUserLoggedIn()) {
    return null;
  }
  
  try {
    const userInfoStr = uni.getStorageSync('userInfo');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {
    console.error('获取用户信息失败', e);
    return null;
  }
};

// 导出模块
export default {
  createMockUser,
  isMockUserLoggedIn,
  logoutMockUser,
  getMockUserInfo,
  defaultUser,
  defaultPets,
  defaultOrders,
  defaultPendingItems,
  mockOrderList
}; 