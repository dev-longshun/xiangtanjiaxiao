package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器（公开接口）
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "认证接口", description = "用户登录相关接口")
public class AuthController {

    private final UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "返回 JWT Token")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "用户名或密码错误"));
        }

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    /**
     * 登录请求 DTO
     */
    @Data
    static class LoginRequest {
        private String username;
        private String password;
    }
}
