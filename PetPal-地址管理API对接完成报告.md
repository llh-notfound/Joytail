# PetPal-地址管理API对接完成报告

## 概述

已完成地址管理模块的后端API对接，包括前端代码修改、API文档生成和测试用例。现在地址管理功能支持Mock模式和真实API模式两种运行方式。

## 完成的工作

### 1. API文档生成

创建了完整的API对接文档 `PetPal-地址管理API对接文档.md`，包含：

#### 1.1 接口列表
- `GET /api/address/list` - 获取地址列表
- `POST /api/address/add` - 新增地址
- `PUT /api/address/update` - 更新地址
- `DELETE /api/address/delete` - 删除地址
- `PUT /api/address/set-default` - 设置默认地址
- `GET /api/address/default` - 获取默认地址

#### 1.2 数据库设计
```sql
CREATE TABLE `address` (
  `id` varchar(32) NOT NULL COMMENT '地址ID',
  `user_id` varchar(32) NOT NULL COMMENT '用户ID',
  `name` varchar(20) NOT NULL COMMENT '收货人姓名',
  `phone` varchar(11) NOT NULL COMMENT '手机号码',
  `region` varchar(100) NOT NULL COMMENT '地区完整字符串',
  `region_array` json NOT NULL COMMENT '地区数组',
  `detail` varchar(100) NOT NULL COMMENT '详细地址',
  `is_default` tinyint(1) DEFAULT 0 COMMENT '是否默认地址',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';
```

### 2. 前端API调用文件

创建了 `uni-preset-vue-vite/src/utils/api/address.js`，包含所有地址管理相关的API调用：

```javascript
export const addressApi = {
  // 获取地址列表
  getAddressList: (params = {}) => {
    return request({
      url: '/api/address/list',
      method: 'GET',
      data: { page: params.page || 1, pageSize: params.pageSize || 10 }
    })
  },

  // 新增地址
  addAddress: (addressData) => {
    return request({
      url: '/api/address/add',
      method: 'POST',
      data: addressData
    })
  },

  // 更新地址
  updateAddress: (addressData) => {
    return request({
      url: '/api/address/update',
      method: 'PUT',
      data: addressData
    })
  },

  // 删除地址
  deleteAddress: (id) => {
    return request({
      url: '/api/address/delete',
      method: 'DELETE',
      data: { id }
    })
  },

  // 设置默认地址
  setDefaultAddress: (id) => {
    return request({
      url: '/api/address/set-default',
      method: 'PUT',
      data: { id }
    })
  },

  // 获取默认地址
  getDefaultAddress: () => {
    return request({
      url: '/api/address/default',
      method: 'GET'
    })
  }
}
```

### 3. 前端页面修改

#### 3.1 地址管理页面 (`address.vue`)
- 修改了获取地址列表功能，支持Mock和API两种模式
- 修改了设置默认地址功能，支持后端API调用
- 修改了删除地址功能，支持后端API调用
- 修改了保存地址功能，支持新增和更新两种操作

#### 3.2 确认订单页面 (`confirm-order.vue`)
- 修改了加载默认地址功能，支持从后端API获取
- 保持了事件监听机制，确保地址选择功能正常

### 4. 双模式支持

#### 4.1 Mock模式 (USE_MOCK = true)
- 使用本地存储管理地址数据
- 保持原有的用户体验
- 便于开发和测试

#### 4.2 API模式 (USE_MOCK = false)
- 调用真实的后端API
- 数据持久化到数据库
- 支持多用户数据隔离

## 技术特点

### 1. 渐进式迁移
- 保持了原有的Mock模式功能
- 新增了API模式支持
- 可以通过配置开关切换模式

### 2. 错误处理
- 统一的错误处理机制
- 用户友好的错误提示
- 网络异常时的降级处理

### 3. 数据一致性
- 本地数据与后端数据同步
- 默认地址的唯一性保证
- 删除操作的数据完整性

### 4. 用户体验
- 保持了原有的交互流程
- 实时更新地址信息
- 流畅的页面切换

## 后端开发指导

### 1. 接口实现要点

#### 1.1 认证和权限
```java
// 示例：Spring Boot Controller
@RestController
@RequestMapping("/api/address")
public class AddressController {
    
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> getAddressList(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int pageSize,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        // 验证用户登录状态
        if (userDetails == null) {
            return ResponseEntity.status(401).body(
                new ApiResponse(401, "用户未登录", null)
            );
        }
        
        // 获取用户地址列表
        String userId = userDetails.getUsername();
        Page<Address> addresses = addressService.getAddressList(userId, page, pageSize);
        
        return ResponseEntity.ok(new ApiResponse(200, "success", addresses));
    }
}
```

