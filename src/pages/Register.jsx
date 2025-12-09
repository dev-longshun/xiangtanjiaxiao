import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

function Register() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nickname.trim()) {
      setError("请填写昵称");
      return;
    }
    if (nickname.trim().length < 2 || nickname.trim().length > 20) {
      setError("昵称长度需在 2-20 个字符之间");
      return;
    }
    if (!password || password.length < 6) {
      setError("密码长度不能少于 6 位");
      return;
    }
    if (password.length > 20) {
      setError("密码长度不能超过 20 位");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const result = await register(nickname.trim(), password);
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setError(result.message || "注册失败");
      }
    } catch (err) {
      setError(err.message || "注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>用户注册</h1>
          <p>注册账号后可投稿评价、分享学车经历</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="nickname">
              <FaUser /> 昵称
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2-20 个字符，用于评论展示"
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
              placeholder="6-20 个字符"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FaLock /> 确认密码
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            <FaUserPlus /> {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            已有账号？<Link to="/login">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
