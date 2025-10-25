import { FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa';
import './ReviewCard.css';

function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="author-info">
          <FaUser className="author-icon" />
          <span className="author-name">{review.author}</span>
        </div>
        <div className="review-rating">{renderStars(review.rating)}</div>
      </div>

      <div className="review-content">
        <p>{review.content}</p>
      </div>

      <div className="review-footer">
        <div className="review-date">
          <FaCalendarAlt className="date-icon" />
          {review.date}
        </div>
        <div className="review-tags">
          {review.tags.map((tag, index) => (
            <span key={index} className={`review-tag ${tag === '踩坑经验' ? 'warning' : ''}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;

