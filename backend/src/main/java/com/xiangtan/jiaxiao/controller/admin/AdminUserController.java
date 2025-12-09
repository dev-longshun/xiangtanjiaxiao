package com.xiangtan.jiaxiao.controller.admin;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 管理员 - 用户管理控制器
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "管理员 - 用户管理", description = "管理员管理用户信息")
public class AdminUserController {

    private final UserService userService;

    /**
     * 修改用户昵称
     */
    @PutMapping("/{id}/nickname")
    @Operation(summary = "修改用户昵称", description = "管理员修改指定用户的昵称（校验唯一性）")
    public Result<?> updateNickname(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long id,
            @RequestBody UpdateNicknameRequest request) {
        
        try {
            userService.updateUserNickname(id, request.getNickname());
            return Result.success(null, "昵称修改成功");
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }

    /**
     * 修改昵称请求 DTO
     */
    @Data
    static class UpdateNicknameRequest {
        private String nickname;  // 新昵称
    }
}
