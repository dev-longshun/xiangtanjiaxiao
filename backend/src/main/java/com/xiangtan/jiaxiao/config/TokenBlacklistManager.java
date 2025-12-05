package com.xiangtan.jiaxiao.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Token 黑名单管理器
 * 用于实现退出登录功能：将要失效的 Token 加入黑名单
 * 
 * 设计思路：
 * 1. 用户调用退出登录接口时，将 Token 加入黑名单
 * 2. 过期的 Token 自动从黑名单中移除（节省内存）
 * 3. 请求时检查 Token 是否在黑名单中
 * 
 * 注意事项：
 * - 本实现使用内存存储，适合单机部署
 * - 如果是分布式部署，建议使用 Redis 作为黑名单存储
 */
@Slf4j
@Component
public class TokenBlacklistManager {

    // Token 黑名单存储：key = token, value = 过期时间（毫秒）
    private final ConcurrentHashMap<String, Long> blacklist = new ConcurrentHashMap<>();

    // 定时清理任务执行器
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public TokenBlacklistManager() {
        // 启动后台线程：每5分钟清理一次过期的黑名单记录
        scheduler.scheduleAtFixedRate(this::cleanupExpiredTokens, 5, 5, TimeUnit.MINUTES);
    }

    /**
     * 将 Token 加入黑名单
     * @param token JWT Token
     * @param expiryTime Token 过期时间（毫秒戳）
     */
    public void addToBlacklist(String token, long expiryTime) {
        blacklist.put(token, expiryTime);
        log.info("Token 已加入黑名单，将在 {} 毫秒后自动清理", expiryTime - System.currentTimeMillis());
    }

    /**
     * 检查 Token 是否在黑名单中
     * @param token JWT Token
     * @return true = 在黑名单中（已失效），false = 未在黑名单中（仍有效）
     */
    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    /**
     * 清理已过期的黑名单记录（定时任务）
     * 防止黑名单无限增长，占用内存
     */
    private void cleanupExpiredTokens() {
        long now = System.currentTimeMillis();
        int removedCount = 0;

        for (String token : blacklist.keySet()) {
            Long expiryTime = blacklist.get(token);
            // 如果 Token 已过期，从黑名单中移除
            if (expiryTime != null && expiryTime <= now) {
                blacklist.remove(token);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            log.debug("清理过期黑名单记录: 删除 {} 个 Token", removedCount);
            log.debug("当前黑名单大小: {} 个 Token", blacklist.size());
        }
    }

    /**
     * 获取黑名单大小（仅用于监控）
     */
    public int getBlacklistSize() {
        return blacklist.size();
    }

    /**
     * 清空所有黑名单（仅用于测试环境）
     */
    public void clearBlacklist() {
        blacklist.clear();
        log.warn("黑名单已清空（仅在测试环境中使用）");
    }
}
