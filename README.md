# 湘潭驾校评价网

一个基于 React 的驾校评价论坛静态网站，为湘潭地区学员提供真实的驾校信息和评价。

## 项目特点

- 🚀 **纯静态网站**：基于 React + Vite 构建，无需后端服务器
- 📝 **JSON 数据驱动**：所有数据存储在 JSON 文件中，简单易维护
- 🛠️ **命令行管理**：提供交互式命令行工具，轻松管理数据
- 📊 **数据可视化**：科技风格的驾考数据统计和对比系统
- 💚 **公益性质**：不接受广告，不收费，纯粹为学员服务
- 📱 **响应式设计**：完美适配电脑、平板、手机等各种设备
- 🎨 **现代简约**：采用卡片式设计，界面清爽美观

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **路由管理**: React Router v6
- **图标库**: React Icons
- **数据管理**: Node.js + Inquirer
- **部署平台**: Vercel / GitHub Pages / Cloudflare Pages

## 项目结构

```
jiaxiao-2/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Header.jsx       # 导航栏
│   │   ├── Footer.jsx       # 页脚
│   │   ├── SchoolCard.jsx   # 驾校卡片
│   │   └── ReviewCard.jsx   # 评价卡片
│   ├── pages/               # 页面组件
│   │   ├── Home.jsx         # 首页
│   │   ├── AllSchools.jsx   # 所有驾校页面
│   │   ├── DataComparison.jsx # 数据统计对比
│   │   ├── SchoolDetail.jsx # 驾校详情
│   │   ├── Submit.jsx       # 投稿说明
│   │   └── About.jsx        # 关于页面
│   ├── data/
│   │   └── data.json        # 数据文件
│   ├── App.jsx              # 根组件
│   └── main.jsx             # 入口文件
├── scripts/
│   └── manage-data.js       # 数据管理脚本
├── public/                  # 静态资源
├── package.json
└── vite.config.js
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 https://xiangtanjiaxiao.vercel.app/ 查看网站

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 数据管理

### 启动数据管理工具

```bash
npm run manage
```

### 管理工具功能

数据管理工具提供以下功能：

1. **添加新驾校** - 添加驾校基本信息
2. **添加新评价** - 为驾校添加学员评价
3. **编辑驾校信息** - 修改驾校信息
4. **删除评价** - 删除不适当的评价
5. **查看统计信息** - 查看驾校和评价统计
6. **退出** - 退出管理工具

### 数据文件位置

所有数据存储在 `src/data/data.json` 文件中。

### 数据结构

```json
{
  "schools": [
    {
      "id": "school-001",
      "name": "驾校名称",
      "address": "详细地址",
      "phone": "联系电话",
      "description": "驾校简介",
      "rating": 4.5,
      "reviewCount": 25,
      "tags": ["特色标签"],
      "courses": ["C1", "C2"],
      "examData": {
        "subject1": 96,
        "subject2": 88,
        "subject3": 91,
        "subject4": 97,
        "overall": 93,
        "totalStudents": 1280,
        "passedStudents": 1190
      }
    }
  ],
  "reviews": [
    {
      "id": "review-001",
      "schoolId": "school-001",
      "author": "学员昵称",
      "content": "评价内容",
      "rating": 5,
      "date": "2025-10-20",
      "tags": ["优质评价"]
    }
  ],
  "contact": {
    "qq": "QQ号",
    "email": "邮箱地址",
    "description": "投稿说明"
  }
}
```

## 数据可视化功能

网站提供了强大的数据统计和对比功能，帮助学员更直观地了解各驾校的考试通过率。

### 功能特点

- **整体统计概览**：显示所有驾校的累计培训学员数、成功拿证人数和平均通过率
- **智能驾校选择**：支持最多选择6所驾校进行对比
- **综合通过率对比**：以动画条形图展示各驾校的综合通过率排名
- **科目详细对比**：分别展示科目一、二、三、四的通过率对比
- **数据表格**：完整的数据表格，支持排序查看
- **科技感设计**：深色主题、发光效果、动画过渡，打造专业数据中心体验

### 访问方式

- 通过导航栏的 "数据统计" 链接访问
- 访问路径：`/data-comparison`

### 数据字段说明

每个驾校的 `examData` 包含以下字段：

- `subject1`：科目一通过率（%）
- `subject2`：科目二通过率（%）
- `subject3`：科目三通过率（%）
- `subject4`：科目四通过率（%）
- `overall`：综合通过率（%）
- `totalStudents`：累计培训学员数
- `passedStudents`：成功拿证学员数

## 部署

### 部署到 Vercel

1. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 登录并部署：
   ```bash
   vercel
   ```

3. 或者直接连接 GitHub 仓库，实现自动部署

### 部署到 GitHub Pages

1. 修改 `vite.config.js`，添加 base 路径：
   ```js
   export default defineConfig({
     base: '/your-repo-name/',
     // ...
   })
   ```

2. 安装 gh-pages：
   ```bash
   npm install -D gh-pages
   ```

3. 在 `package.json` 添加部署脚本：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. 执行部署：
   ```bash
   npm run deploy
   ```

### 部署到 Cloudflare Pages

1. 在 Cloudflare Pages 控制台创建项目
2. 连接 GitHub 仓库
3. 设置构建命令：`npm run build`
4. 设置输出目录：`dist`
5. 部署

## 内容更新流程

1. 学员通过 QQ 或邮箱投稿
2. 管理员收到投稿后，运行 `npm run manage`
3. 选择相应操作（添加驾校/添加评价）
4. 按照提示输入信息
5. 数据自动保存到 `data.json`
6. 重新构建并部署网站：
   ```bash
   npm run build
   vercel --prod  # 或其他部署命令
   ```

## 运营建议

1. **定期备份数据**：定期备份 `data.json` 文件
2. **审核投稿内容**：确保评价真实、客观、文明
3. **及时更新**：收到投稿后尽快审核并更新
4. **保持中立**：不偏袒任何驾校，公正展示评价
5. **隐私保护**：投稿时注意保护学员隐私信息

## 自定义配置

### 修改联系方式

编辑 `src/data/data.json` 中的 `contact` 部分：

```json
"contact": {
  "qq": "你的QQ号",
  "email": "你的邮箱",
  "description": "投稿说明文字"
}
```

### 修改网站标题

编辑 `index.html` 中的 `<title>` 标签

### 修改主题色

编辑 `src/index.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #3b82f6;  /* 主色调 */
  --secondary-color: #10b981; /* 次要色 */
  /* ... */
}
```

## 常见问题

### Q: 如何添加更多驾校？

A: 运行 `npm run manage`，选择"添加新驾校"，按提示输入信息即可。

### Q: 评分如何自动计算？

A: 系统会自动计算该驾校所有评价的平均分，无需手动输入。

### Q: 可以删除驾校吗？

A: 可以手动编辑 `data.json` 删除驾校条目，但建议保留驾校，只删除不当评价。

### Q: 如何本地测试数据修改？

A: 修改数据后运行 `npm run dev`，在浏览器中查看效果。

## 许可证

本项目采用 MIT 许可证。

## 联系方式

- QQ: 123456789
- 邮箱: xiangtan-jiaxiao@qq.com

---

**感谢使用湘潭驾校评价网！祝你学车顺利！** 🚗
