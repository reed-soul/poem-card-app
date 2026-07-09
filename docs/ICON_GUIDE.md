# 应用图标

## 生成

```bash
pnpm icons
```

脚本：[`scripts/generate-icons.mjs`](../scripts/generate-icons.mjs)

## 产物

| 文件 | 用途 |
|------|------|
| `build/icon.png`（1024） | macOS / 通用；主进程窗口图标 |
| `build/icon.ico` | Windows |
| `build/icon.icns` | 仅当本机有 `iconutil` 时生成 |

设计：暖纸底 + 朱红双线印章 +「诗」字，无外链素材。

## 配置

- [`electron-builder.json`](../electron-builder.json)：`mac.icon` → `build/icon.png`，`win.icon` → `build/icon.ico`
- 发布前务必先跑 `pnpm icons`，确保 `build/` 产物存在
