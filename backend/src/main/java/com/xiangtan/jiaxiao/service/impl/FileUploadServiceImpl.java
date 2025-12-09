package com.xiangtan.jiaxiao.service.impl;

import com.xiangtan.jiaxiao.config.FileUploadConfig;
import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.service.FileUploadService;
import com.xiangtan.jiaxiao.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {
    
    private final FileUploadConfig fileUploadConfig;
    
    @Override
    public Result<String> uploadImage(MultipartFile file) {
        try {
            // 1. 调用工具类保存文件
            String relativePath = FileUploadUtil.saveFile(
                file,
                fileUploadConfig.getBasePath(),
                fileUploadConfig.getReviewImagePath(),
                fileUploadConfig.getAllowedExtensions(),
                fileUploadConfig.getMaxFileSize()
            );
            
            // 2. 生成访问 URL
            String imageUrl = fileUploadConfig.getUrlPrefix() + "/" + relativePath;
            
            log.info("图片上传成功: {}", imageUrl);
            return Result.success(imageUrl);
            
        } catch (IllegalArgumentException e) {
            log.warn("图片上传失败: {}", e.getMessage());
            return Result.error(400, e.getMessage());
            
        } catch (Exception e) {
            log.error("图片上传异常", e);
            return Result.error(500, "图片上传失败，请稍后重试");
        }
    }
}
