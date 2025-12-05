package com.xiangtan.jiaxiao.bootstrap;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.boot.web.context.WebServerApplicationContext;

/**
 * 启动日志输出组件
 * 在应用启动成功后，输出常用后端访问 URL，便于联调与测试。
 */
@Component
@Order(99)
@RequiredArgsConstructor
@Slf4j
public class StartupLogger implements CommandLineRunner {

    private final WebServerApplicationContext serverApplicationContext;

    @Override
    public void run(String... args) throws Exception {
        int port = serverApplicationContext.getWebServer().getPort();
        String base = "http://localhost:" + port;

        log.info("========================================");
        log.info("后端服务已启动");
        log.info("Base URL: {}", base);
        log.info("Swagger UI: {}/swagger-ui.html", base);
        log.info("OpenAPI JSON: {}/v3/api-docs", base);
        log.info("健康检查: {}/actuator/health (如已开启)", base);
        log.info("========================================");
    }
}
