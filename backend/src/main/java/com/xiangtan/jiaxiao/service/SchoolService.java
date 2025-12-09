package com.xiangtan.jiaxiao.service;

import com.xiangtan.jiaxiao.model.entity.School;

import java.util.List;

/**
 * 驾校服务接口
 */
public interface SchoolService {

    /** 获取所有驾校列表 */
    List<School> getAllSchools();

    /** 根据ID获取驾校详情 */
    School getSchoolById(String id);

    /** 搜索驾校（按名称模糊匹配） */
    List<School> searchSchools(String keyword);

    /** 创建驾校（管理员） */
    void createSchool(School school);

    /** 更新驾校信息（管理员） */
    void updateSchool(School school);

    /** 删除驾校（管理员，逻辑删除） */
    void deleteSchool(String id);
}
