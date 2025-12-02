package com.xiangtan.jiaxiao.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xiangtan.jiaxiao.mapper.UserMapper;
import com.xiangtan.jiaxiao.model.entity.User;
import com.xiangtan.jiaxiao.service.UserService;
import com.xiangtan.jiaxiao.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private static final int INITIAL_USER_ID = 10001; // 起始用户ID

    /** 用户注册（昵称+密码，系统生成用户名） */
    @Override
    public Map<String, Object> register(String nickname, String password) {
        // 1. 校验参数
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new IllegalArgumentException("昵称不能为空");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("密码长度不能少于6位");
        }
        if (nickname.length() > 50) {
            throw new IllegalArgumentException("昵称长度不能超过50个字符");
        }

        // 2. 生成用户名（数字ID）
        String username = generateUsername();

        // 3. 创建用户
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setNickname(nickname.trim());
        user.setRoles("ROLE_USER");
        user.setIsActive(1);

        userMapper.insert(user);
        log.info("用户注册成功: username={}, nickname={}", username, nickname);

        // 4. 生成 Token
        String token = jwtUtil.generateToken(username, user.getId(), user.getRoles());

        // 5. 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("username", username);
        result.put("nickname", nickname);
        result.put("token", token);
        return result;
    }

    /** 生成用户名（数字ID，从 10001 开始递增） */
    private String generateUsername() {
        // 查询当前最大的数字ID
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("MAX(CAST(username AS UNSIGNED)) as max_id")
                .eq("roles", "ROLE_USER");
        
        User maxUser = userMapper.selectOne(queryWrapper);
        Long maxId = maxUser != null && maxUser.getUsername() != null 
                ? Long.parseLong(maxUser.getUsername()) 
                : (long) (INITIAL_USER_ID - 1);

        return String.valueOf(maxId + 1);
    }

    /** 用户登录（用户名+密码） */
    @Override
    public String login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            log.warn("用户登录失败: 用户不存在, username={}", username);
            return null;
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            log.warn("用户登录失败: 密码错误, username={}", username);
            return null;
        }
        log.info("用户登录成功: username={}, nickname={}", username, user.getNickname());
        return jwtUtil.generateToken(username, user.getId(), user.getRoles());
    }

    /** 管理员登录（用户名+密码） */
    @Override
    public String adminLogin(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            log.warn("管理员登录失败: 用户不存在, username={}", username);
            return null;
        }
        if (!user.getRoles().contains("ROLE_ADMIN")) {
            log.warn("管理员登录失败: 非管理员账号, username={}", username);
            return null;
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            log.warn("管理员登录失败: 密码错误, username={}", username);
            return null;
        }
        log.info("管理员登录成功: username={}", username);
        return jwtUtil.generateToken(username, user.getId(), user.getRoles());
    }

    /** 根据用户名查询 */
    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    /** 创建用户（管理员或初始化） */
    @Override
    public void createUser(User user) {
        if (user.getPasswordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        userMapper.insert(user);
        log.info("用户创建成功: username={}", user.getUsername());
    }
}
