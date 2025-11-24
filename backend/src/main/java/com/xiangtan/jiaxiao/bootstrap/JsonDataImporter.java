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
            school.setId(schoolJson.get("id").getAsString());
            school.setName(schoolJson.get("name").getAsString());
            school.setNamePinyin(schoolJson.get("name_pinyin").getAsString());
            school.setRating(schoolJson.get("rating").getAsDouble());
            school.setReviewCount(schoolJson.get("review_count").getAsInt());
            school.setPassRate(schoolJson.get("pass_rate").getAsDouble());
            
            // JSON 字段直接存储为字符串（数据库使用 JSON 类型）
            school.setTags(schoolJson.get("tags").toString());
            school.setCourses(schoolJson.get("courses").toString());
            school.setExamData(schoolJson.get("exam_data").toString());
            
            school.setAddress(schoolJson.get("address").getAsString());
            school.setPhone(schoolJson.get("phone").getAsString());
            school.setBusinessHours(schoolJson.get("business_hours").getAsString());
            school.setPriceRange(schoolJson.get("price_range").getAsString());
            
            if (schoolJson.has("description") && !schoolJson.get("description").isJsonNull()) {
                school.setDescription(schoolJson.get("description").getAsString());
            }
            
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
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (JsonElement element : reviewsArray) {
            JsonObject reviewJson = element.getAsJsonObject();

            Review review = new Review();
            review.setSchoolId(reviewJson.get("school_id").getAsString());
            review.setAuthor(reviewJson.get("author").getAsString());
            review.setContent(reviewJson.get("content").getAsString());
            review.setRating(reviewJson.get("rating").getAsInt());
            
            String dateStr = reviewJson.get("date").getAsString();
            review.setReviewDate(LocalDateTime.parse(dateStr, formatter));
            
            review.setStatus("APPROVED");  // 历史数据默认已审核
            review.setIsActive(1);

            reviewService.submitReview(review);
            count++;
        }
        log.info("成功导入 {} 条评价数据", count);
    }
}
