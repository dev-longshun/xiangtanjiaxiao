import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSchool, FaChartBar, FaPaperPlane, FaInfoCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { authAPI } from '../utils/api';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, [location]); // 路由变化时重新检查

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('退出登录请求失败，但仍清除本地数据', err);
    }
    
    // 清除本地数据
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('nickname');
    
    setIsLoggedIn(false);
    setUsername('');
    
    alert('已退出登录');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>湘潭驾校评价网</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <FaHome /> 首页
          </Link>
          <Link to="/all-schools" className={`nav-link ${isActive('/all-schools') ? 'active' : ''}`}>
            <FaSchool /> 全部驾校
          </Link>
          <Link to="/data-comparison" className={`nav-link ${isActive('/data-comparison') ? 'active' : ''}`}>
            <FaChartBar /> 数据统计
          </Link>
          <Link to="/submit" className={`nav-link ${isActive('/submit') ? 'active' : ''}`}>
            <FaPaperPlane /> 投稿
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            <FaInfoCircle /> 关于
          </Link>
          
          {isLoggedIn ? (
            <>
              <span className="nav-link user-info">
                <FaUser /> {username}
              </span>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <FaSignOutAlt /> 退出
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              <FaUser /> 登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;


