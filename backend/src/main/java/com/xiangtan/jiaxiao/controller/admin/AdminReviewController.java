package com.xiangtan.jiaxiao.controller.admin;

import com.xiangtan.jiaxiao.model.entity.Review;
import com.xiangtan.jiaxiao.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 评价管理控制器（需要 ADMIN 权限）
 */
@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@Tag(name = "管理-评价", description = "评价审核接口（管理员）")
public class AdminReviewController {

    private final ReviewService reviewService;

    /**
     * 获取所有待审核评价
     */
    @GetMapping
    @Operation(summary = "待审核评价列表", description = "获取所有待审核评价")
    public ResponseEntity<List<Review>> getPendingReviews() {
        return ResponseEntity.ok(reviewService.getPendingReviews());
    }

    /**
     * 审核评价（通过/拒绝）
     */
    @PostMapping("/{id}/review")
    @Operation(summary = "审核评价", description = "管理员审核评价（通过或拒绝）")
    public ResponseEntity<?> reviewApproval(@PathVariable Long id, @RequestBody ApprovalRequest request) {
        reviewService.reviewApproval(id, request.isApproved());
        String message = request.isApproved() ? "评价已通过" : "评价已拒绝";
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * 审核请求 DTO
     */
    @Data
    static class ApprovalRequest {
        private boolean approved;
    }
}
