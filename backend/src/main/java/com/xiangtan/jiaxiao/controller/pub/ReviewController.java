package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.common.Result;
import com.xiangtan.jiaxiao.model.entity.Review;
import com.xiangtan.jiaxiao.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 评价控制器（公开接口）
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "评价接口", description = "评价投稿与查询接口")
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 提交新评价（需要登录，USER 或 ADMIN 角色）
     */
    @PostMapping
    @Operation(summary = "提交评价", description = "用户投稿新评价（需要登录，默认待审核）")
    public Result<Void> submitReview(@RequestBody Review review) {
        reviewService.submitReview(review);
        return Result.success("评价已提交，等待管理员审核");
    }
    
    /**
     * 查看我的投稿（需要登录）
     */
    @GetMapping("/my")
    @Operation(summary = "我的投稿", description = "查看当前用户的所有投稿（需要登录）")
    public Result<List<Review>> getMyReviews() {
        // TODO: 从 SecurityContext 获取当前用户名，查询其投稿
        // String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return Result.success(List.of());
    }

    /**
     * 获取某驾校的已审核评价
     */
    @GetMapping("/school/{schoolId}")
    @Operation(summary = "获取驾校评价", description = "获取某驾校的已审核通过评价列表")
    public Result<List<Review>> getReviewsBySchoolId(@PathVariable String schoolId) {
        return Result.success(reviewService.getApprovedReviewsBySchoolId(schoolId));
    }
}
