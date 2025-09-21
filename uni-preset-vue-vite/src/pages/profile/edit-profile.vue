<template>
  <view class="edit-profile-container">
    <!-- 功能暂时停用提示 -->
    <view class="disabled-notice">
      <view class="notice-icon">🚧</view>
      <text class="notice-title">功能暂时停用</text>
      <text class="notice-desc">个人资料编辑功能正在维护中，请稍后再试</text>
      <button class="back-btn" @tap="goBack">返回上一页</button>
    </view>

    <!-- 原始功能代码（已注释）
    <view class="nav-bar">
      <text class="nav-title">编辑个人资料</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <view class="edit-section">
      <view class="section-title">头像</view>
      <view class="avatar-edit" @tap="chooseAvatar">
        <image class="avatar" :src="userInfo.avatar || defaultAvatar"></image>
        <text class="edit-hint">点击更换头像</text>
      </view>
    </view>

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

    <button class="save-btn" @tap="saveProfile">保存</button>
    -->
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

// 暂时停用所有功能代码
/*
const defaultAvatar = '/static/images/default-avatar-mao.jpg';
const userInfo = ref({
  avatar: '',
  nickname: '',
  gender: ''
});

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uploadAvatar(tempFilePath);
    }
  });
};

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

const selectGender = (gender) => {
  userInfo.value.gender = gender;
};

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

  uni.request({
    url: 'YOUR_API_URL/update-profile',
    method: 'POST',
    data: {
      ...userInfo.value
    },
    success: (res) => {
      if (res.data.success) {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        uni.setStorageSync('userInfo', JSON.stringify(userInfo.value));
        setTimeout(() => {
          goBack();
        }, 1500);
      }
    }
  });
};
*/

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.edit-profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disabled-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  max-width: 600rpx;
  width: 90%;
  
  .notice-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }
  
  .notice-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .notice-desc {
    font-size: 28rpx;
    color: #666;
    text-align: center;
    line-height: 1.5;
    margin-bottom: 40rpx;
  }
  
  .back-btn {
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #6F87FF;
    color: #ffffff;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
}

/* 原始样式代码（已注释）
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
*/
</style> 