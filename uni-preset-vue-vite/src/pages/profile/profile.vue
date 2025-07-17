<template>
  <view class="profile-container">
    <!-- 顶部用户信息 -->
    <view class="user-header">
      <view class="user-info" @tap="handleUserInfoClick">
        <image class="avatar" :src="userInfo.avatar || defaultAvatar"></image>
        <view class="user-detail">
          <view class="username">
            {{ userInfo.nickname || '未登录' }}
            <text v-if="isLoggedIn" class="edit-icon iconfont icon-edit"></text>
          </view>
          <view v-if="isLoggedIn" class="member-tag">
            {{ userInfo.memberLevel }}
          </view>
          <view v-else class="login-btn">点击登录/注册</view>
        </view>
      </view>
      <view class="pet-avatars" @tap="goToPetManagement">
        <image 
          v-for="(pet, index) in petList" 
          :key="index"
          class="pet-avatar" 
          :src="pet.avatar || '/static/images/pet.png'"
        ></image>
        <view v-if="petList.length === 0" class="add-pet-hint">
          <text class="iconfont icon-add"></text>
          <text>添加宠物</text>
        </view>
      </view>
      
      <!-- 快捷模拟登录/退出按钮 -->
      <view class="mock-login-buttons">
        <button v-if="!isLoggedIn" class="mock-btn mock-login" @tap="handleMockLogin">快速模拟登录</button>
        <button v-else class="mock-btn mock-logout" @tap="handleMockLogout">退出登录</button>
      </view>
    </view>

    <!-- 功能块区域 -->
    <view class="feature-grid">
      <view v-for="(item, index) in featureItems" :key="index" class="feature-item" @tap="handleFeatureClick(item)">
        <view class="feature-icon">
          <text :class="['iconfont', item.icon]"></text>
        </view>
        <text class="feature-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 待处理事项 -->
    <view class="task-section">
      <view class="section-header">
        <text class="section-icon iconfont icon-calendar"></text>
        <text class="section-title">待处理事项</text>
      </view>
      
      <view v-if="isLoggedIn">
        <view class="task-item" @tap="goToPendingItems">
          <view class="task-left">
            <text class="task-icon iconfont icon-payment"></text>
            <view class="task-info">
              <view class="task-title">待付款订单</view>
              <view class="task-desc">有{{pendingItems.unpaidOrders}}个订单等待支付</view>
            </view>
          </view>
          <text class="task-action">去支付</text>
        </view>
      </view>
      
      <view v-else class="login-required">
        <text class="login-tip">登录后查看您的待处理事项</text>
        <button class="login-now-btn" @tap="navigateToLogin">立即登录</button>
      </view>
    </view>

    <!-- 活动通知 -->
    <view class="notification-section">
      <view class="section-header">
        <text class="section-icon iconfont icon-notification"></text>
        <text class="section-title">活动通知</text>
      </view>
      
      <view class="notification-item">
        <view class="notification-left">
          <text class="notification-icon iconfont icon-gift"></text>
          <view class="notification-info">
            <view class="notification-title">会员日专属优惠</view>
            <view class="notification-desc">每月18日，尊享9折特权</view>
          </view>
        </view>
        <text class="notification-time">3分钟前</text>
      </view>
      
      <view class="notification-item">
        <view class="notification-left">
          <text class="notification-icon iconfont icon-coupon"></text>
          <view class="notification-info">
            <view class="notification-title">新人专享礼包</view>
            <view class="notification-desc">新用户专享多重优惠</view>
          </view>
        </view>
        <text class="notification-time">昨天</text>
      </view>
    </view>

    <!-- 底部标签栏 -->
    <view class="bottom-tabbar">
      <view class="tab-item" @tap="switchTab('home')">
        <text class="tab-icon iconfont icon-home"></text>
        <text class="tab-name">首页</text>
      </view>
      <view class="tab-item" @tap="switchTab('discover')">
        <text class="tab-icon iconfont icon-compass"></text>
        <text class="tab-name">发现</text>
      </view>
      <view class="tab-item tab-active" @tap="switchTab('profile')">
        <text class="tab-icon iconfont icon-user"></text>
        <text class="tab-name">我的</text>
      </view>
      <view class="tab-item" @tap="switchTab('settings')">
        <text class="tab-icon iconfont icon-settings"></text>
        <text class="tab-name">设置</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mockUser from '../../utils/mockUser.js';
