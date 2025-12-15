package com.xiangtan.jiaxiao.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xiangtan.jiaxiao.mapper.ReviewMapper;
import com.xiangtan.jiaxiao.model.entity.Review;
import com.xiangtan.jiaxiao.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 评价服务实现
 */
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;

    /** 获取某驾校的已审核评价列表 */
    @Override
    public List<Review> getApprovedReviewsBySchoolId(String schoolId) {
        QueryWrapper<Review> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("school_id", schoolId)
                .eq("status", "APPROVED")
                .orderByDesc("review_date");
        return reviewMapper.selectList(queryWrapper);
    }

    /** 获取所有待审核评价（管理员） */
    @Override
    public List<Review> getPendingReviews() {
        QueryWrapper<Review> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "PENDING")
                .orderByAsc("created_at");
        return reviewMapper.selectList(queryWrapper);
    }

    /** 提交新评价（公开接口，默认状态 PENDING） */
    @Override
    public void submitReview(Review review) {
        review.setStatus("PENDING");
        review.setReviewDate(LocalDateTime.now());
        reviewMapper.insert(review);
    }

    /** 审核评价（管理员） */
    @Override
    public void reviewApproval(Long id, boolean approved, String rejectReason) {
        String status = approved ? "APPROVED" : "REJECTED";
        reviewMapper.updateStatus(id, status, rejectReason);
    }

    /** 获取所有评价（管理员） */
    @Override
    public List<Review> getAllReviews() {
        QueryWrapper<Review> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("created_at");
        return reviewMapper.selectList(queryWrapper);
    }

    /** 按状态获取评价（管理员） */
    @Override
    public List<Review> getReviewsByStatus(String status) {
        QueryWrapper<Review> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", status)
                .orderByDesc("created_at");
        return reviewMapper.selectList(queryWrapper);
    }
}
