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

### 核心功能

- ✅ 约 180 首人工精校古诗词（真诗库，非粗筛堆量）
- ✅ 24 节气计算 + 可解释的每日选定引擎
- ✅ 历史日历回顾（同日同诗）+ Canvas 分享长图
- ✅ 收藏集、春纸 / 夜墨 / 素屏三套离线主题
- ✅ 本地预置短赏析；可选智谱 / DeepSeek **只做讲解增强**
- ✅ 创作工坊（明确 AI 新作，隔离每日真诗）
- ✅ 跨端支持（macOS、Windows）

> 原则：**真诗只来自精校库；AI 绝不冒充古人写诗。** 详见 `docs/PHASE1.md`、`docs/PHASE2.md`。

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

- 纸感卡片、朱红印章、克制动效
- 三套离线主题：春纸 / 夜墨 / 素屏（纯 CSS，无外链背景图）
- Canvas 分享长图 + 一键复制诗文

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

### 环境要求

- Node.js >= 18
- **pnpm**（仓库强制，勿用 npm/yarn）

### 步骤

```bash
git clone https://github.com/reed-soul/poem-card-app.git
cd poem-card-app
pnpm install
pnpm icons          # 生成 build/ 应用图标
pnpm dev
```

应用由 Electron 打开；开发态渲染地址由 electron-vite 注入。

可信度与内容约定见 `docs/CREDIBILITY.md`。

---

## 开发指南

```bash
pnpm dev              # 开发
pnpm build            # 构建并打包到 release/
pnpm preview          # 预览
pnpm icons            # 生成图标
pnpm verify:content   # 精校库校验
pnpm verify:phase2
pnpm verify:credibility
```

可选环境变量（`.env`）：

```env
VITE_ZHIPU_AI_API_KEY=
VITE_DEEPSEEK_API_KEY=
```

---

## 构建打包

```bash
pnpm icons
pnpm build
```

产出目录：`release/`（见 `electron-builder.json`）。

- macOS：DMG（x64 / arm64），图标 `build/icon.png`
- Windows：NSIS，图标 `build/icon.ico`

CI：`.github/workflows/release.yml` 在 tag `v*` 时构建 mac + win。

当前版本：`0.1.1`。

---

## API 参考

### 赏析（讲解真诗）

```typescript
import { getAppreciation, getLocalAppreciation } from './services/ai/appreciation'
```

### 创作工坊（现代新作，隔离每日真诗）

```typescript
import { createWorkshopPoem } from './services/ai/workshop'
```

### 每日选定 / 节气

```typescript
import { pickDailyPoem } from './engine/dailyPick'
import { getNearestSolarTerm } from './engine/solarTerm'
```

详见 `docs/PHASE1.md`、`docs/PHASE2.md`。

---

## 常见问题

### 构建失败

```bash
rm -rf node_modules out release
pnpm install
pnpm icons
pnpm build
```

### AI 赏析 / 工坊失败

- 检查设置中的智谱 / DeepSeek Key
- 无 Key 时赏析回退本地预置；工坊会明确提示需配置 Key

### 开发端口占用

electron-vite 默认端口冲突时，结束占用进程后重跑 `pnpm dev`。

---

## 许可证

MIT

---

## 联系方式

- GitHub: https://github.com/reed-soul/poem-card-app
- Issues: https://github.com/reed-soul/poem-card-app/issues

---

## 更新日志

### 0.1.1

- Phase 1：精校库、节气每日引擎、赏析增强
- Phase 2：历史日历、分享、收藏、主题、创作工坊
- 可信度：内容 P0/P1 修复、应用图标、分享防溢出、文档校正

---

## 未来计划

- [ ] 精校库人工抽检 50+ 首（见 `docs/CREDIBILITY.md`）
- [ ] 诗词搜索
- [ ] 背诵模式
- [ ] 付费边界（更大精校库 / 主题字体 / 工坊额度）

---

## 致谢

- 诗词数据来源：chinese-poetry/chinese-poetry（经精校筛选）
- 智谱 AI：https://open.bigmodel.cn/
- DeepSeek：https://www.deepseek.com/
- Electron：https://www.electronjs.org/
