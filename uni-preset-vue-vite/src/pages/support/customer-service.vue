<template>
  <view class="customer-service-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">在线客服</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 聊天区域 -->
    <scroll-view 
      scroll-y 
      class="chat-area"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollToView"
      @scrolltoupper="loadMoreMessages"
    >
      <!-- 加载更多 -->
      <view v-if="hasMore" class="loading-more">
        <text>加载中...</text>
      </view>

      <!-- 消息列表 -->
      <view class="message-list">
        <view 
          v-for="(item, index) in messageList" 
          :key="index"
          :id="'msg-' + item.id"
          class="message-item"
          :class="{ 'message-self': item.isSelf }"
        >
          <image 
            class="avatar" 
            :src="item.isSelf ? userInfo.avatar : '/static/images/customer-service.png'"
            mode="aspectFill"
          ></image>
          <view class="message-content">
            <text class="message-text">{{ item.content }}</text>
            <text class="message-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input 
        class="message-input" 
        v-model="inputMessage" 
        placeholder="请输入您的问题" 
        confirm-type="send"
        @confirm="sendMessage"
      />
      <view class="send-btn" @tap="sendMessage">发送</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// 用户信息
const userInfo = ref({
  avatar: '/static/images/avatar.png',
  nickname: '用户'
});

// 消息列表
const messageList = ref([]);
const hasMore = ref(false);
const scrollTop = ref(0);
const scrollToView = ref('');
const inputMessage = ref('');

// 模拟消息数据
const mockMessages = [
  {
    id: 1,
    content: '您好，欢迎咨询PetPal宠物服务平台，请问有什么可以帮您？',
    time: '10:00',
    isSelf: false
  },
  {
    id: 2,
    content: '我想咨询一下宠物保险的理赔流程',
    time: '10:01',
    isSelf: true
  },
  {
    id: 3,
    content: '好的，宠物保险理赔流程如下：\n1. 准备理赔材料（医疗单据、诊断证明等）\n2. 登录APP，进入"我的-保险服务-理赔申请"\n3. 上传理赔材料\n4. 等待审核，一般1-3个工作日\n5. 审核通过后，理赔金额将直接打入您的账户',
    time: '10:02',
    isSelf: false
  },
  {
    id: 4,
    content: '谢谢，明白了',
    time: '10:03',
    isSelf: true
  },
  {
    id: 5,
    content: '不客气，还有其他问题吗？',
    time: '10:04',
    isSelf: false
  }
];

// 获取消息列表
const getMessageList = () => {
  // 模拟接口请求
  setTimeout(() => {
    messageList.value = mockMessages;
    hasMore.value = false; // 模拟数据没有更多了
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  }, 500);
};

// 加载更多消息
const loadMoreMessages = () => {
  if (hasMore.value) {
    // 模拟加载更多
    uni.showToast({
      title: '没有更多消息了',
      icon: 'none'
    });
  }
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) {
    uni.showToast({
      title: '请输入消息内容',
      icon: 'none'
    });
    return;
  }
  
  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    content: inputMessage.value,
    time: formatTime(new Date()),
    isSelf: true
  };
  
  messageList.value.push(userMessage);
  
  // 清空输入框
  inputMessage.value = '';
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
  
  // 模拟客服回复
  setTimeout(() => {
    const serviceMessage = {
      id: Date.now() + 1,
      content: getAutoReply(userMessage.content),
      time: formatTime(new Date()),
      isSelf: false
    };
    
    messageList.value.push(serviceMessage);
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  }, 1000);
};

// 滚动到底部
const scrollToBottom = () => {
  if (messageList.value.length > 0) {
    const lastMessage = messageList.value[messageList.value.length - 1];
    scrollToView.value = 'msg-' + lastMessage.id;
  }
};

// 格式化时间
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 自动回复
const getAutoReply = (message) => {
  const keywords = {
    '保险': '关于保险问题，您可以查看帮助中心的"保险服务"专题，或直接联系我们的保险专员。',
    '退款': '退款问题请提供您的订单号，我们会尽快为您处理。',
    '物流': '物流问题请提供您的物流单号，我们会帮您查询物流状态。',
    '账号': '账号问题请详细描述您遇到的问题，我们会尽快为您解决。',
    '密码': '如果您忘记了密码，可以点击登录页面的"忘记密码"进行重置。',
    '优惠券': '优惠券使用问题请提供优惠券编号，我们会帮您核实。',
    '宠物': '关于宠物健康问题，建议您咨询我们的在线兽医。',
    '医生': '您可以在APP首页的"在线问诊"中预约医生进行咨询。',
    '预约': '预约问题请提供您想预约的服务和时间，我们会尽快为您安排。',
    '投诉': '非常抱歉给您带来不便，我们会认真处理您的投诉，并尽快给您回复。'
  };
  
  for (const key in keywords) {
    if (message.includes(key)) {
      return keywords[key];
    }
  }
  
  return '感谢您的咨询，请问还有其他问题吗？如需更多帮助，您可以查看帮助中心或提交投诉建议。';
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 获取用户信息
  const userInfoStorage = uni.getStorageSync('userInfo');
  if (userInfoStorage) {
    userInfo.value = userInfoStorage;
  }
  
  // 获取消息列表
  getMessageList();
});
</script>

<style lang="scss">
.customer-service-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.nav-bar {
  position: relative;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.nav-back {
  position: absolute;
  left: 30rpx;
  font-size: 36rpx;
  color: #333;
}

/* 聊天区域 */
.chat-area {
  flex: 1;
  height: calc(100vh - 180rpx);
  padding: 20rpx;
}

.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.message-item {
  display: flex;
  align-items: flex-start;
}

.message-self {
  flex-direction: row-reverse;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.message-content {
  max-width: 70%;
  margin: 0 20rpx;
}

.message-text {
  display: block;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  word-break: break-all;
}

.message-self .message-text {
  background-color: #6F87FF;
  color: #fff;
}

.message-time {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
  text-align: center;
}

/* 输入区域 */
.input-area {
  height: 90rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.message-input {
  flex: 1;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
}

.send-btn {
  width: 120rpx;
  height: 70rpx;
  background-color: #6F87FF;
  color: #fff;
  font-size: 28rpx;
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
}
</style> 