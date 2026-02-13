# 飞渡 SDK 文档

本文档是从 https://sdk.freedo3d.com/doc/api/ 提取并整理的完整版飞渡 SDK 开发文档。

提取日期：2026-02-10

## 文件结构

### 📚 [01-快速入门.md](./01-快速入门.md)
- SDK 介绍与安装
- Hello World 示例
- 传统开发模式（HTML + Script）
- SPA 开发模式（Vue/React/Angular）

### 🚀 [02-进阶教程.md](./02-进阶教程.md)
- 多个云渲染窗口嵌入
- 异步接口三种调用方式（Callback/Then/Async-Await）
- 事件交互系统详解
- 相机位置设置的三种方式
- Tick 高性能功能使用说明

### 📖 [03-API参考.md](./03-API参考.md)
- 坐标数组格式规范
- 颜色参数格式说明
- 外部资源引入指南
- 高级付费接口列表
- API 版本修改记录（完整历史）

---

## 快速开始

飞渡 SDK 是一套基于 JavaScript 的二次开发接口，用于在现代浏览器中加载和展示由引擎渲染的三维视频流。支持 Vue.js、React.js 和 Angular.js 等主流前端框架。

### 基础使用

```html
<!-- 1. 引入 SDK -->
<script src='lib/ac.min.js'></script>

<!-- 2. 创建视频流容器 -->
<div id="player" style="width:800px;height:500px;"></div>

<!-- 3. 初始化 -->
<script>
var demoPlayer = new DigitalTwinPlayer('192.168.1.27:8081', {
  domId: 'player',
  apiOptions: {
    onReady: function() {
      console.info('API 已就绪，可以调用了');
    }
  }
});
var api = demoPlayer.getAPI();
</script>
```

### Vue 示例

```javascript
import * as acapi from './ac.min'

export default {
  mounted() {
    this.api = new acapi.DigitalTwinPlayer("192.168.1.27:8081", {
      "domId": "player",
      "apiOptions": { onReady: () => console.log('Ready') }
    }).getAPI();
  },
  destroyed() {
    this.api.destroy();
  }
}
```

---

## 文档说明

- ✅ 所有代码示例已整理
- ✅ 参数说明完整
- ✅ 实用代码片段独立标注
- ✅ 适合 NotebookLLM 直接读取

如需查看原始在线文档，请访问：https://sdk.freedo3d.com/doc/api/
