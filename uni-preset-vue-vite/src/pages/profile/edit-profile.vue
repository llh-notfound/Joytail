<template>
  <view class="edit-profile-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">编辑个人资料</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 头像编辑 -->
    <view class="edit-section">
      <view class="section-title">头像</view>
      <view class="avatar-edit" @tap="chooseAvatar">
        <image class="avatar" :src="userInfo.avatar || defaultAvatar"></image>
        <text class="edit-hint">点击更换头像</text>
      </view>
    </view>

    <!-- 昵称编辑 -->
    <view class="edit-section">
      <view class="section-title">昵称</view>
      <input 
        class="input-field" 
        type="text" 
        v-model="userInfo.nickname" 
        placeholder="请输入昵称"
        maxlength="20"
      />
    </view>

    <!-- 性别选择 -->
    <view class="edit-section">
      <view class="section-title">性别</view>
      <view class="gender-select">
        <view 
          class="gender-option" 
          :class="{ active: userInfo.gender === 'male' }"
          @tap="selectGender('male')"
        >
          <text class="iconfont icon-male"></text>
          <text>男</text>
        </view>
        <view 
          class="gender-option" 
          :class="{ active: userInfo.gender === 'female' }"
          @tap="selectGender('female')"
        >
          <text class="iconfont icon-female"></text>
          <text>女</text>
        </view>
      </view>
    </view>

    <!-- 手机号绑定 -->
    <view class="edit-section">
      <view class="section-title">手机号</view>
      <view class="phone-bind">
        <input 
          class="input-field" 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号"
          maxlength="11"
        />
        <button 
          class="verify-btn" 
          :disabled="!canSendCode" 
          @tap="sendVerifyCode"
        >
          {{ codeButtonText }}
        </button>
      </view>
      <view class="verify-code-input" v-if="showVerifyCode">
        <input 
          class="input-field" 
          type="number" 
          v-model="verifyCode" 
          placeholder="请输入验证码"
          maxlength="6"
        />
      </view>
    </view>

    <!-- 保存按钮 -->
    <button class="save-btn" @tap="saveProfile">保存</button>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const defaultAvatar = '/static/images/default-avatar.png';
const userInfo = ref({
  avatar: '',
  nickname: '',
  gender: '',
  phone: ''
});

const phone = ref('');
const verifyCode = ref('');
const countdown = ref(0);
const showVerifyCode = ref(false);

// 验证码按钮文本
const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}秒后重试` : '获取验证码';
});

// 是否可以发送验证码
const canSendCode = computed(() => {
  return phone.value.length === 11 && countdown.value === 0;
});

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      // 上传图片到服务器
      uploadAvatar(tempFilePath);
    }
  });
};

// 上传头像
const uploadAvatar = (filePath) => {
  uni.uploadFile({
    url: 'YOUR_UPLOAD_URL',
    filePath: filePath,
    name: 'avatar',
    success: (res) => {
      const data = JSON.parse(res.data);
      userInfo.value.avatar = data.url;
    }
  });
};

// 选择性别
const selectGender = (gender) => {
  userInfo.value.gender = gender;
};

// 发送验证码
const sendVerifyCode = () => {
  if (!canSendCode.value) return;
  
  // 发送验证码请求
  uni.request({
    url: 'YOUR_API_URL/send-code',
    method: 'POST',
    data: {
      phone: phone.value
    },
    success: () => {
      showVerifyCode.value = true;
      startCountdown();
    }
  });
};

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 保存个人资料
const saveProfile = () => {
  if (!userInfo.value.nickname) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    });
    return;
  }

  if (!userInfo.value.gender) {
    uni.showToast({
      title: '请选择性别',
      icon: 'none'
    });
    return;
  }

  if (phone.value && !verifyCode.value) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    });
    return;
  }

  // 保存到服务器
  uni.request({
    url: 'YOUR_API_URL/update-profile',
    method: 'POST',
    data: {
      ...userInfo.value,
      phone: phone.value,
      verifyCode: verifyCode.value
    },
    success: (res) => {
      if (res.data.success) {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        // 更新本地存储
        uni.setStorageSync('userInfo', JSON.stringify(userInfo.value));
        setTimeout(() => {
          goBack();
        }, 1500);
      }
    }
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.edit-profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background-color: #ffffff;
  position: relative;
  
  .nav-title {
    font-size: 32rpx;
    font-weight: 500;
  }
  
  .nav-back {
    position: absolute;
    left: 30rpx;
    font-size: 40rpx;
  }
}

.edit-section {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #ffffff;
  
  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.avatar-edit {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    margin-bottom: 20rpx;
  }
  
  .edit-hint {
    font-size: 24rpx;
    color: #999;
  }
}

.input-field {
  width: 100%;
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.gender-select {
  display: flex;
  gap: 40rpx;
  
  .gender-option {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;
    font-size: 28rpx;
    
    &.active {
      background-color: #6F87FF;
      color: #ffffff;
    }
  }
}

.phone-bind {
  display: flex;
  gap: 20rpx;
  
  .input-field {
    flex: 1;
  }
  
  .verify-btn {
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #6F87FF;
    color: #ffffff;
    border-radius: 8rpx;
    font-size: 28rpx;
    
    &:disabled {
      background-color: #cccccc;
    }
  }
}

.verify-code-input {
  margin-top: 20rpx;
}

.save-btn {
  width: 90%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background-color: #6F87FF;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  margin: 60rpx auto;
}
</style> 