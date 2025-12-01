package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.service.UserService;
import com.xiangtan.jiaxiao.service.WeChatService;
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
@Tag(name = "认证接口", description = "微信登录与管理员登录")
public class AuthController {

    private final UserService userService;
    private final WeChatService weChatService;

    /**
     * 微信网页登录（扫码或微信浏览器内授权）
     * 
     * 前端流程：
     * 1. 用户点击"微信登录"按钮
     * 2. 跳转到微信授权页面：
     *    https://open.weixin.qq.com/connect/qrconnect?appid=YOUR_APPID&redirect_uri=YOUR_CALLBACK&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
     * 3. 用户扫码/授权后，微信重定向到 redirect_uri，携带 code 参数
     * 4. 前端从 URL 获取 code，调用此接口
     */
    @PostMapping("/wechat/login")
    @Operation(summary = "微信网页登录", description = "通过微信授权码登录（扫码或浏览器内授权），返回 JWT Token 和用户信息")
    public Result<?> wechatLogin(@RequestBody WeChatLoginRequest request) {
        // 1. 通过 code 换取用户信息
        WeChatService.WeChatUserInfo weChatUserInfo = weChatService.getUserInfoByCode(request.getCode());
        
        if (weChatUserInfo == null || weChatUserInfo.getOpenid() == null) {
            return Result.unauthorized("微信授权失败，请重试");
        }

        // 2. 使用 openid 登录或注册（微信 API 已返回用户信息，直接使用）
        String token = userService.wechatLogin(
            weChatUserInfo.getOpenid(),
            weChatUserInfo.getNickname(),
            weChatUserInfo.getAvatar(),
            weChatUserInfo.getUnionid()
        );

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userInfo", Map.of(
            "nickname", weChatUserInfo.getNickname(),
            "avatar", weChatUserInfo.getAvatar()
        ));
        return Result.success(data, "登录成功");
    }

    /**
     * 管理员登录（用户名密码）
     */
    @PostMapping("/admin/login")
    @Operation(summary = "管理员登录", description = "用户名密码登录，返回 JWT Token")
    public Result<?> adminLogin(@RequestBody AdminLoginRequest request) {
        String token = userService.adminLogin(request.getUsername(), request.getPassword());
        
        if (token == null) {
            return Result.unauthorized("用户名或密码错误");
        }

        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        return Result.success(data, "登录成功");
    }

    /**
     * 微信登录请求 DTO
     */
    @Data
    static class WeChatLoginRequest {
        private String code;      // 微信授权码（从回调 URL 参数中获取）
    }

    /**
     * 管理员登录请求 DTO
     */
    @Data
    static class AdminLoginRequest {
        private String username;
        private String password;
    }
}
