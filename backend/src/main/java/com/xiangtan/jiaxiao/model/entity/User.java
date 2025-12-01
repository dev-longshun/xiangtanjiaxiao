package com.xiangtan.jiaxiao.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体（对应 users 表）
 * 支持微信登录和管理员账号两种方式
 */
@Data
@TableName("users")
public class User {
    
    /**
     * 主键ID（自增）
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户名（管理员使用，微信用户可为空）
     */
    private String username;
    
    /**
     * 密码哈希（仅管理员使用 BCrypt，微信用户为 NULL）
     */
    private String passwordHash;
    
    /**
     * 微信 OpenID（唯一标识，用于微信登录）
     */
    private String openid;
    
    /**
     * 微信 UnionID（多应用统一标识，可选）
     */
    private String unionid;
    
    /**
     * 昵称（微信昵称或自定义昵称）
     */
    private String nickname;
    
    /**
     * 头像 URL（微信头像）
     */
    private String avatar;
    
    /**
     * 角色（ROLE_ADMIN, ROLE_USER）
     */
    private String roles;
    
    /**
     * 邮箱（可选）
     */
    private String email;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    /**
     * 是否激活（逻辑删除标志，1=激活，0=禁用）
     */
    @TableLogic
    private Integer isActive;
}
