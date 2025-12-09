import { useState, useEffect } from "react";
import {
  FaStar,
  FaCheck,
  FaTimes,
  FaEye,
  FaClock,
  FaImage,
} from "react-icons/fa";
import { reviewAPI } from "../../services/api";
import "./ReviewManagement.css";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getPending();
      if (response.code === 200) {
        setReviews(response.data || []);
      }
    } catch (error) {
      console.error("加载待审核评价失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (processing) return;
    setProcessing(true);
    try {
      const response = await reviewAPI.review(id, true, null);
      if (response.code === 200) {
        setReviews(reviews.filter((r) => r.id !== id));
        setSelectedReview(null);
      }
    } catch (error) {
      alert("操作失败: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || rejectReason.length < 10) {
      alert("请填写驳回原因（至少10个字）");
      return;
    }
    if (processing) return;
    setProcessing(true);
    try {
      const response = await reviewAPI.review(
        selectedReview.id,
        false,
        rejectReason
      );
      if (response.code === 200) {
        setReviews(reviews.filter((r) => r.id !== selectedReview.id));
        setShowRejectModal(false);
        setSelectedReview(null);
        setRejectReason("");
      }
    } catch (error) {
      alert("操作失败: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (review) => {
    setSelectedReview(review);
    setShowRejectModal(true);
  };

  return (
    <div className="review-management">
      <div className="page-header">
        <h1>投稿审核</h1>
        <p>共 {reviews.length} 条待审核投稿</p>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : reviews.length === 0 ? (
        <div className="empty">暂无待审核投稿</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-info">
                  <span className="school-name">{review.schoolId}</span>
                  <span className="author">投稿者: {review.author}</span>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "star filled" : "star"}
                    />
                  ))}
                </div>
              </div>

              <p className="review-content">{review.content}</p>

              {review.evidenceImages && review.evidenceImages.length > 0 && (
                <div className="review-images">
                  <FaImage /> {review.evidenceImages.length} 张证明图片
                </div>
              )}

              <div className="review-footer">
                <span className="review-date">
                  <FaClock />{" "}
                  {new Date(
                    review.reviewDate || review.createdAt
                  ).toLocaleString()}
                </span>
                <div className="review-actions">
                  <button
                    className="btn-view"
                    onClick={() => setSelectedReview(review)}
                  >
                    <FaEye /> 查看详情
                  </button>
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(review.id)}
                    disabled={processing}
                  >
                    <FaCheck /> 通过
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => openRejectModal(review)}
                    disabled={processing}
                  >
                    <FaTimes /> 驳回
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedReview && !showRejectModal && (
        <div className="modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>投稿详情</h2>
            <div className="detail-item">
              <label>驾校:</label>
              <span>{selectedReview.schoolId}</span>
            </div>
            <div className="detail-item">
              <label>投稿者:</label>
              <span>{selectedReview.author}</span>
            </div>
            <div className="detail-item">
              <label>评分:</label>
              <span>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < selectedReview.rating ? "star filled" : "star"
                    }
                  />
                ))}
              </span>
            </div>
            <div className="detail-item">
              <label>内容:</label>
              <p>{selectedReview.content}</p>
            </div>
            {selectedReview.evidenceImages &&
              selectedReview.evidenceImages.length > 0 && (
                <div className="detail-item">
                  <label>证明图片:</label>
                  <div className="image-gallery">
                    {selectedReview.evidenceImages.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`证明${i + 1}`}
                        onClick={() => window.open(url)}
                      />
                    ))}
                  </div>
                </div>
              )}
            <div className="modal-actions">
              <button
                className="btn-approve"
                onClick={() => handleApprove(selectedReview.id)}
                disabled={processing}
              >
                <FaCheck /> 通过
              </button>
              <button
                className="btn-reject"
                onClick={() => setShowRejectModal(true)}
              >
                <FaTimes /> 驳回
              </button>
              <button
                className="btn-cancel"
                onClick={() => setSelectedReview(null)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 驳回原因弹窗 */}
      {showRejectModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRejectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>填写驳回原因</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请填写驳回原因（10-200字）"
              rows={4}
            />
            <p className="char-hint">{rejectReason.length}/200</p>
            <div className="modal-actions">
              <button
                className="btn-reject"
                onClick={handleReject}
                disabled={processing}
              >
                确认驳回
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;
