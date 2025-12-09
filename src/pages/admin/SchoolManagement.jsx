import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaStar,
  FaEye,
} from "react-icons/fa";
import { schoolAPI, reviewAPI } from "../../services/api";
import "./SchoolManagement.css";

function SchoolManagement() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolReviews, setSchoolReviews] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    description: "",
    businessHours: "",
    priceRange: "",
    courses: "",
    tags: "",
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const response = await schoolAPI.getAll();
      if (response.code === 200) setSchools(response.data || []);
    } catch (error) {
      console.error("加载驾校列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingSchool(null);
    setFormData({
      id: "",
      name: "",
      address: "",
      phone: "",
      description: "",
      businessHours: "",
      priceRange: "",
      courses: "",
      tags: "",
    });
    setShowModal(true);
  };

  const openEditModal = (school) => {
    setEditingSchool(school);
    setFormData({
      id: school.id,
      name: school.name || "",
      address: school.address || "",
      phone: school.phone || "",
      description: school.description || "",
      businessHours: school.businessHours || "",
      priceRange: school.priceRange || "",
      courses: Array.isArray(school.courses) ? school.courses.join(",") : "",
      tags: Array.isArray(school.tags) ? school.tags.join(",") : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolData = {
      ...formData,
      courses: formData.courses
        ? formData.courses.split(",").map((s) => s.trim())
        : [],
      tags: formData.tags ? formData.tags.split(",").map((s) => s.trim()) : [],
    };
    try {
      if (editingSchool) await schoolAPI.update(editingSchool.id, schoolData);
      else await schoolAPI.create(schoolData);
      setShowModal(false);
      loadSchools();
    } catch (error) {
      alert("操作失败: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("确定要删除这个驾校吗？")) return;
    try {
      await schoolAPI.delete(id);
      loadSchools();
    } catch (error) {
      alert("删除失败: " + error.message);
    }
  };

  const viewSchoolDetail = async (school) => {
    setSelectedSchool(school);
    setShowDetailModal(true);
    try {
      const response = await reviewAPI.getSchoolAll(school.id);
      if (response.code === 200) setSchoolReviews(response.data || []);
    } catch (error) {
      console.error("加载评价失败:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("确定要删除这条评价吗？")) return;
    try {
      await reviewAPI.delete(reviewId);
      setSchoolReviews(schoolReviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      alert("删除失败: " + error.message);
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

  return (
    <div className="school-management">
      <div className="page-header">
        <div>
          <h1>驾校管理</h1>
          <p>共 {schools.length} 所驾校</p>
        </div>
        <button className="btn-add" onClick={openAddModal}>
          <FaPlus /> 新增驾校
        </button>
      </div>

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="搜索驾校名称..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="schools-table">
          <table>
            <thead>
              <tr>
                <th>名称</th>
                <th>评分</th>
                <th>评价数</th>
                <th>地址</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school.id}>
                  <td className="name-cell">{school.name}</td>
                  <td>
                    <FaStar className="star" />{" "}
                    {school.rating?.toFixed(1) || "0.0"}
                  </td>
                  <td>{school.reviewCount || 0}</td>
                  <td className="address-cell">{school.address}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      onClick={() => viewSchoolDetail(school)}
                      title="查看详情"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(school)}
                      title="编辑"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(school.id)}
                      title="删除"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSchools.length === 0 && (
            <div className="empty">没有找到匹配的驾校</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSchool ? "编辑驾校" : "新增驾校"}</h2>
            <form onSubmit={handleSubmit}>
              {!editingSchool && (
                <div className="form-group">
                  <label>驾校ID *</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    required
                    placeholder="如: school-012"
                  />
                </div>
              )}
              <div className="form-group">
                <label>驾校名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>联系电话</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>价格范围</label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) =>
                      setFormData({ ...formData, priceRange: e.target.value })
                    }
                    placeholder="如: 3000-5000元"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>地址</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>营业时间</label>
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) =>
                    setFormData({ ...formData, businessHours: e.target.value })
                  }
                  placeholder="如: 8:00-18:00"
                />
              </div>
              <div className="form-group">
                <label>培训课程 (逗号分隔)</label>
                <input
                  type="text"
                  value={formData.courses}
                  onChange={(e) =>
                    setFormData({ ...formData, courses: e.target.value })
                  }
                  placeholder="如: C1,C2"
                />
              </div>
              <div className="form-group">
                <label>标签 (逗号分隔)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="如: 通过率高,教练耐心"
                />
              </div>
              <div className="form-group">
                <label>简介</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingSchool ? "保存" : "创建"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedSchool && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedSchool.name}</h2>
            <div className="school-detail-info">
              <p>
                <strong>地址:</strong> {selectedSchool.address}
              </p>
              <p>
                <strong>电话:</strong> {selectedSchool.phone}
              </p>
              <p>
                <strong>评分:</strong> {selectedSchool.rating?.toFixed(1)} (
                {selectedSchool.reviewCount} 条评价)
              </p>
              <p>
                <strong>简介:</strong> {selectedSchool.description}
              </p>
            </div>
            <h3>关联评价 ({schoolReviews.length})</h3>
            <div className="reviews-list-mini">
              {schoolReviews.length === 0 ? (
                <p className="empty-text">暂无评价</p>
              ) : (
                schoolReviews.map((review) => (
                  <div key={review.id} className="review-item-mini">
                    <div className="review-item-header">
                      <span>{review.author}</span>
                      <span
                        className={`status ${review.status?.toLowerCase()}`}
                      >
                        {getStatusText(review.status)}
                      </span>
                    </div>
                    <p>{review.content?.substring(0, 100)}...</p>
                    <button
                      className="btn-delete-mini"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <FaTrash /> 删除
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDetailModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolManagement;
