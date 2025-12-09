# 湘潭驾校评价平台 - AI 开发指南

## 项目概述

这是一个前后端分离的驾校评价平台，从纯前端静态网站演进到 Spring Boot + React 架构。核心功能包括驾校信息展示、用户评价投稿、管理后台。

**关键特点**：
- 暗色主题 + 紫色渐变视觉风格（毛玻璃、发光效果）
- 最小侵入原则：避免大规模改动现有代码
- 文档先行：新功能开发前必须编写设计文档

---

## 技术栈速查

### 前端
- **React 19.1.1** + Vite 7.1.7 + React Router v7.9.4
- 原生 `fetch` API（无 axios），统一封装在 `src/utils/api.js`
- React Icons 5.5.0
- **无 UI 库**：所有组件自定义开发

### 后端
- **Spring Boot 3.1.5** + MyBatis-Plus 3.5.5
- Spring Security + JWT 认证
- MySQL 8.x (utf8mb4)
- Swagger UI（`localhost:7070/swagger-ui/index.html`）

---

## 架构关键点

### 前端数据流
```
用户操作 → React 组件 → src/utils/api.js 
→ fetch(`${VITE_API_BASE}/api/xxx`) → 后端 Spring Boot
→ 返回 Result<T> 格式 → 组件处理响应
```

### 认证机制
- JWT Token 存储在 `localStorage.getItem('token')`
- API 工具类自动在请求头添加 `Authorization: Bearer {token}`
- Token 过期时间：24小时（后端黑名单管理）

### 后端分层架构
```
Controller（接收请求、参数校验、返回响应）
    ↓
Service（业务逻辑、事务管理）
    ↓
Mapper（MyBatis-Plus 数据访问）
    ↓
MySQL（InnoDB 存储引擎）
```

**规范**：
- Controller 禁止包含业务逻辑
- Service 方法加 `@Transactional`
- 使用 SLF4J 日志记录关键操作

---

## 视觉设计系统

### 主题色彩（CSS 变量定义在 `src/index.css`）
```css
/* 品牌色：紫色渐变 */
--primary-color: #6366f1
--primary-light: #a78bfa

/* 文字色（暗色主题） */
rgba(255, 255, 255, 0.95)  /* 主要文字 */
rgba(255, 255, 255, 0.45)  /* 占位符 */
rgba(167, 139, 250, 0.7)   /* 紫色调辅助文字 */
```

### 核心视觉模式
1. **毛玻璃卡片**：
   ```css
   background: rgba(15, 12, 41, 0.75);
   backdrop-filter: blur(20px);
   border: 1px solid rgba(255, 255, 255, 0.1);
   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
   ```

2. **渐变标题**：
   ```css
   background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%);
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   ```

3. **紫色渐变按钮 + 光泽扫过动画**：
   参考 `src/pages/Login.css` 中的 `.submit-btn`

### 新页面必须遵循的样式模板
复制 `src/pages/Login.css` 的结构：
- 页面容器：`min-height: 100vh` + `display: flex` 居中
- 内容卡片：毛玻璃效果 + `fadeInUp` 动画
- 输入框：深色半透明底 + 紫色聚焦光晕
- 按钮：渐变背景 + 悬停发光

---

## 开发工作流

### 新功能开发流程
1. **文档阶段**（必须）：
   - 在 `docs/` 创建设计文档（参考 `docs/登录注册接口测试指南.md`）
   - 内容：功能概述、页面结构、API 接口、UI 设计
   - 提交给项目负责人审阅

2. **编码阶段**：
   - 创建 `src/pages/NewPage.jsx` + `NewPage.css`
   - 复制相似页面的样式模板（如 `Login.css`）
   - 使用 `src/utils/api.js` 进行 API 调用
   - 确保视觉风格与现有页面一致

3. **测试与文档**：
   - 功能测试 + 响应式测试
   - 更新 `docs/项目开发状态与规划.md`

### 常用命令
```bash
# 启动前端（端口 5173，被占用时自动递增）
npm run dev

# 启动后端（端口 7070）
cd backend && mvn spring-boot:run

# 强制刷新浏览器缓存
Ctrl + Shift + R（Windows）/ Cmd + Shift + R（Mac）
```

---

## 代码规范速查

### 前端组件模板
```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './PageName.css';

function PageName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);  // 页面加载滚动到顶部
  }, []);

  return (
    <div className="page-name">
      <div className="page-container">
        {/* 内容 */}
      </div>
    </div>
  );
}

export default PageName;
```

