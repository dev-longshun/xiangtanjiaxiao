package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.entity.School;
import com.xiangtan.jiaxiao.service.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 驾校控制器（公开接口）
 */
@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
@Tag(name = "驾校接口", description = "驾校列表、详情、搜索等公开接口")
public class SchoolController {

    private final SchoolService schoolService;

    /**
     * 获取所有驾校列表
     */
    @GetMapping
    @Operation(summary = "获取所有驾校", description = "返回所有驾校列表（按拼音排序）")
    public ResponseEntity<List<School>> getAllSchools() {
        return ResponseEntity.ok(schoolService.getAllSchools());
    }

    /**
     * 获取驾校详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取驾校详情", description = "根据驾校ID获取详细信息")
    public ResponseEntity<?> getSchoolById(@PathVariable String id) {
        School school = schoolService.getSchoolById(id);
        if (school == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(school);
    }

    /**
     * 搜索驾校
     */
    @GetMapping("/search")
    @Operation(summary = "搜索驾校", description = "按名称模糊搜索驾校")
    public ResponseEntity<List<School>> searchSchools(@RequestParam String keyword) {
        return ResponseEntity.ok(schoolService.searchSchools(keyword));
    }
}
