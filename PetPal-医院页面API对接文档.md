# PetPal医院页面API对接文档

## 📋 文档概述

**文档版本**: v1.0  
**创建日期**: 2025年7月13日  
**适用页面**: 医院主页 + 医院详情页  
**前端路径**: `/pages/medical/index.vue` + `/pages/medical/detail.vue`

## 🏥 业务需求

### 页面功能
1. **医院主页**: 展示3个推荐医院，轮播图 + 卡片列表
2. **医院详情页**: 展示单个医院的完整信息和环境图片

### 数据展示
- 医院基本信息（名称、地址、电话、网站）
- 医院Logo和封面图
- 医院环境图片（4张）
- 医院介绍文字

## 🔗 API接口规范

### 1. 获取医院列表

#### 接口信息
- **路径**: `GET /api/medical/hospitals`
- **描述**: 获取推荐医院列表（固定3个）
- **权限**: 无需登录

#### 请求参数
```json
无参数（或可选分页参数）
```

#### 响应格式
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 3,
    "list": [
      {
        "id": 1,
        "name": "香港宠物医院",
        "address": "香港中环干诺道中200号",
        "phone": "+852 2234 5678",
        "website": "https://www.hkpethospital.com",
        "logo": "https://api.petpal.com/uploads/hospitals/hospital1-logo.png",
        "cover": "https://api.petpal.com/uploads/hospitals/hospital1-cover.jpg",
        "description": "香港宠物医院是一家专业的宠物医疗机构，拥有先进的医疗设备和经验丰富的兽医团队。",
        "images": [
          "https://api.petpal.com/uploads/hospitals/hospital1-1.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital1-2.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital1-3.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital1-4.jpg"
        ],
        "features": ["专业设备", "资深团队", "24小时服务"],
        "rating": 4.8,
        "status": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-07-13T00:00:00Z"
      },
      {
        "id": 2,
        "name": "旺角宠物诊所",
        "address": "香港旺角弥敦道123号",
        "phone": "+852 2345 6789",
        "website": "https://www.mkpetclinic.com",
        "logo": "https://api.petpal.com/uploads/hospitals/hospital2-logo.png",
        "cover": "https://api.petpal.com/uploads/hospitals/hospital2-cover.jpg",
        "description": "旺角宠物诊所位于香港繁华地段，交通便利。我们提供全面的宠物医疗服务。",
        "images": [
          "https://api.petpal.com/uploads/hospitals/hospital2-1.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital2-2.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital2-3.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital2-4.jpg"
        ],
        "features": ["交通便利", "全科服务", "设备先进"],
        "rating": 4.6,
        "status": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-07-13T00:00:00Z"
      },
      {
        "id": 3,
        "name": "铜锣湾动物医院",
        "address": "香港铜锣湾轩尼诗道456号",
        "phone": "+852 3456 7890",
        "website": "https://www.cwbanimalhospital.com",
        "logo": "https://api.petpal.com/uploads/hospitals/hospital3-logo.png",
        "cover": "https://api.petpal.com/uploads/hospitals/hospital3-cover.jpg",
        "description": "铜锣湾动物医院是香港知名的宠物医疗中心，拥有24小时急诊服务。",
        "images": [
          "https://api.petpal.com/uploads/hospitals/hospital3-1.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital3-2.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital3-3.jpg",
          "https://api.petpal.com/uploads/hospitals/hospital3-4.jpg"
        ],
        "features": ["24小时急诊", "高端设备", "专业团队"],
        "rating": 4.9,
        "status": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-07-13T00:00:00Z"
      }
    ]
  }
}
```

### 2. 获取医院详情

#### 接口信息
- **路径**: `GET /api/medical/hospitals/{id}`
- **描述**: 获取指定医院的详细信息
- **权限**: 无需登录

#### 请求参数
```
Path参数:
- id (integer, required): 医院ID
```

#### 响应格式
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "香港宠物医院",
    "address": "香港中环干诺道中200号",
    "phone": "+852 2234 5678",
    "website": "https://www.hkpethospital.com",
    "logo": "https://api.petpal.com/uploads/hospitals/hospital1-logo.png",
    "cover": "https://api.petpal.com/uploads/hospitals/hospital1-cover.jpg",
    "description": "香港宠物医院是一家专业的宠物医疗机构，拥有先进的医疗设备和经验丰富的兽医团队。我们致力于为您的宠物提供最优质的医疗服务，包括常规检查、疫苗接种、手术治疗等。医院采用国际先进的诊疗标准，配备了数字化X光机、超声波设备、生化分析仪等现代化设备。",
    "images": [
      "https://api.petpal.com/uploads/hospitals/hospital1-1.jpg",
      "https://api.petpal.com/uploads/hospitals/hospital1-2.jpg",
      "https://api.petpal.com/uploads/hospitals/hospital1-3.jpg",
      "https://api.petpal.com/uploads/hospitals/hospital1-4.jpg"
    ],
    "features": ["专业设备", "资深团队", "24小时服务"],
    "services": [
      {
        "name": "常规检查",
        "description": "全面的宠物健康检查"
      },
      {
        "name": "疫苗接种",
        "description": "各类宠物疫苗接种服务"
      },
      {
        "name": "外科手术",
        "description": "专业的外科手术治疗"
      },
      {
        "name": "急诊服务",
        "description": "24小时急诊医疗服务"
      }
    ],
    "doctors": [
      {
        "name": "陈医生",
        "title": "主任兽医师",
        "speciality": "内科、外科",
        "experience": "15年临床经验"
      },
      {
        "name": "李医生",
        "title": "副主任兽医师", 
        "speciality": "皮肤科、眼科",
        "experience": "10年临床经验"
      }
    ],
    "business_hours": {
      "weekdays": "09:00-18:00",
      "weekends": "09:00-17:00",
      "emergency": "24小时急诊"
    },
    "rating": 4.8,
    "review_count": 156,
    "status": 1,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-07-13T00:00:00Z"
  }
}
```

