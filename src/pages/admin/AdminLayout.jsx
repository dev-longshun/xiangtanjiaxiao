import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaSchool,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { authAPI } from "../../utils/api";
import "./AdminLayout.css";

/**
 * 管理后台布局组件
 * 包含侧边栏导航 + 内容区域 + 权限守卫
 */
function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState("");

  // 权限检查
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");

    if (!token) {
      alert("请先登录");
      navigate("/login");
      return;
    }

    if (role !== "ROLE_ADMIN") {
      alert("无权限访问管理后台");
      navigate("/");
      return;
    }

    setUsername(savedUsername || "管理员");
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn("退出登录请求失败", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{sidebarOpen && "管理后台"}</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FaClipboardList className="nav-icon" />
            {sidebarOpen && <span>投稿审核</span>}
          </NavLink>

          <NavLink
            to="/admin/schools"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <FaSchool className="nav-icon" />
            {sidebarOpen && <span>驾校管理</span>}
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="nav-item back-home">
            <FaHome className="nav-icon" />
            {sidebarOpen && <span>返回前台</span>}
          </NavLink>

          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignOutAlt className="nav-icon" />
            {sidebarOpen && <span>退出登录</span>}
          </button>

          {sidebarOpen && (
            <div className="user-info">
              <span className="user-label">当前用户</span>
              <span className="user-name">{username}</span>
            </div>
          )}
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
