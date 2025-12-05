package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.model.entity.User;
import com.xiangtan.jiaxiao.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户控制器（公开接口）
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "用户接口", description = "用户搜索等公开功能")
public class UserController {

    private final UserService userService;

    /**
     * 按昵称搜索用户（模糊查询，返回脱敏信息）
     */
    @GetMapping("/search")
    @Operation(summary = "按昵称搜索用户", description = "模糊查询昵称，返回用户基本信息（脱敏）")
    public Result<?> searchByNickname(
            @Parameter(description = "昵称关键字", required = true)
            @RequestParam String nickname) {
        
        List<User> users = userService.searchByNickname(nickname);
        
        // 脱敏处理：仅返回必要字段
        List<Map<String, Object>> result = users.stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("username", user.getUsername());
                    map.put("nickname", user.getNickname());
                    map.put("createdAt", user.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
        
        return Result.success(result);
    }
}
