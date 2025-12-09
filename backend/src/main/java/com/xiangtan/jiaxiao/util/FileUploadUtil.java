package com.xiangtan.jiaxiao.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.UUID;

/**
 * 文件上传工具类
 */
@Slf4j
public class FileUploadUtil {
    
    /**
     * 保存上传的文件
     * 
     * @param file 上传的文件
     * @param basePath 基础路径（如 uploads）
     * @param subPath 子路径（如 reviews）
     * @param allowedExtensions 允许的文件扩展名
     * @param maxFileSize 最大文件大小（字节）
     * @return 相对路径（如 reviews/202511/abc123.jpg）
     */
    public static String saveFile(MultipartFile file, String basePath, String subPath, 
                                   String[] allowedExtensions, Long maxFileSize) throws IOException {
        // 1. 校验文件
        validateFile(file, allowedExtensions, maxFileSize);
        
        // 2. 生成文件名（年月/UUID.扩展名）
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String monthFolder = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        String filename = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        
        // 3. 构建保存路径
        Path uploadDir = Paths.get(basePath, subPath, monthFolder);
        Files.createDirectories(uploadDir);
        
        // 4. 保存文件
        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath.toFile());
        
        // 5. 返回相对路径（用于存储到数据库和生成访问 URL）
        String relativePath = subPath + "/" + monthFolder + "/" + filename;
        log.info("文件上传成功: {}", relativePath);
        return relativePath;
    }
    
    /**
     * 校验文件
     */
    private static void validateFile(MultipartFile file, String[] allowedExtensions, Long maxFileSize) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }
        
        // 校验文件大小
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("文件大小超过限制（最大 " + (maxFileSize / 1024 / 1024) + "MB）");
        }
        
        // 校验文件格式
        String extension = getFileExtension(file.getOriginalFilename());
        if (extension == null || !Arrays.asList(allowedExtensions).contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("不支持的文件格式，仅支持: " + String.join(", ", allowedExtensions));
        }
    }
    
    /**
     * 获取文件扩展名
     */
    private static String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return null;
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
    
    /**
     * 删除文件
     */
    public static boolean deleteFile(String relativePath, String basePath) {
        try {
            Path filePath = Paths.get(basePath, relativePath);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("删除文件失败: {}", relativePath, e);
            return false;
        }
    }
}
