package com.xiangtan.jiaxiao.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xiangtan.jiaxiao.mapper.ReviewMapper;
import com.xiangtan.jiaxiao.model.entity.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 评价服务
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;

    /**
     * 获取某驾校的已审核评价列表
     */
    public List<Review> getApprovedReviewsBySchoolId(String schoolId) {
        QueryWrapper<Review> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("school_id", schoolId)
                    .eq("status", "APPROVED")
                    .orderByDesc("review_date");
        return reviewMapper.selectList(queryWrapper);
    }

    /**
     * 获取所有待审核评价（管理员）
     */
    public List<Review> getPendingReviews() {
        QueryWrapper<Review> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "PENDING")
                    .orderByAsc("created_at");
        return reviewMapper.selectList(queryWrapper);
    }

    /**
     * 提交新评价（公开接口，默认状态 PENDING）
     */
    public void submitReview(Review review) {
        review.setStatus("PENDING");
        review.setReviewDate(LocalDateTime.now());
        reviewMapper.insert(review);
    }

    /**
     * 审核评价（管理员）
     * @param id 评价ID
     * @param approved true=通过, false=拒绝
     */
    public void reviewApproval(Long id, boolean approved) {
        String status = approved ? "APPROVED" : "REJECTED";
        reviewMapper.updateStatus(id, status);
    }
}
