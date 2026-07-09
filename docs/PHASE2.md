# Phase 2：回访闭环与创作工坊

## 目标

在精校每日一诗之上，补齐回访与表达：历史日历、分享长图、收藏回顾、离线主题、AI 创作工坊。

## 硬原则

1. 主界面仍是一张诗卡；历史 / 收藏 / 工坊用全屏叠层
2. 真诗只来自 `poems.curated.json`；AI 新作永不进入每日选定与历史日历
3. 分享图由 Canvas 绘制，不截屏 UI，无控件入镜
4. 主题纯 CSS 变量，无外链背景图

## 能力与文件

| 能力 | 关键路径 |
|------|----------|
| 历史日历 | `components/HistoryCalendar.tsx`、`content/history.ts` |
| 分享长图 | `services/shareImage.ts` |
| 收藏集 | `content/favorites.ts`、`components/FavoritesPanel.tsx` |
| 离线主题 | `styles/globals.css`、`types/settings.ts`（spring/night/plain） |
| 创作工坊 | `services/ai/workshop.ts`、`components/WorkshopPanel.tsx` |

## 隔离规则

```
每日真诗 / 历史日历  ← 仅 curatedPoems + pickDailyPoem(date)
收藏回看            ← curated 中的 id，只读覆盖展示
创作工坊            ← WorkshopPoem（author=AI · 新作, dynasty=当代, ai_generated=true）
```

## 校验

```bash
node scripts/verify-phase1.mjs
node scripts/verify-phase2.mjs
pnpm exec tsc --noEmit
```
