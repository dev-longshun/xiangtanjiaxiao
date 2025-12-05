package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.config.TokenBlacklistManager;
import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.service.UserService;
import com.xiangtan.jiaxiao.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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
@Tag(name = "认证接口", description = "用户注册、登录与退出登录")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistManager blacklistManager;

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
     * 用户退出登录
     * 
     * 说明：
     * 1. 前端调用此接口时，在请求头中必须携带有效的 JWT Token
     * 2. 后端将该 Token 加入黑名单
     * 3. Token 在黑名单中的时间 = Token 原有效期
     * 4. 黑名单会定期清理过期的 Token（每5分钟）
     * 5. 前端收到响应后，应立即删除本地存储的 Token 并跳转到登录页
     */
    @PostMapping("/logout")
    @SecurityRequirement(name = "bearerAuth")  // 标记为需要认证的接口
    @Operation(summary = "用户退出登录", description = "退出登录，将 Token 加入黑名单")
    public Result<?> logout(HttpServletRequest request) {
        // 1. 从请求头中提取 Token
        String token = extractToken(request);
        
        if (token == null) {
            return Result.error(401, "未找到有效的 Token");
        }

        try {
            // 2. 验证 Token 是否有效
            if (!jwtUtil.validateToken(token)) {
                return Result.error(401, "Token 无效或已过期");
            }

            // 3. 获取 Token 的过期时间
            long expiryTime = jwtUtil.getExpiryTimeFromToken(token);
            
            // 4. 将 Token 加入黑名单
            blacklistManager.addToBlacklist(token, expiryTime);
            
            // 5. 获取用户名用于日志记录
            String username = jwtUtil.getUsernameFromToken(token);
            
            return Result.success(null, "退出登录成功");
        } catch (Exception e) {
            return Result.error(500, "退出登录失败: " + e.getMessage());
        }
    }

    /**
     * 从请求头中提取 JWT Token
     * 格式：Authorization: Bearer <token>
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
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
