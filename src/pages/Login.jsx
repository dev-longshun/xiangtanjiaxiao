// ===== 导入依赖 =====
import { useState } from "react"; // React Hook，用于管理组件状态
import { useNavigate, Link } from "react-router-dom"; // 路由相关（跳转、链接）
import { authAPI } from "../utils/api"; // 导入 API 工具类（调用后端接口）
import "./Login.css"; // 页面样式

/**
 * 登录页面组件
 *
 * 这是一个 React 函数式组件，负责：
 * 1. 渲染登录表单（用户名、密码输入框）
 * 2. 处理用户输入
 * 3. 调用后端登录接口
 * 4. 保存 Token 并跳转首页
 */
function Login() {
  // ===== 初始化工具和状态 =====
  const navigate = useNavigate(); // 路由跳转工具（类似后端 redirect）

  // 表单数据状态（类似 Java 的成员变量）
  const [formData, setFormData] = useState({
    username: "", // 用户名（可以是数字ID或昵称）
    password: "", // 密码
  });

  const [loading, setLoading] = useState(false); // 是否正在加载（防止重复提交）
  const [error, setError] = useState(""); // 错误提示信息

  // ===== 处理输入框变化 =====
  /**
   * 当用户在输入框输入时触发
   * 例如：用户在用户名输入框输入 "1"，则 formData.username 变为 "1"
   */
  const handleChange = (e) => {
    const { name, value } = e.target; // 获取输入框的 name 和 value
    setFormData((prev) => ({
      ...prev, // 保留其他字段
      [name]: value, // 更新对应字段（username 或 password）
    }));
    setError(""); // 清除之前的错误提示
  };

  // ===== 核心：处理登录提交 =====
  /**
   * 用户点击"登录"按钮时触发
   * 这是前端调用后端的核心流程
   */
  const handleSubmit = async (e) => {
    // 阻止表单默认提交行为（避免页面刷新）
    e.preventDefault();
    setError(""); // 清空错误提示

    // ===== 第1步：前端表单验证 =====
    // 在发送请求前先检查，减少无效请求
    if (!formData.username.trim()) {
      setError("请输入用户名或昵称");
      return; // 验证失败，终止流程
    }
    if (!formData.password) {
      setError("请输入密码");
      return;
    }

    // ===== 第2步：设置加载状态 =====
    // 禁用提交按钮，防止用户重复点击
    setLoading(true);

    try {
      // ===== 第3步：调用后端登录接口 =====
      // 这里开始执行网络请求，流程如下：
      //
      // authAPI.login(formData.username, formData.password)
      //   ↓ 调用 src/utils/api.js 中的 login 函数
      //   ↓ login 函数内部调用 request('/api/auth/login', {...})
      //   ↓ request 函数执行：
      //     1. 从 localStorage 读取 token（如果有）
      //     2. 构造请求头：{ "Content-Type": "application/json", "Authorization": "Bearer ..." }
      //     3. 构造请求体：{ "username": "10001", "password": "123456" }
      //     4. 调用 fetch('http://localhost:7070/api/auth/login', {
      //          method: 'POST',
      //          headers: { ... },
      //          body: '{"username":"10001","password":"123456"}'
      //        })
      //   ↓ 浏览器发送 HTTP POST 请求到后端
      //   ↓ 请求经过网络传输到 Spring Boot 服务器（localhost:7070）
      //   ↓ Spring Security 拦截请求：
      //     - SecurityConfig 检查 /api/auth/login 是否在 permitAll 列表（是，放行）
      //   ↓ DispatcherServlet 根据 @PostMapping("/api/auth/login") 路由到 AuthController
      //   ↓ AuthController.login(@RequestBody LoginRequest request) 接收请求
      //     - Spring 自动将 JSON 字符串反序列化为 LoginRequest 对象
      //     - LoginRequest { username: "10001", password: "123456" }
      //   ↓ Controller 调用 AuthService.login(request)
      //   ↓ Service 执行业务逻辑：
      //     1. 根据 username 查询数据库（UserMapper.selectByUsername）
      //     2. 比对密码（BCryptPasswordEncoder.matches）
      //     3. 生成 JWT Token（JwtUtil.generateToken）
      //     4. 封装返回数据：LoginResponse { token: "eyJhbGc...", username: "10001", ... }
      //   ↓ Controller 返回 Result.success(loginResponse, "登录成功")
      //     - Result { code: 200, message: "登录成功", data: { token: "...", username: "..." } }
      //   ↓ Spring Boot 将 Result 对象序列化为 JSON 字符串
      //   ↓ HTTP 响应返回给浏览器（Response Body）
      //   ↓ fetch() 接收响应
      //   ↓ response.json() 解析 JSON 字符串为 JavaScript 对象
      //   ↓ 返回给这里的 result 变量
      const result = await authAPI.login(formData.username, formData.password);

      // ===== 第4步：处理后端响应 =====
      // result 格式：{ code: 200, message: "登录成功", data: { token: "...", username: "10001" } }
      if (result.code === 200) {
        // ===== 第5步：登录成功，保存 Token 和用户信息 =====
        // localStorage.setItem() 类似后端的 Session.setAttribute()
        // Token 会被永久保存在浏览器本地，直到手动删除或退出登录
        localStorage.setItem("token", result.data.token); // 保存 JWT Token
        localStorage.setItem(
          "username",
          result.data.username || formData.username
        ); // 保存用户名
        localStorage.setItem(
          "nickname",
          result.data.nickname || formData.username
        ); // 保存昵称
        localStorage.setItem("role", result.data.role || "ROLE_USER"); // 保存角色

        // 控制台输出（方便调试）
        console.log(
          "登录成功，Token:",
          result.data.token,
          "角色:",
          result.data.role
        );

        // ===== 第6步：根据角色跳转 =====
        // 管理员跳转到管理后台，普通用户跳转到首页
        if (result.data.role === "ROLE_ADMIN") {
          alert("管理员登录成功！");
          navigate("/admin");
        } else {
          alert("登录成功！");
          navigate("/");
        }
      } else {
        // ===== 登录失败：显示后端返回的错误信息 =====
        // 例如：result.message = "用户名不存在" 或 "密码错误"
        setError(result.message || "登录失败，请检查用户名和密码");
      }
    } catch (err) {
      // ===== 第7步：捕获网络错误 =====
      // 可能的错误：
      // 1. 后端服务未启动（fetch 会抛出 TypeError: Failed to fetch）
      // 2. 网络超时
      // 3. CORS 跨域问题
      console.error("登录失败:", err);
      setError("网络错误，请稍后重试");
    } finally {
      // ===== 第8步：结束加载状态 =====
      // 无论成功或失败，都要恢复按钮可点击状态
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>用户登录</h1>
          <p>欢迎回来，请登录您的账户</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">用户名 / 昵称</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="输入系统用户名（如 10001）或昵称"
              disabled={loading}
            />
            <span className="form-hint">
              支持使用系统生成的数字ID或您的昵称登录
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="输入密码"
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="login-footer">
          还没有账户？<Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
