package com.xiangtan.jiaxiao.model.common;

import lombok.Data;

/**
 * 统一响应结果封装
 */
@Data
public class Result<T> {
    
    /** 响应码（200=成功，其他=失败） */
    private Integer code;
    
    /** 响应数据 */
    private T data;
    
    /** 响应消息 */
    private String message;
    
    // 私有构造器
    private Result(Integer code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
    
    /**
     * 成功响应（有数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, data, "操作成功");
    }
    
    /**
     * 成功响应（有数据和自定义消息）
     */
    public static <T> Result<T> success(T data, String message) {
        return new Result<>(200, data, message);
    }
    
    /**
     * 成功响应（仅消息，无数据）
     */
    public static <T> Result<T> success(String message) {
        return new Result<>(200, null, message);
    }
    
    /**
     * 失败响应
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, null, message);
    }
    
    /**
     * 失败响应（默认 500）
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(500, null, message);
    }
    
    /**
     * 未授权（401）
     */
    public static <T> Result<T> unauthorized(String message) {
        return new Result<>(401, null, message);
    }
    
    /**
     * 无权限（403）
     */
    public static <T> Result<T> forbidden(String message) {
        return new Result<>(403, null, message);
    }
    
    /**
     * 未找到（404）
     */
    public static <T> Result<T> notFound(String message) {
        return new Result<>(404, null, message);
    }
}
