<template>
  <view class="help-center-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">帮助中心</text>
      <text class="nav-back iconfont icon-back" @tap="goBack"></text>
    </view>

    <!-- 搜索框 -->
    <view class="search-box">
      <view class="search-input-wrap">
        <text class="iconfont icon-search"></text>
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索常见问题" 
          @confirm="searchQuestions"
        />
      </view>
    </view>

    <!-- 问题分类列表 -->
    <scroll-view 
      scroll-y 
      class="category-list"
      :scroll-top="scrollTop"
      @scrolltolower="loadMoreCategories"
    >
      <!-- 加载更多 -->
      <view v-if="hasMore" class="loading-more">
        <text>加载中...</text>
      </view>

      <!-- 分类列表 -->
      <view class="category-items">
        <view 
          v-for="(category, index) in filteredCategories" 
          :key="index"
          class="category-item"
          @tap="toggleCategory(category)"
        >
          <view class="category-header">
            <view class="category-title-wrap">
              <text class="category-icon" :class="category.icon"></text>
              <text class="category-title">{{ category.title }}</text>
            </view>
            <text class="category-arrow" :class="{ 'arrow-up': category.isExpanded }"></text>
          </view>
          
          <!-- 问题列表 -->
          <view class="question-list" v-if="category.isExpanded">
            <view 
              v-for="(question, qIndex) in category.questions" 
              :key="qIndex"
              class="question-item"
              @tap="showAnswer(question)"
            >
              <text class="question-text">{{ question.title }}</text>
              <text class="question-arrow"></text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 答案弹窗 -->
    <uni-popup ref="answerPopup" type="bottom">
      <view class="answer-popup">
        <view class="popup-header">
          <text class="popup-title">{{ currentQuestion.title }}</text>
          <text class="popup-close iconfont icon-close" @tap="closeAnswer"></text>
        </view>
        <scroll-view scroll-y class="popup-content">
          <rich-text :nodes="currentQuestion.content"></rich-text>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 搜索关键词
const searchKeyword = ref('');
const scrollTop = ref(0);
const hasMore = ref(false);
const answerPopup = ref(null);
const currentQuestion = ref({});

// 问题分类数据
const categories = ref([
  {
    id: 1,
    title: '账号相关',
    icon: 'icon-account',
    isExpanded: false,
    questions: [
      {
        id: 101,
        title: '如何注册账号？',
        content: '注册账号步骤如下：<br>1. 点击APP首页右下角"我的"<br>2. 点击"登录/注册"按钮<br>3. 选择手机号注册<br>4. 输入手机号并获取验证码<br>5. 设置登录密码<br>6. 完成注册'
      },
      {
        id: 102,
        title: '忘记密码怎么办？',
        content: '如果您忘记了密码，可以通过以下方式重置：<br>1. 在登录页面点击"忘记密码"<br>2. 输入注册手机号<br>3. 获取验证码<br>4. 设置新密码<br>5. 使用新密码登录'
      },
      {
        id: 103,
        title: '如何修改个人信息？',
        content: '修改个人信息步骤：<br>1. 进入"我的"页面<br>2. 点击头像或昵称<br>3. 在个人信息页面修改相应信息<br>4. 点击保存即可'
      }
    ]
  },
  {
    id: 2,
    title: '订单相关',
    icon: 'icon-order',
    isExpanded: false,
    questions: [
      {
        id: 201,
        title: '如何查看订单状态？',
        content: '查看订单状态方法：<br>1. 进入"我的-我的订单"<br>2. 选择对应订单<br>3. 在订单详情页可查看当前状态<br>4. 点击物流信息可查看配送进度'
      },
      {
        id: 202,
        title: '如何申请退款？',
        content: '申请退款步骤：<br>1. 进入"我的-我的订单"<br>2. 选择需要退款的订单<br>3. 点击"申请退款"<br>4. 选择退款原因<br>5. 上传相关凭证<br>6. 提交申请'
      },
      {
        id: 203,
        title: '退款多久到账？',
        content: '退款到账时间说明：<br>1. 支付宝/微信支付：1-3个工作日<br>2. 银行卡：3-7个工作日<br>3. 余额：实时到账<br>注：具体到账时间以银行处理时间为准'
      }
    ]
  },
  {
    id: 3,
    title: '宠物服务',
    icon: 'icon-pet',
    isExpanded: false,
    questions: [
      {
        id: 301,
        title: '如何预约宠物美容？',
        content: '预约宠物美容步骤：<br>1. 首页点击"宠物服务"<br>2. 选择"美容服务"<br>3. 选择服务项目和美容师<br>4. 选择预约时间<br>5. 填写宠物信息<br>6. 提交预约'
      },
      {
        id: 302,
        title: '如何预约宠物医疗？',
        content: '预约宠物医疗步骤：<br>1. 首页点击"宠物服务"<br>2. 选择"医疗服务"<br>3. 选择医院和医生<br>4. 选择预约时间<br>5. 填写宠物症状<br>6. 提交预约'
      },
      {
        id: 303,
        title: '宠物保险如何理赔？',
        content: '宠物保险理赔流程：<br>1. 准备理赔材料（医疗单据、诊断证明等）<br>2. 登录APP，进入"我的-保险服务-理赔申请"<br>3. 上传理赔材料<br>4. 等待审核，一般1-3个工作日<br>5. 审核通过后，理赔金额将直接打入您的账户'
      }
    ]
  },
  {
    id: 4,
    title: '积分优惠',
    icon: 'icon-points',
    isExpanded: false,
    questions: [
      {
        id: 401,
        title: '如何获取积分？',
        content: '获取积分方式：<br>1. 每日签到：+5积分<br>2. 消费：每消费1元获得1积分<br>3. 评价：每次评价获得10积分<br>4. 分享：每次分享获得5积分<br>5. 邀请好友：每位好友注册并完成首单获得50积分'
      },
      {
        id: 402,
        title: '积分如何使用？',
        content: '积分使用方式：<br>1. 进入"我的-积分商城"<br>2. 选择想要兑换的商品<br>3. 确认积分是否足够<br>4. 点击"立即兑换"<br>5. 填写收货地址<br>6. 提交订单'
      },
      {
        id: 403,
        title: '积分会过期吗？',
        content: '积分有效期说明：<br>1. 积分有效期为一年<br>2. 每年12月31日将对一年前的积分进行清零<br>3. 建议及时使用积分，避免过期'
      }
    ]
  },
  {
    id: 5,
    title: '其他问题',
    icon: 'icon-other',
    isExpanded: false,
    questions: [
      {
        id: 501,
        title: '如何联系客服？',
        content: '联系客服方式：<br>1. 在线客服：进入"我的-服务支持-在线客服"<br>2. 电话客服：400-123-4567（周一至周日 9:00-22:00）<br>3. 邮件客服：support@petpal.com'
      },
      {
        id: 502,
        title: '如何投诉建议？',
        content: '提交投诉建议步骤：<br>1. 进入"我的-服务支持-投诉建议"<br>2. 选择问题类型<br>3. 详细描述您的问题或建议<br>4. 上传相关截图（如有）<br>5. 提交反馈'
      },
      {
        id: 503,
        title: 'APP常见问题',
        content: '常见问题解答：<br>1. 无法登录：检查网络连接，确认账号密码正确<br>2. 页面加载慢：清理缓存，检查网络状态<br>3. 支付失败：确认支付方式可用，余额充足<br>4. 消息通知：进入"我的-设置-消息通知"开启相关通知'
      }
    ]
  }
]);

