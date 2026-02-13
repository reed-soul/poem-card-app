# MEMORY.md - Long-Term Memory

这是清溪的长期记忆文件，包含重要信息、偏好、技术栈、关键决策和资源。

---

## 🙋 Human Identity

**姓名:** 清溪

**角色:** 高级前端开发

**时区:** Asia/Shanghai (GMT+8)

**联系方式:** Feishu (主要)、WhatsApp、Email

---

## 🛠️ Technical Stack

**当前了解：**
- 高级前端开发
- 可能涉及：Vue, React, TypeScript, Node.js
- 博客系统（Hugo 静态站点）

**已安装框架/工具：**
- 前端设计：anthropic-frontend-design（创建生产级前端界面，避免"AI 味"通用设计）
- 后端架构：backend-patterns（Repository、Service Layer、API 设计、数据库优化）
- 社交媒体：tweet-writer（推文写作技能，使用 WebSearch 研究病毒式例子）
- AI CLI：Gemini CLI（@google/gemini-cli，Google 官方 Gemini 命令行工具）
  - 路径：`/Users/reed_soul/.nvm/versions/node/v24.7.0/bin/gemini`
  - 功能：Gemini 3 模型，1M token 上下文，内置工具（Google 搜索、文件操作、Shell 命令、网页抓取）
  - 免费额度：60 请求/分钟，1000 请求/天
  - 状态：已安装，未完成认证

**待补充：**
- 具体技术栈（主框架、构建工具、部署方式）
- 常用库和工具
- 开发习惯和偏好

---

## 🎯 Installed Skills

**当前已安装的 OpenClaw Skills:**

1. **tweet-writer** - 推特/X 内容写作技能
   - 功能：写病毒式推文、研究热门例子、优化算法
   - 用途：社交媒体内容创作
   - 安装日期：2026-02-08

2. **backend-patterns** - 后端架构模式
   - 功能：Repository、Service Layer、Middleware、API 设计、数据库优化
   - 用途：后端系统设计和优化
   - 安装日期：2026-02-08

3. **anthropic-frontend-design** - 前端设计框架
   - 功能：创建生产级前端界面，避免"AI 味"通用设计
   - 用途：前端 UI/UX 设计指导
   - 安装日期：2026-02-08

---

## 🎉 Milestones

**2026-02-08 - OpenClaw 环境配置与探索**
- 成功配置 OpenClaw 环境，连接 Feishu 网关
- 安装了 3 个实用 skills（tweet-writer, backend-patterns, anthropic-frontend-design）
- 探索了 OpenClaw 社区和 ClawHub 技能生态系统

**2026-02-08 - 第一条 X 推文发布** ✅
- 通过 OpenClaw 浏览器控制成功发布
- 推文主题：OpenClaw AI 助手使用体验
- 推文内容：介绍 OpenClaw 的功能（本地运行、隐私安全、24小时在线、通过飞书控制）
- 推文链接：https://x.com/Reed_soul/status/2020374393344672033
- 状态：成功发布

**2026-02-08 - 浏览器自动发推测试成功** ✅
- 验证了通过浏览器控制自动发布推文的可行性
- 流程：tweet-writer 写内容 → 浏览器控制输入文本 → 点击发布

**2026-02-11 - Gemini CLI 安装** ✅
- 成功安装 Google 官方的 Gemini CLI
- 安装包数：641 个包
- 路径：`/Users/reed_soul/.nvm/versions/node/v24.7.0/bin/gemini`
- 状态：已安装，待完成认证
- 功能：Gemini 3 模型，1M token 上下文，内置工具，免费额度 60 请求/分钟

**2026-02-11 - 发现浏览器控制服务的局限性** ⚠️
- OpenClaw 浏览器与用户自己的 Chrome 是独立的浏览器实例
- 要复用用户的浏览器，需要安装 OpenClaw Chrome 扩展
- 用户期望直接用自己的浏览器进行操作

**2026-02-13 - 诗词卡片应用项目重建** ✅
- 项目：跨端诗词推荐应用（Windows & macOS）
- 位置：`~/code/poem-card-app`
- 技术栈：Electron + React + TypeScript + Vite + Tailwind CSS
- 功能：每日诗词推荐，中国风UI，毛玻璃效果
- 已完成：框架搭建、核心组件、依赖安装（614包）、Git初始化
- 待完成：GitHub仓库、智谱AI接入、天气API、节气算法
- 状态：开发中

---

## ⚙️ Tools & Configuration

**浏览器控制服务：**
- 自动发推功能：正常工作，能够自动输入文本和发布
- 评论功能：因 Gateway 连接不稳定，操作频繁超时，无法稳定使用
- 导航功能：正常工作
- **重要发现：OpenClaw 浏览器控制与用户自己的 Chrome 是独立的浏览器实例**
  - OpenClaw 浏览器：独立的，没有用户的登录状态
  - 用户自己的 Chrome：已登录各种账号
  - 要复用用户的浏览器，需要安装 OpenClaw Chrome 扩展并 attach 标签页
