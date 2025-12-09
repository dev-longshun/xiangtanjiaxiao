import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 清除错误提示
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 前端验证
    if (!formData.nickname.trim()) {
      setError('请输入昵称');
      return;
    }
    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      setError('昵称长度应在 2-20 个字符之间');
      return;
    }
    if (!formData.password) {
      setError('请输入密码');
      return;
    }
    if (formData.password.length < 6) {
      setError('密码长度不能少于 6 位');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.register(formData.nickname, formData.password);
      
      if (result.code === 200) {
        // 注册成功
        setSuccess(true);
        setRegisteredUsername(result.data.username);
        
        // 保存 token
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('username', result.data.username);
        localStorage.setItem('nickname', formData.nickname);
        
        console.log('注册成功，用户名:', result.data.username, 'Token:', result.data.token);
        
        // 3秒后跳转到首页
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(result.message || '注册失败，请重试');
      }
    } catch (err) {
      console.error('注册失败:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>用户注册</h1>
          <p>创建账户，开始分享您的学车经历</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              <p>注册成功！3秒后自动跳转...</p>
              <div className="username-display">
                <p>您的系统用户名（用于登录）：</p>
                <p><strong>{registeredUsername}</strong></p>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  请妥善保管此用户名，登录时可使用用户名或昵称
                </p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nickname">昵称</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="输入您的昵称（2-20个字符）"
              disabled={loading || success}
            />
            <span className="form-hint">昵称将用于评价展示，注册后可用于登录</span>
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="输入密码（至少6位）"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="再次输入密码"
              disabled={loading || success}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || success}
          >
            {loading ? '注册中...' : success ? '注册成功' : '注册'}
          </button>
        </form>

        <div className="register-footer">
          已有账户？<Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
