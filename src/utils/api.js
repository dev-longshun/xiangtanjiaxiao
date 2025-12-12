/**
 * API 工具类 - 封装后端接口调用
 * 
 * 这个文件是前端调用后端的核心入口，负责：
 * 1. 统一管理 API 基础地址
 * 2. 自动添加 Token 到请求头
 * 3. 统一错误处理
 * 4. 按模块分类导出接口（authAPI、schoolAPI、reviewAPI）
 */

// ===== 步骤1：获取后端服务器地址 =====
// 从环境变量读取 API 基础地址（开发环境：http://localhost:7070）
// 这个值来自 .env.development 文件中的 VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:7070';

/**
 * 通用请求封装函数
 * 
 * 这是所有 API 调用的底层实现，类似后端的 RestTemplate 或 HttpClient
 * 
 * @param {string} url - API 路径（如 '/api/auth/login'）
 * @param {object} options - 请求配置（method, body, headers 等）
 * @returns {Promise<object>} 返回后端的 Result<T> 对象
 */
async function request(url, options = {}) {
  // ===== 步骤2：从浏览器本地存储读取 Token =====
  // localStorage 类似后端的 Session，用于持久化存储用户登录凭证
  // 用户登录成功后，会将 Token 保存到 localStorage（见 Login.jsx 第45行）
  const token = localStorage.getItem('token');
  
  // ===== 步骤3：构造 HTTP 请求头 =====
  const headers = {
    // 告诉后端发送的是 JSON 格式数据（对应后端 @RequestBody）
    'Content-Type': 'application/json',
    // 合并外部传入的自定义请求头（如果有）
    ...options.headers,
  };

  // ===== 步骤4：如果用户已登录，自动添加 Token 到请求头 =====
  // 这样后续所有 API 调用都会自动携带 Token，无需手动添加
  // 后端通过 JwtAuthenticationFilter 提取这个 Token 进行身份验证
  if (token) {
    // 格式：Authorization: Bearer eyJhbGc...
    // 对应后端：String token = request.getHeader("Authorization")
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // ===== 步骤5：发起 HTTP 请求 =====
    // fetch() 是浏览器原生 API，类似后端的 RestTemplate.exchange()
    // 完整 URL = API_BASE + url，例如：
    // http://localhost:7070 + /api/auth/login = http://localhost:7070/api/auth/login
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,  // 包含 method（GET/POST）、body（请求体）等
      headers,     // 请求头（Content-Type、Authorization）
    });

    // ===== 步骤6：解析后端返回的 JSON 数据 =====
    // 后端返回的 Result<T> 对象会被自动解析为 JavaScript 对象
    // 例如：{ code: 200, message: "登录成功", data: { token: "...", username: "..." } }
    const result = await response.json();
    
    // ===== 步骤7：返回解析后的数据给调用方 =====
    // 调用方可以通过 result.code 判断成功/失败
    return result;
    
  } catch (error) {
    // ===== 步骤8：统一错误处理 =====
    // 捕获网络错误、超时、后端服务未启动等异常
    console.error('API 请求失败:', error);
    throw error;  // 抛给调用方处理（如 Login.jsx 的 catch 块）
  }
}

// ===== 认证相关接口（对应后端 AuthController） =====
/**
 * 认证接口模块
 * 
 * 这个对象封装了所有与用户认证相关的 API 调用
 * 前端通过 import { authAPI } from '../utils/api' 导入使用
 */
export const authAPI = {
  /**
   * 用户注册
   * 
   * 调用链：
   * Register.jsx → authAPI.register() → request() → fetch() → 后端 POST /api/auth/register
   * 
   * @param {string} nickname - 用户昵称（2-20字符）
   * @param {string} password - 密码（6-20字符）
   * @returns {Promise<object>} 后端返回：{ code: 200, message: "注册成功", data: { username: "10001", nickname: "..." } }
   */
  register(nickname, password) {
    // 调用底层 request() 函数
    return request('/api/auth/register', {
      method: 'POST',  // HTTP 方法（对应后端 @PostMapping）
      // JSON.stringify() 将 JavaScript 对象转为 JSON 字符串
      // { nickname: "测试", password: "123456" } → '{"nickname":"测试","password":"123456"}'
      // 对应后端：@RequestBody RegisterRequest request
      body: JSON.stringify({ nickname, password }),
    });
  },

  /**
   * 用户登录
   * 
   * 完整调用流程（详见下方注释）：
   * Login.jsx 用户点击按钮 
   *   → handleSubmit() 函数
   *   → authAPI.login(username, password)
   *   → request('/api/auth/login', {...})
   *   → fetch('http://localhost:7070/api/auth/login', {...})
   *   → 浏览器发送 HTTP POST 请求到后端
   *   → 后端 AuthController.login() 接收
   *   → 返回 Result<LoginResponse>
   *   → fetch 接收响应
   *   → response.json() 解析
   *   → 返回给 Login.jsx
   *   → 保存 token 到 localStorage
   * 
   * @param {string} username - 用户名（数字ID如 "10001" 或昵称）
   * @param {string} password - 密码
   * @returns {Promise<object>} 后端返回：{ code: 200, message: "登录成功", data: { token: "...", username: "10001" } }
   */
  login(username, password) {
    return request('/api/auth/login', {
      method: 'POST',
      // 请求体示例：{"username":"10001","password":"123456"}
      // 后端接收：LoginRequest { private String username; private String password; }
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * 退出登录
   * 
   * 调用链：
   * Header.jsx → authAPI.logout() → request() → 后端 POST /api/auth/logout
   * 后端会将 Token 加入黑名单（TokenBlacklistManager）
   * 
   * @returns {Promise<object>} 后端返回：{ code: 200, message: "退出成功", data: null }
   */
  logout() {
    return request('/api/auth/logout', {
      method: 'POST',
      // 这个接口需要 Token（request() 函数会自动从 localStorage 读取并添加到请求头）
    });
  },
};

/**
 * 驾校接口
 */
export const schoolAPI = {
  /**
   * 获取所有驾校
   */
  getAllSchools() {
    return request('/api/schools');
  },

  /**
   * 获取驾校详情
   * @param {string} id - 驾校ID
   */
  getSchoolById(id) {
    return request(`/api/schools/${id}`);
  },

  /**
   * 搜索驾校
   * @param {string} keyword - 关键字
   */
  searchSchools(keyword) {
    return request(`/api/schools/search?keyword=${encodeURIComponent(keyword)}`);
  },
};

/**
 * 评价接口
 */
export const reviewAPI = {
  /**
   * 提交评价
   * @param {object} reviewData - 评价数据
   */
  submitReview(reviewData) {
    return request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * 获取驾校评价列表
   * @param {string} schoolId - 驾校ID
   */
  getReviewsBySchoolId(schoolId) {
    return request(`/api/reviews/school/${schoolId}`);
  },

  /**
   * 获取我的投稿
   */
  getMyReviews() {
    return request('/api/reviews/my');
  },
};

/**
 * 上传 API
 */
export const uploadAPI = {
  /**
   * 上传单张图片
   * @param {File} file - 图片文件对象
   * @returns {Promise<Result<string>>} 返回图片URL
   */
  async uploadImage(file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  },
};

export default {
  authAPI,
  schoolAPI,
  reviewAPI,
  uploadAPI,
};
