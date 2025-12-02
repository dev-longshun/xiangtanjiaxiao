package com.xiangtan.jiaxiao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiangtan.jiaxiao.model.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 用户 Mapper 接口
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 根据用户名查询用户
     */
    User selectByUsername(@Param("username") String username);
}
