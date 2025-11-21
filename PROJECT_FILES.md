# FlowSpace 项目文件清单

## 📁 主要文件结构

```
FlowSpace/
├── index.html              # 仪表板主页
├── projects.html           # 项目管理页面
├── journal.html            # 工作日记页面
├── planner.html            # 每日计划页面
├── main.js                 # 主要JavaScript逻辑
├── resources/              # 资源文件夹
│   ├── hero-bg.png        # 背景图片
│   ├── productivity-visual.png  # 生产力可视化图片
│   └── dashboard-mockup.png     # 仪表板模型图片
├── README.md               # 项目说明文档
├── design.md               # 设计文档
├── interaction.md          # 交互设计文档
├── outline.md              # 项目大纲
├── Dockerfile              # Docker配置文件
├── docker-compose.yml      # Docker Compose配置
├── nginx-proxy.conf        # Nginx代理配置
├── deploy.sh               # 部署脚本
├── push-to-github.sh       # GitHub推送脚本
├── GITHUB_PUSH_GUIDE.md    # GitHub推送指南
├── PROJECT_FILES.md        # 本文件
└── .gitignore             # Git忽略文件
```

## 📄 文件说明

### 🌐 核心页面文件
- **`index.html`** - 仪表板主页，显示项目概览和今日任务
- **`projects.html`** - 项目管理页面，支持看板视图和任务管理
- **`journal.html`** - 工作日记页面，Markdown编辑器和日记管理
- **`planner.html`** - 每日计划页面，日历和任务规划
- **`main.js`** - 核心JavaScript逻辑，处理所有交互功能

### 🎨 资源文件
- **`resources/hero-bg.png`** - 主页背景图片
- **`resources/productivity-visual.png`** - 生产力可视化图片
- **`resources/dashboard-mockup.png`** - 仪表板模型图片

### 📚 文档文件
- **`README.md`** - 项目主要说明文档
- **`design.md`** - UI/UX设计规范文档
- **`interaction.md`** - 交互设计详细说明
- **`outline.md`** - 项目结构大纲
- **`GITHUB_PUSH_GUIDE.md`** - GitHub推送详细指南
- **`PROJECT_FILES.md`** - 项目文件清单

### 🐳 部署配置
- **`Dockerfile`** - Docker容器配置
- **`docker-compose.yml`** - Docker Compose服务配置
- **`nginx-proxy.conf`** - Nginx反向代理配置
- **`deploy.sh`** - 自动化部署脚本
- **`.dockerignore`** - Docker构建忽略文件

### 🔧 开发工具
- **`push-to-github.sh`** - 自动化GitHub推送脚本
- **`.gitignore`** - Git版本控制忽略文件

## 🎯 核心功能模块

### 1. 仪表板 (index.html)
- 项目统计概览
- 今日任务预览
- 快速操作按钮
- 数据可视化图表

### 2. 项目管理 (projects.html)
- 看板视图
- 任务状态管理
- 优先级设置
- 项目统计

### 3. 工作日记 (journal.html)
- Markdown编辑器
- 实时预览
- 标签管理
- 全文搜索

### 4. 每日计划 (planner.html)
- 智能日历
- 任务时间规划
- 完成度统计
- 任务筛选

## 🛠️ 技术栈

- **HTML5/CSS3** - 现代Web标准
- **Tailwind CSS** - 实用优先CSS框架
- **JavaScript ES6+** - 原生现代JavaScript
- **Anime.js** - 流畅动画效果
- **ECharts.js** - 专业数据可视化
- **LocalStorage** - 安全本地存储
- **Docker** - 容器化部署

## 📊 项目统计

- **总文件数**: 20+ 文件
- **代码行数**: 约2000+ 行
- **页面数**: 4个主要页面
- **功能模块**: 4个核心模块
- **部署方式**: Docker + Nginx

## 🚀 使用说明

1. **本地运行**: `python -m http.server 8000`
2. **Docker部署**: `docker-compose up -d`
3. **生产部署**: `./deploy.sh`
4. **GitHub推送**: `./push-to-github.sh`

---

**FlowSpace** - 您的个人工作流空间管理器 🌌