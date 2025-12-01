package com.xiangtan.jiaxiao.controller.admin;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.model.entity.School;
import com.xiangtan.jiaxiao.service.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 驾校管理控制器（需要 ADMIN 权限）
 */
@RestController
@RequestMapping("/api/admin/schools")
@RequiredArgsConstructor
@Tag(name = "管理-驾校", description = "驾校的增删改接口（管理员）")
public class AdminSchoolController {

    private final SchoolService schoolService;

    /**
     * 创建驾校
     */
    @PostMapping
    @Operation(summary = "创建驾校", description = "管理员添加新驾校")
    public Result<Void> createSchool(@RequestBody School school) {
        schoolService.createSchool(school);
        return Result.success("驾校创建成功");
    }

    /**
     * 更新驾校信息
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新驾校", description = "管理员更新驾校信息")
    public Result<Void> updateSchool(@PathVariable String id, @RequestBody School school) {
        school.setId(id);
        schoolService.updateSchool(school);
        return Result.success("驾校更新成功");
    }

    /**
     * 删除驾校（逻辑删除）
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除驾校", description = "管理员逻辑删除驾校")
    public Result<Void> deleteSchool(@PathVariable String id) {
        schoolService.deleteSchool(id);
        return Result.success("驾校删除成功");
    }
}
