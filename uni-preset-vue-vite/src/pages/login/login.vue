<template>
  <view class="login-container">
    <view class="login-header">
      <image class="logo" src="/static/images/logo.png"></image>
      <text class="welcome">欢迎使用petpal</text>
    </view>
    
    <view class="login-options">
      <view class="login-card">
        <view class="login-title">登录/注册</view>
        <view class="login-desc">登录后享受更多会员特权</view>
        
        <!-- 微信登录按钮 -->
        <button class="wechat-login-btn" open-type="getUserInfo" @getuserinfo="handleWechatLogin">
          <text class="wechat-icon iconfont icon-wechat"></text>
          <text>微信一键登录</text>
        </button>
        
        <!-- 手机号登录按钮 -->
        <view class="phone-login-btn" @tap="goToPhoneLogin">
          <text class="phone-icon iconfont icon-phone"></text>
          <text>手机号登录</text>
        </view>
        
        <!-- 账号密码登录按钮 -->
        <view class="account-login-btn" @tap="goToAccountLogin">
          <text class="account-icon iconfont icon-user"></text>
          <text>账号密码登录</text>
        </view>
        
        <!-- 虚拟用户登录按钮 -->
        <view class="mock-login-btn" @tap="handleMockLogin">
          <text class="mock-icon iconfont icon-user"></text>
          <text>虚拟用户登录</text>
        </view>
      </view>
    </view>
    
    <view class="agreement">
      <checkbox :checked="agreePolicy" @tap="toggleAgree" class="agreement-checkbox"></checkbox>
      <text class="agreement-text">登录即表示您已同意</text>
      <text class="policy-link" @tap="showUserPolicy">《用户协议》</text>
      <text class="agreement-text">和</text>
      <text class="policy-link" @tap="showPrivacyPolicy">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userApi, commonApi } from '../../utils/api';

// 是否同意用户协议和隐私政策
const agreePolicy = ref(false);

onMounted(() => {
  checkPreviousLogin();
});

const checkPreviousLogin = () => {
  try {
    const token = uni.getStorageSync('token');
    const userInfo = uni.getStorageSync('userInfo');
    if (token && userInfo) {
      // 已登录，返回上一页
      uni.navigateBack();
    }
  } catch(e) {
    console.error('检查登录状态失败', e);
  }
};

// 切换同意状态
const toggleAgree = () => {
  agreePolicy.value = !agreePolicy.value;
};

// 前往手机号登录页面
const goToPhoneLogin = () => {
  if (!agreePolicy.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: '/pages/login/phone-login'
  });
};

// 前往账号密码登录页面
const goToAccountLogin = () => {
  if (!agreePolicy.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    });
    return;
  }
  
  uni.navigateTo({
    url: '/pages/login/account-login'
  });
};

// 处理虚拟用户登录
const handleMockLogin = () => {
  if (!agreePolicy.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    });
    return;
  }
  
  uni.showToast({
    title: '已关闭模拟登录功能',
    icon: 'none'
  });
};

// 处理微信登录
const handleWechatLogin = (e) => {
  if (!agreePolicy.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    });
    return;
  }
  
  console.log('微信登录回调', e);
  
  // 检查用户是否允许授权
  if (e.detail.errMsg === 'getUserInfo:ok') {
    const userInfo = e.detail.userInfo;
    
    // 显示加载中
    uni.showLoading({
      title: '登录中...'
    });
    
    // 获取微信临时登录凭证
    uni.login({
      provider: 'weixin',
      success: (loginRes) => {
        console.log('获取登录凭证成功', loginRes.code);
        
        // 调用后端API登录
        userApi.wxLogin(loginRes.code, userInfo)
          .then(res => {
            // 登录成功，保存用户信息
            handleLoginSuccess(res.data, userInfo);
          })
          .catch(err => {
            console.error('登录失败', err);
            uni.showToast({
              title: err.message || '登录失败，请重试',
              icon: 'none'
            });
          })
          .finally(() => {
            uni.hideLoading();
          });
      },
      fail: (err) => {
        console.error('微信登录失败', err);
        uni.hideLoading();
        uni.showToast({
          title: '微信登录失败，请重试',
          icon: 'none'
        });
      }
    });
  } else {
    uni.showToast({
      title: '您取消了授权',
      icon: 'none'
    });
  }
};

