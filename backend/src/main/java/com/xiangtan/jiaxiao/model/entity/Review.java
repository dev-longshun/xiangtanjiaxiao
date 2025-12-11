package com.xiangtan.jiaxiao.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 评价实体（对应 reviews 表）
 */
@Data
@TableName("reviews")
public class Review {
    
    /**
     * 主键ID（自增）
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 关联驾校ID（外键）
     */
    private String schoolId;
    
    /**
     * 评价者昵称
     */
    private String author;
    
    /**
     * 评价内容
     */
    private String content;
    
    /**
     * 评分（1-5）
     */
    private Integer rating;
    
    /**
     * 事实证明图片（JSON 数组，存储图片 URL 列表）
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private java.util.List<String> evidenceImages;
    
    /**
     * 评价时间
     */
    private LocalDateTime reviewDate;
    
    /**
     * 审核状态（PENDING=待审核, APPROVED=已通过, REJECTED=已拒绝）
     */
    private String status;
    
    /**
     * 驳回原因（status=REJECTED 时填写）
     */
    private String rejectReason;
    
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