## 📝 前端调用示例

### 1. 医院列表页面调用

```javascript
// pages/medical/index.vue
export default {
  data() {
    return {
      hospitals: [],
      loading: false
    }
  },
  async onLoad() {
    await this.loadHospitals();
  },
  methods: {
    async loadHospitals() {
      try {
        this.loading = true;
        const response = await uni.request({
          url: 'https://api.petpal.com/api/medical/hospitals',
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.code === 200) {
          this.hospitals = response.data.data.list;
        } else {
          uni.showToast({
            title: response.data.message || '获取医院列表失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取医院列表失败:', error);
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    navigateToDetail(hospital) {
      uni.navigateTo({
        url: `/pages/medical/detail?id=${hospital.id}`
      });
    }
  }
}
```

### 2. 医院详情页面调用

```javascript
// pages/medical/detail.vue
export default {
  data() {
    return {
      hospital: {},
      loading: false,
      hospitalId: null
    }
  },
  async onLoad(options) {
    if (options.id) {
      this.hospitalId = options.id;
      await this.loadHospitalDetail();
    }
  },
  methods: {
    async loadHospitalDetail() {
      try {
        this.loading = true;
        const response = await uni.request({
          url: `https://api.petpal.com/api/medical/hospitals/${this.hospitalId}`,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.code === 200) {
          this.hospital = response.data.data;
        } else {
          uni.showToast({
            title: response.data.message || '获取医院详情失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取医院详情失败:', error);
        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
```

## 🗃️ 数据库表结构建议

### hospitals表
```sql
CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '医院名称',
  `address` text NOT NULL COMMENT '医院地址',
  `phone` varchar(50) NOT NULL COMMENT '联系电话',
  `website` varchar(255) DEFAULT NULL COMMENT '官方网站',
  `logo` varchar(500) DEFAULT NULL COMMENT 'Logo图片URL',
  `cover` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
  `description` text COMMENT '医院介绍',
  `features` json COMMENT '医院特色（JSON数组）',
  `rating` decimal(2,1) DEFAULT '0.0' COMMENT '评分',
  `review_count` int(11) DEFAULT '0' COMMENT '评价数量',
  `business_hours` json COMMENT '营业时间（JSON对象）',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1-正常，0-停用',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序权重',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_sort` (`status`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医院信息表';
```

### hospital_images表
```sql
CREATE TABLE `hospital_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL COMMENT '医院ID',
  `image_url` varchar(500) NOT NULL COMMENT '图片URL',
  `image_type` enum('environment','equipment','staff','other') DEFAULT 'environment' COMMENT '图片类型',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hospital_id` (`hospital_id`),
  FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医院图片表';
```

### hospital_services表
```sql
CREATE TABLE `hospital_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL COMMENT '医院ID',
  `service_name` varchar(255) NOT NULL COMMENT '服务名称',
  `service_description` text COMMENT '服务描述',
  `price_range` varchar(100) COMMENT '价格范围',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hospital_id` (`hospital_id`),
  FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医院服务表';
```

### hospital_doctors表
```sql
CREATE TABLE `hospital_doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL COMMENT '医院ID',
  `doctor_name` varchar(255) NOT NULL COMMENT '医生姓名',
  `title` varchar(255) COMMENT '职称',
  `speciality` text COMMENT '专业领域',
  `experience` varchar(255) COMMENT '工作经验',
  `avatar` varchar(500) COMMENT '头像URL',
  `introduction` text COMMENT '医生介绍',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hospital_id` (`hospital_id`),
  FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医院医生表';
```

## 📊 测试数据示例

### 插入测试数据
```sql
-- 插入医院数据
INSERT INTO `hospitals` VALUES 
(1, '香港宠物医院', '香港中环干诺道中200号', '+852 2234 5678', 'https://www.hkpethospital.com', 
 'https://api.petpal.com/uploads/hospitals/hospital1-logo.png', 
 'https://api.petpal.com/uploads/hospitals/hospital1-cover.jpg',
 '香港宠物医院是一家专业的宠物医疗机构，拥有先进的医疗设备和经验丰富的兽医团队。',
 '["专业设备", "资深团队", "24小时服务"]', 4.8, 156,
 '{"weekdays": "09:00-18:00", "weekends": "09:00-17:00", "emergency": "24小时急诊"}',
 1, 1, NOW(), NOW()),

(2, '旺角宠物诊所', '香港旺角弥敦道123号', '+852 2345 6789', 'https://www.mkpetclinic.com',
 'https://api.petpal.com/uploads/hospitals/hospital2-logo.png',
 'https://api.petpal.com/uploads/hospitals/hospital2-cover.jpg',
 '旺角宠物诊所位于香港繁华地段，交通便利。我们提供全面的宠物医疗服务。',
 '["交通便利", "全科服务", "设备先进"]', 4.6, 89,
 '{"weekdays": "09:00-18:00", "weekends": "09:00-17:00"}',
 1, 2, NOW(), NOW()),

(3, '铜锣湾动物医院', '香港铜锣湾轩尼诗道456号', '+852 3456 7890', 'https://www.cwbanimalhospital.com',
 'https://api.petpal.com/uploads/hospitals/hospital3-logo.png',
 'https://api.petpal.com/uploads/hospitals/hospital3-cover.jpg',
 '铜锣湾动物医院是香港知名的宠物医疗中心，拥有24小时急诊服务。',
 '["24小时急诊", "高端设备", "专业团队"]', 4.9, 203,
 '{"weekdays": "08:00-20:00", "weekends": "09:00-18:00", "emergency": "24小时急诊"}',
 1, 3, NOW(), NOW());

-- 插入医院图片
INSERT INTO `hospital_images` VALUES
(1, 1, 'https://api.petpal.com/uploads/hospitals/hospital1-1.jpg', 'environment', 1, NOW()),
(2, 1, 'https://api.petpal.com/uploads/hospitals/hospital1-2.jpg', 'environment', 2, NOW()),
(3, 1, 'https://api.petpal.com/uploads/hospitals/hospital1-3.jpg', 'equipment', 3, NOW()),
(4, 1, 'https://api.petpal.com/uploads/hospitals/hospital1-4.jpg', 'environment', 4, NOW());
```

## 🔧 后端实现建议

### PHP Laravel示例
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    /**
     * 获取医院列表
     */
    public function index(Request $request)
    {
        try {
            $hospitals = Hospital::with(['images', 'services', 'doctors'])
                ->where('status', 1)
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'asc')
                ->limit(3)
                ->get();

            $list = $hospitals->map(function ($hospital) {
                return [
                    'id' => $hospital->id,
                    'name' => $hospital->name,
                    'address' => $hospital->address,
                    'phone' => $hospital->phone,
                    'website' => $hospital->website,
                    'logo' => $hospital->logo,
                    'cover' => $hospital->cover,
                    'description' => $hospital->description,
                    'images' => $hospital->images->pluck('image_url')->toArray(),
                    'features' => json_decode($hospital->features, true) ?? [],
                    'rating' => floatval($hospital->rating),
                    'status' => $hospital->status,
                    'created_at' => $hospital->created_at,
                    'updated_at' => $hospital->updated_at,
                ];
            });

            return response()->json([
                'code' => 200,
                'message' => '获取成功',
                'data' => [
                    'total' => $list->count(),
                    'list' => $list
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => '服务器错误',
                'data' => null
            ], 500);
        }
    }

    /**
     * 获取医院详情
     */
    public function show($id)
    {
        try {
            $hospital = Hospital::with(['images', 'services', 'doctors'])
                ->where('status', 1)
                ->find($id);

            if (!$hospital) {
                return response()->json([
                    'code' => 404,
                    'message' => '医院不存在',
                    'data' => null
                ], 404);
            }

            $data = [
                'id' => $hospital->id,
                'name' => $hospital->name,
                'address' => $hospital->address,
                'phone' => $hospital->phone,
                'website' => $hospital->website,
                'logo' => $hospital->logo,
                'cover' => $hospital->cover,
                'description' => $hospital->description,
                'images' => $hospital->images->pluck('image_url')->toArray(),
                'features' => json_decode($hospital->features, true) ?? [],
                'services' => $hospital->services->map(function ($service) {
                    return [
                        'name' => $service->service_name,
                        'description' => $service->service_description,
                        'price_range' => $service->price_range
                    ];
                }),
                'doctors' => $hospital->doctors->map(function ($doctor) {
                    return [
                        'name' => $doctor->doctor_name,
                        'title' => $doctor->title,
                        'speciality' => $doctor->speciality,
                        'experience' => $doctor->experience,
                        'avatar' => $doctor->avatar,
                        'introduction' => $doctor->introduction
                    ];
                }),
                'business_hours' => json_decode($hospital->business_hours, true),
                'rating' => floatval($hospital->rating),
                'review_count' => $hospital->review_count,
                'status' => $hospital->status,
                'created_at' => $hospital->created_at,
                'updated_at' => $hospital->updated_at,
            ];

            return response()->json([
                'code' => 200,
                'message' => '获取成功',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => '服务器错误',
                'data' => null
            ], 500);
        }
    }
}
```

## 🔍 错误处理

### 常见错误码
- **200**: 成功
- **404**: 医院不存在
- **500**: 服务器内部错误
- **503**: 服务暂不可用

### 错误响应格式
```json
{
  "code": 404,
  "message": "医院不存在",
  "data": null
}
```

## 📋 API测试清单

### 测试用例
1. **获取医院列表** - 验证返回3个医院数据
2. **获取医院详情** - 验证每个医院ID的详情数据
3. **错误处理** - 测试不存在的医院ID
4. **图片URL** - 验证所有图片URL可访问
5. **数据完整性** - 验证必填字段不为空

### Postman测试集合
```json
{
  "info": {
    "name": "PetPal医院API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "获取医院列表",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/medical/hospitals",
          "host": ["{{baseUrl}}"],
          "path": ["api", "medical", "hospitals"]
        }
      }
    },
    {
      "name": "获取医院详情",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/medical/hospitals/1",
          "host": ["{{baseUrl}}"],
          "path": ["api", "medical", "hospitals", "1"]
        }
      }
    }
  ]
}
```

## 📞 技术支持

如有API对接问题，请联系：
- **前端开发**: 医院页面已完成，等待后端API对接
- **API规范**: 本文档定义了完整的接口规范
- **测试环境**: 提供Postman测试集合

---

**注意**: 本文档基于前端已完成的医院页面功能编写，后端需严格按照此规范实现API接口。
