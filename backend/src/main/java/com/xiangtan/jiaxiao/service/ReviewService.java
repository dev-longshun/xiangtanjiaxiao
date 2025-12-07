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

    /** 提交新评价（公开接口，默认状态 PENDING） */
    void submitReview(Review review);

    /** 审核评价（管理员） */
    void reviewApproval(Long id, boolean approved);
    
    /** 审核驳回评价并填写原因（管理员） */
    void rejectReview(Long id, String rejectReason);
    
    /** 获取用户的所有投稿 */
    List<Review> getReviewsByAuthor(String author);
    
    /** 获取某驾校的所有评价（管理员，含各状态） */
    List<Review> getAllReviewsBySchoolId(String schoolId);
    
    /** 删除评价（逻辑删除） */
    void deleteReview(Long id);
}
