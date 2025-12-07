import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserShield } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("请填写用户名和密码");
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(username.trim(), password);
      if (result.success) {
        navigate("/admin", { replace: true });
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
          <h1>
            <FaUserShield /> 管理员登录
          </h1>
          <p>仅限管理员账号登录</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> 用户名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入管理员用户名"
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
            <FaUserShield /> {loading ? "登录中..." : "管理员登录"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login">返回用户登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
