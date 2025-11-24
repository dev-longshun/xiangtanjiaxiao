package com.xiangtan.jiaxiao.service;

import com.xiangtan.jiaxiao.mapper.UserMapper;
import com.xiangtan.jiaxiao.model.entity.User;
import com.xiangtan.jiaxiao.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 用户服务
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * 用户登录验证
     * @param username 用户名
     * @param password 明文密码
     * @return JWT Token（失败返回 null）
     */
    public String login(String username, String password) {
        // 查询用户
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            return null;
        }

        // 验证密码
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return null;
        }

        // 生成 JWT Token
        return jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRoles());
    }

    /**
     * 根据用户名查询用户
     */
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    /**
     * 创建用户
     */
    public void createUser(User user) {
        // 密码加密
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        userMapper.insert(user);
    }
}
