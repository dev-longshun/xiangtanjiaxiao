package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件上传控制器
 */
@Tag(name = "文件上传", description = "文件上传相关接口")
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {
    
    private final FileUploadService fileUploadService;
    
    /**
     * 上传图片
     */
    @Operation(summary = "上传图片", description = "用于上传评论事实证明图片，单张最大 5MB，支持 jpg/jpeg/png/gif/webp/bmp 格式")
    @PostMapping("/image")
    public Result<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return fileUploadService.uploadImage(file);
    }
}
