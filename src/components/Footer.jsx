import { FaQq, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>湘潭驾校评价网</h3>
            <p>公益性驾校信息分享平台</p>
          </div>
          <div className="footer-section">
            <h4>联系我们</h4>
            <p>
              <FaQq /> QQ: 123456789
            </p>
            <p>
              <FaEnvelope /> 邮箱: xiangtan-jiaxiao@qq.com
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 湘潭驾校评价网 | 所有评价均来自学员真实投稿</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

