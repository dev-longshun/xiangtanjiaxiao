package com.xiangtan.jiaxiao.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger UI 配置
 * 访问地址：http://localhost:8080/swagger-ui.html
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("湘潭驾校评价 API")
                        .version("1.0")
                        .description("后端 RESTful API 文档（Swagger UI）")
                        .contact(new Contact()
                                .name("开发团队")
                                .email("xiangtan-jiaxiao@qq.com")));
    }
}
