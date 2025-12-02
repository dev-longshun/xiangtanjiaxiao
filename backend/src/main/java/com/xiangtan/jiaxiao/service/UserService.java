package com.xiangtan.jiaxiao.service;

import com.xiangtan.jiaxiao.model.entity.User;
import java.util.Map;

/**
 * 用户服务接口
 */
public interface UserService {

    /** 用户注册（昵称+密码，系统生成用户名） */
    Map<String, Object> register(String nickname, String password);

    /** 用户登录（用户名+密码） */
    String login(String username, String password);

    /** 管理员登录（用户名+密码） */
    String adminLogin(String username, String password);

    /** 根据用户名查询 */
    User getUserByUsername(String username);

    /** 创建用户（管理员或初始化） */
    void createUser(User user);
}
