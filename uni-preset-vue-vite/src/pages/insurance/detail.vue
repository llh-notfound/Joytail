<template>
  <view class="insurance-detail-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">保险详情</text>
    </view>
    
    <!-- 保险产品基本信息 -->
    <view class="insurance-basic-info">
      <view class="insurance-header">
        <image class="insurance-image" :src="insuranceDetail.image" mode="aspectFill"></image>
        <view class="insurance-title-info">
          <view class="insurance-name">{{ insuranceDetail.name }}</view>
          <view class="insurance-company">{{ insuranceDetail.company }}</view>
        </view>
      </view>
      
      <view class="insurance-summary">
        <view class="summary-item">
          <text class="summary-label">适用对象</text>
          <text class="summary-value">{{ insuranceDetail.petTypes?.join('、') }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">保障范围</text>
          <text class="summary-value">{{ insuranceDetail.coverage }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">保障期限</text>
          <text class="summary-value">{{ insuranceDetail.period }}</text>
        </view>
        <view class="price-info">
          <text class="current-price">¥{{ insuranceDetail.price }}</text>
          <text class="original-price">¥{{ insuranceDetail.originalPrice }}</text>
          <text class="price-unit">/{{ insuranceDetail.period }}</text>
        </view>
      </view>
    </view>
    
    <!-- 保险条款说明 -->
    <collapsible-panel title="保险条款说明">
      <view v-for="(section, index) in insuranceDetail.terms" :key="index" class="terms-section">
        <view class="terms-title">{{ section.title }}</view>
        <view class="terms-content">{{ section.content }}</view>
      </view>
    </collapsible-panel>
    
    <!-- 理赔流程 -->
    <collapsible-panel title="理赔流程">
      <claim-process-steps :steps="insuranceDetail.claimProcess"/>
    </collapsible-panel>
    
    <!-- 常见问题 -->
    <collapsible-panel title="常见问题">
      <view v-for="(faq, index) in insuranceDetail.faqs" :key="index" class="faq-item">
        <view class="faq-question">{{ faq.question }}</view>
        <view class="faq-answer">{{ faq.answer }}</view>
      </view>
    </collapsible-panel>
    
    <!-- 底部操作区 -->
    <view class="bottom-action-bar">
      <view class="visit-website-btn" @click="visitWebsite">
        <text>访问官网</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CollapsiblePanel from './components/CollapsiblePanel.vue';
import ClaimProcessSteps from './components/ClaimProcessSteps.vue';

// 从页面参数中获取保险ID
const insuranceId = ref(null);

// 保险详情数据
const insuranceDetail = ref({});

// 模拟保险数据
const mockInsuranceData = [
  {
    id: 1,
    name: '宠物综合医疗保险',
    coverage: '意外伤害、常见疾病、手术费用',
    price: 899,
    originalPrice: 1099,
    petTypes: ['犬类', '猫类'],
    type: '医疗险',
    image: '/static/images/pet.png',
    period: '1年',
    company: '安心保险',
    websiteUrl: 'https://www.example.com/insurance/pet-medical',
    terms: [
      {
        title: '投保须知',
        content: '本产品适用于3个月龄至8周岁的家养宠物犬和家养宠物猫，投保时须提供宠物有效健康证明及免疫证明。每只宠物限投保一份，多投无效。'
      },
      {
        title: '保障内容',
        content: '本保险提供意外伤害、常见疾病、手术费用等保障。意外伤害包括但不限于车祸、跌落、误食异物等；常见疾病包括但不限于肠胃炎、泌尿系统感染、皮肤病等；手术费用包括手术费、麻醉费、住院费等。'
      },
      {
        title: '责任免除',
        content: '因投保前已存在的疾病、先天性疾病、遗传性疾病所产生的费用；疫苗接种、绝育、怀孕、分娩等费用；美容、洗牙等非治疗性费用；未经兽医诊断擅自用药产生的费用。'
      },
      {
        title: '等待期',
        content: '本保险产品疾病保障等待期为30天，意外伤害保障无等待期。等待期内发生的疾病导致的医疗费用，保险公司不承担赔偿责任。'
      }
    ],
    claimProcess: [
      {
        title: '就医治疗',
        description: '宠物生病或意外受伤后，及时带至正规宠物医院进行治疗',
        icon: 'icon-hospital'
      },
      {
        title: '收集凭证',
        description: '保留医院诊断证明、处方、医疗费用发票等原件',
        icon: 'icon-document'
      },
      {
        title: '提交申请',
        description: '登录官网填写理赔申请，上传相关凭证',
        icon: 'icon-upload'
      },
      {
        title: '审核处理',
        description: '保险公司在5个工作日内完成审核',
        icon: 'icon-check'
      },
      {
        title: '赔款到账',
        description: '审核通过后，赔款将在3个工作日内到账',
        icon: 'icon-money'
      }
    ],
    faqs: [
      {
        question: '宠物需要做体检才能投保吗？',
        answer: '是的，首次投保需要提供近3个月内的宠物体检报告，以确认宠物健康状况。'
      },
      {
        question: '哪些情况不能理赔？',
        answer: '投保前已有的疾病、先天性疾病、美容洗牙、疫苗接种等非疾病治疗费用不在理赔范围内。详情请参考保险条款。'
      },
      {
        question: '理赔有金额限制吗？',
        answer: '本保险产品的最高理赔金额为10000元/年，单次理赔最高3000元，每年最多可申请4次理赔。'
      }
    ]
  },
  {
    id: 2,
    name: '宠物意外保险',
    coverage: '意外伤害、第三方责任',
    price: 399,
    originalPrice: 499,
    petTypes: ['犬类', '猫类', '小型宠物'],
    type: '意外险',
    image: '/static/images/pet.png',
    period: '1年',
    company: '守护保险',
    websiteUrl: 'https://www.example.com/insurance/pet-accident',
    terms: [
      {
        title: '投保须知',
        content: '本产品适用于3个月龄至10周岁的家养宠物，投保时需提供宠物照片和芯片登记证明(如有)。'
      },
      {
        title: '保障内容',
        content: '本保险提供宠物意外伤害和第三方责任保障。意外伤害包括交通事故、跌落、误食有毒物质等导致的医疗费用；第三方责任包括宠物造成他人人身伤害或财产损失的赔偿责任。'
      },
      {
        title: '责任免除',
        content: '故意伤害宠物产生的费用；宠物参与斗狗等非正常活动导致的伤害；宠物未拴绳或未由成年人看管导致的第三方责任事故。'
      }
    ],
    claimProcess: [
      {
        title: '事故报案',
        description: '意外发生后24小时内致电保险公司报案',
        icon: 'icon-phone'
      },
      {
        title: '就医治疗',
        description: '将宠物送往就近的正规宠物医院进行治疗',
        icon: 'icon-hospital'
      },
      {
        title: '收集证明',
        description: '保留医疗证明、医疗费用发票、事故证明等材料',
        icon: 'icon-document'
      },
      {
        title: '提交材料',
        description: '将理赔材料提交至保险公司',
        icon: 'icon-submit'
      },
      {
        title: '赔付到账',
        description: '审核通过后7个工作日内赔款到账',
        icon: 'icon-money'
      }
    ],
    faqs: [
      {
        question: '第三方责任有赔付限额吗？',
        answer: '本保险产品的第三方责任最高赔付限额为5万元/次，每年累计最高10万元。'
      },
      {
        question: '宠物打架导致的伤害赔付吗？',
        answer: '一般情况下，因宠物之间打架导致的伤害属于责任免除范围，不予赔付。'
      },
      {
        question: '如何认定是意外还是疾病？',
        answer: '需由专业兽医出具诊断证明，确认是因外部突发因素导致的伤害才属于意外范畴。'
      }
    ]
  }
];

// 初始化页面
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options;
  
  // 获取保险ID
  if (options && options.id) {
    insuranceId.value = parseInt(options.id);
    // 根据ID查找保险详情
    const detail = mockInsuranceData.find(item => item.id === insuranceId.value);
    if (detail) {
      insuranceDetail.value = detail;
    } else {
      // 如果找不到对应ID的保险，使用第一个作为默认值
      insuranceDetail.value = mockInsuranceData[0];
      uni.showToast({
        title: '未找到相关保险产品',
        icon: 'none'
      });
    }
  } else {
    // 如果没有传入ID，使用第一个作为默认值
    insuranceDetail.value = mockInsuranceData[0];
  }
});

