import { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { adminAPI } from "../../utils/api";
import "./ReviewManagement.css";

/**
 * 投稿审核管理页面
 * 对应需求：Requirement 5.1 - 5.4
 */
function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING"); // PENDING, APPROVED, REJECTED, ALL
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  // 驳回弹窗状态
  const [rejectModal, setRejectModal] = useState({
    show: false,
    reviewId: null,
  });
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 通过确认弹窗状态
  const [approveModal, setApproveModal] = useState({
    show: false,
    reviewId: null,
  });

  // 操作成功提示
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // 图片预览
  const [previewImage, setPreviewImage] = useState(null);

  // 加载评价列表
  const loadReviews = async (statusFilter) => {
    setLoading(true);
    try {
      const result = await adminAPI.getReviews(
        statusFilter === "ALL" ? null : statusFilter
      );
      if (result.code === 200) {
        setReviews(result.data || []);
      }
    } catch (err) {
      console.error("加载评价列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const result = await adminAPI.getReviews(null);
      if (result.code === 200) {
        const data = result.data || [];
        const pending = data.filter((r) => r.status === "PENDING").length;
        const approved = data.filter((r) => r.status === "APPROVED").length;
        const rejected = data.filter((r) => r.status === "REJECTED").length;
        setStats({ pending, approved, rejected });
      }
    } catch (err) {
      console.error("加载统计数据失败:", err);
    }
  };

  // 首次加载
  useEffect(() => {
    loadStats();
    loadReviews(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 筛选变化时重新加载
  useEffect(() => {
    loadReviews(filter);
  }, [filter]);

  // 显示提示
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 2000);
  };

  // 从列表中移除评价并更新统计
  const removeReviewFromList = (id, newStatus) => {
    const review = reviews.find((r) => r.id === id);
    if (!review) return;

    // 从当前列表移除
    setReviews((prev) => prev.filter((r) => r.id !== id));

    // 更新统计数据
    setStats((prev) => ({
      pending: prev.pending - (review.status === "PENDING" ? 1 : 0),
      approved: prev.approved + (newStatus === "APPROVED" ? 1 : 0),
      rejected: prev.rejected + (newStatus === "REJECTED" ? 1 : 0),
    }));
  };

  // 打开通过确认弹窗
  const openApproveModal = (id) => {
    setApproveModal({ show: true, reviewId: id });
  };

  // 确认审核通过
  const handleApprove = async () => {
    const id = approveModal.reviewId;
    setSubmitting(true);
    try {
      const result = await adminAPI.reviewApproval(id, true);
      if (result.code === 200) {
        setApproveModal({ show: false, reviewId: null });
        removeReviewFromList(id, "APPROVED");
        showToast("审核通过");
      } else {
        showToast(result.message || "操作失败", "error");
      }
    } catch (err) {
      console.error("审核失败:", err);
      showToast("操作失败，请重试", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // 打开驳回弹窗
  const openRejectModal = (id) => {
    setRejectModal({ show: true, reviewId: id });
    setRejectReason("");
  };

  // 确认驳回
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showToast("请填写驳回原因", "error");
      return;
    }
    if (rejectReason.trim().length < 10) {
      showToast("驳回原因至少10个字符", "error");
      return;
    }

    const id = rejectModal.reviewId;
    setSubmitting(true);
    try {
      const result = await adminAPI.reviewApproval(id, false, rejectReason);
      if (result.code === 200) {
        setRejectModal({ show: false, reviewId: null });
        removeReviewFromList(id, "REJECTED");
        showToast("已驳回");
      } else {
        showToast(result.message || "操作失败", "error");
      }
    } catch (err) {
      console.error("驳回失败:", err);
      showToast("操作失败，请重试", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // 格式化日期
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="review-management">
      <div className="page-header">
        <h1>投稿审核</h1>
        <p>审核用户提交的驾校评价，确保内容真实有效</p>
      </div>

      {/* 统计卡片 */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>待审核</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon approved">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.approved}</h3>
            <p>已通过</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rejected">
            <FaTimesCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>已驳回</p>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "PENDING" ? "active" : ""}`}
          onClick={() => setFilter("PENDING")}
        >
          待审核
        </button>
        <button
          className={`filter-btn ${filter === "APPROVED" ? "active" : ""}`}
          onClick={() => setFilter("APPROVED")}
        >
          已通过
        </button>
        <button
          className={`filter-btn ${filter === "REJECTED" ? "active" : ""}`}
          onClick={() => setFilter("REJECTED")}
        >
          已驳回
        </button>
        <button
          className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          全部
        </button>
      </div>

      {/* 评价列表 */}
      {loading ? (
        <div className="loading-state">加载中...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>暂无{filter === "PENDING" ? "待审核" : ""}评价</h3>
          <p>当前没有需要处理的投稿</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-meta">
                  <span className="school-name">
                    {review.schoolName || `驾校ID: ${review.schoolId}`}
                  </span>
                  <div className="review-info">
                    <span>评价者: {review.author}</span>
                    <span className="review-rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span>
                      {formatDate(review.createdAt || review.reviewDate)}
                    </span>
                  </div>
                </div>
                <span className={`status-badge ${review.status.toLowerCase()}`}>
                  {review.status === "PENDING" && "待审核"}
                  {review.status === "APPROVED" && "已通过"}
                  {review.status === "REJECTED" && "已驳回"}
                </span>
              </div>

              <div className="review-content">{review.content}</div>

              {/* 证明图片 */}
              {review.evidenceImages && review.evidenceImages.length > 0 && (
                <div className="review-images">
                  {review.evidenceImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`证明图片${idx + 1}`}
                      className="review-image"
                      onClick={() => setPreviewImage(img)}
                    />
                  ))}
                </div>
              )}

              {/* 驳回原因 */}
              {review.status === "REJECTED" && review.rejectReason && (
                <div className="reject-reason">
                  <strong>驳回原因：</strong>
                  {review.rejectReason}
                </div>
              )}

              {/* 操作按钮 - 仅待审核状态显示 */}
              {review.status === "PENDING" && (
                <div className="review-actions">
                  <button
                    className="action-btn approve"
                    onClick={() => openApproveModal(review.id)}
                    disabled={submitting}
                  >
                    <FaCheck /> 通过
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => openRejectModal(review.id)}
                    disabled={submitting}
                  >
                    <FaTimes /> 驳回
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 驳回原因弹窗 */}
      {rejectModal.show && (
        <div
          className="modal-overlay"
          onClick={() => setRejectModal({ show: false, reviewId: null })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>填写驳回原因</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请详细说明驳回原因（10-200字）..."
              maxLength={200}
            />
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setRejectModal({ show: false, reviewId: null })}
              >
                取消
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleReject}
                disabled={submitting || rejectReason.trim().length < 10}
              >
                {submitting ? "提交中..." : "确认驳回"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通过确认弹窗 */}
      {approveModal.show && (
        <div
          className="modal-overlay"
          onClick={() => setApproveModal({ show: false, reviewId: null })}
        >
          <div
            className="modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>确认通过</h3>
            <p className="confirm-text">确定要通过这条评价吗？</p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setApproveModal({ show: false, reviewId: null })}
              >
                取消
              </button>
              <button
                className="modal-btn approve-confirm"
                onClick={handleApprove}
                disabled={submitting}
              >
                {submitting ? "处理中..." : "确认通过"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 图片预览弹窗 */}
      {previewImage && (
        <div
          className="image-preview-modal"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="预览" />
        </div>
      )}

      {/* Toast 提示 */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;
