<template>
  <view class="phone-login-container">
    <view class="form-container">
      <view class="form-title">手机号登录</view>
      
      <view class="form-item">
        <text class="input-label">手机号</text>
        <view class="input-wrapper">
          <text class="country-code">+86</text>
          <input 
            class="phone-input" 
            type="number" 
            maxlength="11"
            placeholder="请输入手机号码" 
            v-model="phoneNumber"
            @input="validatePhoneNumber" />
        </view>
        <text v-if="phoneError" class="error-tip">{{ phoneError }}</text>
      </view>
      
      <view class="form-item">
        <text class="input-label">验证码</text>
        <view class="input-wrapper code-wrapper">
          <input 
            class="code-input" 
            type="number" 
            maxlength="6"
            placeholder="请输入验证码" 
            v-model="verifyCode" />
          <button 
            class="send-code-btn" 
            :disabled="!canSendCode || countDown > 0" 
            @tap="sendVerifyCode">
            {{ countDown > 0 ? `重新发送(${countDown}s)` : '获取验证码' }}
          </button>
        </view>
        <text v-if="codeError" class="error-tip">{{ codeError }}</text>
      </view>
      
      <button class="login-btn" :disabled="!canLogin" @tap="handleLogin">登录</button>
      
      <view class="other-login-options">
        <text class="divider-text">其他登录方式</text>
        <view class="other-options">
          <view class="wechat-option" @tap="backToWechatLogin">
            <text class="wechat-icon iconfont icon-wechat"></text>
            <text class="option-text">微信</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { userApi } from '../../utils/api';

// 手机号和验证码
const phoneNumber = ref('');
const verifyCode = ref('');
const phoneError = ref('');
const codeError = ref('');
const countDown = ref(0);
const countDownTimer = ref(null);

// 计算属性：是否可以发送验证码
const canSendCode = computed(() => {
  return phoneNumber.value.length === 11 && !phoneError.value;
});

// 计算属性：是否可以登录
const canLogin = computed(() => {
  return phoneNumber.value.length === 11 && 
         verifyCode.value.length === 6 && 
         !phoneError.value && 
         !codeError.value;
});

// 验证手机号格式
const validatePhoneNumber = () => {
  if (phoneNumber.value.length === 0) {
    phoneError.value = '';
    return;
  }
  
  if (phoneNumber.value.length !== 11) {
    phoneError.value = '请输入11位手机号码';
    return;
  }
  
  // 使用正则表达式验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneError.value = '手机号格式不正确';
  } else {
    phoneError.value = '';
  }
};

// 发送验证码
const sendVerifyCode = () => {
  if (!canSendCode.value || countDown.value > 0) {
    return;
  }
  
  // 显示加载中
  uni.showLoading({
    title: '发送中...'
  });
  
  // 调用验证码API
  userApi.sendVerifyCode(phoneNumber.value)
    .then(res => {
      uni.hideLoading();
      
      // 提示发送成功
      uni.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
      
      // 设置倒计时
      countDown.value = 60;
      startCountDown();
    })
    .catch(err => {
      uni.hideLoading();
      uni.showToast({
        title: err.message || '发送验证码失败',
        icon: 'none'
      });
    });
};

// 开始倒计时
const startCountDown = () => {
  // 清除之前的定时器
  clearInterval(countDownTimer.value);
  
  // 创建新的定时器
  countDownTimer.value = setInterval(() => {
    countDown.value--;
    if (countDown.value <= 0) {
      clearInterval(countDownTimer.value);
    }
  }, 1000);
};

// 处理登录逻辑
const handleLogin = () => {
  if (!canLogin.value) {
    return;
  }
  
  // 显示加载中
  uni.showLoading({
    title: '登录中...'
  });
  
  // 调用登录API
  userApi.phoneLogin(phoneNumber.value, verifyCode.value)
    .then(res => {
      uni.hideLoading();
      
      // 登录成功
      const userData = res.data;
      
      // 保存用户信息和token
      uni.setStorageSync('token', userData.token);
      uni.setStorageSync('userInfo', JSON.stringify({
        token: userData.token,
        userId: userData.userId,
        nickname: userData.nickname,
        avatar: userData.avatar,
        memberLevel: userData.memberLevel || '普通会员',
        petAvatar: userData.petAvatar || '/static/images/pet.png'
      }));
      
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 触发登录事件
      uni.$emit('userLogin');
      
      // 如果是新用户，跳转到宠物信息完善页面
      if (userData.isNewUser) {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/profile/pet-info'
          });
        }, 1500);
      } else {
        // 登录成功，返回个人中心页面
        setTimeout(() => {
          try {
            // 尝试返回上一页，如果失败则使用switchTab
            const pages = getCurrentPages();
            console.log('当前页面栈:', pages);
            
            if (pages.length > 1) {
              uni.navigateBack({
                delta: 2 // 返回两层，跳过登录选择页
              });
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
    })
    .catch(err => {
      uni.hideLoading();
      
      // 登录失败
      uni.showToast({
        title: err.message || '登录失败，请检查手机号和验证码',
        icon: 'none'
      });
      
      // 如果是验证码错误，显示错误提示
      if (err.code === 400) {
        codeError.value = '验证码错误';
      }
    });
};

// 返回微信登录页面
const backToWechatLogin = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.phone-login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 30rpx;
}

.form-container {
  margin-top: 60rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 50rpx;
  text-align: center;
}

.form-item {
  margin-bottom: 40rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  height: 90rpx;
  border-bottom: 1px solid #e0e0e0;
}

.country-code {
  font-size: 32rpx;
  color: #333;
  margin-right: 20rpx;
}

.phone-input, .code-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
}

.code-wrapper {
  position: relative;
}

.send-code-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  color: #6F87FF;
  font-size: 28rpx;
  padding: 0;
  border: none;
  min-width: 180rpx;
  text-align: right;
}

.send-code-btn::after {
  border: none;
}

.send-code-btn[disabled] {
  color: #999;
  background-color: transparent;
}

.error-tip {
  display: block;
  font-size: 24rpx;
  color: #ff4d4f;
  margin-top: 10rpx;
}

.login-btn {
  margin-top: 60rpx;
  height: 90rpx;
  border-radius: 45rpx;
  background-color: #6F87FF;
  color: #fff;
  font-size: 32rpx;
  line-height: 90rpx;
}

.login-btn[disabled] {
  background-color: #d9d9d9;
  color: #fff;
}

.other-login-options {
  margin-top: 80rpx;
}

.divider-text {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: #999;
  position: relative;
  margin-bottom: 40rpx;
}

.divider-text::before,
.divider-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 25%;
  height: 1px;
  background-color: #e0e0e0;
}

.divider-text::before {
  left: 0;
}

.divider-text::after {
  right: 0;
}

.other-options {
  display: flex;
  justify-content: center;
}

.wechat-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wechat-icon {
  font-size: 80rpx;
  color: #07c160;
  margin-bottom: 15rpx;
}

.option-text {
  font-size: 24rpx;
  color: #666;
}
</style> 