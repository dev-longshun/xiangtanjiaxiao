package com.xiangtan.jiaxiao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security 配置
 * 配置 JWT 认证、跨域、权限控制
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 密码编码器（BCrypt）
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Security 过滤链配置
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF（使用 JWT 不需要）
                .csrf(csrf -> csrf.disable())
                
                // CORS 配置
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // 会话管理（无状态，使用 JWT）
                .sessionManagement(session -> 
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // 权限配置
                .authorizeHttpRequests(auth -> auth
                        // 公开接口（无需认证）
                        .requestMatchers(
                                "/api/auth/**",           // 登录接口
                                "/api/schools/**",        // 驾校列表/详情
                                "/api/reviews",           // 投稿（公开）
                                "/api/data/**",           // 统计数据
                                "/swagger-ui/**",         // Swagger UI
                                "/v3/api-docs/**",        // OpenAPI 文档
                                "/swagger-ui.html"
                        ).permitAll()
                        
                        // 管理接口（需要 ADMIN 权限）
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // 其他请求需要认证
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    /**
     * CORS 配置（允许前端跨域访问）
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));  // 前端地址
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
