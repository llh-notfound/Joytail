<template>
  <view class="account-login-container">
    <view class="form-container">
      <view class="form-title">{{ isRegister ? '账号注册' : '账号登录' }}</view>
      
      <view class="form-item">
        <text class="input-label">用户名/邮箱</text>
        <view class="input-wrapper">
          <input 
            class="username-input" 
            type="text" 
            placeholder="请输入用户名或邮箱" 
            v-model="username" />
        </view>
        <text v-if="usernameError" class="error-tip">{{ usernameError }}</text>
      </view>
      
      <view class="form-item">
        <text class="input-label">密码</text>
        <view class="input-wrapper">
          <input 
            class="password-input" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="请输入密码" 
            v-model="password" />
          <text 
            class="password-toggle iconfont" 
            :class="showPassword ? 'icon-eye' : 'icon-eye-close'"
            @tap="togglePasswordVisibility"></text>
        </view>
        <text v-if="passwordError" class="error-tip">{{ passwordError }}</text>
      </view>
      
      <view v-if="isRegister" class="form-item">
        <text class="input-label">确认密码</text>
        <view class="input-wrapper">
          <input 
            class="password-input" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            placeholder="请再次输入密码" 
            v-model="confirmPassword" />
          <text 
            class="password-toggle iconfont" 
            :class="showConfirmPassword ? 'icon-eye' : 'icon-eye-close'"
            @tap="toggleConfirmPasswordVisibility"></text>
        </view>
        <text v-if="confirmPasswordError" class="error-tip">{{ confirmPasswordError }}</text>
      </view>
      
      <button class="submit-btn" :disabled="!canSubmit" @tap="handleSubmit">
        {{ isRegister ? '注册' : '登录' }}
      </button>
      
      <view class="switch-mode">
        <text @tap="switchMode">
          {{ isRegister ? '已有账号？点击登录' : '没有账号？点击注册' }}
        </text>
      </view>
      
      <view class="other-login-options">
        <text class="divider-text">其他登录方式</text>
        <view class="other-options">
          <view class="option-item" @tap="goToWechatLogin">
            <text class="option-icon iconfont icon-wechat"></text>
            <text class="option-text">微信</text>
          </view>
          <view class="option-item" @tap="goToPhoneLogin">
            <text class="option-icon iconfont icon-phone"></text>
            <text class="option-text">手机号</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { userApi } from '../../utils/api';

// 是否为注册模式
const isRegister = ref(false);

// 表单数据
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

// 错误信息
const usernameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// 密码显示控制
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 切换确认密码可见性
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 切换登录/注册模式
const switchMode = () => {
  isRegister.value = !isRegister.value;
  clearErrors();
};

// 清除错误信息
const clearErrors = () => {
  usernameError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
};

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  if (isRegister.value) {
    return username.value.trim() !== '' && 
           password.value.trim() !== '' && 
           confirmPassword.value.trim() !== '' &&
           !usernameError.value &&
           !passwordError.value &&
           !confirmPasswordError.value;
  } else {
    return username.value.trim() !== '' && 
           password.value.trim() !== '' &&
           !usernameError.value &&
           !passwordError.value;
  }
});

// 验证用户名
const validateUsername = () => {
  const value = username.value.trim();
  if (!value) {
    usernameError.value = '请输入用户名或邮箱';
    return false;
  }
  
  // 验证用户名规则
  if (isRegister.value) {
    // 用户名至少3个字符
    if (value.length < 3) {
      usernameError.value = '用户名至少需要3个字符';
      return false;
    }
    
    // 判断是否是邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.includes('@') && !emailRegex.test(value)) {
      usernameError.value = '邮箱格式不正确';
      return false;
    }
  }
  
  usernameError.value = '';
  return true;
};

// 验证密码
const validatePassword = () => {
  const value = password.value.trim();
  if (!value) {
    passwordError.value = '请输入密码';
    return false;
  }
  
  // 验证密码规则
  if (isRegister.value) {
    // 密码至少6个字符
    if (value.length < 6) {
      passwordError.value = '密码至少需要6个字符';
      return false;
    }
    
    // 密码需要包含字母和数字
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      passwordError.value = '密码需要包含字母和数字';
      return false;
    }
  }
  
  passwordError.value = '';
  return true;
};

