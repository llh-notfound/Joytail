# PetPal 医院广告位API对接指导文档

## 📋 功能概述

医院广告位功能已从原来的"在线问诊"简化为"医院广告位展示"，专注于为用户推荐优质的宠物医院信息。

### 🎯 核心需求
- **医院列表API**: 动态获取医院广告位数据
- **医院详情API**: 获取单个医院的详细信息
- **点击统计API**: 记录广告位点击量（可选）

## 📊 当前状态分析

### 前端现状
**文件**: `/src/pages/medical/index.vue`
- ✅ **功能定位**: 医院广告位展示页面
- ❌ **数据来源**: 硬编码的6家香港医院静态数据
- ✅ **UI功能**: 搜索、筛选、点击查看详情

### 静态数据结构
```javascript
// 当前使用的静态数据格式
const hospitals = [
  {
    id: 1,
    name: '香港宠物医院',
    address: '香港中环干诺道中200号',
    rating: 4.9,
    reviewCount: 520,
    services: '内科、外科、急诊、体检',
    phone: '+852 2234 5678',
    image: '/static/images/hospital1.png',
    website: 'https://www.hkpethospital.com'
  }
  // ... 更多医院数据
];
```

## 🔧 API接口设计

### 1. 获取医院广告位列表

- **接口URL**: `/api/medical/hospitals`
- **请求方式**: GET
- **认证要求**: 无需认证（公开广告位）
- **请求参数**:

```json
{
  "page": 1,                    // 页码，默认1
  "pageSize": 10,               // 每页数量，默认10
  "keyword": "string",          // 搜索关键词（医院名称或地址），可选
  "city": "香港",               // 城市筛选，可选
  "sortBy": "rating"            // 排序方式：rating/name，默认rating
}
```

- **成功响应**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "string",
        "name": "香港宠物医院",
        "address": "香港中环干诺道中200号",
        "rating": 4.9,
        "reviewCount": 520,
        "services": "内科、外科、急诊、体检",
        "phone": "+852 2234 5678",
        "image": "string",        // 医院图片URL
        "website": "string",      // 医院官网地址
        "isRecommended": true,    // 是否推荐医院
        "adPosition": 1,          // 广告位位置
        "clickCount": 1250        // 点击次数（可选）
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. 获取医院详情

- **接口URL**: `/api/medical/hospitals/{hospitalId}`
- **请求方式**: GET
- **认证要求**: 无需认证
- **路径参数**:
  - `hospitalId`: 医院ID

- **成功响应**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "string",
    "name": "香港宠物医院",
    "address": "香港中环干诺道中200号",
    "phone": "+852 2234 5678",
    "rating": 4.9,
    "reviewCount": 520,
    "services": "内科、外科、急诊、体检",
    "website": "https://www.hkpethospital.com",
    "images": [                 // 医院图片数组
      "string"
    ],
    "description": "专业的宠物医疗服务机构...",
    "workingHours": {
      "monday": "09:00-18:00",
      "tuesday": "09:00-18:00",
      "wednesday": "09:00-18:00",
      "thursday": "09:00-18:00",
      "friday": "09:00-18:00",
      "saturday": "09:00-17:00",
      "sunday": "10:00-16:00"
    },
    "location": {
      "latitude": 22.2810,
      "longitude": 114.1590
    },
    "facilities": [             // 设施设备
      "X光机", "B超设备", "手术室"
    ],
    "specialties": [            // 专业领域
      "小动物内科", "外科手术", "影像诊断"
    ]
  }
}
```

### 3. 记录广告位点击（可选）

- **接口URL**: `/api/medical/hospitals/{hospitalId}/click`
- **请求方式**: POST
- **认证要求**: 无需认证
- **路径参数**:
  - `hospitalId`: 医院ID

- **请求参数**:

```json
{
  "source": "list",             // 点击来源：list/detail/homepage
  "userAgent": "string"         // 用户代理信息（可选）
}
```

- **成功响应**:

```json
{
  "code": 200,
  "message": "记录成功",
  "data": {
    "clickCount": 1251          // 更新后的点击次数
  }
}
```

## 🛠️ 后端实现指导

### 1. 数据库表结构

```sql
-- 医院广告位表
CREATE TABLE hospital_ads (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500) NOT NULL,
  phone VARCHAR(50),
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  services TEXT,
  website VARCHAR(500),
  image_url VARCHAR(500),
  description TEXT,
  working_hours JSON,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  facilities JSON,
  specialties JSON,
  is_recommended BOOLEAN DEFAULT FALSE,
  ad_position INT DEFAULT 0,
  click_count INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_rating (rating),
  INDEX idx_position (ad_position),
  INDEX idx_status (status)
);
```

### 2. API路由配置示例（Express.js）

```javascript
// 医院广告位相关路由
const express = require('express');
const router = express.Router();

