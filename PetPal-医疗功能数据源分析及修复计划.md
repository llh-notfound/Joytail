# PetPal 医疗功能数据源分析及修复计划

## 📊 分析总结

**结论**: 宠物医疗相关功能目前使用的是**前端硬编码的静态数据**，而非后端API数据。

## 🔍 详细分析结果

### 当前状态对比表

| 功能模块 | 页面路径 | 数据来源 | API使用 | 连接状态 |
|---------|---------|---------|---------|----------|
| **保险功能** | `pages/insurance/` | ✅ 后端API | ✅ 完整 | ✅ 已连接 |
| **商品功能** | `pages/goods/` | ✅ 后端API | ✅ 完整 | ✅ 已连接 |
| **医疗功能** | `pages/medical/` | ❌ 静态数据 | ❌ 未使用 | ❌ 未连接 |
| **咨询功能** | `pages/consult/` | ❌ 静态数据 | ❌ 未使用 | ❌ 未连接 |

### 具体问题详情

#### 1. 医疗机构/医生列表 (`pages/medical/index.vue`)
- **问题**: 硬编码4个医生数据
- **当前代码**:
```javascript
const doctors = ref([
  {
    id: 1,
    name: '张医生',
    hospital: '北京宠物医院',
    // ... 硬编码数据
  }
]);
```
- **应该使用**: `api.medical.getHospitals()` 或新增 `api.medical.getDoctors()`

#### 2. 医生详情页 (`pages/medical/detail.vue`)
- **问题**: 所有医生显示相同信息
- **当前代码**:
```javascript
const doctorInfo = ref({
  id: 1,
  name: '张医生',
  // ... 静态数据
});
```
- **应该使用**: `api.consult.getDoctorDetail(doctorId)`

#### 3. 在线咨询页 (`pages/consult/index.vue`)
- **问题**: 模拟对话，无实际功能
- **当前代码**:
```javascript
const messages = ref([
  { content: '您好，我是张医生...', isSelf: false }
]);
```
- **应该使用**: `api.consult.createConsultSession()`, `api.consult.sendMessage()`

#### 4. 医疗记录页 (`pages/order/medical-list.vue`)
- **问题**: 使用mockUser数据
- **当前代码**:
```javascript
import mockUser from '../../utils/mockUser.js';
const mockRecords = mockUser.mockOrderList.filter(order => order.type === 'medical');
```
- **应该使用**: `api.medical.getMedicalRecords()`, `api.medical.getMyAppointments()`

## 🛠️ 修复计划

### Phase 1: 医疗机构列表修复 (高优先级)

**目标**: 将医生列表从静态数据改为API数据

**修复步骤**:
1. 在 `pages/medical/index.vue` 中导入医疗API
2. 替换硬编码数据为API调用
3. 添加加载状态和错误处理
4. 实现搜索和筛选功能

**预期代码**:
```javascript
import { ref, onMounted } from 'vue';
import api from '../../utils/api/index.js';

const doctors = ref([]);
const loading = ref(false);
const error = ref('');

const getDoctorList = async () => {
  try {
    loading.value = true;
    const response = await api.medical.getDoctors({
      page: 1,
      pageSize: 20
    });
    doctors.value = response.data.list || [];
  } catch (err) {
    error.value = '获取医生列表失败';
    console.error('获取医生列表失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getDoctorList();
});
```

### Phase 2: 医生详情页修复 (高优先级)

**目标**: 根据医生ID动态获取医生信息

**修复步骤**:
1. 在页面加载时获取医生ID
2. 调用API获取医生详情
3. 动态渲染医生信息
4. 添加加载和错误状态

**预期代码**:
```javascript
import { ref, onMounted } from 'vue';
import api from '../../utils/api/index.js';

const doctorInfo = ref(null);
const loading = ref(false);

onMounted(async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const doctorId = currentPage.$page.options.id;
  
  if (doctorId) {
    try {
      loading.value = true;
      const response = await api.consult.getDoctorDetail(doctorId);
      doctorInfo.value = response.data;
    } catch (error) {
      console.error('获取医生详情失败:', error);
    } finally {
      loading.value = false;
    }
  }
});
```

