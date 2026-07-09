# 诗词日历 - 项目文档

## 📋 目录

- [项目概述](#项目概述)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [安装指南](#安装指南)
- [开发指南](#开发指南)
- [构建打包](#构建打包)
- [API 参考](#api-参考)
- [常见问题](#常见问题)

---

## 项目概述

**诗词日历** 是一款跨端桌面应用：**每日一诗 · 精校 · 节气**。打开即读，安静、准确、好看。

### 核心功能（Phase 1）

- ✅ 约 180 首人工精校古诗词（真诗库，非粗筛堆量）
- ✅ 24 节气计算 + 可解释的每日选定引擎
- ✅ 本地预置短赏析；可选智谱 / DeepSeek **只做讲解增强**
- ✅ 收藏、极简设置
- ✅ 中国风卡片 UI
- ✅ 跨端支持（macOS、Windows）

> 原则：**真诗只来自精校库；AI 绝不冒充古人写诗。** 详见 `docs/PHASE1.md`。

---

## 功能特性

### 1. 诗词推荐

**推荐算法：**
```
日期种子 + 节气关键词 + 用户偏好 = 推荐的诗词
```

**推荐因素：**
- 📅 日期：确保同一天显示相同的诗词
- 🌤️ 节气：根据当前节气推荐相关诗词
- 👤️ 用户偏好：喜欢的诗人、季节、主题
- 🎲 随机性：基于日期种子的伪随机

### 2. 赏析（可选 AI 增强）

- 默认使用精校库预置短赏析
- 设置中开启「自动增强」后：智谱优先，DeepSeek 回退
- **只讲解原作**，不生成伪唐诗/伪宋词

### 3. 用户设置（克制）

- 显示：节气 / 朝代 / 作者 / 今日缘由
- 口味：偏爱诗人、主题（只加权，不硬过滤）
- 赏析：仅本地 / 自动增强（可填智谱、DeepSeek Key）

### 4. 中国风 UI

**设计元素：**
- 🎨 毛玻璃效果（backdrop-blur）
- 🔴 中国红装饰角
- 🖋️ 印章样式组件
- 📜 诗词卡片布局
- 🌸 季节背景图片（自动切换）

---

## 技术栈

### 前端
- **React 19** + **TypeScript**
- **Vite** (快速开发工具链）
- **Tailwind CSS** (原子化 CSS)
- **Framer Motion** (动画库)
- **date-fns** (日期处理)

### 桌面应用
- **Electron 34** (跨端框架)
- **Electron Vite** (Electron + Vite 集成)
- **Electron Builder** (打包工具)

### AI 集成
- **智谱 AI GLM-4** (大语言模型)
- **Chat Completions API** (对话接口)
- **Fetch API** (网络请求)

---

## 项目结构

```
poem-calendar/
├── src/
│   ├── main/                 # Electron 主进程
│   │   └── index.ts
│   ├── preload/              # 预加载脚本
│   │   └── index.ts
│   └── renderer/             # 渲染进程（前端）
│       ├── App.tsx            # 主应用组件
│       ├── main.tsx           # 入口文件
│       ├── components/         # React 组件
│       │   ├── PoemCard.tsx
│       │   ├── SettingsPanel.tsx
│       │   └── WindowControls.tsx
│       ├── data/               # 数据文件
│       │   └── poems精选.json  # 诗词库
│       ├── services/           # 服务层
│       │   └── zhipuAI.ts     # 智谱 AI 服务
│       ├── types/              # 类型定义
│       │   └── settings.ts     # 设置类型
│       └── utils/              # 工具函数
│           └── solarTerm.ts   # 24节气算法
├── out/                      # 构建输出
│   ├── main/
│   ├── preload/
│   └── renderer/
├── release/                  # 打包输出
│   └── ...
├── docs/                     # 文档目录
│   └── ...
├── package.json              # 项目配置
├── electron.vite.config.ts    # Electron Vite 配置
├── electron-builder.json      # Electron Builder 配置
├── tsconfig.json             # TypeScript 配置
├── tailwind.config.js        # Tailwind CSS 配置
└── vite.config.ts             # Vite 配置
```

---

## 安装指南

### 开发环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **git**: >= 2.0.0

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/reed-soul/poem-card-app.git
   cd poem-card-app/poem-calendar
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开应用**
   - 应用会自动打开
   - 访问 http://localhost:5173

---

## 开发指南

### 启动开发

```bash
# 开发模式（热重载）
npm run dev

# 构建预览
npm run preview

# 生产构建
npm run build
```

### 开发脚本

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build && electron-builder",
    "preview": "electron-vite preview"
  }
}
```

### 环境变量

创建 `.env` 文件（可选）：

```env
# 智谱 AI API Key（可选）
VITE_ZHIPU_AI_API_KEY=your_api_key_here

# 其他环境变量
# VITE_API_BASE_URL=https://api.example.com
```

---

## 构建打包

### 开发构建

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 打包输出

```bash
# macOS
out/release/诗词日历-0.1.0-arm64.dmg

# Windows (需要配置)
out/release/诗词日历 Setup 0.1.0.exe
```

---

## API 参考

### 智谱 AI 服务

**导入：**
```typescript
import { generatePoem, testApiKey, getApiKey } from './services/zhipuAI';
```

**生成诗词：**
```typescript
const poem = await generatePoem({
  style: '清新',
  season: '春天',
  theme: '山水',
  length: 4,
});

// 返回：
{
  title: '春日山水',
  author: 'AI诗人',
  dynasty: '现代',
  content: ['春山如黛草如烟', '绿水潺潺绕客船', ...],
  ai_generated: true,
  tags: ['清新', '春天', '山水', 'AI生成']
}
```

**测试 API Key：**
```typescript
const result = await testApiKey(apiKey);

// 返回：
{
  success: true,
  message: 'API Key 有效，智谱 AI 连接成功！',
  samplePoem: { ... }
}
```

### 24节气服务

**导入：**
```typescript
import { getNearestSolarTerm, getAllSolarTerms } from './utils/solarTerm';
```

**获取最近的节气：**
```typescript
const term = getNearestSolarTerm(new Date());

// 返回：
{
  name: '立春',
  date: new Date('2024-02-04'),
  keywords: ['春天', '开始', '温暖', '生机'],
  isToday: false
}
```

**获取所有节气：**
```typescript
const terms = getAllSolarTerms(2024);

// 返回 24 个节气的数组
```

---

## 常见问题

### 1. 构建失败

**问题：** `npm run build` 报错

**解决方案：**
```bash
# 清理缓存和重新安装
rm -rf node_modules package-lock.json
npm install

# 清理构建输出
rm -rf out dist release

# 重新构建
npm run build
```

### 2. 智谱 AI API 调用失败

**问题：** API Key 无效或网络错误

**解决方案：**
- 检查 API Key 是否正确
- 检查网络连接
- 检查智谱 AI 服务状态
- 尝试重新生成诗词

### 3. 应用打包失败

**问题：** Electron Builder 报错

**解决方案：**
```bash
# 检查配置
cat electron-builder.json

# 尝试不同的打包命令
npm run build -- --mac --universal
```

### 4. 开发服务器无法启动

**问题：** `npm run dev` 报错

**解决方案：**
```bash
# 清理端口占用
lsof -ti:5173 | xargs kill -9

# 重新启动
npm run dev
```

---

## 许可证

MIT

---

## 联系方式

- **GitHub**: https://github.com/reed-soul/poem-card-app
- **Issues**: https://github.com/reed-soul/poem-card-app/issues

---

## 贡献指南

欢迎贡献！请先阅读贡献指南。

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 更新日志

### 0.1.0 (2024-02-13)

**新增：**
- ✅ 733首精选古诗词
- ✅ 智谱 AI 智能生成
- ✅ 24节气推荐算法
- ✅ 完全用户设置界面
- ✅ 中国风 UI 设计
- ✅ macOS DMG 打包

**优化：**
- ✅ 智能推荐算法优化
- ✅ 用户体验改进
- ✅ 错误处理和回退机制

**修复：**
- ✅ 打包配置修复
- ✅ 依赖版本更新

---

## 未来计划

- [ ] Windows 打包
- [ ] 应用图标设计
- [ ] 用户收藏功能
- [ ] 诗词搜索功能
- [ ] 诗词分享功能
- [ ] 诗词翻译功能
- [ ] 诗词背诵模式
- [ ] 天气 API 集成
- [ ] 更多 AI 模型支持
- [ ] 离线模式
- [ ] 主题切换功能

---

## 致谢

- 诗词数据来源：chinese-poetry/chinese-poetry
- UI 设计灵感：Anthropic Frontend Design
- 智谱 AI：https://open.bigmodel.cn/
- Electron 框架：https://www.electronjs.org/
