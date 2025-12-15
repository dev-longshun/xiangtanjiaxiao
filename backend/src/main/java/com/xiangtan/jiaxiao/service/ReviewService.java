package com.xiangtan.jiaxiao.service;

import com.xiangtan.jiaxiao.model.entity.Review;

import java.util.List;

/**
 * 评价服务接口
 */
public interface ReviewService {

    /** 获取某驾校的已审核评价列表 */
    List<Review> getApprovedReviewsBySchoolId(String schoolId);

    /** 获取所有待审核评价（管理员） */
    List<Review> getPendingReviews();

    /** 获取所有评价（管理员） */
    List<Review> getAllReviews();

    /** 按状态获取评价（管理员） */
    List<Review> getReviewsByStatus(String status);

    /** 提交新评价（公开接口，默认状态 PENDING） */
    void submitReview(Review review);

    /** 审核评价（管理员） */
    void reviewApproval(Long id, boolean approved, String rejectReason);
}
