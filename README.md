# 脸书小助手 - Astro 版本

专为 Facebook 注册设计的身份生成工具,现已迁移至 Astro 框架。

## 主要变更

### 技术栈迁移
- ✅ 从 **Next.js** 迁移至 **Astro 5**
- ✅ 纯静态站点,无需服务器
- ✅ 保留 React 组件(通过 Astro Islands)
- ✅ 支持任意静态托管平台

### IP 检测优化
- ✅ 客户端直接调用 **ipapi.co API**
- ✅ 无需后端服务器
- ✅ 免费且稳定
- ✅ 5秒超时保护

### 性能优化
- 更快的首屏加载速度
- 更小的 JavaScript 包体积
- 完全静态化,CDN 友好
- 可部署到任意静态托管平台

## 项目结构

```
├── src/
│   ├── components/      # React 组件
│   │   ├── MainApp.tsx         # 主应用
│   │   ├── MailPage.tsx        # 临时邮箱页面
│   │   ├── FavoritesPage.tsx   # 收藏页面
│   │   ├── NavigationMenu.tsx  # 导航菜单
│   │   ├── SharedBackground.tsx# 背景组件
│   │   └── FreeNoticeModal.tsx # 免费提示弹窗
│   ├── layouts/         # Astro 布局
│   │   └── Layout.astro        # 主布局
│   ├── lib/            # 工具库
│   │   ├── generator.ts        # 信息生成器
│   │   ├── countryData.ts      # 国家数据
│   │   ├── domains.ts          # 邮箱域名
│   │   ├── mailData.ts         # 邮箱数据管理
│   │   └── backgroundContext.tsx # 背景上下文
│   ├── pages/          # Astro 页面
│   │   ├── index.astro         # 首页
│   │   └── mail/
│   │       ├── index.astro    # 临时邮箱页面
│   │       └── favorites.astro # 收藏页面
│   └── styles/         # 全局样式
│       └── globals.css
├── astro.config.mjs    # Astro 配置
├── tailwind.config.ts  # Tailwind 配置
└── tsconfig.json      # TypeScript 配置
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## IP 检测

项目使用客户端 IP 检测:
- **服务商**: ipapi.co
- **方法**: 客户端直接调用
- **特性**:
  - 自动检测用户真实 IP
  - 免费使用
  - 5 秒超时保护
  - 返回国家代码和 IP 地址

## 部署

项目为纯静态站点,可部署到任意静态托管平台:

### 构建
```bash
npm run build
```

构建后的文件输出到 `dist/` 目录。

### 支持的托管平台
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- 任意静态文件服务器

## 主要功能

- ✅ 支持 30+ 国家/地区的身份信息生成
- ✅ 真实手机号格式(各国运营商号段)
- ✅ 智能密码生成(模拟真实用户习惯)
- ✅ 临时邮箱大全
- ✅ 收藏功能
- ✅ 响应式设计
- ✅ 移动端优化
- ✅ 触觉反馈

## 技术细节

### IP 检测实现
使用 ip-api.com 免费服务:
- 无需 API Key
- 支持 IPv4/IPv6
- 精确到城市级别
- 包含时区、地区信息
- 自动处理私有 IP 和代理

### React Islands
关键交互组件使用 React,通过 Astro Islands 模式按需加载:
- `client:load` - 页面加载时立即加载
- `client:only` - 仅在客户端渲染

## 浏览器兼容性

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 移动浏览器支持

## 许可证

MIT

## 联系方式

Telegram: [@fang180](https://t.me/fang180)
