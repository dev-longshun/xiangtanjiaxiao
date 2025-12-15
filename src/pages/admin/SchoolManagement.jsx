import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaComments,
} from "react-icons/fa";
import { schoolAPI, adminAPI } from "../../utils/api";
import "./SchoolManagement.css";

/**
 * 驾校管理页面
 * 对应需求：Requirement 6.1 - 6.6
 */
function SchoolManagement() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 删除确认弹窗
  const [deleteModal, setDeleteModal] = useState({ show: false, school: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setLoading(true);
    try {
      const result = await schoolAPI.getAllSchools();
      if (result.code === 200) {
        setSchools(result.data || []);
      }
    } catch (err) {
      console.error("加载驾校列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 搜索过滤
  const filteredSchools = schools.filter((school) => {
    if (!searchKeyword.trim()) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      school.name?.toLowerCase().includes(keyword) ||
      school.namePinyin?.toLowerCase().includes(keyword) ||
      school.address?.toLowerCase().includes(keyword)
    );
  });

  // 打开删除确认
  const openDeleteModal = (school) => {
    setDeleteModal({ show: true, school });
  };

  // 确认删除
  const handleDelete = async () => {
    if (!deleteModal.school) return;

    setDeleting(true);
    try {
      const result = await adminAPI.deleteSchool(deleteModal.school.id);
      if (result.code === 200) {
        alert("删除成功");
        setDeleteModal({ show: false, school: null });
        loadSchools();
      } else {
        alert(result.message || "删除失败");
      }
    } catch (err) {
      console.error("删除失败:", err);
      alert("删除失败，请重试");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="school-management">
      <div className="page-header">
        <div className="page-header-left">
          <h1>驾校管理</h1>
          <p>管理平台上的驾校信息，支持新增、编辑、删除操作</p>
        </div>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/schools/new")}
        >
          <FaPlus /> 新增驾校
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索驾校名称或地址..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* 驾校列表 */}
      {loading ? (
        <div className="loading-state">加载中...</div>
      ) : filteredSchools.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏫</div>
          <h3>{searchKeyword ? "未找到匹配的驾校" : "暂无驾校数据"}</h3>
          <p>
            {searchKeyword
              ? "请尝试其他关键词"
              : '点击"新增驾校"添加第一个驾校'}
          </p>
        </div>
      ) : (
        <div className="school-list">
          {filteredSchools.map((school) => (
            <div key={school.id} className="school-card">
              <div className="school-info">
                <div className="school-name">{school.name}</div>
                <div className="school-meta">
                  <span className="meta-item rating">
                    <FaStar className="icon" />
                    {school.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="meta-item">
                    <FaComments className="icon" />
                    {school.reviewCount || 0} 条评价
                  </span>
                  <span className="meta-item">
                    <FaMapMarkerAlt className="icon" />
                    {school.address || "暂无地址"}
                  </span>
                </div>
              </div>
              <div className="school-actions">
                <button
                  className="action-btn view"
                  onClick={() => navigate(`/admin/schools/view/${school.id}`)}
                  title="查看详情"
                >
                  <FaEye /> 查看
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => navigate(`/admin/schools/edit/${school.id}`)}
                  title="编辑"
                >
                  <FaEdit /> 编辑
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => openDeleteModal(school)}
                  title="删除"
                >
                  <FaTrash /> 删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteModal.show && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ show: false, school: null })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>
              确定要删除驾校{" "}
              <span className="school-name-highlight">
                {deleteModal.school?.name}
              </span>{" "}
              吗？
              <br />
              删除后该驾校将不再显示，但关联的评价数据会保留。
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setDeleteModal({ show: false, school: null })}
              >
                取消
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolManagement;
