import { Link } from "react-router-dom";
import { FaStar, FaComment, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import "./SchoolCard.css";

function SchoolCard({ school }) {
  // 安全处理数据
  const rating = school.rating || 0;
  const tags = Array.isArray(school.tags) ? school.tags : [];
  const courses = Array.isArray(school.courses) ? school.courses : [];

  return (
    <Link to={`/school/${school.id}`} className="school-card">
      <div className="school-card-header">
        <h2>{school.name}</h2>
        <div className="rating">
          <FaStar className="star-icon" />
          <span className="rating-score">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="school-info">
        <p className="info-item">
          <FaMapMarkerAlt className="info-icon" />
          {school.address || "暂无地址"}
        </p>
        <p className="info-item">
          <FaPhone className="info-icon" />
          {school.phone || "暂无电话"}
        </p>
      </div>

      <p className="school-description">{school.description || "暂无简介"}</p>

      {tags.length > 0 && (
        <div className="school-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="school-footer">
        <span className="review-count">
          <FaComment /> {school.reviewCount || 0} 条评价
        </span>
        {courses.length > 0 && (
          <span className="courses">课程: {courses.join(", ")}</span>
        )}
      </div>
    </Link>
  );
}

export default SchoolCard;
