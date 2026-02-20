#!/bin/bash

# 一旦有命令执行失败，立刻停止
set -e

# 检查是否有未提交的代码
if [[ $(git status --porcelain) ]]; then
  echo "⚠️ 检测到你有未提交的代码修改（如新增了配置等）。"
  echo "👉 请先执行 git add . 和 git commit -m '你的修改内容' ，然后再运行此命令发布！"
  exit 1
fi

# 读取当前版本号
CURRENT_VERSION=$(node -e "console.log(JSON.parse(fs.readFileSync('package.json')).version)")

echo "📦 当前版本号: v$CURRENT_VERSION"
echo "🤔 请选择你要发布的版本类型:"
echo "  1) Patch 修补版 (修复 Bug, 不加新功能。示例: 0.1.0 -> 0.1.1)"
echo "  2) Minor 小版本 (新增功能, 向下兼容。示例: 0.1.0 -> 0.2.0)"
echo "  3) Major 大版本 (重大更新或颠覆性修改。示例: 0.1.0 -> 1.0.0)"
read -p "请输入 [1/2/3] 选择版本类型: " choice

case $choice in
  1) BUMP="patch" ;;
  2) BUMP="minor" ;;
  3) BUMP="major" ;;
  *) echo "❌ 无效的输入。已退出。"; exit 1 ;;
esac

echo ""
echo "🚀 正在升级版本号、打标签，并推送给 GitHub 云端服务器..."

# 让 pnpm 自动帮我们修改 package.json 的版本，并将此次修改 commit，外加打好 v 开头的 tag 标签
pnpm version $BUMP

# 获取刚刚打好的新 tag (例如 v0.1.1)
NEW_TAG=$(git describe --tags --abbrev=0)

echo "✅ 成功升级版本并打好标签: $NEW_TAG"

# 推送普通的 commit 记录
git push origin HEAD
# 推送刚才生成的 tag 标签（这一步将触发我们在 release.yml 设定的 GitHub Actions）
git push origin $NEW_TAG

echo ""
echo "🎉 发布管道已触发！"
echo "GitHub 云端的 Mac 和 Windows 电脑正在疯狂帮你打包 $NEW_TAG 版本。"
echo "请去你仓库页面的 Actions 一栏喝杯茶等待打包物产出。"
