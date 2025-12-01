package com.xiangtan.jiaxiao.service;

import com.xiangtan.jiaxiao.model.entity.User;

/**
 * 用户服务接口
 * 约束管理员登录与微信登录相关的核心能力
 */
public interface UserService {

    /** 管理员登录（用户名+密码） */
    String adminLogin(String username, String password);

    /** 微信登录（openid 等信息） */
    String wechatLogin(String openid, String nickname, String avatar, String unionid);

    /** 根据用户名查询（管理员） */
    User getUserByUsername(String username);

    /** 根据 openid 查询（微信用户） */
    User getUserByOpenid(String openid);

    /** 创建用户（管理员或初始化） */
    void createUser(User user);
}
