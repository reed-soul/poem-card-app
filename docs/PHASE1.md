# Phase 1：精校每日一诗

## 目标

把产品从「能跑的 demo」收束为：**每日一诗 · 精校 · 节气 · 短赏析 · 收藏**。

## 硬原则

1. **真诗只来自** `src/renderer/data/poems.curated.json`
2. **AI 只讲解，不冒充古人写诗**
3. **主界面极简**：诗 + 节气 + 缘由 + 赏析 + 收藏
4. **每日选定可解释、可复现**（同日同结果）

## 关键文件

| 路径 | 作用 |
|------|------|
| `src/renderer/types/poem.ts` | 精校诗 schema |
| `src/renderer/data/poems.curated.json` | 精校库（约 180 首） |
| `src/renderer/engine/solarTerm.ts` | 节气日期计算 |
| `src/renderer/engine/dailyPick.ts` | 每日选定引擎 |
| `src/renderer/services/ai/appreciation.ts` | 智谱 / DeepSeek 赏析路由 |
| `src/renderer/content/favorites.ts` | 本地收藏 |
| `scripts/verify-phase1.mjs` | 内容冒烟校验 |

## 推荐规则

```
节气显式命中 > 当季 > 短诗友好兜底
口味（诗人/主题）只加权，不硬过滤到空
```

## AI 用法

- 默认：本地预置 `appreciation`
- 设置里「自动增强」：智谱优先，DeepSeek 回退，结果写入 localStorage 缓存
- **已移除**主路径「AI 生成唐诗」

## 校验

```bash
node scripts/verify-phase1.mjs
```

## 旧资产

- `poems精选.json`：历史粗库，**不再作为主数据源**
- `services/zhipuAI.ts`：旧「生成诗词」实现，待后续删除或改作创作工坊