// 验证确认密码
const validateConfirmPassword = () => {
  if (!isRegister.value) return true;
  
  const value = confirmPassword.value.trim();
  if (!value) {
    confirmPasswordError.value = '请再次输入密码';
    return false;
  }
  
  if (value !== password.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
    return false;
  }
  
  confirmPasswordError.value = '';
  return true;
};

// 处理提交
const handleSubmit = () => {
  // 验证表单
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  
  if (!isUsernameValid || !isPasswordValid || (isRegister.value && !isConfirmPasswordValid)) {
    return;
  }
  
  // 显示加载中
  uni.showLoading({
    title: isRegister.value ? '注册中...' : '登录中...'
  });
  
  if (isRegister.value) {
    // 调用注册接口
    userApi.register({
      username: username.value,
      password: password.value,
      email: username.value.includes('@') ? username.value : ''
    })
      .then(res => {
        uni.hideLoading();
        
        uni.showToast({
          title: '注册成功，请登录',
          icon: 'success'
        });
        
        // 切换到登录模式
        isRegister.value = false;
        password.value = '';
        confirmPassword.value = '';
      })
      .catch(err => {
        uni.hideLoading();
        
        // 显示错误信息
        if (err.code === 400 && err.message.includes('用户名已存在')) {
          usernameError.value = '用户名已被注册';
        } else if (err.code === 400 && err.message.includes('邮箱已存在')) {
          usernameError.value = '邮箱已被注册';
        } else {
          uni.showToast({
            title: err.message || '注册失败，请重试',
            icon: 'none'
          });
        }
      });
  } else {
    // 调用登录接口
    userApi.login(username.value, password.value)
      .then(res => {
        uni.hideLoading();
        
        // 登录成功，保存用户信息
        const userData = res.data;
        
        // 保存用户信息和token
        uni.setStorageSync('token', userData.token);
        uni.setStorageSync('userInfo', JSON.stringify({
          token: userData.token,
          userId: userData.userId,
          nickname: userData.nickname || username.value,
          avatar: userData.avatar || '/static/images/default-avatar-mao.jpg',
          memberLevel: userData.memberLevel || '普通会员',
          petAvatar: userData.petAvatar || '/static/images/pet.png'
        }));
        
        // 触发登录事件
        uni.$emit('userLogin');
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
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
        
        // 显示错误信息
        if (err.code === 400 && err.message.includes('用户名或密码错误')) {
          passwordError.value = '用户名或密码错误';
        } else {
          uni.showToast({
            title: err.message || '登录失败，请重试',
            icon: 'none'
          });
        }
      });
  }
};

// 返回微信登录页面
const goToWechatLogin = () => {
  uni.navigateBack();
};

// 前往手机号登录页面
const goToPhoneLogin = () => {
  uni.redirectTo({
    url: '/pages/login/phone-login'
  });
};
</script>

<style lang="scss">
.account-login-container {
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
  position: relative;
}

.username-input, .password-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
}

.password-toggle {
  position: absolute;
  right: 10rpx;
  color: #999;
  font-size: 40rpx;
}

.error-tip {
  display: block;
  font-size: 24rpx;
  color: #ff4d4f;
  margin-top: 10rpx;
}

.submit-btn {
  margin-top: 60rpx;
  height: 90rpx;
  border-radius: 45rpx;
  background-color: #1890ff;
  color: #fff;
  font-size: 32rpx;
  line-height: 90rpx;
}

.submit-btn[disabled] {
  background-color: #d9d9d9;
  color: #fff;
}

.switch-mode {
  margin-top: 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #1890ff;
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
  gap: 60rpx;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-icon {
  font-size: 80rpx;
  margin-bottom: 15rpx;
}

.option-icon.icon-wechat {
  color: #07c160;
}

.option-icon.icon-phone {
  color: #6F87FF;
}

.option-text {
  font-size: 24rpx;
  color: #666;
}
</style> 