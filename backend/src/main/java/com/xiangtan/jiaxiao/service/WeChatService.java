package com.xiangtan.jiaxiao.service;

/**
 * 微信服务接口
 * 处理微信网页授权登录
 */
public interface WeChatService {

    /**
     * 使用微信网页授权码换取用户信息
     * @param code 微信授权码
     * @return 微信用户信息（包含 openid, unionid, nickname, avatar）
     */
    WeChatUserInfo getUserInfoByCode(String code);

    /**
     * 微信用户信息 DTO
     */
    class WeChatUserInfo {
        private String openid;
        private String unionid;
        private String nickname;
        private String avatar;

        public String getOpenid() { return openid; }
        public void setOpenid(String openid) { this.openid = openid; }

        public String getUnionid() { return unionid; }
        public void setUnionid(String unionid) { this.unionid = unionid; }

        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
    }
}
