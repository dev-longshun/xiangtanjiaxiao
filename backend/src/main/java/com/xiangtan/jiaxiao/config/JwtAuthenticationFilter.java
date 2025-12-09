package com.xiangtan.jiaxiao.config;

import com.xiangtan.jiaxiao.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT 认证过滤器
 * 拦截所有请求，从 Header 中提取并验证 JWT Token
 * 
 * 处理流程：
 * 1. 从 Authorization 头中提取 Token
 * 2. 检查 Token 是否在黑名单中（已退出登录）
 * 3. 验证 Token 签名和有效期
 * 4. 解析用户信息和角色
 * 5. 将认证信息放入 SecurityContext
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final TokenBlacklistManager blacklistManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. 从 Header 中提取 Token
        String token = extractToken(request);
        
        // 2. 验证 Token 签名和有效期
        if (token != null && jwtUtil.validateToken(token)) {
            // 3. 检查 Token 是否在黑名单中（已退出登录）
            if (blacklistManager.isBlacklisted(token)) {
                logger.debug("拒绝已黑名单中的 Token（用户已退出登录）");
            } else {
                try {
                    // 4. 解析用户信息
                    String username = jwtUtil.getUsernameFromToken(token);
                    String roles = jwtUtil.getRolesFromToken(token);
                    
                    // 5. 转换角色为 GrantedAuthority
                    List<SimpleGrantedAuthority> authorities = parseRoles(roles);
                    
                    // 6. 创建认证对象
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 7. 将认证信息放入 Security 上下文
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                } catch (Exception e) {
                    logger.error("JWT 认证失败: " + e.getMessage());
                }
            }
        }
        
        // 8. 继续过滤链
        filterChain.doFilter(request, response);
    }

    /**
     * 从请求头中提取 JWT Token
     * 格式：Authorization: Bearer <token>
     */
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // 去掉 "Bearer " 前缀
        }
        return null;
    }

    /**
     * 解析角色字符串为 GrantedAuthority 列表
     * 支持单角色（ROLE_ADMIN）或多角色（ROLE_ADMIN,ROLE_USER）
     */
    private List<SimpleGrantedAuthority> parseRoles(String roles) {
        if (roles == null || roles.trim().isEmpty()) {
            return Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")); // 默认普通用户
        }
        
        return Arrays.stream(roles.split(","))
                .map(String::trim)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