import { userApi, petApi, orderApi } from '../../utils/api';
import { USE_MOCK } from '../../utils/config';

// 默认头像
const defaultAvatar = '/static/images/default-avatar.png';

// 是否已登录
const isLoggedIn = ref(false);

// 用户信息
const userInfo = ref({
  nickname: '',
  avatar: '',
  memberLevel: '黄金会员',
  petAvatar: '/static/images/pet.png'
});

// 功能区
const featureItems = ref([
  { name: '订单管理', icon: 'icon-order' },
  { name: '社区互动', icon: 'icon-community' },
  { name: '账户工具', icon: 'icon-tools' },
  { name: '服务支持', icon: 'icon-support' }
]);

const petList = ref([]);

// 待处理事项数据
const pendingItems = ref({
  unpaidOrders: 0
});

// 获取宠物列表
const getPetList = () => {
  if (USE_MOCK) {
    const list = uni.getStorageSync('petList') || [];
    petList.value = list;
    return;
  }
  
  if (!isLoggedIn.value) return;
  
  petApi.getPetList()
    .then(res => {
      petList.value = res.data || [];
    })
    .catch(err => {
      console.error('获取宠物列表失败', err);
      petList.value = [];
    });
};

// 获取待处理事项
const fetchPendingItems = async () => {
  try {
    // 模拟API调用
    const response = {
      unpaidOrders: 3
    }
    pendingItems.value = response
  } catch (error) {
    console.error('获取待处理事项失败:', error)
  }
}

// 页面加载时检查登录状态和获取宠物列表
onMounted(() => {
  checkLoginStatus();
  getPetList();
  fetchPendingItems();
  
  // 监听宠物列表更新事件
  uni.$on('updatePetList', () => {
    getPetList();
  });
  
  // 监听用户登录事件
  uni.$on('userLogin', () => {
    checkLoginStatus();
    getPetList();
    fetchPendingItems();
  });
  
  // 监听用户登出事件
  uni.$on('userLogout', () => {
    checkLoginStatus();
    getPetList();
    fetchPendingItems();
  });
});

onUnmounted(() => {
  // 移除事件监听
  uni.$off('updatePetList');
  uni.$off('userLogin');
  uni.$off('userLogout');
});

// 检查登录状态
const checkLoginStatus = () => {
  if (USE_MOCK) {
    try {
      const userInfoStorage = uni.getStorageSync('userInfo');
      if (userInfoStorage) {
        userInfo.value = JSON.parse(userInfoStorage);
        
        // 确保有宠物头像，如果没有则使用默认图片
        if (!userInfo.value.petAvatar) {
          userInfo.value.petAvatar = '/static/images/pet.png';
        }
        
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    } catch (e) {
      console.error('获取登录状态失败', e);
      isLoggedIn.value = false;
    }
    return;
  }
  
  // 使用真实API获取用户信息
  const token = uni.getStorageSync('token');
  if (!token) {
    isLoggedIn.value = false;
    return;
  }
  
  userApi.getUserInfo()
    .then(res => {
      userInfo.value = res.data;
      isLoggedIn.value = true;
      
      // 确保有宠物头像，如果没有则使用默认图片
      if (!userInfo.value.petAvatar) {
        userInfo.value.petAvatar = '/static/images/pet.png';
      }
      
      // 保存最新的用户信息
      uni.setStorageSync('userInfo', JSON.stringify(userInfo.value));
    })
    .catch(err => {
      console.error('获取用户信息失败', err);
      isLoggedIn.value = false;
    });
};

// 处理模拟登录
const handleMockLogin = () => {
  mockUser.createMockUser();
};

// 处理模拟登出
const handleMockLogout = () => {
  mockUser.logoutMockUser();
};

// 处理真实登出
const handleLogout = () => {
  if (USE_MOCK) {
    handleMockLogout();
    return;
  }
  
  userApi.logout()
    .then(res => {
      // 清除本地存储
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      
      uni.showToast({
        title: '已退出登录',
        icon: 'success'
      });
      
      // 更新登录状态
      isLoggedIn.value = false;
      
      // 触发登出事件
      uni.$emit('userLogout');
    })
    .catch(err => {
      console.error('登出失败', err);
      uni.showToast({
        title: '登出失败，请重试',
        icon: 'none'
      });
    });
};

// 处理用户信息点击
const handleUserInfoClick = () => {
  if (isLoggedIn.value) {
    // 已登录，跳转到个人资料编辑页
    goToEditProfile();
  } else {
    // 未登录，跳转到登录页
    navigateToLogin();
  }
};

// 跳转到登录页
const navigateToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};

