package com.xiangtan.jiaxiao.controller.pub;

import com.xiangtan.jiaxiao.model.entity.Review;
import com.xiangtan.jiaxiao.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
     * 提交新评价（公开接口）
     */
    @PostMapping
    @Operation(summary = "提交评价", description = "用户投稿新评价（默认待审核）")
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        reviewService.submitReview(review);
        return ResponseEntity.ok(Map.of("message", "评价已提交，等待管理员审核"));
    }

    /**
     * 获取某驾校的已审核评价
     */
    @GetMapping("/school/{schoolId}")
    @Operation(summary = "获取驾校评价", description = "获取某驾校的已审核通过评价列表")
    public ResponseEntity<List<Review>> getReviewsBySchoolId(@PathVariable String schoolId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsBySchoolId(schoolId));
    }
}
