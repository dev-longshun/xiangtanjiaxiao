package com.xiangtan.jiaxiao.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 驾校实体（对应 schools 表）
 */
@Data
@TableName("schools")
public class School {
    
    /**
     * 驾校ID（字符串，如 "changsha-anjia"）
     */
    @TableId(type = IdType.INPUT)
    private String id;
    
    /**
     * 驾校名称
     */
    private String name;
    
    /**
     * 名称拼音（用于排序/搜索）
     */
    private String namePinyin;
    
    /**
     * 综合评分（0.0-5.0）
     */
    private Double rating;
    
    /**
     * 评价总数
     */
    private Integer reviewCount;
    
    /**
     * 通过率（百分比，如 85.5）
     */
    private Double passRate;
    
    /**
     * 标签（JSON 数组，如 ["大型驾校","设施完善"]）
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private String tags;
    
    /**
     * 开设课程（JSON 数组，如 ["C1","C2","A1"]）
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private String courses;
    
    /**
     * 地址
     */
    private String address;
    
    /**
     * 联系电话
     */
    private String phone;
    
    /**
     * 营业时间
     */
    private String businessHours;
    
    /**
     * 学车费用范围
     */
    private String priceRange;
    
    /**
     * 考试数据（JSON 对象，包含各科通过率等）
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private String examData;
    
    /**
     * 驾校简介
     */
    @TableField(typeHandler = org.apache.ibatis.type.JdbcType.class)
    private String description;
    
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
     * 是否激活（逻辑删除标志）
     */
    @TableLogic
    private Integer isActive;
}