#### 1.2 默认地址管理
```java
@PutMapping("/set-default")
public ResponseEntity<ApiResponse> setDefaultAddress(
    @RequestBody SetDefaultRequest request,
    @AuthenticationPrincipal UserDetails userDetails
) {
    String userId = userDetails.getUsername();
    
    // 1. 取消所有地址的默认状态
    addressService.clearDefaultAddress(userId);
    
    // 2. 设置指定地址为默认
    Address defaultAddress = addressService.setDefaultAddress(userId, request.getId());
    
    return ResponseEntity.ok(new ApiResponse(200, "设置成功", defaultAddress));
}
```

#### 1.3 数据验证
```java
@PostMapping("/add")
public ResponseEntity<ApiResponse> addAddress(
    @Valid @RequestBody AddressRequest request,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // 验证手机号码格式
    if (!PhoneValidator.isValid(request.getPhone())) {
        return ResponseEntity.badRequest().body(
            new ApiResponse(400, "手机号码格式不正确", null)
        );
    }
    
    // 验证收货人姓名
    if (StringUtils.isEmpty(request.getName()) || request.getName().length() > 20) {
        return ResponseEntity.badRequest().body(
            new ApiResponse(400, "收货人姓名不能为空且不能超过20字符", null)
        );
    }
    
    // 保存地址
    Address address = addressService.addAddress(userDetails.getUsername(), request);
    
    return ResponseEntity.ok(new ApiResponse(200, "添加成功", address));
}
```

### 2. 数据库操作

#### 2.1 实体类设计
```java
@Entity
@Table(name = "address")
public class Address {
    @Id
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "name", nullable = false, length = 20)
    private String name;
    
    @Column(name = "phone", nullable = false, length = 11)
    private String phone;
    
    @Column(name = "region", nullable = false, length = 100)
    private String region;
    
    @Column(name = "region_array", columnDefinition = "json")
    private String regionArray; // JSON格式存储
    
    @Column(name = "detail", nullable = false, length = 100)
    private String detail;
    
    @Column(name = "is_default")
    private Boolean isDefault = false;
    
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    // getters and setters
}
```

#### 2.2 服务层实现
```java
@Service
public class AddressService {
    
    @Autowired
    private AddressRepository addressRepository;
    
    public Page<Address> getAddressList(String userId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return addressRepository.findByUserIdOrderByIsDefaultDescCreateTimeDesc(userId, pageable);
    }
    
    public Address addAddress(String userId, AddressRequest request) {
        Address address = new Address();
        address.setId(generateId());
        address.setUserId(userId);
        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setRegion(request.getRegion());
        address.setRegionArray(JsonUtils.toJson(request.getRegionArray()));
        address.setDetail(request.getDetail());
        address.setIsDefault(request.getIsDefault());
        address.setCreateTime(LocalDateTime.now());
        address.setUpdateTime(LocalDateTime.now());
        
        // 如果设为默认地址，需要取消其他地址的默认状态
        if (request.getIsDefault()) {
            clearDefaultAddress(userId);
        }
        
        return addressRepository.save(address);
    }
    
    public void clearDefaultAddress(String userId) {
        addressRepository.clearDefaultAddress(userId);
    }
}
```

## 测试用例

### 1. 接口测试
```bash
# 获取地址列表
curl -X GET "http://localhost:8080/api/address/list?page=1&pageSize=10" \
  -H "Authorization: Bearer your-token"

# 新增地址
curl -X POST http://localhost:8080/api/address/add \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "region": "广东省深圳市南山区",
    "regionArray": ["广东省", "深圳市", "南山区"],
    "detail": "科技园南区8栋101室",
    "isDefault": false
  }'

# 设置默认地址
curl -X PUT http://localhost:8080/api/address/set-default \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"id": "A001"}'
```

### 2. 前端测试
- 创建了 `default-address-test.html` 测试页面
- 可以验证地址数据的创建、读取、更新、删除
- 支持默认地址的设置和获取测试

## 部署说明

### 1. 环境配置
- 确保 `USE_MOCK` 配置正确
- 配置正确的API基础路径
- 确保用户认证机制正常工作

### 2. 数据库迁移
- 执行地址表的创建SQL
- 确保索引正确创建
- 验证JSON字段支持

### 3. 监控和日志
- 添加API调用日志
- 监控地址操作频率
- 设置错误告警机制

## 总结

通过本次API对接工作，地址管理模块现在具备了：

1. **完整的CRUD功能**: 支持地址的增删改查
2. **默认地址管理**: 支持设置和获取默认地址
3. **双模式运行**: 支持Mock模式和API模式
4. **良好的用户体验**: 保持了原有的交互流程
5. **完善的错误处理**: 统一的错误处理机制

后端团队可以根据提供的API文档和数据库设计，快速实现对应的接口，确保前后端数据格式一致，功能完整。 