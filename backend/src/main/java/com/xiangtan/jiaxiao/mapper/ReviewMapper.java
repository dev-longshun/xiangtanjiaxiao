package com.xiangtan.jiaxiao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiangtan.jiaxiao.model.entity.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 评价 Mapper 接口
 */
@Mapper
public interface ReviewMapper extends BaseMapper<Review> {
    
    /**
     * 更新评价状态（PENDING -> APPROVED/REJECTED）
     */
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
