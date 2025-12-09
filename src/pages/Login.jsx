import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("请填写用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || "登录失败");
      }
    } catch (err) {
      setError(err.message || "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>用户登录</h1>
          <p>登录后可投稿评价、查看投稿状态</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> 用户名 / 昵称
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名或昵称"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> 密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            <FaSignInAlt /> {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            还没有账号？<Link to="/register">立即注册</Link>
          </p>
          <p>
            <Link to="/admin/login">管理员登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
