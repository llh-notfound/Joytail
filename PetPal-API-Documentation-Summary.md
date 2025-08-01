# PetPal API Documentation Summary

## 📋 Overview

This document provides a comprehensive summary of all PetPal API endpoints, organized by functional modules. PetPal is a comprehensive pet care application built with uni-app and Vue 3, featuring community, medical services, insurance, shopping cart, and user management functionalities.

## 🔧 Technical Specifications

### Base Information
- **API Base URL**: `https://udrvmlsoncfg.sealosbja.site`
- **API Prefix**: `/api`
- **Authentication**: JWT Bearer Token
- **Response Format**: JSON
- **Database**: Redis
- **Frontend Framework**: uni-app + Vue 3
- **API Version**: v2.3.0

### Standard Response Format
```json
{
  "code": 200,       // Status code: 200 for success, others for errors
  "message": "xxx",  // Response message
  "data": {}         // Response data (object or array)
}
```

### Common Error Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (Invalid parameters) |
| 401 | Unauthorized (Not logged in or invalid token) |
| 403 | Forbidden (Insufficient permissions) |
| 404 | Not Found (Resource doesn't exist) |
| 500 | Internal Server Error |

### Authentication
Most APIs require JWT token in the request header:
```
Authorization: Bearer {token}
```

---

## 🛒 Shopping Cart Module

### 1. Get Cart List
- **URL**: `GET /api/cart/list`
- **Auth**: Required
- **Description**: Retrieve user's shopping cart items

**Response**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "cart_item_001",
        "goodsId": "goods_001",
        "name": "Royal Cat Food",
        "image": "https://example.com/images/cat-food.jpg",
        "price": 89.90,
        "quantity": 2,
        "specs": "2kg",
        "selected": true,
        "stock": 100,
        "createTime": "2025-07-14T09:00:00Z"
      }
    ],
    "totalItems": 1,
    "totalAmount": 179.80,
    "selectedCount": 1,
    "selectedAmount": 179.80
  }
}
```

### 2. Add to Cart
- **URL**: `POST /api/cart/add`
- **Auth**: Required
- **Description**: Add product to shopping cart

**Request**:
```json
{
  "goodsId": "goods_001",
  "quantity": 1,
  "specs": "2kg"
}
```

### 3. Update Cart Item
- **URL**: `PUT /api/cart/update`
- **Auth**: Required
- **Description**: Update cart item quantity

**Request**:
```json
{
  "cartItemId": "cart_item_001",
  "quantity": 3
}
```

### 4. Update Selection Status
- **URL**: `PUT /api/cart/select`
- **Auth**: Required
- **Description**: Update cart item selection status

**Request**:
```json
{
  "cartItemId": "cart_item_001",
  "selected": true
}
```

### 5. Delete Cart Items
- **URL**: `DELETE /api/cart/items`
- **Auth**: Required
- **Description**: Delete cart items

**Request**:
```json
{
  "cartItemIds": ["cart_item_001", "cart_item_002"]
}
```

---

## 📦 Order Management Module

### 1. Create Order
- **URL**: `POST /api/order/create`
- **Auth**: Required
- **Description**: Create new order from cart items

**Request**:
```json
{
  "cartItemIds": ["1", "2", "3"],
  "addressId": "A001",
  "message": "Please ship quickly"
}
```

**Response**:
```json
{
  "code": 200,
  "message": "Order created successfully",
  "data": {
    "orderNumber": "ORD202412010001",
    "orderId": "12345",
    "status": "pending_payment",
    "statusText": "Pending Payment",
    "createTime": "2024-12-01 10:30:00",
    "totalAmount": 299.00,
    "goodsAmount": 280.00,
    "shippingFee": 19.00,
    "address": {
      "id": "A001",
      "name": "John Doe",
      "phone": "13800138000",
      "province": "Guangdong",
      "city": "Shenzhen",
      "district": "Nanshan",
      "detailAddress": "Tech Park South 8-101"
    },
    "goods": [
      {
        "id": "G001",
        "name": "Premium Cat Food",
        "image": "https://example.com/cat-food.jpg",
        "specs": "5kg",
        "price": 140.00,
        "quantity": 2,
        "subtotal": 280.00
      }
    ]
  }
}
```

### 2. Get Order List
- **URL**: `GET /api/order/goods-list`
- **Auth**: Required
- **Description**: Get user's order list with filtering

**Parameters**:
- `status`: Order status filter (all, pending_payment, pending_shipment, etc.)
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)

### 3. Get Order Detail
- **URL**: `GET /api/order/detail/{orderNumber}`
- **Auth**: Required
- **Description**: Get detailed order information

### 4. Pay Order
- **URL**: `POST /api/order/pay/{orderNumber}`
- **Auth**: Required
- **Description**: Initiate payment for order

**Request**:
```json
{
  "paymentMethod": "wechat",
  "paymentChannel": "online"
}
```

### 5. Cancel Order
- **URL**: `POST /api/order/cancel/{orderNumber}`
- **Auth**: Required
- **Description**: Cancel order

**Request**:
```json
{
  "reason": "Changed mind"
}
```

### 6. Confirm Order
- **URL**: `POST /api/order/confirm/{orderNumber}`
- **Auth**: Required
- **Description**: Confirm order receipt

---

## 🏥 Medical Services Module

### 1. Get Hospital List
- **URL**: `GET /api/medical/hospitals`
- **Auth**: Not required
- **Description**: Get list of pet hospitals

**Response**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "Hong Kong Pet Hospital",
        "address": "200 Connaught Road Central, Hong Kong",
        "phone": "+852 2234 5678",
        "website": "https://www.hkpethospital.com",
        "description": "Professional pet medical services with advanced equipment",
        "logo_url": "https://example.com/images/hospital1-logo.png",
        "cover_url": "https://example.com/images/hospital1-cover.jpg",
        "rating": 4.8,
        "services": ["Emergency", "Surgery", "Checkup", "Vaccination"],
        "business_hours": "Monday-Sunday 8:00-22:00",
        "emergency_24h": true
      }
    ],
    "total": 3
  }
}
```