// 根据搜索关键词过滤分类
const filteredCategories = computed(() => {
  if (!searchKeyword.value) {
    return categories.value;
  }
  
  const keyword = searchKeyword.value.toLowerCase();
  return categories.value.map(category => {
    const filteredQuestions = category.questions.filter(question => 
      question.title.toLowerCase().includes(keyword) || 
      question.content.toLowerCase().includes(keyword)
    );
    
    return {
      ...category,
      questions: filteredQuestions
    };
  }).filter(category => category.questions.length > 0);
});

// 切换分类展开状态
const toggleCategory = (category) => {
  category.isExpanded = !category.isExpanded;
};

// 显示问题答案
const showAnswer = (question) => {
  currentQuestion.value = question;
  answerPopup.value.open();
};

// 关闭答案弹窗
const closeAnswer = () => {
  answerPopup.value.close();
};

// 搜索问题
const searchQuestions = () => {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    });
    return;
  }
  
  // 展开包含搜索结果的分类
  categories.value.forEach(category => {
    const hasMatch = category.questions.some(question => 
      question.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) || 
      question.content.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
    
    if (hasMatch) {
      category.isExpanded = true;
    }
  });
};

// 加载更多分类
const loadMoreCategories = () => {
  if (hasMore.value) {
    // 模拟加载更多
    uni.showToast({
      title: '没有更多内容了',
      icon: 'none'
    });
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 检查登录状态
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }, 1500);
  }
});
</script>

<style lang="scss">
.help-center-container {
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

/* 搜索框 */
.search-box {
  padding: 20rpx 30rpx;
  background-color: #fff;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 20rpx;
  height: 70rpx;
}

.icon-search {
  font-size: 32rpx;
  color: #999;
  margin-right: 10rpx;
}

.search-input {
  flex: 1;
  height: 70rpx;
  font-size: 28rpx;
  color: #333;
}

/* 分类列表 */
.category-list {
  flex: 1;
  height: calc(100vh - 230rpx);
}

.loading-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}

.category-items {
  padding: 0 30rpx 30rpx;
}

.category-item {
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
}

.category-title-wrap {
  display: flex;
  align-items: center;
}

.category-icon {
  width: 60rpx;
  height: 60rpx;
  background-color: rgba(111, 135, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 32rpx;
  color: #6F87FF;
}

.category-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.category-arrow {
  width: 30rpx;
  height: 30rpx;
  border-right: 4rpx solid #ccc;
  border-bottom: 4rpx solid #ccc;
  transform: rotate(45deg);
  transition: transform 0.3s;
}

.arrow-up {
  transform: rotate(-135deg);
}

/* 问题列表 */
.question-list {
  border-top: 1rpx solid #f5f5f5;
}

.question-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.question-item:last-child {
  border-bottom: none;
}

.question-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.question-arrow {
  width: 20rpx;
  height: 20rpx;
  border-right: 3rpx solid #ccc;
  border-bottom: 3rpx solid #ccc;
  transform: rotate(-45deg);
  margin-left: 20rpx;
}

/* 答案弹窗 */
.answer-popup {
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
  overflow: hidden;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.popup-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.popup-close {
  font-size: 36rpx;
  color: #999;
}

.popup-content {
  max-height: 60vh;
  padding: 30rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}
</style> 