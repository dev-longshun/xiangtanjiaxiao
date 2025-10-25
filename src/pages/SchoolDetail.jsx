import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaArrowLeft } from 'react-icons/fa';
import ReviewCard from '../components/ReviewCard';
import data from '../data/data.json';
import './SchoolDetail.css';

function SchoolDetail() {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('date'); // date or rating

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // 查找驾校信息
    const foundSchool = data.schools.find(s => s.id === id);
    setSchool(foundSchool);

    // 获取该驾校的所有评价
    let schoolReviews = data.reviews.filter(r => r.schoolId === id);
    
    // 排序
    if (sortBy === 'date') {
      schoolReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'rating') {
      schoolReviews.sort((a, b) => b.rating - a.rating);
    }
    
    setReviews(schoolReviews);
  }, [id, sortBy]);

  if (!school) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>驾校不存在</h2>
          <Link to="/" className="back-link">
            <FaArrowLeft /> 返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="school-detail">
      <div className="container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> 返回首页
        </Link>

        <div className="school-header">
          <div className="school-main-info">
            <h1>{school.name}</h1>
            <div className="school-rating-large">
              <FaStar className="star-icon-large" />
              <span className="rating-score-large">{school.rating.toFixed(1)}</span>
              <span className="rating-count">({school.reviewCount} 条评价)</span>
            </div>
          </div>

          <div className="school-contact">
            <p className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>{school.address}</span>
            </p>
            <p className="contact-item">
              <FaPhone className="contact-icon" />
              <span>{school.phone}</span>
            </p>
          </div>

          <div className="school-description-box">
            <h3>驾校简介</h3>
            <p>{school.description}</p>
          </div>

          <div className="school-meta">
            <div className="meta-item">
              <strong>培训课程:</strong>
              <div className="courses-list">
                {school.courses.map((course, index) => (
                  <span key={index} className="course-badge">{course}</span>
                ))}
              </div>
            </div>
            <div className="meta-item">
              <strong>驾校特色:</strong>
              <div className="tags-list">
                {school.tags.map((tag, index) => (
                  <span key={index} className="feature-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>学员评价</h2>
            <div className="sort-controls">
              <label>排序: </label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">按时间</option>
                <option value="rating">按评分</option>
              </select>
            </div>
          </div>

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="no-reviews">
                <p>暂无评价，欢迎成为第一个评价的学员！</p>
                <Link to="/submit" className="submit-link">去投稿</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolDetail;

