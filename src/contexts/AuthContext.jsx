import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 解析 JWT Token 获取用户信息
  const parseToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return {
        username: payload.sub,
        userId: payload.userId,
        roles: payload.roles,
        nickname: payload.nickname || payload.sub,
      };
    } catch {
      return null;
    }
  };

  // 注册
  const register = async (nickname, password) => {
    const response = await authAPI.register(nickname, password);
    if (response.code === 200) {
      const { token, username, nickname: nick } = response.data;
      const userData = { username, nickname: nick, roles: "ROLE_USER" };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: response.message };
  };

  // 登录
  const login = async (username, password) => {
    const response = await authAPI.login(username, password);
    if (response.code === 200) {
      const { token } = response.data;
      const userData = parseToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, message: response.message };
  };

  // 管理员登录
  const adminLogin = async (username, password) => {
    const response = await authAPI.adminLogin(username, password);
    if (response.code === 200) {
      const { token } = response.data;
      const userData = parseToken(token);
      if (!userData?.roles?.includes("ROLE_ADMIN")) {
        return { success: false, message: "非管理员账号" };
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, message: response.message };
  };

  // 退出登录
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // 即使后端调用失败，也清除本地状态
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 检查是否为管理员
  const isAdmin = () => user?.roles?.includes("ROLE_ADMIN");

  // 检查是否已登录
  const isAuthenticated = () => !!user;

  const value = {
    user,
    loading,
    register,
    login,
    adminLogin,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
