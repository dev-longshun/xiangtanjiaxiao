package com.xiangtan.jiaxiao.controller.admin;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.model.entity.Review;
import com.xiangtan.jiaxiao.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public Result<List<Review>> getPendingReviews() {
        return Result.success(reviewService.getPendingReviews());
    }

    /**
     * 审核评价（通过/拒绝）
     */
    @PostMapping("/{id}/review")
    @Operation(summary = "审核评价", description = "管理员审核评价（通过或拒绝）")
    public Result<Void> reviewApproval(@PathVariable Long id, @RequestBody ApprovalRequest request) {
        if (request.isApproved()) {
            reviewService.reviewApproval(id, true);
            return Result.success("评价已通过");
        } else {
            reviewService.rejectReview(id, request.getRejectReason());
            return Result.success("评价已驳回");
        }
    }
    
    /**
     * 获取某驾校的所有评价（含各状态）
     */
    @GetMapping("/school/{schoolId}")
    @Operation(summary = "获取驾校所有评价", description = "获取某驾校的所有评价（含待审核、已通过、已驳回）")
    public Result<List<Review>> getSchoolAllReviews(@PathVariable String schoolId) {
        return Result.success(reviewService.getAllReviewsBySchoolId(schoolId));
    }
    
    /**
     * 删除评价（逻辑删除）
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除评价", description = "管理员删除评价（逻辑删除）")
    public Result<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return Result.success("评价已删除");
    }

    /**
     * 审核请求 DTO
     */
    @Data
    static class ApprovalRequest {
        private boolean approved;
        private String rejectReason;
    }
}
