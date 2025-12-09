import axios from "axios";

// API 基础配置
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：自动携带 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(new Error(data?.message || "请求失败"));
    }
    return Promise.reject(new Error("网络错误，请检查网络连接"));
  }
);

// ==================== 认证相关 API ====================

export const authAPI = {
  // 用户注册
  register: (nickname, password) =>
    api.post("/api/auth/register", { nickname, password }),

  // 用户登录
  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),

  // 管理员登录
  adminLogin: (username, password) =>
    api.post("/api/auth/admin/login", { username, password }),

  // 退出登录
  logout: () => api.post("/api/auth/logout"),
};

// ==================== 驾校相关 API ====================

export const schoolAPI = {
  // 获取所有驾校
  getAll: () => api.get("/api/schools"),

  // 获取驾校详情
  getById: (id) => api.get(`/api/schools/${id}`),

  // 搜索驾校
  search: (keyword) => api.get("/api/schools/search", { params: { keyword } }),

  // 管理员：创建驾校
  create: (school) => api.post("/api/admin/schools", school),

  // 管理员：更新驾校
  update: (id, school) => api.put(`/api/admin/schools/${id}`, school),

  // 管理员：删除驾校
  delete: (id) => api.delete(`/api/admin/schools/${id}`),
};

// ==================== 评价相关 API ====================

export const reviewAPI = {
  // 获取驾校的已审核评价
  getBySchoolId: (schoolId) => api.get(`/api/reviews/school/${schoolId}`),

  // 提交评价
  submit: (review) => api.post("/api/reviews", review),

  // 获取我的投稿
  getMy: (author) => api.get("/api/reviews/my", { params: { author } }),

  // 管理员：获取待审核评价
  getPending: () => api.get("/api/admin/reviews"),

  // 管理员：获取驾校所有评价
  getSchoolAll: (schoolId) => api.get(`/api/admin/reviews/school/${schoolId}`),

  // 管理员：审核评价
  review: (id, approved, rejectReason) =>
    api.post(`/api/admin/reviews/${id}/review`, { approved, rejectReason }),

  // 管理员：删除评价
  delete: (id) => api.delete(`/api/admin/reviews/${id}`),
};

// ==================== 文件上传 API ====================

export const uploadAPI = {
  // 上传图片
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
