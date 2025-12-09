package com.xiangtan.jiaxiao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiangtan.jiaxiao.model.entity.School;
import org.apache.ibatis.annotations.Mapper;

/**
 * 驾校 Mapper 接口
 */
@Mapper
public interface SchoolMapper extends BaseMapper<School> {
    
    /**
     * MyBatis-Plus BaseMapper 已提供常用方法：
     * - selectById(id)
     * - selectList(queryWrapper)
     * - insert(entity)
     * - updateById(entity)
     * - deleteById(id)
     */
}
