<template>  <view class="insurance-detail-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="page-title">保险详情</text>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-text">正在加载保险详情...</view>
    </view>
    
    <!-- 保险详情内容 -->
    <view v-else>
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
        <image-display 
          :image="insuranceDetail.termsImage" 
          :height="800"
          fallbackImage="/static/images/terms-placeholder.png"
        />
      </collapsible-panel>
      
      <!-- 理赔流程 -->
      <collapsible-panel title="理赔流程">
        <image-display 
          :image="insuranceDetail.claimProcessImage" 
          :height="600"
          fallbackImage="/static/images/claim-process-placeholder.png"
        />
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
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CollapsiblePanel from './components/CollapsiblePanel.vue';
import ImageDisplay from './components/ImageDisplay.vue';
import api from '../../utils/api';
import { BASE_URL } from '../../utils/config';
import { formatImageUrl, processObjectImages } from '../../utils/imageHelper';

// 从页面参数中获取保险ID
const insuranceId = ref(null);

// 保险详情数据
const insuranceDetail = ref({});

// 加载状态
const isLoading = ref(true);

// 模拟保险数据 (作为 fallback)
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
    websiteUrl: 'https://www.example.com/insurance/pet-medical',    termsImage: '/static/images/insurance/terms-medical.png',
    claimProcessImage: '/static/images/insurance/claim-medical.png',
    // 保留旧的数据结构以便向下兼容
    terms: [],
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
    websiteUrl: 'https://www.example.com/insurance/pet-accident',    termsImage: '/static/images/insurance/terms-accident.png',
    claimProcessImage: '/static/images/insurance/claim-accident.png',
    // 保留旧的数据结构以便向下兼容
    terms: [],
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

// 获取保险产品详情
const fetchInsuranceDetail = async (productId) => {
  try {
    console.log('📍 [保险详情] 开始获取产品详情，ID:', productId);
    console.log('🔗 [保险详情] 请求URL:', `${api.baseURL || ''}`, '/insurance/products/', productId);
    isLoading.value = true;
    
    const response = await api.insurance.getInsuranceProductDetail(productId);
    console.log('📥 [保险详情] API响应:', response);
    
    if (response.code === 200 && response.data) {      // 映射API响应数据到前端格式
      // 注意：图片URL已在API层处理
      const apiData = response.data;
      console.log('🖼️ [保险详情] API返回的图片URL:', apiData.image);

      insuranceDetail.value = {
        id: apiData.id,
        name: apiData.name,
        company: apiData.company,
        coverage: apiData.coverage,
        price: apiData.price,
        originalPrice: apiData.originalPrice,
        petTypes: apiData.petTypes || [],
        type: apiData.type,
        image: apiData.image,
        period: apiData.period || '1年',        websiteUrl: apiData.websiteUrl || '',
        // 保险条款图片
        termsImage: apiData.termsImage || '/static/images/insurance/terms-placeholder.png',
        // 理赔流程图片
        claimProcessImage: apiData.claimProcessImage || '/static/images/insurance/claim-placeholder.png',
        // 保留旧的数据结构以便向下兼容
        terms: apiData.terms || [],
        claimProcess: apiData.claimProcess || [],
        // 常见问题
        faqs: apiData.faqs || [
          {
            question: '投保时需要注意什么？',
            answer: '请仔细阅读保险条款，确保宠物符合投保要求。'
          }
        ]
      };
      console.log('✅ [保险详情] 数据映射完成:', insuranceDetail.value);
    } else {
      console.warn('⚠️ [保险详情] API返回格式异常:', response);
      // 使用 mock 数据作为 fallback
      fallbackToMockData(productId);
    }  } catch (error) {
    console.error('❌ [保险详情] API请求失败:', error);
    
    // 显示更具体的错误信息
    let errorMsg = '网络请求失败';
    if (error.statusCode) {
      errorMsg = `服务器返回错误(${error.statusCode})`;
    } else if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        errorMsg = '请求超时';
      } else if (error.errMsg.includes('abort')) {
        errorMsg = '请求被中断';
      } else if (error.errMsg.includes('not found')) {
        errorMsg = '未找到资源(404)';
      }
    }
    
    // 提示用户
    uni.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 3000
    });
    
    // 使用 mock 数据作为 fallback
    fallbackToMockData(productId);
  } finally {
    isLoading.value = false;
  }
};

// 回退到 Mock 数据
const fallbackToMockData = (productId) => {
  console.log('🔄 [保险详情] 使用 Mock 数据作为备选方案');
  const detail = mockInsuranceData.find(item => item.id === parseInt(productId));
  if (detail) {
    insuranceDetail.value = detail;
    uni.showToast({
      title: '正在使用演示数据',
      icon: 'none',
      duration: 2000
    });
  } else {
    insuranceDetail.value = mockInsuranceData[0] || {};
    uni.showToast({
      title: '未找到相关保险产品',
      icon: 'none'
    });
  }
};

// 初始化页面
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options;
  
  // 获取保险ID
  if (options && options.id) {
    insuranceId.value = options.id;
    console.log('📍 [保险详情] 获取到产品ID:', insuranceId.value);
    
    // 从 API 获取详情
    fetchInsuranceDetail(insuranceId.value);
  } else {
    console.warn('⚠️ [保险详情] 未获取到产品ID，使用默认数据');
    // 如果没有传入ID，使用第一个 mock 数据作为默认值
    fallbackToMockData('1');
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
  background: linear-gradient(135deg, #6F87FF 0%, #5A6BF5 100%);  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}
</style>