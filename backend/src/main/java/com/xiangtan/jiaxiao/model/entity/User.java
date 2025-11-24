package com.xiangtan.jiaxiao.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体（对应 users 表）
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
     * 用户名（唯一）
     */
    private String username;
    
    /**
     * 密码哈希（BCrypt）
     */
    private String passwordHash;
    
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
