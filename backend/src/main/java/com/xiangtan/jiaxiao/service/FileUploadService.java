package com.xiangtan.jiaxiao.service;

import com.xiangtan.jiaxiao.model.common.Result;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传服务接口
 */
public interface FileUploadService {
    
    /**
     * 上传图片
     * 
     * @param file 图片文件
     * @return 图片访问 URL
     */
    Result<String> uploadImage(MultipartFile file);
}