// 跳转到个人资料编辑页
const goToEditProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/edit-profile'
  });
};

// 处理功能点击
const handleFeatureClick = (item) => {
  console.log('点击了功能：', item.name);
  
  // 某些功能可能需要登录才能使用
  if (!isLoggedIn.value && ['订单管理', '我的钱包', '会员特权', '社区互动'].includes(item.name)) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    setTimeout(() => {
      navigateToLogin();
    }, 1500);
    return;
  }
  
  // 根据不同功能跳转不同页面
  switch (item.name) {
    case '订单管理':
      uni.navigateTo({ url: '/pages/order/index' });
      break;
    case '社区互动':
      uni.navigateTo({ url: '/pages/community/index' });
      break;
    case '账户工具':
      uni.navigateTo({ url: '/pages/account/index' });
      break;
    case '服务支持':
      uni.navigateTo({ url: '/pages/support/index' });
      break;
    default:
      // 其他功能的处理...
      break;
  }
};

// 跳转到待处理事项页面
const goToPendingItems = () => {
  uni.navigateTo({
    url: '/pages/profile/pending-items'
  });
};

// 跳转到宠物管理页面
const goToPetManagement = () => {
  uni.navigateTo({
    url: '/pages/profile/pet-management'
  });
};

// 切换标签页
const switchTab = (tab) => {
  if (tab === 'home') {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }
  // 其他标签页的处理
};
</script>

<style lang="scss">
.profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
}

/* 用户信息头部 */
.user-header {
  position: relative;
  padding: 40rpx 30rpx;
  color: #fff;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-right: 20rpx;
  background-color: #e0e0e0;
}

.user-detail {
  flex: 1;
}

.username {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
}

.edit-icon {
  font-size: 28rpx;
  margin-left: 10rpx;
}

.member-tag {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.login-btn {
  display: inline-block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5rpx;
}

.pet-avatars {
  display: flex;
  align-items: center;
  gap: 20rpx;
  
  .pet-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    border: 2rpx solid #ffffff;
  }
  
  .add-pet-hint {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 10rpx 20rpx;
    background-color: #f0f4ff;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: #6F87FF;
    
    .iconfont {
      font-size: 28rpx;
    }
  }
}

/* 模拟登录按钮 */
.mock-login-buttons {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
}

.mock-btn {
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.mock-login {
  background-color: rgba(255, 255, 255, 0.9);
  color: #6F87FF;
}

.mock-logout {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* 功能区 */
.feature-grid {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  border-radius: 20rpx;
  margin: 20rpx;
  padding: 20rpx 0;
}

.feature-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.feature-icon {
  width: 100rpx;
  height: 100rpx;
  background-color: #f0f4ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15rpx;
  font-size: 40rpx;
  color: #6F87FF;
}

.feature-name {
  font-size: 26rpx;
  color: #333;
}

/* 待处理事项区域 */
.task-section, .notification-section {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 20rpx;
  padding: 30rpx 20rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-icon {
  margin-right: 10rpx;
  font-size: 40rpx;
  color: #759cff;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.task-item, .notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.task-item:last-child, .notification-item:last-child {
  border-bottom: none;
}

.task-left, .notification-left {
  display: flex;
  align-items: center;
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #f0f4ff;
  border-radius: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15rpx;
  color: #6F87FF;
  font-size: 40rpx;
}

.notification-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff4ee;
  border-radius: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15rpx;
  color: #FF9D6C;
  font-size: 40rpx;
}

.task-info, .notification-info {
  flex: 1;
}

.task-title, .notification-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.task-desc, .notification-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.task-action {
  color: #6F87FF;
  font-size: 26rpx;
}

.notification-time {
  font-size: 24rpx;
  color: #999;
}

/* 未登录状态 */
.login-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.login-tip {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.login-now-btn {
  background: #6F87FF;
  color: #fff;
  font-size: 28rpx;
  padding: 10rpx 40rpx;
  border-radius: 30rpx;
  border: none;
}

/* 底部标签栏 */
.bottom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #f0f0f0;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rpx 0;
}

.tab-icon {
  font-size: 40rpx;
  color: #999;
}

.tab-name {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.tab-active .tab-icon,
.tab-active .tab-name {
  color: #6F87FF;
}
</style> 