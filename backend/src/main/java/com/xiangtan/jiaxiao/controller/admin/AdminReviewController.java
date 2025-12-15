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
     * 获取评价列表（支持按状态筛选）
     * @param status 可选：PENDING/APPROVED/REJECTED，不传则返回所有
     */
    @GetMapping
    @Operation(summary = "评价列表", description = "获取评价列表，支持按状态筛选")
    public Result<List<Review>> getReviews(@RequestParam(required = false) String status) {
        if (status == null || status.isEmpty()) {
            // 返回所有评价
            return Result.success(reviewService.getAllReviews());
        }
        // 按状态筛选
        return Result.success(reviewService.getReviewsByStatus(status));
    }

    /**
     * 审核评价（通过/拒绝）
     */
    @PostMapping("/{id}/review")
    @Operation(summary = "审核评价", description = "管理员审核评价（通过或拒绝）")
    public Result<Void> reviewApproval(@PathVariable Long id, @RequestBody ApprovalRequest request) {
        // 验证：驳回时必须填写驳回原因
        if (!request.isApproved() && (request.getRejectReason() == null || request.getRejectReason().trim().isEmpty())) {
            return Result.error(400, "驳回时必须填写驳回原因");
        }
        
        reviewService.reviewApproval(id, request.isApproved(), request.getRejectReason());
        String message = request.isApproved() ? "评价已通过" : "评价已拒绝";
        return Result.success(message);
    }

    /**
     * 审核请求 DTO
     */
    @Data
    static class ApprovalRequest {
        private boolean approved;
        private String rejectReason; // 驳回原因（驳回时必填）
    }
}