- 观察结果：Gateway 重启后，浏览器控制服务需要较长时间才能完全恢复稳定连接

**已连接平台：**
- Feishu (主要沟通渠道)
- WhatsApp
- X (Twitter)

---

## 📝 Notes & Observations

**浏览器控制服务：**
- 发推功能：正常工作，能够自动输入文本和发布
- 评论功能：因 Gateway 连接不稳定，操作频繁超时，无法稳定使用
- 稳定性问题：可能是因为 Gateway 重启需要更长时间完全恢复，或浏览器控制服务本身的技术问题
- 建议：在浏览器控制不稳定的情况下，手动操作可能更可靠

**用户反馈：**
- 清溪对某些推荐的 skills 不够实用（主要是非编程类的）
- 清溪认为浏览器应该能直接控制，不需要手动复制

**技术相关：**
- 清溪对前端设计（anthropic-frontend-design）和后端架构（backend-patterns）感兴趣
- 清溪希望探索更多 OpenClaw skills，尤其是自动化工具
- **WebMCP (Web Model Context Protocol)：** 2026-02-11 学习的新技术
  - 让开发者用纯 JavaScript/HTML 暴露网站功能为结构化工具
  - AI agents 可以直接调用网站工具，而不是通过屏幕点击
  - Human-in-the-loop 设计：用户保持控制权，可以看到所有操作
  - GitHub: https://github.com/webmachinelearning/webmcp
  - Chrome 146 提供早期预览（`navigator.modelContext` API）

**技能使用：**
- tweet-writer skill 需要激活时会使用 WebSearch 研究病毒式推文例子
- backend-patterns 提供后端开发的最佳实践和设计模式

---

## 🔗 Key Resources

**清溪的资源：**
- 博客：code/blog-pages（Hugo 静态站点）
- X 账号：@Reed_soul
- 第一条推文：https://x.com/Reed_soul/status/2020374393344672033

**OpenClaw 相关：**
- GitHub: https://github.com/openclaw
- ClawHub: https://clawhub.ai/
- 文档：https://docs.openclaw.ai/

---

## 💡 Preferences & Style

**清溪的偏好：**
- 直接、高效，不废话
- 喜欢自动化和工具
- 关注隐私和安全
- 本地运行优先（OpenClaw 模式）
- 希望通过浏览器直接控制，而不是手动复制

**我的响应风格：**
- 直接、有帮助、能开玩笑但知道什么时候认真
- 不做无用客套
- 解决实际问题优先

---

## 🔄 Last Updated

**更新时间：** 2026-02-13 10:50 (GMT+8)

**更新内容：**
- 添加了诗词卡片应用项目到里程碑
- 更新了项目和待办列表
- 创建了 2026-02-13 记忆文件记录今日工作

---

## 📋 Tasks & Projects

**诗词卡片应用**
- 位置：`~/code/poem-card-app`
- 状态：开发中
- 技术栈：Electron + React + TypeScript + Vite + Tailwind CSS
- 当前进度：框架完成，UI组件实现，待接入数据和API
- 下一步：创建GitHub仓库、智谱AI接入、天气API、节气算法

**待办：**
- 了解清溪的具体项目和工作内容
- 补充技术栈详细信息（主框架、构建工具、部署方式、常用库）
- 解决浏览器控制服务的不稳定问题（可能需要排查 Gateway 或浏览器服务配置）
- 根据清溪的项目需求提供针对性支持

**进行中：**
- 诗词卡片应用开发
- 学习和熟练使用已安装的 skills
- 探索更多 OpenClaw skills 的使用场景
- 建立稳定的自动化工作流

---

## 🚀 Achievements

**已达成：**
- 成功配置 OpenClaw 环境
- 安装了 3 个实用 skills（tweet-writer, backend-patterns, anthropic-frontend-design）
- 通过浏览器控制发布了第一条社交媒体内容
- 建立了长期的记忆和上下文管理机制
- 学习了浏览器控制服务的使用技巧和局限性

**待探索：**
- 更多 OpenClaw skills 的使用场景
- 自动化工作流的搭建
- 能与项目的深度结合

---

## 📊 Development Context

**前端开发相关：**
- 可能涉及的项目：博客系统（Hugo）
- 可能感兴趣的领域：性能优化、组件库、状态管理
- 可能使用的工具：Git、Webpack/Vite、CI/CD

**后端相关：**
- 清溪对后端架构感兴趣
- 可能涉及：API 设计、数据库优化、微服务

**设计相关：**
- 前端 UX/UI 设计
- 已安装 anthropic-frontend-design skill 可用于设计指导

---

## 📋 Quick Reference

**常用命令：**
- Gateway 控制：`openclaw gateway restart`
- 浏览器操作：通过 OpenClaw 浏览器工具
- 技能管理：`openclaw skill install <skill-slug>`

**快捷链接：**
- 清溪博客：待确认 URL
- X 账号：@Reed_soul
- 第一条推文：https://x.com/Reed_soul/status/2020374393344672033
- OpenClaw 文档：https://docs.openclaw.ai/

---

**此文件由 Claw 维护，持续更新中...**