### API 调用模式
```javascript
try {
  setLoading(true);
  const result = await authAPI.login(username, password);
  
  if (result.code === 200) {
    localStorage.setItem('token', result.data.token);
    navigate('/');
  } else {
    setError(result.message || '操作失败');
  }
} catch (err) {
  console.error('请求失败:', err);
  setError('网络错误，请稍后重试');
} finally {
  setLoading(false);
}
```

### 后端 Controller 规范
```java
@RestController
@RequestMapping("/api/xxx")
@RequiredArgsConstructor  // Lombok 构造器注入
@Tag(name = "模块名称", description = "描述")
public class XxxController {
    private final XxxService xxxService;

    @PostMapping
    @Operation(summary = "操作名称")
    public Result<Xxx> create(@RequestBody XxxDTO dto) {
        // 1. 参数校验（可选，使用 @Valid）
        // 2. 调用 Service
        Xxx result = xxxService.create(dto);
        // 3. 返回统一格式
        return Result.success(result, "操作成功");
    }
}
```

---

## 关键文件导航

### 前端核心文件
- `src/utils/api.js` - **API 统一封装**（所有后端调用入口）
- `src/index.css` - 全局样式、CSS 变量、暗色主题背景
- `src/components/Header.jsx` - 导航栏（毛玻璃效果参考）
- `src/pages/Login.jsx` + `Login.css` - **样式模板参考**（最新暗色主题）

### 后端核心文件
- `backend/src/.../config/SecurityConfig.java` - Spring Security 配置、权限规则
- `backend/src/.../util/JwtUtil.java` - JWT 生成与验证
- `backend/src/.../config/TokenBlacklistManager.java` - Token 黑名单管理

### 文档资源
- `docs/前后端接口对接文档.md` - **API 接口完整清单**
- `docs/项目开发状态与规划.md` - 功能清单、技术债务
- `docs/登录注册接口测试指南.md` - API 测试步骤示例

---

## 常见陷阱与解决方案

### 1. 输入框文字看不见
**原因**：`src/index.css` 全局样式可能设置了不可见颜色  
**解决**：组件 CSS 显式设置 `color: #ffffff`

### 2. 页面布局错乱
**原因**：浏览器缓存旧 CSS  
**解决**：`Ctrl + Shift + R` 强制刷新，或重启开发服务器

### 3. API 返回 401 Unauthorized
**原因**：Token 过期或未携带  
**排查**：
- 检查 `localStorage.getItem('token')` 是否存在
- 查看浏览器 Network 标签页的请求头 `Authorization`
- 重新登录获取新 Token

### 4. 后端修改未生效
**原因**：Spring Boot 需重新编译  
**解决**：停止服务（Ctrl+C）→ `mvn clean install` → 重新 `mvn spring-boot:run`

---

## 禁止操作清单

1. ❌ 修改全局 CSS 变量（`src/index.css`）
2. ❌ 大幅修改现有页面结构（Home、AllSchools 等）
3. ❌ 引入新 UI 库（Material-UI、Ant Design）
4. ❌ 使用内联样式（`style={{ ... }}`）
5. ❌ 硬编码 API 地址（必须用 `import.meta.env.VITE_API_BASE`）
6. ❌ Controller 层编写业务逻辑
7. ❌ 直接操作 DOM（`document.getElementById`）

---

## 协作约定

### 与项目负责人沟通时机
- 需要大规模改动现有代码时
- 不确定某个功能的实现方式时
- 新增页面或核心功能前（提交设计文档）
- 发现技术债务或架构问题时

### 提交变更规范
- **Commit 信息**：中文描述（如："新增用户登录页面"、"修复输入框颜色问题"）
- **PR 描述**：包含变更说明、测试步骤、截图（UI 变更时）
- **文档更新**：修改功能时同步更新 `docs/` 中的相关文档

---

## 快速上手检查清单

新 AI Agent 接手项目时，请依次确认：

- [ ] 阅读 `README.md` 了解项目背景
- [ ] 查看 `docs/项目开发状态与规划.md` 了解当前进度
- [ ] 浏览 `src/pages/Login.jsx` + `Login.css` 熟悉代码风格
- [ ] 启动前后端服务（`npm run dev` + `mvn spring-boot:run`）
- [ ] 访问 `localhost:5173/login` 测试登录功能
- [ ] 查看 Swagger UI（`localhost:7070/swagger-ui/index.html`）
- [ ] 阅读 `.github/instructions/前端开发全局规则.instructions.md` 详细规范

---

**文档版本**：v1.0  
**最后更新**：2025年12月6日  
**维护者**：项目负责人