### Phase 3: 医疗记录页修复 (中优先级)

**目标**: 使用真实的医疗记录API

**修复步骤**:
1. 移除mockUser依赖
2. 调用医疗记录API
3. 实现分页加载
4. 添加状态筛选

**预期代码**:
```javascript
import { ref, onMounted } from 'vue';
import api from '../../utils/api/index.js';

const recordList = ref([]);
const loading = ref(false);

const getMedicalRecords = async () => {
  try {
    loading.value = true;
    const response = await api.medical.getMedicalRecords({
      page: 1,
      pageSize: 10
    });
    recordList.value = response.data.list || [];
  } catch (error) {
    console.error('获取医疗记录失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getMedicalRecords();
});
```

### Phase 4: 在线咨询功能完善 (低优先级)

**目标**: 实现真实的在线咨询功能

**修复步骤**:
1. 实现咨询会话创建
2. 实现实时消息发送
3. 实现消息历史加载
4. 添加文件上传功能

## 🧪 测试验证

### 1. API连接测试
创建测试脚本验证医疗API连接状态：

```javascript
// 医疗API测试
const testMedicalAPIs = async () => {
  console.log('=== 测试医疗API ===');
  
  try {
    // 测试医疗机构列表
    const hospitals = await api.medical.getHospitals();
    console.log('✅ 医疗机构列表:', hospitals);
    
    // 测试咨询服务
    const services = await api.consult.getConsultServices();
    console.log('✅ 咨询服务:', services);
    
  } catch (error) {
    console.error('❌ 医疗API测试失败:', error);
  }
};
```

### 2. 功能验证清单
- [ ] 医生列表能正确加载
- [ ] 医生详情显示正确信息
- [ ] 搜索功能正常工作
- [ ] 预约功能能提交成功
- [ ] 医疗记录能正确显示
- [ ] 咨询功能能正常使用

## 📞 后端对齐要求

### 需要确认的API端点

根据 `petpal-backend-api.md` 文档，以下API端点需要后端实现：

#### 医疗相关
- `GET /api/medical/hospitals` - 获取医疗机构列表
- `GET /api/medical/hospitals/{hospitalId}` - 获取医疗机构详情
- `POST /api/medical/appointments` - 预约医疗服务
- `GET /api/medical/appointments/my` - 获取我的预约记录
- `GET /api/medical/records` - 获取医疗记录
- `GET /api/medical/vaccinations` - 获取疫苗记录

#### 咨询相关
- `GET /api/consult/services` - 获取咨询服务列表
- `GET /api/consult/doctors/{doctorId}` - 获取医生详情
- `POST /api/consult/sessions` - 发起咨询
- `GET /api/consult/sessions/my` - 获取咨询记录
- `POST /api/consult/sessions/{sessionId}/messages` - 发送消息

## 📋 修复优先级

### 🔴 高优先级（立即修复）
1. **医生列表API连接** - 用户访问频率高
2. **医生详情API连接** - 核心功能页面

### 🟡 中优先级（本周修复）
3. **医疗记录API连接** - 用户查看历史记录
4. **预约功能完善** - 核心业务流程

### 🟢 低优先级（后续优化）
5. **在线咨询实时功能** - 需要websocket支持
6. **疫苗记录管理** - 辅助功能

## 📈 预期收益

修复完成后：
- ✅ 医疗功能将使用真实后端数据
- ✅ 用户体验与保险功能保持一致
- ✅ 数据实时性得到保障
- ✅ 为后续功能扩展奠定基础

## 🔧 快速修复脚本

可以运行以下命令快速检测当前状态：

```bash
# 检查医疗页面API使用情况
grep -r "import.*api" src/pages/medical/ --include="*.vue"
grep -r "api\." src/pages/medical/ --include="*.vue"

# 检查硬编码数据
grep -r "const.*=.*ref(\[" src/pages/medical/ --include="*.vue"
```

---

**总结**: 医疗功能目前完全依赖静态数据，需要系统性地改造为使用后端API，建议按优先级逐步修复。