### 2. Get Hospital Detail
- **URL**: `GET /api/medical/hospitals/{id}`
- **Auth**: Not required
- **Description**: Get detailed hospital information

**Response**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Hong Kong Pet Hospital",
    "address": "200 Connaught Road Central, Hong Kong",
    "phone": "+852 2234 5678",
    "website": "https://www.hkpethospital.com",
    "description": "Professional pet medical services...",
    "logo_url": "https://example.com/images/hospital1-logo.png",
    "cover_url": "https://example.com/images/hospital1-cover.jpg",
    "images": [
      {
        "id": 1,
        "url": "https://example.com/images/hospital1-room1.jpg",
        "title": "Consultation Room",
        "description": "Bright and spacious consultation environment"
      }
    ],
    "rating": 4.8,
    "services": ["Emergency", "Surgery", "Checkup", "Vaccination"],
    "business_hours": "Monday-Sunday 8:00-22:00",
    "emergency_24h": true
  }
}
```

### 3. Record Hospital Click
- **URL**: `POST /api/medical/hospitals/{id}/click`
- **Auth**: Not required
- **Description**: Record hospital click for analytics

---

## 🛡️ Insurance Module

### 1. Get Insurance Products
- **URL**: `GET /api/insurance/products`
- **Auth**: Not required
- **Description**: Get list of insurance products

**Response**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [
      {
        "id": "ins_001",
        "name": "Comprehensive Pet Insurance",
        "description": "Complete coverage for your pet's health",
        "coverage": ["Medical", "Surgery", "Vaccination", "Accident"],
        "premium": 299.00,
        "coverage_amount": 50000.00,
        "image": "https://example.com/insurance1.jpg",
        "terms_url": "https://example.com/terms1.pdf"
      }
    ],
    "total": 5
  }
}
```

### 2. Get Insurance Product Detail
- **URL**: `GET /api/insurance/products/{id}`
- **Auth**: Not required
- **Description**: Get detailed insurance product information

### 3. Get My Policies
- **URL**: `GET /api/insurance/policies/my`
- **Auth**: Required
- **Description**: Get user's insurance policies

### 4. Get Insurance Quote
- **URL**: `POST /api/insurance/quote`
- **Auth**: Required
- **Description**: Get insurance quote

