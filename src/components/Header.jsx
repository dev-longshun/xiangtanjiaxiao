import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSchool, FaChartBar, FaPaperPlane, FaInfoCircle } from 'react-icons/fa';
import './Header.css';

function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
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
        </nav>
      </div>
    </header>
  );
}

export default Header;

