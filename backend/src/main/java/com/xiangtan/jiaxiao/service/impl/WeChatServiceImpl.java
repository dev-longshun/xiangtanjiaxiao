package com.xiangtan.jiaxiao.service.impl;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.xiangtan.jiaxiao.service.WeChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * 微信服务实现
 * 处理微信网页授权登录（扫码登录或微信浏览器内授权）
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WeChatServiceImpl implements WeChatService {

    @Value("${wechat.appid:}")
    private String appid;

    @Value("${wechat.secret:}")
    private String secret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Gson gson = new Gson();

    /**
     * 使用微信网页授权码换取 access_token 和用户信息
     * 
     * 流程：
     * 1. 前端跳转到微信授权页面（扫码或微信内授权）
     * 2. 用户授权后，微信回调到前端页面，携带 code
     * 3. 前端将 code 发送到后端
     * 4. 后端通过 code 换取 access_token
     * 5. 使用 access_token 获取用户信息
     * 
     * @param code 微信授权码（前端从 URL 参数中获取）
     * @return WeChatUserInfo（包含 openid, unionid, nickname, avatar）
     */
    @Override
    public WeChatUserInfo getUserInfoByCode(String code) {
        // 第一步：通过 code 换取 access_token
        String tokenUrl = String.format(
            "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code",
            appid, secret, code
        );

        try {
            String tokenResponse = restTemplate.getForObject(tokenUrl, String.class);
            JsonObject tokenJson = gson.fromJson(tokenResponse, JsonObject.class);

            if (tokenJson.has("errcode")) {
                int errcode = tokenJson.get("errcode").getAsInt();
                String errmsg = tokenJson.get("errmsg").getAsString();
                log.error("获取微信 access_token 失败: errcode={}, errmsg={}", errcode, errmsg);
                return null;
            }

            String accessToken = tokenJson.get("access_token").getAsString();
            String openid = tokenJson.get("openid").getAsString();
            String unionid = tokenJson.has("unionid") ? tokenJson.get("unionid").getAsString() : null;

            // 第二步：通过 access_token 获取用户信息
            String userInfoUrl = String.format(
                "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN",
                accessToken, openid
            );

            String userInfoResponse = restTemplate.getForObject(userInfoUrl, String.class);
            JsonObject userInfoJson = gson.fromJson(userInfoResponse, JsonObject.class);

            if (userInfoJson.has("errcode")) {
                int errcode = userInfoJson.get("errcode").getAsInt();
                String errmsg = userInfoJson.get("errmsg").getAsString();
                log.error("获取微信用户信息失败: errcode={}, errmsg={}", errcode, errmsg);
                return null;
            }

            // 封装用户信息
            WeChatUserInfo userInfo = new WeChatUserInfo();
            userInfo.setOpenid(openid);
            userInfo.setUnionid(unionid);
            userInfo.setNickname(userInfoJson.get("nickname").getAsString());
            userInfo.setAvatar(userInfoJson.get("headimgurl").getAsString());
            
            return userInfo;

        } catch (Exception e) {
            log.error("调用微信 API 失败: {}", e.getMessage(), e);
            return null;
        }
    }
}