// 返回上一页
const handleBack = () => {
  uni.navigateBack();
};

// 访问官网
const visitWebsite = () => {
  if (insuranceDetail.value.websiteUrl) {
    // 使用web-view组件或系统浏览器打开链接
    uni.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(insuranceDetail.value.websiteUrl)}`
    });
  } else {
    uni.showToast({
      title: '暂无官网链接',
      icon: 'none'
    });
  }
};
</script>

<style lang="scss">
.insurance-detail-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx; // 为底部操作栏预留空间
}

/* 顶部导航栏 */
.nav-bar {
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  color: #fff;
  
  .back-btn {
    padding: 10rpx;
    margin-right: 20rpx;
    
    .iconfont {
      font-size: 36rpx;
    }
  }
  
  .page-title {
    font-size: 32rpx;
    font-weight: 500;
  }
}

/* 保险基本信息 */
.insurance-basic-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.insurance-header {
  display: flex;
  margin-bottom: 30rpx;
  
  .insurance-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
  }
}

.insurance-title-info {
  flex: 1;
  
  .insurance-name {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 10rpx;
    line-height: 1.4;
  }
  
  .insurance-company {
    font-size: 26rpx;
    color: #666;
  }
}

.insurance-summary {
  .summary-item {
    display: flex;
    margin-bottom: 16rpx;
    
    .summary-label {
      font-size: 26rpx;
      color: #999;
      min-width: 140rpx;
    }
    
    .summary-value {
      flex: 1;
      font-size: 26rpx;
      color: #333;
    }
  }
}

.price-info {
  display: flex;
  align-items: baseline;
  margin-top: 30rpx;
  
  .current-price {
    font-size: 40rpx;
    font-weight: 600;
    color: #FF6B6B;
  }
  
  .original-price {
    font-size: 26rpx;
    color: #999;
    margin-left: 12rpx;
    text-decoration: line-through;
  }
  
  .price-unit {
    font-size: 26rpx;
    color: #999;
    margin-left: 6rpx;
  }
}

/* 保险条款样式 */
.terms-section {
  margin-bottom: 30rpx;
  
  .terms-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .terms-content {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }
}

/* FAQ样式 */
.faq-item {
  margin-bottom: 30rpx;
  
  .faq-question {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .faq-answer {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }
}

/* 底部操作栏 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 100rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  z-index: 100;
}

.visit-website-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}
</style> 