# 产品可信度

本轮目标：懂诗的人抽查不穿帮；安装包有正式图标；对外文档与代码一致。

## 本轮已修（机器可检）

### 精校库

- 移除散文误入库：`湖心亭看雪`
- `木兰诗` → `木兰诗（节选）`，`excerpt: true`，UI 显示「节选」
- `青玉案·元夕` 清除错误 `solarTerms: ["立春"]`
- 悯农编号按通行本：`悯农二首其一`（春种）/ `其二`（锄禾）
- 重名消歧：浣溪沙 / 蝶恋花 / 浪淘沙 等补全通行题名
- 系列消歧：子夜吴歌·秋歌、归园田居·其三、读山海经·其十、秋浦歌·其十五
- 用字：`谢朓`、`谈宴`
- 超长篇 `dailyEligible: false`，每日选定不再抽到撑爆卡片的作品

### 品牌与打包

- `pnpm icons` → `build/icon.png` + `build/icon.ico`
- `electron-builder.json` 使用上述图标
- 主进程窗口标题「诗词日历」，加载窗口图标

### 分享

- Canvas 正文自动缩小，避免与印章/品牌重叠
- 导出前等待 `document.fonts.ready`
- 诗卡「复制」纯文本

## 人工抽检清单（建议你本地做 50 首）

1. 对照通行本核对正文（错字、断句）
2. 作者 / 朝代是否正确
3. `seasons` / `solarTerms` / `themes` 是否可解释
4. 节选作品标题是否标明
5. 词牌重名是否已消歧

优先抽检：李白、杜甫、苏轼、李清照、辛弃疾名篇，以及所有 `dailyEligible: false` 长篇的标题与出处说明。

## 校验命令

```bash
pnpm icons
pnpm verify:content
pnpm verify:phase2
pnpm verify:credibility
pnpm exec tsc --noEmit
```
