-- =============================================
-- 湘潭驾校评价系统 - 数据库建表脚本
-- MySQL 8.x (UTF-8mb4, InnoDB)
-- =============================================

-- 创建数据库（如不存在）
CREATE DATABASE IF NOT EXISTS jiaxiao
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE jiaxiao;

-- =============================================
-- 1. 用户表（users）
-- 支持微信登录和管理员账号两种方式
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) UNIQUE COMMENT '用户名（管理员使用，微信用户为 NULL）',
    password_hash VARCHAR(255) COMMENT '密码哈希（仅管理员使用 BCrypt，微信用户为 NULL）',
    openid VARCHAR(100) UNIQUE COMMENT '微信 OpenID（唯一标识，用于微信登录）',
    unionid VARCHAR(100) COMMENT '微信 UnionID（多应用统一标识，可选）',
    nickname VARCHAR(100) COMMENT '昵称（微信昵称或自定义昵称）',
    avatar VARCHAR(500) COMMENT '头像 URL（微信头像）',
    roles VARCHAR(100) NOT NULL DEFAULT 'ROLE_USER' COMMENT '角色（ROLE_ADMIN, ROLE_USER）',
    email VARCHAR(100) COMMENT '邮箱（可选）',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否激活（1=激活, 0=禁用，逻辑删除标志）',
    INDEX idx_username (username),
    INDEX idx_openid (openid),
    INDEX idx_unionid (unionid),
    INDEX idx_roles (roles)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表（支持微信登录）';

-- =============================================
-- 2. 驾校表（schools）
-- =============================================
CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(50) PRIMARY KEY COMMENT '驾校ID（如 school-001）',
    name VARCHAR(100) NOT NULL COMMENT '驾校名称',
    name_pinyin VARCHAR(100) COMMENT '名称拼音（用于排序）',
    rating DECIMAL(3, 2) DEFAULT 0.00 COMMENT '综合评分（0.00-5.00）',
    review_count INT DEFAULT 0 COMMENT '评价总数',
    pass_rate DECIMAL(5, 2) COMMENT '通过率（百分比，如 85.50）',
    tags JSON COMMENT '标签（JSON 数组，如 ["大型驾校","设施完善"]）',
    courses JSON COMMENT '开设课程（JSON 数组，如 ["C1","C2","A1"]）',
    address VARCHAR(255) COMMENT '地址',
    phone VARCHAR(20) COMMENT '联系电话',
    business_hours VARCHAR(100) COMMENT '营业时间',
    price_range VARCHAR(50) COMMENT '学车费用范围',
    exam_data JSON COMMENT '考试数据（JSON 对象，包含各科通过率等）',
    description TEXT COMMENT '驾校简介',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否激活（逻辑删除标志）',
    INDEX idx_name (name),
    INDEX idx_name_pinyin (name_pinyin),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='驾校表';

-- =============================================
-- 3. 评价表（reviews）
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    school_id VARCHAR(50) NOT NULL COMMENT '关联驾校ID（外键）',
    author VARCHAR(50) NOT NULL COMMENT '评价者昵称',
    content TEXT NOT NULL COMMENT '评价内容',
    rating INT NOT NULL COMMENT '评分（1-5）',
    evidence_images TEXT COMMENT '事实证明图片（JSON 数组，存储图片 URL 列表，最多9张）',
    review_date DATETIME NOT NULL COMMENT '评价时间',
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING' COMMENT '审核状态',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否激活（逻辑删除标志）',
    CONSTRAINT fk_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id),
    INDEX idx_status (status),
    INDEX idx_review_date (review_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';

-- =============================================
-- 初始数据说明
-- =============================================
-- 1. 初始管理员账户由 AdminInitializer 自动创建（username=admin, password=123456）
-- 2. 驾校与评价数据由 JsonDataImporter 从 data.json 自动导入
-- 3. 请在首次启动 Spring Boot 应用后，使用 admin 登录并修改默认密码
-- =============================================
