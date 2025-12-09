package com.xiangtan.jiaxiao.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger UI 配置
 * 访问地址：http://localhost:7070/swagger-ui.html
 * 
 * JWT Token 使用方法：
 * 1. 调用登录接口获取 Token
 * 2. 点击右上角 "Authorize" 按钮
 * 3. 在弹窗中输入 Token（无需加 "Bearer " 前缀，系统会自动添加）
 * 4. 点击 "Authorize" 确认
 * 5. 之后所有请求会自动携带 Authorization: Bearer {token} 请求头
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        // 定义安全方案名称
        String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("湘潭驾校评价 API")
                        .version("1.2")
                        .description("后端 RESTful API 文档（Swagger UI）\n\n" +
                                "**认证说明**：\n" +
                                "- 公开接口（如注册、登录、驾校列表）无需 Token\n" +
                                "- 用户接口（如提交评论、上传图片）需要 ROLE_USER 或 ROLE_ADMIN 权限\n" +
                                "- 管理接口（如审核评论、管理驾校）需要 ROLE_ADMIN 权限\n\n" +
                                "**Token 配置步骤**：\n" +
                                "1. 调用 `/api/auth/login` 或 `/api/auth/admin/login` 获取 Token\n" +
                                "2. 点击页面右上角的 **Authorize** 🔓 按钮\n" +
                                "3. 在弹窗的 Value 输入框中粘贴 Token（无需加 'Bearer ' 前缀）\n" +
                                "4. 点击 **Authorize** 按钮确认\n" +
                                "5. 关闭弹窗后，所有接口请求会自动携带认证头")
                        .contact(new Contact()
                                .name("开发团队")
                                .email("xiangtan-jiaxiao@qq.com")))
                // 添加 JWT 认证组件
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("请输入 JWT Token（无需加 'Bearer ' 前缀）")))
                // 全局应用安全要求（所有接口默认显示锁图标）
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
    }
}
