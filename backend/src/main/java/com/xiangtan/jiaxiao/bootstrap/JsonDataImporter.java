package com.xiangtan.jiaxiao.bootstrap;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.xiangtan.jiaxiao.model.entity.Review;
import com.xiangtan.jiaxiao.model.entity.School;
import com.xiangtan.jiaxiao.service.ReviewService;
import com.xiangtan.jiaxiao.service.SchoolService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * JSON 数据导入工具
 * 从 src/data/data.json 导入驾校与评价数据到 MySQL
 * 仅在首次启动时执行（检测数据库为空）
 */
@Component
@Order(2)  // 确保在 AdminInitializer 之后执行
@RequiredArgsConstructor
@Slf4j
public class JsonDataImporter implements CommandLineRunner {

    private final SchoolService schoolService;
    private final ReviewService reviewService;
    private final Gson gson = new Gson();

    @Override
    public void run(String... args) throws Exception {
        // 检查数据库是否已有数据
        List<School> existingSchools = schoolService.getAllSchools();
        if (!existingSchools.isEmpty()) {
            log.info("数据库已有驾校数据，跳过导入");
            return;
        }

        log.info("开始从 data.json 导入数据...");

        // 读取 JSON 文件
        InputStream inputStream = getClass().getClassLoader()
                .getResourceAsStream("static/data.json");
        
        if (inputStream == null) {
            log.warn("未找到 data.json 文件，跳过数据导入");
            return;
        }

        JsonObject jsonData = gson.fromJson(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8), 
                JsonObject.class
        );

        // 导入驾校数据
        importSchools(jsonData.getAsJsonArray("schools"));

        // 导入评价数据
        importReviews(jsonData.getAsJsonArray("reviews"));

        log.info("数据导入完成！");
    }

    /**
     * 导入驾校数据
     */
    private void importSchools(JsonArray schoolsArray) {
        int count = 0;
        for (JsonElement element : schoolsArray) {
            JsonObject schoolJson = element.getAsJsonObject();

            School school = new School();
            // 兼容驼峰/下划线命名的数据源，并做好空值兜底
            school.setId(getAsString(schoolJson, "id", null));
            school.setName(getAsString(schoolJson, "name", ""));
            // namePinyin 可能不存在，允许为空
            school.setNamePinyin(getAsString(schoolJson, "name_pinyin", getAsString(schoolJson, "namePinyin", null)));
            school.setRating(getAsDouble(schoolJson, "rating", 0.0));
            school.setReviewCount(getAsInt(schoolJson, "review_count", getAsInt(schoolJson, "reviewCount", 0)));
            school.setPassRate(getAsDouble(schoolJson, "pass_rate", getAsDouble(schoolJson, "overall", null)));
            
            // JSON 字段直接存储为字符串（数据库使用 JSON 类型）
            school.setTags(getAsJsonString(schoolJson, "tags"));
            school.setCourses(getAsJsonString(schoolJson, "courses"));
            // exam_data 或 examData
            String examData = getAsJsonString(schoolJson, "exam_data");
            if (examData == null) examData = getAsJsonString(schoolJson, "examData");
            school.setExamData(examData);
            
            school.setAddress(getAsString(schoolJson, "address", ""));
            school.setPhone(getAsString(schoolJson, "phone", ""));
            school.setBusinessHours(getAsString(schoolJson, "business_hours", getAsString(schoolJson, "businessHours", null)));
            school.setPriceRange(getAsString(schoolJson, "price_range", getAsString(schoolJson, "priceRange", null)));
            
            school.setDescription(getAsString(schoolJson, "description", null));
            
            // 兜底设置时间戳（即使 MetaObjectHandler 已配置，仍显式兜底）
            school.setCreatedAt(LocalDateTime.now());
            school.setUpdatedAt(LocalDateTime.now());
            school.setIsActive(1);

            schoolService.createSchool(school);
            count++;
        }
        log.info("成功导入 {} 条驾校数据", count);
    }

    /**
     * 导入评价数据
     */
    private void importReviews(JsonArray reviewsArray) {
        int count = 0;
        DateTimeFormatter formatterFull = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        DateTimeFormatter formatterDate = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (JsonElement element : reviewsArray) {
            JsonObject reviewJson = element.getAsJsonObject();

            Review review = new Review();
            // 兼容字段命名差异
            String schoolId = getAsString(reviewJson, "school_id", getAsString(reviewJson, "schoolId", null));
            review.setSchoolId(schoolId);
            review.setAuthor(getAsString(reviewJson, "author", "匿名学员"));
            review.setContent(getAsString(reviewJson, "content", ""));
            review.setRating(getAsInt(reviewJson, "rating", 5));
            
            String dateStr = getAsString(reviewJson, "date", null);
            if (dateStr != null) {
                // 支持 YYYY-MM-DD 与 YYYY-MM-DD HH:mm:ss
                LocalDateTime dt;
                if (dateStr.length() == 10) {
                    dt = formatterDate.parse(dateStr, java.time.LocalDate::from).atStartOfDay();
                } else {
                    dt = LocalDateTime.parse(dateStr, formatterFull);
                }
                review.setReviewDate(dt);
            }
            
            // 兜底设置时间戳
            review.setCreatedAt(LocalDateTime.now());
            review.setUpdatedAt(LocalDateTime.now());
            review.setStatus("APPROVED");  // 历史数据默认已审核
            review.setIsActive(1);

            reviewService.submitReview(review);
            count++;
        }
        log.info("成功导入 {} 条评价数据", count);
    }

    // =====================
    // 工具方法：安全读取
    // =====================
    private String getAsString(JsonObject obj, String key, String defaultVal) {
        if (obj == null) return defaultVal;
        if (!obj.has(key) || obj.get(key).isJsonNull()) return defaultVal;
        JsonElement el = obj.get(key);
        try {
            return el.getAsString();
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private Integer getAsInt(JsonObject obj, String key, Integer defaultVal) {
        if (obj == null) return defaultVal;
        if (!obj.has(key) || obj.get(key).isJsonNull()) return defaultVal;
        JsonElement el = obj.get(key);
        try {
            return el.getAsInt();
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private Double getAsDouble(JsonObject obj, String key, Double defaultVal) {
        if (obj == null) return defaultVal;
        if (!obj.has(key) || obj.get(key).isJsonNull()) return defaultVal;
        JsonElement el = obj.get(key);
        try {
            return el.getAsDouble();
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private String getAsJsonString(JsonObject obj, String key) {
        if (obj == null) return null;
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        try {
            return obj.get(key).toString();
        } catch (Exception e) {
            return null;
        }
    }
}
