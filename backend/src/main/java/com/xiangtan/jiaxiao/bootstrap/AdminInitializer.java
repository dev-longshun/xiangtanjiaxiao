package com.xiangtan.jiaxiao.bootstrap;

import com.xiangtan.jiaxiao.model.entity.User;
import com.xiangtan.jiaxiao.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 初始化管理员账户
 * 首次启动时自动创建 admin 账户（用户名：admin，密码：123456）
 * 
 * 警告：生产环境必须立即修改默认密码！
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // 检查 admin 是否已存在
        User existingAdmin = userService.getUserByUsername("admin");
        if (existingAdmin != null) {
            log.info("管理员账户已存在，跳过初始化");
            return;
        }

        // 创建默认管理员
        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash("123456");  // 将被 Service 层 BCrypt 加密
        admin.setNickname("系统管理员");
        admin.setRoles("ROLE_ADMIN");
        admin.setEmail("admin@xiangtan-jiaxiao.com");
        admin.setIsActive(1);

        userService.createUser(admin);
        log.warn("========================================");
        log.warn("初始管理员账户已创建");
        log.warn("用户名：admin");
        log.warn("密码：123456");
        log.warn("【警告】生产环境必须立即修改默认密码！");
        log.warn("========================================");
    }
}
