# 🏮 诗词卡片 - PoemCard

一个精美的跨端诗词推荐应用，每天为你推荐一首应景的诗词。

## ✨ 特性

- 🖥️ **跨端支持**：Windows & macOS
- 🎨 **中国风设计**：精美的中国风UI，毛玻璃效果
- 📅 **智能推荐**：根据24节气智能推荐诗词
- 🎯 **个性化**：支持设置喜欢的诗人
- 💾 **离线可用**：本地诗词数据库，无需网络
- 🤖 **AI 集成**：支持智谱 AI 接入

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### Electron 开发

```bash
npm run electron:dev
```

### 构建

```bash
# 构建 Web
npm run build

# 构建 Windows 应用
npm run electron:build:win

# 构建 macOS 应用
npm run electron:build:mac
```

## 📝 项目结构

```
poem-card-app/
├── electron/          # Electron 主进程
│   ├── main.ts       # 主进程入口
│   └── preload.ts    # 预加载脚本
├── src/              # React 源码
│   ├── data/         # 诗词数据
│   │   └── poems精选.json  # 40首精选诗词
│   ├── utils/        # 工具函数
│   │   └── solarTerm.ts  # 24节气算法
│   ├── components/   # React 组件
│   ├── App.tsx       # 主应用
│   └── main.tsx      # React 入口
└── package.json
```

## 🎨 技术栈

- **框架**：Electron + React + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **日期处理**：date-fns

## ✅ 已实现功能

- [x] Electron + React + TypeScript 项目框架
- [x] 跨端支持（Windows & macOS）配置
- [x] 中国风UI设计（毛玻璃效果、装饰角、印章）
- [x] 诗词卡片展示组件
- [x] 窗口控制按钮
- [x] 精选诗词数据库（40首高质量诗词）
- [x] 24节气算法
- [x] 节气智能推荐逻辑

## 📋 TODO

- [ ] 扩展诗词数据库（接入更多诗词）
- [ ] 实现天气 API 集成
- [ ] 用户偏好设置界面
- [ ] 智谱 AI 接入
- [ ] 动画效果优化
- [ ] 打包离线背景图片

## 📄 许可证

MIT
