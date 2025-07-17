-- PetPal 购物车结算流程 - 数据库设计文档
-- 创建日期: 2025-07-14
-- 版本: v1.0.0
-- 适用于: MySQL 5.7+

-- ===================================
-- 1. 购物车相关表结构
-- ===================================

-- 购物车表
CREATE TABLE `cart_items` (
  `id` varchar(32) NOT NULL COMMENT '购物车项ID',
  `user_id` varchar(32) NOT NULL COMMENT '用户ID',
  `goods_id` varchar(32) NOT NULL COMMENT '商品ID',
  `quantity` int(11) NOT NULL DEFAULT '1' COMMENT '数量',
  `specs` varchar(100) DEFAULT NULL COMMENT '商品规格',
  `selected` tinyint(1) DEFAULT '1' COMMENT '是否选中 1-选中 0-未选中',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_goods_id` (`goods_id`),
  KEY `idx_user_goods` (`user_id`, `goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- ===================================
-- 2. 订单相关表结构
-- ===================================

-- 订单主表
CREATE TABLE `orders` (
  `id` varchar(32) NOT NULL COMMENT '订单ID',
  `order_number` varchar(20) NOT NULL COMMENT '订单号',
  `user_id` varchar(32) NOT NULL COMMENT '用户ID',
  `address_id` varchar(32) NOT NULL COMMENT '收货地址ID',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '订单总金额',
  `goods_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总金额',
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '运费',

  `payable_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '应付金额',
  `status` enum('pending_payment','paid','shipped','delivered','completed','cancelled') NOT NULL DEFAULT 'pending_payment' COMMENT '订单状态',
  `message` text COMMENT '订单备注',
  `pay_time` timestamp NULL DEFAULT NULL COMMENT '支付时间',
  `ship_time` timestamp NULL DEFAULT NULL COMMENT '发货时间',
  `receive_time` timestamp NULL DEFAULT NULL COMMENT '收货时间',
  `complete_time` timestamp NULL DEFAULT NULL COMMENT '完成时间',
  `cancel_time` timestamp NULL DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` varchar(200) DEFAULT NULL COMMENT '取消原因',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_number` (`order_number`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单主表';

-- 订单商品表
CREATE TABLE `order_items` (
  `id` varchar(32) NOT NULL COMMENT '订单商品ID',
  `order_id` varchar(32) NOT NULL COMMENT '订单ID',
  `goods_id` varchar(32) NOT NULL COMMENT '商品ID',
  `name` varchar(200) NOT NULL COMMENT '商品名称',
  `image` varchar(500) DEFAULT NULL COMMENT '商品图片',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品单价',
  `quantity` int(11) NOT NULL DEFAULT '1' COMMENT '购买数量',
  `specs` varchar(100) DEFAULT NULL COMMENT '商品规格',
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '小计金额',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_goods_id` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';

-- ===================================
-- 3. 支付相关表结构
-- ===================================

-- 支付记录表
CREATE TABLE `payment_records` (
  `id` varchar(32) NOT NULL COMMENT '支付记录ID',
  `order_id` varchar(32) NOT NULL COMMENT '订单ID',
  `order_number` varchar(20) NOT NULL COMMENT '订单号',
  `payment_order_id` varchar(64) NOT NULL COMMENT '支付平台订单ID',
  `payment_method` enum('wechat','alipay','balance') NOT NULL COMMENT '支付方式',
  `payment_channel` enum('h5','app','mini_program','pc') NOT NULL COMMENT '支付渠道',
  `payment_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `status` enum('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
  `transaction_id` varchar(64) DEFAULT NULL COMMENT '第三方交易号',
  `callback_data` text COMMENT '回调数据',
  `success_time` timestamp NULL DEFAULT NULL COMMENT '支付成功时间',
  `expire_time` timestamp NULL DEFAULT NULL COMMENT '支付过期时间',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_order_id` (`payment_order_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

-- ===================================
-- 4. 地址管理表结构
-- ===================================

-- 用户地址表
CREATE TABLE `user_addresses` (
  `id` varchar(32) NOT NULL COMMENT '地址ID',
  `user_id` varchar(32) NOT NULL COMMENT '用户ID',
  `name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号码',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `district` varchar(50) NOT NULL COMMENT '区县',
  `detail_address` varchar(200) NOT NULL COMMENT '详细地址',
  `postal_code` varchar(10) DEFAULT NULL COMMENT '邮政编码',
  `is_default` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否默认地址 1-是 0-否',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';

-- ===================================
-- 5. 库存管理表结构
-- ===================================

-- 商品库存表
CREATE TABLE `goods_inventory` (
  `id` varchar(32) NOT NULL COMMENT '库存ID',
  `goods_id` varchar(32) NOT NULL COMMENT '商品ID',
  `specs` varchar(100) DEFAULT NULL COMMENT '商品规格',
  `total_stock` int(11) NOT NULL DEFAULT '0' COMMENT '总库存',
  `available_stock` int(11) NOT NULL DEFAULT '0' COMMENT '可用库存',
  `locked_stock` int(11) NOT NULL DEFAULT '0' COMMENT '锁定库存',
  `sold_stock` int(11) NOT NULL DEFAULT '0' COMMENT '已售库存',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_goods_specs` (`goods_id`, `specs`),
  KEY `idx_goods_id` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品库存表';

-- 库存变更记录表
CREATE TABLE `inventory_logs` (
  `id` varchar(32) NOT NULL COMMENT '记录ID',
  `goods_id` varchar(32) NOT NULL COMMENT '商品ID',
  `specs` varchar(100) DEFAULT NULL COMMENT '商品规格',
  `change_type` enum('in','out','lock','unlock') NOT NULL COMMENT '变更类型',
  `change_quantity` int(11) NOT NULL COMMENT '变更数量',
  `before_stock` int(11) NOT NULL COMMENT '变更前库存',
  `after_stock` int(11) NOT NULL COMMENT '变更后库存',
  `relation_type` enum('order','cart','refund','adjust') NOT NULL COMMENT '关联类型',
  `relation_id` varchar(32) DEFAULT NULL COMMENT '关联ID',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_goods_id` (`goods_id`),
  KEY `idx_relation` (`relation_type`, `relation_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存变更记录表';

-- ===================================
-- 7. 物流相关表结构
-- ===================================

-- 物流信息表
CREATE TABLE `logistics_info` (
  `id` varchar(32) NOT NULL COMMENT '物流ID',
  `order_id` varchar(32) NOT NULL COMMENT '订单ID',
  `order_number` varchar(20) NOT NULL COMMENT '订单号',
  `company_code` varchar(20) NOT NULL COMMENT '物流公司代码',
  `company_name` varchar(50) NOT NULL COMMENT '物流公司名称',
  `tracking_number` varchar(50) NOT NULL COMMENT '物流单号',
  `status` enum('pending','shipped','in_transit','delivered','exception') NOT NULL DEFAULT 'pending' COMMENT '物流状态',
  `ship_time` timestamp NULL DEFAULT NULL COMMENT '发货时间',
  `deliver_time` timestamp NULL DEFAULT NULL COMMENT '签收时间',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_id` (`order_id`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_tracking_number` (`tracking_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物流信息表';

-- 物流轨迹表
CREATE TABLE `logistics_tracks` (
  `id` varchar(32) NOT NULL COMMENT '轨迹ID',
  `logistics_id` varchar(32) NOT NULL COMMENT '物流ID',
  `track_time` timestamp NOT NULL COMMENT '轨迹时间',
  `track_status` varchar(50) NOT NULL COMMENT '状态描述',
  `track_detail` varchar(200) NOT NULL COMMENT '详细描述',
  `location` varchar(100) DEFAULT NULL COMMENT '所在地点',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_logistics_id` (`logistics_id`),
  KEY `idx_track_time` (`track_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物流轨迹表';

-- ===================================
-- 8. 初始化数据
-- ===================================

-- 插入测试地址数据
INSERT INTO `user_addresses` (
  `id`, `user_id`, `name`, `phone`, `province`, `city`, `district`, 
  `detail_address`, `postal_code`, `is_default`
) VALUES (
  'addr_001', 'user_001', '张三', '13812345678', '广东省', '深圳市', '南山区',
  '科技园1号楼101室', '518000', 1
);

-- 插入测试优惠券模板
INSERT INTO `coupon_templates` (
  `id`, `name`, `type`, `amount`, `min_amount`, `total_count`, 
  `start_time`, `end_time`, `scope`, `status`
) VALUES 
('tpl_001', '新用户优惠券', 'fixed', 10.00, 100.00, 1000, 
 '2025-01-01 00:00:00', '2025-12-31 23:59:59', '全场通用', 'active'),
('tpl_002', '宠物用品优惠券', 'fixed', 20.00, 200.00, 500,
 '2025-01-01 00:00:00', '2025-12-31 23:59:59', '仅限宠物用品', 'active'),
('tpl_003', '满减优惠券', 'fixed', 30.00, 300.00, 200,
 '2025-01-01 00:00:00', '2025-12-31 23:59:59', '全场通用', 'active');

-- ===================================
-- 9. 索引优化建议
-- ===================================

-- 针对高频查询的复合索引
ALTER TABLE `orders` ADD INDEX `idx_user_status_time` (`user_id`, `status`, `create_time`);
ALTER TABLE `cart_items` ADD INDEX `idx_user_selected` (`user_id`, `selected`);
ALTER TABLE `payment_records` ADD INDEX `idx_status_expire` (`status`, `expire_time`);

-- ===================================
-- 10. 存储过程示例
-- ===================================

DELIMITER $$

-- 创建订单的存储过程
CREATE PROCEDURE `CreateOrder`(
  IN p_user_id VARCHAR(32),
  IN p_cart_item_ids TEXT,
  IN p_address_id VARCHAR(32),
  IN p_message TEXT,
  OUT p_order_id VARCHAR(32),
  OUT p_order_number VARCHAR(20),
  OUT p_total_amount DECIMAL(10,2)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_cart_item_id VARCHAR(32);
  DECLARE v_goods_id VARCHAR(32);
  DECLARE v_quantity INT;
  DECLARE v_price DECIMAL(10,2);
  DECLARE v_subtotal DECIMAL(10,2);
  DECLARE v_goods_amount DECIMAL(10,2) DEFAULT 0;
  DECLARE v_shipping_fee DECIMAL(10,2) DEFAULT 10.00;
  
  DECLARE cart_cursor CURSOR FOR 
    SELECT ci.id, ci.goods_id, ci.quantity, g.price
    FROM cart_items ci 
    JOIN goods g ON ci.goods_id = g.id 
    WHERE FIND_IN_SET(ci.id, p_cart_item_ids) > 0;
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  -- 生成订单ID和订单号
  SET p_order_id = CONCAT('ORD_', UNIX_TIMESTAMP(), '_', SUBSTRING(MD5(RAND()), 1, 8));
  SET p_order_number = CONCAT('PO', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 99999), 5, '0'));
  
  -- 开启事务
  START TRANSACTION;
  
  -- 计算商品总金额
  OPEN cart_cursor;
  read_loop: LOOP
    FETCH cart_cursor INTO v_cart_item_id, v_goods_id, v_quantity, v_price;
    IF done THEN
      LEAVE read_loop;
    END IF;
    
    SET v_subtotal = v_price * v_quantity;
    SET v_goods_amount = v_goods_amount + v_subtotal;
    
    -- 插入订单商品
    INSERT INTO order_items (
      id, order_id, goods_id, name, image, price, quantity, specs, subtotal
    ) SELECT 
      CONCAT('OI_', UNIX_TIMESTAMP(), '_', SUBSTRING(MD5(RAND()), 1, 8)),
      p_order_id, g.id, g.name, g.image, g.price, v_quantity, ci.specs, v_subtotal
    FROM goods g 
    JOIN cart_items ci ON g.id = ci.goods_id 
    WHERE ci.id = v_cart_item_id;
    
  END LOOP;
  CLOSE cart_cursor;
  
  -- 计算最终金额
  SET p_total_amount = v_goods_amount + v_shipping_fee;
  
  -- 创建订单
  INSERT INTO orders (
    id, order_number, user_id, address_id, total_amount, goods_amount, 
    shipping_fee, payable_amount, message
  ) VALUES (
    p_order_id, p_order_number, p_user_id, p_address_id, p_total_amount, 
    v_goods_amount, v_shipping_fee, p_total_amount, p_message
  );
  
  -- 删除购物车中的商品
  DELETE FROM cart_items WHERE FIND_IN_SET(id, p_cart_item_ids) > 0;
  
  COMMIT;
  
END$$

DELIMITER ;

-- ===================================
-- 11. 定时任务SQL
-- ===================================

-- 清理超时未支付订单（建议每5分钟执行一次）
UPDATE orders 
SET status = 'cancelled', cancel_time = NOW(), cancel_reason = '支付超时自动取消'
WHERE status = 'pending_payment' 
  AND create_time < DATE_SUB(NOW(), INTERVAL 30 MINUTE);

-- 清理过期支付记录（建议每小时执行一次）
UPDATE payment_records 
SET status = 'failed' 
WHERE status = 'pending' 
  AND expire_time < NOW();

-- ===================================
-- 12. 性能监控查询
-- ===================================

-- 查看慢查询
SELECT 
  TABLE_SCHEMA,
  TABLE_NAME,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'DB Size in MB'
FROM information_schema.tables 
WHERE TABLE_SCHEMA = 'petpal'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 查看表大小
SHOW TABLE STATUS LIKE 'orders';

-- ===================================
-- 13. 备份与恢复
-- ===================================

-- 备份命令（在命令行执行）
-- mysqldump -u username -p petpal > petpal_backup.sql

-- 恢复命令（在命令行执行）
-- mysql -u username -p petpal < petpal_backup.sql
