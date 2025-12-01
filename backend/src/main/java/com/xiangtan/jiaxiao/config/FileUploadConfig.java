package com.xiangtan.jiaxiao.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 文件上传配置
 */
@Configuration
@ConfigurationProperties(prefix = "file.upload")
@Data
public class FileUploadConfig {
    
    /** 上传根目录（默认：项目下 uploads/） */
    private String basePath = "uploads";
    
    /** 评价图片子目录 */
    private String reviewImagePath = "reviews";
    
    /** 单张图片最大大小（字节，默认 5MB） */
    private Long maxFileSize = 5 * 1024 * 1024L;
    
    /** 单次上传最大图片数量 */
    private Integer maxFileCount = 9;
    
    /** 允许的图片格式 */
    private String[] allowedExtensions = {"jpg", "jpeg", "png", "gif", "webp", "bmp"};
    
    /** 访问 URL 前缀（如 http://localhost:7070/uploads/） */
    private String urlPrefix = "/uploads/";
}
