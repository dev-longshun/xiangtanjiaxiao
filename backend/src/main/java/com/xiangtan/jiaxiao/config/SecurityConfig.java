package com.xiangtan.jiaxiao.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security 配置
 * 配置 JWT 认证、跨域、权限控制
 * 
 * 角色说明：
 * - ROLE_USER: 普通用户，可以投稿评价
 * - ROLE_ADMIN: 管理员，可以审核评价、管理驾校
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

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
                
                // 添加 JWT 认证过滤器（在 UsernamePasswordAuthenticationFilter 之前）
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                
                // 异常处理
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)  // 未登录 -> 401
                        .accessDeniedHandler(accessDeniedHandler)            // 权限不足 -> 403
                )
                
                // 权限配置
                .authorizeHttpRequests(auth -> auth
                        // 1. 公开接口（无需认证）
                        .requestMatchers(
                                "/api/auth/**",                    // 登录、注册
                                "/api/schools",                    // 驾校列表
                                "/api/schools/*",                  // 驾校详情
                                "/api/schools/search",             // 驾校搜索
                                "/api/reviews/school/*",           // 查看某驾校的评价
                                "/api/users/search",               // 按昵称搜索用户（公开）
                                "/swagger-ui/**",                  // Swagger UI
                                "/v3/api-docs/**",                 // OpenAPI 文档
                                "/swagger-ui.html"
                        ).permitAll()
                        
                        // 2. 用户接口（需要 USER 或 ADMIN 角色）
                        .requestMatchers(
                                "/api/reviews",                    // 投稿评价（POST）
                                "/api/reviews/my"                  // 查看我的投稿
                        ).hasAnyRole("USER", "ADMIN")
                        
                        // 3. 管理接口（仅 ADMIN）
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // 4. 其他请求默认拒绝（或改为 permitAll）
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
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",           // Vite 开发服务器
                "http://localhost:3000",           // React 开发服务器
                "http://localhost:7070",           // 本地后端
                "https://xiangtanjiaxiao.vercel.app"  // 生产环境前端
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));  // 允许前端读取 Authorization header
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
