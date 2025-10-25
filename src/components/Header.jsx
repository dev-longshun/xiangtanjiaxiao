import { Link } from 'react-router-dom';
import { FaHome, FaPaperPlane, FaInfoCircle } from 'react-icons/fa';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>湘潭驾校评价网</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <FaHome /> 首页
          </Link>
          <Link to="/submit" className="nav-link">
            <FaPaperPlane /> 投稿
          </Link>
          <Link to="/about" className="nav-link">
            <FaInfoCircle /> 关于
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

