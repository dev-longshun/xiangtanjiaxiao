package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器（公开接口）
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "认证接口", description = "用户注册与登录")
public class AuthController {

    private final UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "通过昵称和密码注册，系统自动生成用户名（数字ID）")
    public Result<?> register(@RequestBody RegisterRequest request) {
        try {
            Map<String, Object> result = userService.register(request.getNickname(), request.getPassword());
            return Result.success(result, "注册成功");
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "通过用户名（系统生成的数字ID）或唯一昵称和密码登录")
    public Result<?> login(@RequestBody LoginRequest request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        
        if (token == null) {
            return Result.error(401, "用户名或密码错误");
        }

        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        return Result.success(data, "登录成功");
    }

    /**
     * 管理员登录（用户名密码）
     */
    @PostMapping("/admin/login")
    @Operation(summary = "管理员登录", description = "用户名密码登录，返回 JWT Token")
    public Result<?> adminLogin(@RequestBody LoginRequest request) {
        String token = userService.adminLogin(request.getUsername(), request.getPassword());
        
        if (token == null) {
            return Result.error(401, "用户名或密码错误");
        }

        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        return Result.success(data, "登录成功");
    }

    /**
     * 注册请求 DTO
     */
    @Data
    static class RegisterRequest {
        private String nickname;   // 昵称（必填）
        private String password;   // 密码（必填）
    }

    /**
     * 登录请求 DTO
     */
    @Data
    static class LoginRequest {
        private String username;   // 用户名（系统生成的数字ID）
        private String password;   // 密码
    }
}
