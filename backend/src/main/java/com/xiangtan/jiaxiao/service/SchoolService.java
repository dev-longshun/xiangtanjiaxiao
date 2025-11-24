package com.xiangtan.jiaxiao.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.xiangtan.jiaxiao.mapper.SchoolMapper;
import com.xiangtan.jiaxiao.model.entity.School;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 驾校服务
 */
@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolMapper schoolMapper;

    /**
     * 获取所有驾校列表
     */
    public List<School> getAllSchools() {
        QueryWrapper<School> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("name_pinyin");  // 按拼音排序
        return schoolMapper.selectList(queryWrapper);
    }

    /**
     * 根据ID获取驾校详情
     */
    public School getSchoolById(String id) {
        return schoolMapper.selectById(id);
    }

    /**
     * 搜索驾校（按名称模糊匹配）
     */
    public List<School> searchSchools(String keyword) {
        QueryWrapper<School> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("name", keyword)
                    .or()
                    .like("name_pinyin", keyword);
        return schoolMapper.selectList(queryWrapper);
    }

    /**
     * 创建驾校（管理员）
     */
    public void createSchool(School school) {
        schoolMapper.insert(school);
    }

    /**
     * 更新驾校信息（管理员）
     */
    public void updateSchool(School school) {
        schoolMapper.updateById(school);
    }

    /**
     * 删除驾校（管理员，逻辑删除）
     */
    public void deleteSchool(String id) {
        schoolMapper.deleteById(id);
    }
}