// 处理登录成功
const handleLoginSuccess = (loginData, userInfo) => {
  // 保存登录信息
  const userData = {
    token: loginData.token,
    userId: loginData.userId,
    nickname: userInfo.nickName,
    avatar: userInfo.avatarUrl,
    memberLevel: loginData.memberLevel || '普通会员',
    petAvatar: loginData.petAvatar || '/static/images/pet.png',
    // 其他需要保存的用户信息
  };
  
  // 存储用户信息
  uni.setStorageSync('userInfo', JSON.stringify(userData));
  uni.setStorageSync('token', loginData.token);
  
  // 触发登录事件
  uni.$emit('userLogin');
  
  uni.showToast({
    title: '登录成功',
    icon: 'success'
  });
  
  // 如果是新用户，跳转到宠物信息完善页面
  if (loginData.isNewUser) {
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/profile/pet-info'
      });
    }, 1500);
  } else {
    // 返回个人中心页面
    setTimeout(() => {
      try {
        // 尝试返回上一页，如果失败则使用switchTab
        const pages = getCurrentPages();
        console.log('当前页面栈:', pages);
        
        if (pages.length > 1) {
          uni.navigateBack();
        } else {
          // 如果页面栈不足，直接切换到个人中心tab
          uni.switchTab({
            url: '/pages/profile/profile',
            fail: (err) => {
              console.error('切换到个人中心失败:', err);
              // 最后尝试重定向
              uni.redirectTo({
                url: '/pages/profile/profile'
              });
            }
          });
        }
      } catch (e) {
        console.error('导航错误:', e);
        // 发生错误时，尝试使用switchTab直接切换到个人中心
        uni.switchTab({
          url: '/pages/profile/profile'
        });
      }
    }, 1500);
  }
};

// 显示用户协议
const showUserPolicy = () => {
  commonApi.getUserPolicy()
    .then(res => {
      // 根据返回的内容显示协议
      uni.navigateTo({
        url: '/pages/common/user-policy'
      });
    })
    .catch(err => {
      console.error('获取用户协议失败', err);
      // 仍然跳转到协议页面，页面内部会处理加载失败的情况
      uni.navigateTo({
        url: '/pages/common/user-policy'
      });
    });
};

// 显示隐私政策
const showPrivacyPolicy = () => {
  commonApi.getPrivacyPolicy()
    .then(res => {
      // 根据返回的内容显示协议
      uni.navigateTo({
        url: '/pages/common/privacy-policy'
      });
    })
    .catch(err => {
      console.error('获取隐私政策失败', err);
      // 仍然跳转到协议页面，页面内部会处理加载失败的情况
      uni.navigateTo({
        url: '/pages/common/privacy-policy'
      });
    });
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding: 30rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
  margin-bottom: 80rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.welcome {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.login-options {
  flex: 1;
}

.login-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.login-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.login-desc {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.wechat-login-btn, .phone-login-btn, .account-login-btn, .mock-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90rpx;
  border-radius: 45rpx;
  font-size: 32rpx;
  margin-bottom: 30rpx;
}

.wechat-login-btn {
  background-color: #07c160;
  color: #fff;
}

.phone-login-btn {
  background-color: #f0f4ff;
  color: #6F87FF;
  border: 1px solid #6F87FF;
}

.account-login-btn {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.mock-login-btn {
  background-color: #fff5f0;
  color: #FF9D6C;
  border: 1px solid #FF9D6C;
}

.wechat-icon, .phone-icon, .account-icon, .mock-icon {
  margin-right: 10rpx;
  font-size: 40rpx;
}

.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
  font-size: 24rpx;
}

.agreement-checkbox {
  transform: scale(0.7);
}

.agreement-text {
  color: #999;
}

.policy-link {
  color: #6F87FF;
}
</style> 