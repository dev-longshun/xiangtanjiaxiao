import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { schoolAPI, adminAPI } from "../../utils/api";
import "./SchoolDetail.css";

/**
 * 管理后台 - 驾校详情页面
 */
function AdminSchoolDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadSchoolDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadSchoolDetail = async () => {
    setLoading(true);
    try {
      const result = await schoolAPI.getSchoolById(id);
      if (result.code === 200 && result.data) {
        const data = result.data;
        setSchool({
          ...data,
          tags: parseJsonArray(data.tags),
          courses: parseJsonArray(data.courses),
        });
      } else {
        setError("驾校不存在");
      }
    } catch (err) {
      console.error("加载驾校详情失败:", err);
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const parseJsonArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const handleDelete = async () => {
    if (!confirm(`确定要删除驾校"${school.name}"吗？`)) return;

    try {
      const result = await adminAPI.deleteSchool(id);
      if (result.code === 200) {
        alert("删除成功");
        navigate("/admin/schools");
      } else {
        alert(result.message || "删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  if (loading) {
    return <div className="loading-state">加载中...</div>;
  }

  if (error || !school) {
    return (
      <div className="error-state">
        <p>{error || "驾校不存在"}</p>
        <Link to="/admin/schools" className="back-link">
          返回驾校列表
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-school-detail">
      <div className="page-header">
        <Link to="/admin/schools" className="back-link">
          <FaArrowLeft /> 返回驾校列表
        </Link>
        <div className="header-actions">
          <button
            className="btn btn-edit"
            onClick={() => navigate(`/admin/schools/edit/${id}`)}
          >
            <FaEdit /> 编辑
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            <FaTrash /> 删除
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{school.name}</h1>
          <div className="rating-badge">
            <FaStar /> {(school.rating || 0).toFixed(1)}
          </div>
        </div>

        <div className="detail-info">
          <div className="info-row">
            <FaMapMarkerAlt className="icon" />
            <span>{school.address || "暂无地址"}</span>
          </div>
          <div className="info-row">
            <FaPhone className="icon" />
            <span>{school.phone || "暂无电话"}</span>
          </div>
          {school.businessHours && (
            <div className="info-row">
              <FaClock className="icon" />
              <span>{school.businessHours}</span>
            </div>
          )}
          {school.priceRange && (
            <div className="info-row">
              <FaMoneyBillWave className="icon" />
              <span>{school.priceRange}</span>
            </div>
          )}
        </div>

        {school.description && (
          <div className="detail-section">
            <h3>驾校简介</h3>
            <p>{school.description}</p>
          </div>
        )}

        {school.courses && school.courses.length > 0 && (
          <div className="detail-section">
            <h3>开设课程</h3>
            <div className="tags">
              {school.courses.map((course, idx) => (
                <span key={idx} className="tag course">
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}

        {school.tags && school.tags.length > 0 && (
          <div className="detail-section">
            <h3>驾校标签</h3>
            <div className="tags">
              {school.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="detail-section">
          <h3>统计数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{school.reviewCount || 0}</span>
              <span className="stat-label">评价数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {(school.rating || 0).toFixed(1)}
              </span>
              <span className="stat-label">平均评分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSchoolDetail;
