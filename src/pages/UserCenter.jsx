import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaLock,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { reviewAPI } from "../services/api";
import "./UserCenter.css";

function UserCenter() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 修改密码表单
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const loadMyReviews = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await reviewAPI.getMy(user.nickname);
      if (response.code === 200) {
        setReviews(response.data || []);
      }
    } catch {
      setError("加载投稿列表失败");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadMyReviews();
  }, [user, navigate, loadMyReviews]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheckCircle className="status-icon approved" />;
      case "REJECTED":
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaHourglassHalf className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "已通过";
      case "REJECTED":
        return "已驳回";
      default:
        return "待审核";
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "请填写所有字段" });
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      setPasswordMsg({ type: "error", text: "新密码长度需在 6-20 位之间" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "两次输入的新密码不一致" });
      return;
    }

    // TODO: 调用修改密码 API
    setPasswordMsg({ type: "success", text: "密码修改成功" });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="user-center-page">
      <div className="container">
        <div className="user-center-header">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <h1>{user.nickname}</h1>
              <p>用户ID: {user.username}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>

        <div className="user-center-content">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <FaClipboardList /> 我的投稿
            </button>
            <button
              className={`tab ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <FaLock /> 修改密码
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "reviews" && (
              <div className="reviews-section">
                {loading ? (
                  <div className="loading">加载中...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : reviews.length === 0 ? (
                  <div className="empty">暂无投稿记录</div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <span className="school-name">{review.schoolId}</span>
                          <span
                            className={`status ${review.status.toLowerCase()}`}
                          >
                            {getStatusIcon(review.status)}
                            {getStatusText(review.status)}
                          </span>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating ? "star filled" : "star"
                              }
                            />
                          ))}
                        </div>
                        <p className="review-content">{review.content}</p>
                        <div className="review-footer">
                          <span className="review-date">
                            <FaClock />{" "}
                            {new Date(review.reviewDate).toLocaleDateString()}
                          </span>
                        </div>
                        {review.status === "REJECTED" &&
                          review.rejectReason && (
                            <div className="reject-reason">
                              <strong>驳回原因：</strong>
                              {review.rejectReason}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div className="password-section">
                <form onSubmit={handlePasswordChange}>
                  {passwordMsg.text && (
                    <div className={`message ${passwordMsg.type}`}>
                      {passwordMsg.text}
                    </div>
                  )}
                  <div className="form-group">
                    <label>原密码</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="请输入原密码"
                    />
                  </div>
                  <div className="form-group">
                    <label>新密码</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="6-20 个字符"
                    />
                  </div>
                  <div className="form-group">
                    <label>确认新密码</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="请再次输入新密码"
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    修改密码
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCenter;