// 获取医院列表
router.get('/hospitals', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, city, sortBy = 'rating' } = req.query;
    
    // 构建查询条件
    let whereClause = "status = 'active'";
    let params = [];
    
    if (keyword) {
      whereClause += " AND (name LIKE ? OR address LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    if (city) {
      whereClause += " AND address LIKE ?";
      params.push(`%${city}%`);
    }
    
    // 排序
    let orderBy = 'rating DESC';
    if (sortBy === 'name') {
      orderBy = 'name ASC';
    }
    
    const offset = (page - 1) * pageSize;
    
    // 查询总数
    const countQuery = `SELECT COUNT(*) as total FROM hospital_ads WHERE ${whereClause}`;
    const totalResult = await db.query(countQuery, params);
    const total = totalResult[0].total;
    
    // 查询数据
    const dataQuery = `
      SELECT id, name, address, rating, review_count, services, 
             phone, image_url as image, website, is_recommended, 
             ad_position, click_count
      FROM hospital_ads 
      WHERE ${whereClause} 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(pageSize), offset);
    
    const hospitals = await db.query(dataQuery, params);
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: hospitals,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
    
  } catch (error) {
    console.error('获取医院列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 获取医院详情
router.get('/hospitals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, name, address, phone, rating, review_count, 
             services, website, image_url as image, description,
             working_hours, location_lat as latitude, 
             location_lng as longitude, facilities, specialties
      FROM hospital_ads 
      WHERE id = ? AND status = 'active'
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '医院不存在',
        data: null
      });
    }
    
    const hospital = result[0];
    
    // 处理JSON字段
    if (hospital.working_hours) {
      hospital.working_hours = JSON.parse(hospital.working_hours);
    }
    if (hospital.facilities) {
      hospital.facilities = JSON.parse(hospital.facilities);
    }
    if (hospital.specialties) {
      hospital.specialties = JSON.parse(hospital.specialties);
    }
    
    // 构建location对象
    if (hospital.latitude && hospital.longitude) {
      hospital.location = {
        latitude: hospital.latitude,
        longitude: hospital.longitude
      };
      delete hospital.latitude;
      delete hospital.longitude;
    }
    
    res.json({
      code: 200,
      message: '获取成功',
      data: hospital
    });
    
  } catch (error) {
    console.error('获取医院详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

// 记录点击
router.post('/hospitals/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const { source = 'unknown' } = req.body;
    
    // 更新点击次数
    const updateQuery = `
      UPDATE hospital_ads 
      SET click_count = click_count + 1 
      WHERE id = ? AND status = 'active'
    `;
    
    await db.query(updateQuery, [id]);
    
    // 获取更新后的点击次数
    const selectQuery = `
      SELECT click_count 
      FROM hospital_ads 
      WHERE id = ?
    `;
    
    const result = await db.query(selectQuery, [id]);
    
    res.json({
      code: 200,
      message: '记录成功',
      data: {
        clickCount: result[0]?.click_count || 0
      }
    });
    
  } catch (error) {
    console.error('记录点击失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    });
  }
});

module.exports = router;
```

### 3. 初始数据导入

```sql
-- 插入示例医院数据
INSERT INTO hospital_ads (
  id, name, address, phone, rating, review_count, services, 
  website, image_url, description, is_recommended, ad_position
) VALUES 
(
  'hospital_001',
  '香港宠物医院',
  '香港中环干诺道中200号',
  '+852 2234 5678',
  4.9,
  520,
  '内科、外科、急诊、体检',
  'https://www.hkpethospital.com',
  '/static/images/hospital1.png',
  '专业的宠物医疗服务机构，提供全方位的宠物健康护理',
  TRUE,
  1
),
(
  'hospital_002',
  '旺角宠物诊所',
  '香港旺角弥敦道123号',
  '+852 2345 6789',
  4.7,
  380,
  '常规检查、疫苗接种、洗护美容',
  'https://www.mkpetclinic.com',
  '/static/images/hospital2.png',
  '位于旺角繁华地段的专业宠物诊所',
  TRUE,
  2
);
-- 继续插入其他医院数据...
```

