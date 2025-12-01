package com.xiangtan.jiaxiao.service.impl;

import com.xiangtan.jiaxiao.mapper.UserMapper;
import com.xiangtan.jiaxiao.model.entity.User;
import com.xiangtan.jiaxiao.service.UserService;
import com.xiangtan.jiaxiao.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 用户服务实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /** 管理员登录（用户名+密码） */
    @Override
    public String adminLogin(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            return null;
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return null;
        }
        return jwtUtil.generateToken(user.getUsername() != null ? user.getUsername() : user.getNickname(),
                user.getId(),
                user.getRoles());
    }

    /** 微信登录（openid 等信息） */
    @Override
    public String wechatLogin(String openid, String nickname, String avatar, String unionid) {
        User user = userMapper.selectByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setUnionid(unionid);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            user.setRoles("ROLE_USER");
            user.setIsActive(1);
            userMapper.insert(user);
        } else {
            user.setNickname(nickname);
            user.setAvatar(avatar);
            userMapper.updateById(user);
        }
        return jwtUtil.generateToken(user.getNickname(), user.getId(), user.getRoles());
    }

    /** 根据用户名查询（管理员） */
    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    /** 根据 openid 查询（微信用户） */
    @Override
    public User getUserByOpenid(String openid) {
        return userMapper.selectByOpenid(openid);
    }

    /** 创建用户（管理员或初始化） */
    @Override
    public void createUser(User user) {
        if (user.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        userMapper.insert(user);
    }
}
