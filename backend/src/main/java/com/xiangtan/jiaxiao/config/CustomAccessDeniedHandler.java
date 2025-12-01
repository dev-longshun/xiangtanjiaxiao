package com.xiangtan.jiaxiao.config;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 自定义权限不足处理器
 * 当用户已登录但权限不足时，返回 JSON 格式的 403 错误
 */
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final Gson gson = new Gson();

    @Override
    public void handle(HttpServletRequest request, 
                      HttpServletResponse response,
                      AccessDeniedException accessDeniedException) throws IOException, ServletException {
        
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        response.setContentType("application/json;charset=UTF-8");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "权限不足");
        errorResponse.put("message", "您没有访问此资源的权限");
        errorResponse.put("status", 403);
        errorResponse.put("path", request.getRequestURI());
        
        response.getWriter().write(gson.toJson(errorResponse));
    }
}
