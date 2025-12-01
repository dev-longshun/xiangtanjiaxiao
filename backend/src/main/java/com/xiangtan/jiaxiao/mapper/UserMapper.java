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
     * 根据用户名查询用户（用于管理员登录）
     */
    User selectByUsername(@Param("username") String username);
    
    /**
     * 根据微信 OpenID 查询用户（用于微信登录）
     */
    User selectByOpenid(@Param("openid") String openid);
}
