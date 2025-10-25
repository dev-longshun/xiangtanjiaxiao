import { Link } from 'react-router-dom';
import { FaStar, FaComment, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import './SchoolCard.css';

function SchoolCard({ school }) {
  return (
    <Link to={`/school/${school.id}`} className="school-card">
      <div className="school-card-header">
        <h2>{school.name}</h2>
        <div className="rating">
          <FaStar className="star-icon" />
          <span className="rating-score">{school.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="school-info">
        <p className="info-item">
          <FaMapMarkerAlt className="info-icon" />
          {school.address}
        </p>
        <p className="info-item">
          <FaPhone className="info-icon" />
          {school.phone}
        </p>
      </div>

      <p className="school-description">{school.description}</p>

      <div className="school-tags">
        {school.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>

      <div className="school-footer">
        <span className="review-count">
          <FaComment /> {school.reviewCount} 条评价
        </span>
        <span className="courses">
          课程: {school.courses.join(', ')}
        </span>
      </div>
    </Link>
  );
}

export default SchoolCard;

