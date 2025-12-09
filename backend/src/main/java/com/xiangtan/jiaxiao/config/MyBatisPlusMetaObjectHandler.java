package com.xiangtan.jiaxiao.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * MyBatis-Plus 元数据自动填充处理器
 * 自动为 createdAt、updatedAt 字段填充时间戳
 */
@Component
@Slf4j
public class MyBatisPlusMetaObjectHandler implements MetaObjectHandler {

    /**
     * 插入时自动填充 createdAt、updatedAt
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        log.debug("自动填充 createdAt 和 updatedAt");
        this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }

    /**
     * 更新时自动填充 updatedAt
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.debug("自动填充 updatedAt");
        this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }
}