**Request**:
```json
{
  "productId": "ins_001",
  "petType": "dog",
  "petAge": 3,
  "coverageLevel": "comprehensive"
}
```

### 5. Purchase Insurance
- **URL**: `POST /api/insurance/purchase`
- **Auth**: Required
- **Description**: Purchase insurance policy

### 6. Submit Claim
- **URL**: `POST /api/insurance/claims`
- **Auth**: Required
- **Description**: Submit insurance claim

### 7. Get Claim History
- **URL**: `GET /api/insurance/claims/my`
- **Auth**: Required
- **Description**: Get user's claim history

---

## 🐾 Community Module

### 1. Get Community Posts
- **URL**: `GET /api/community/posts`
- **Auth**: Not required
- **Description**: Get community posts with pagination

**Parameters**:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `type`: Post type filter (all, hot, latest)

**Response**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [
      {
        "id": "post_001",
        "userId": "user_001",
        "userName": "PetLover",
        "userAvatar": "https://example.com/avatar1.jpg",
        "content": "My cute cat today! 😸",
        "images": [
          "https://example.com/post1-1.jpg",
          "https://example.com/post1-2.jpg"
        ],
        "tags": ["cat", "cute"],
        "likesCount": 25,
        "commentsCount": 8,
        "collectsCount": 3,
        "isLiked": false,
        "isCollected": false,
        "createTime": "2025-07-14T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. Create Post
- **URL**: `POST /api/community/posts`
- **Auth**: Required
- **Description**: Create new community post

**Request**:
```json
{
  "content": "My cute cat today! 😸",
  "images": [
    "https://example.com/post1-1.jpg",
    "https://example.com/post1-2.jpg"
  ],
  "tags": ["cat", "cute"]
}
```

### 3. Like Post
- **URL**: `POST /api/community/posts/{id}/like`
- **Auth**: Required
- **Description**: Like/unlike a post

### 4. Collect Post
- **URL**: `POST /api/community/posts/{id}/collect`
- **Auth**: Required
- **Description**: Collect/uncollect a post

### 5. Get Post Comments
- **URL**: `GET /api/community/posts/{id}/comments`
- **Auth**: Not required
- **Description**: Get post comments

### 6. Add Comment
- **URL**: `POST /api/community/posts/{id}/comments`
- **Auth**: Required
- **Description**: Add comment to post

**Request**:
```json
{
  "content": "So cute! 😍"
}
```

---

## 📍 Address Management Module

### 1. Get Address List
- **URL**: `GET /api/address/list`
- **Auth**: Required
- **Description**: Get user's address list

**Response**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [
      {
        "id": "A001",
        "name": "John Doe",
        "phone": "13800138000",
        "region": "Guangdong Shenzhen Nanshan",
        "regionArray": ["Guangdong", "Shenzhen", "Nanshan"],
        "detail": "Tech Park South 8-101",
        "isDefault": true,
        "createTime": "2024-01-15 10:30:00",
        "updateTime": "2024-01-15 10:30:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. Add Address
- **URL**: `POST /api/address/add`
- **Auth**: Required
- **Description**: Add new address

**Request**:
```json
{
  "name": "John Doe",
  "phone": "13800138000",
  "region": "Guangdong Shenzhen Nanshan",
  "regionArray": ["Guangdong", "Shenzhen", "Nanshan"],
  "detail": "Tech Park South 8-101",
  "isDefault": false
}
```

### 3. Update Address
- **URL**: `PUT /api/address/update/{id}`
- **Auth**: Required
- **Description**: Update address information

### 4. Delete Address
- **URL**: `DELETE /api/address/delete/{id}`
- **Auth**: Required
- **Description**: Delete address

### 5. Set Default Address
- **URL**: `PUT /api/address/set-default/{id}`
- **Auth**: Required
- **Description**: Set address as default

---

## 👤 User Management Module

### 1. User Login
- **URL**: `POST /api/user/login`
- **Auth**: Not required
- **Description**: User login

**Request**:
```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

**Response**:
```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": "user_001",
      "phone": "13800138000",
      "nickname": "PetLover",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### 2. Get User Profile
- **URL**: `GET /api/user/profile`
- **Auth**: Required
- **Description**: Get user profile information

### 3. Update User Profile
- **URL**: `PUT /api/user/profile`
- **Auth**: Required
- **Description**: Update user profile

**Request**:
```json
{
  "nickname": "NewNickname",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

### 4. Get Pet Information
- **URL**: `GET /api/user/pets`
- **Auth**: Required
- **Description**: Get user's pet information

### 5. Add Pet
- **URL**: `POST /api/user/pets`
- **Auth**: Required
- **Description**: Add pet information

**Request**:
```json
{
  "name": "Fluffy",
  "type": "cat",
  "breed": "Persian",
  "age": 3,
  "gender": "female",
  "avatar": "https://example.com/pet-avatar.jpg"
}
```

---

## 🛍️ Goods/Shopping Module

### 1. Get Goods List
- **URL**: `GET /api/goods/list`
- **Auth**: Not required
- **Description**: Get goods list with filtering

**Parameters**:
- `category`: Category filter
- `brand`: Brand filter
- `priceMin`: Minimum price
- `priceMax`: Maximum price
- `sort`: Sort order (price_asc, price_desc, sales_desc)
- `page`: Page number
- `pageSize`: Items per page

### 2. Get Goods Detail
- **URL**: `GET /api/goods/detail/{id}`
- **Auth**: Not required
- **Description**: Get detailed goods information

### 3. Search Goods
- **URL**: `GET /api/goods/search`
- **Auth**: Not required
- **Description**: Search goods by keyword

**Parameters**:
- `keyword`: Search keyword
- `page`: Page number
- `pageSize`: Items per page

---

## 🔧 Utility APIs

### 1. Get Region Data
- **URL**: `GET /api/region/list`
- **Auth**: Not required
- **Description**: Get region data for address selection

### 2. Upload Image
- **URL**: `POST /api/upload/image`
- **Auth**: Required
- **Description**: Upload image file

**Request**: Multipart form data
- `file`: Image file

**Response**:
```json
{
  "code": 200,
  "message": "Upload successful",
  "data": {
    "url": "https://example.com/uploads/image.jpg"
  }
}
```

### 3. Health Check
- **URL**: `GET /api/health`
- **Auth**: Not required
- **Description**: API health check

**Response**:
```json
{
  "code": 200,
  "message": "Service is healthy",
  "data": {
    "timestamp": "2025-07-14T10:30:00Z",
    "version": "v2.3.0"
  }
}
```

---

## 📊 Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Cart Items Table
```sql
CREATE TABLE cart_items (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  goods_id VARCHAR(36) NOT NULL,
  goods_name VARCHAR(255) NOT NULL,
  goods_image VARCHAR(500),
  specs VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_goods_id (goods_id),
  UNIQUE KEY uk_user_goods_specs (user_id, goods_id, specs)
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  goods_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) NOT NULL,
  address_id VARCHAR(36) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status)
);
```

#### Community Posts Table
```sql
CREATE TABLE community_posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  content TEXT,
  images JSON,
  tags JSON,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  collects_count INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
);
```

---

## 🚀 Development Guidelines

### Error Handling
All APIs should return consistent error responses:
```json
{
  "code": 400,
  "message": "Invalid parameters",
  "data": null
}
```

### Authentication
Protected APIs require valid JWT token in Authorization header:
```
Authorization: Bearer {token}
```

### Pagination
List APIs should support pagination with consistent parameters:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)

### File Upload
Image upload APIs should:
- Accept multipart form data
- Validate file type and size
- Return public URL for uploaded file
- Support image compression if needed

### Rate Limiting
Consider implementing rate limiting for:
- Login attempts
- File uploads
- API calls per user

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.3.0 | 2025-07-12 | Medical module restructured to hospital advertising |
| v2.2.0 | 2025-07-11 | Insurance module enhanced with improved filtering |
| v2.1.0 | 2025-07-10 | Goods filtering upgraded with multi-dimensional options |
| v2.0.0 | 2025-07-09 | Architecture optimization with unified response format |

---

## 🔗 Additional Resources

- **Frontend Repository**: uni-app + Vue 3 project
- **Database**: Redis for caching and session management
- **Deployment**: Production environment on cloud platform
- **Documentation**: Comprehensive API documentation and testing tools

---

**Note**: This API documentation is continuously updated. For the latest version, please refer to the development team or check the project repository. 