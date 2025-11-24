package com.xiangtan.jiaxiao;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 启动类
 * 重要：该类必须放在基础包（com.xiangtan.jiaxiao）根目录下
 * @SpringBootApplication 会自动扫描当前包及所有子包下的组件
 */
@SpringBootApplication
@MapperScan("com.xiangtan.jiaxiao.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