## 📱 前端集成指导

### 1. 更新API调用

在 `/src/pages/medical/index.vue` 中：

```javascript
// 替换现有的静态数据
import { medicalApi } from '../../utils/api';

const hospitals = ref([]);
const loading = ref(false);
const searchKeyword = ref('');

// 获取医院列表
const getHospitals = async () => {
  try {
    loading.value = true;
    const response = await medicalApi.getHospitals({
      page: 1,
      pageSize: 20,
      keyword: searchKeyword.value || undefined
    });
    
    if (response.code === 200) {
      hospitals.value = response.data.list || [];
    }
  } catch (error) {
    console.error('获取医院列表失败:', error);
    uni.showToast({
      title: '获取医院信息失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 搜索医院
const searchHospitals = () => {
  getHospitals();
};

// 页面加载时获取数据
onMounted(() => {
  getHospitals();
});
```

### 2. 更新API文件

在 `/src/utils/api/medical.js` 中添加：

```javascript
// 获取医院广告位列表
export const getHospitals = (params) => {
  return request({
    url: '/medical/hospitals',
    method: 'GET',
    params
  });
};

// 获取医院详情
export const getHospitalDetail = (hospitalId) => {
  return request({
    url: `/medical/hospitals/${hospitalId}`,
    method: 'GET'
  });
};

// 记录医院点击
export const recordHospitalClick = (hospitalId, source = 'list') => {
  return request({
    url: `/medical/hospitals/${hospitalId}/click`,
    method: 'POST',
    data: { source }
  });
};
```

## 🧪 测试验证

### 1. API测试脚本

```javascript
// 医院广告位API测试
const testHospitalAPIs = async () => {
  console.log('=== 测试医院广告位API ===');
  
  try {
    // 测试获取医院列表
    console.log('1. 测试医院列表API...');
    const listResponse = await fetch('/api/medical/hospitals?page=1&pageSize=5');
    const listData = await listResponse.json();
    console.log('✅ 医院列表:', listData);
    
    if (listData.data?.list?.length > 0) {
      const hospitalId = listData.data.list[0].id;
      
      // 测试获取医院详情
      console.log('2. 测试医院详情API...');
      const detailResponse = await fetch(`/api/medical/hospitals/${hospitalId}`);
      const detailData = await detailResponse.json();
      console.log('✅ 医院详情:', detailData);
      
      // 测试记录点击
      console.log('3. 测试点击记录API...');
      const clickResponse = await fetch(`/api/medical/hospitals/${hospitalId}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'test' })
      });
      const clickData = await clickResponse.json();
      console.log('✅ 点击记录:', clickData);
    }
    
  } catch (error) {
    console.error('❌ 医院API测试失败:', error);
  }
};
```

### 2. 功能验证清单

- [ ] 医院列表API返回正确格式的数据
- [ ] 搜索功能正常工作
- [ ] 医院详情API返回完整信息
- [ ] 点击统计功能正常记录
- [ ] 分页功能正确处理
- [ ] 错误处理机制正常

## 📋 部署检查清单

### 后端部署
- [ ] 数据库表已创建
- [ ] 示例数据已导入
- [ ] API路由已配置
- [ ] CORS设置正确
- [ ] 错误处理完善

### 前端部署
- [ ] API调用已更新
- [ ] 错误处理已添加
- [ ] 加载状态已实现
- [ ] 搜索功能已连接
- [ ] 页面跳转正常

## 🔧 常见问题排查

### 1. API连接失败
- 检查API服务器是否正常运行
- 验证API路径是否正确
- 确认CORS配置是否允许前端域名

### 2. 数据格式错误
- 检查数据库字段类型是否匹配
- 验证JSON字段的序列化/反序列化
- 确认图片URL路径是否正确

### 3. 搜索功能异常
- 检查SQL查询语句的LIKE语法
- 验证中文搜索的编码问题
- 确认搜索参数的传递

## 📞 联系信息

如在对接过程中遇到问题，请联系：
- **前端开发**: 提供API调用示例和错误日志
- **后端开发**: 确认API实现和数据库配置
- **测试团队**: 验证功能完整性和用户体验

---

**总结**: 本文档专注于医院广告位功能的API化改造，提供了完整的接口设计、后端实现指导和前端集成方案。按照此文档实施可以将静态的医院数据改为动态API驱动。
