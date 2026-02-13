# 飞渡 SDK - API 参考

本章节包含坐标数组格式、颜色格式、外部资源引入说明、付费接口列表以及完整的 API 版本修改记录。

---

## 一、坐标数组格式说明

```javascript
/*
 z元素是可选的（如果z没有指定，则z==0）
 单个点： 一维数组
 单个环： 二维数组，注意：坐标点索引需要按顺时针或者逆时针排列
 单个Part：三维数组
 多个Part：四维数组
*/

let z = 0;

//1个Part, 无内环
let c1 = [[1, 1, z], [2, 2, z], [3, 3, z]];

//1个Part, 1到多个内环
let c2 = [
  [[1, 1, z], [2, 2, z], [3, 3, z]], //第一个元素是外环
  [[1, 1, z], [2, 2, z], [3, 3, z]], //其他元素是内环
  [[1, 1, z], [2, 2, z], [3, 3, z]],
  [[1, 1, z], [2, 2, z], [3, 3, z]]
];

//多个Part，有的Part有内环，有的没有内环
let c3 = [
  //没有内环的Part
  [
    [[1, 1, z], [2, 2, z], [3, 3, z]]
  ],

  //有内环的Part
  [
    [[1, 1, z], [2, 2, z], [3, 3, z]], //第一个元素是外环
    [[1, 1, z], [2, 2, z], [3, 3, z]], //其他元素是内环
    [[1, 1, z], [2, 2, z], [3, 3, z]],
    [[1, 1, z], [2, 2, z], [3, 3, z]]
  ],

  //没有内环的Part
  [
    [[1, 1, z], [2, 2, z], [3, 3, z]]
  ]
];

//多个Part，每个Part有内环
let c4 = [
  [ //Part1
    [[1, 1, z], [2, 2, z], [3, 3, z]], //第一个元素是外环
    [[1, 1, z], [2, 2, z], [3, 3, z]], //其他元素是内环
    [[1, 1, z], [2, 2, z], [3, 3, z]],
    [[1, 1, z], [2, 2, z], [3, 3, z]]
  ],

  [ //Part2
    [[1, 1, z], [2, 2, z], [3, 3, z]], //第一个元素是外环
    [[1, 1, z], [2, 2, z], [3, 3, z]], //其他元素是内环
    [[1, 1, z], [2, 2, z], [3, 3, z]],
    [[1, 1, z], [2, 2, z], [3, 3, z]]
  ],

  [ //Part3
    [[1, 1, z], [2, 2, z], [3, 3, z]], //第一个元素是外环
    [[1, 1, z], [2, 2, z], [3, 3, z]], //其他元素是内环
    [[1, 1, z], [2, 2, z], [3, 3, z]],
    [[1, 1, z], [2, 2, z], [3, 3, z]]
  ],
];
```

---

## 二、颜色参数格式说明

若需设置透明度时请使用数组类型参数，颜色值转换函数参考：[颜色值转换](../api/global.html#__convertColor)

### 目前支持以下四种格式：

#### 常量颜色

`Color.Red`，[取值参考](../api/global.html#Color)，常量颜色目前不支持透明度设置

#### RGB 颜色

`RGB(255,255,255)`，取值顺序：红绿蓝，取值范围：[0~255]

#### 16 进制颜色

`#FFFEEE`，[取值参考](http://tools.jb51.net/color/rgb_hex_color)

#### 数组颜色

`[0.5,0.5,0.5,1]`，取值顺序：红绿蓝透明度，取值范围：[0~1.0]，按 RGBA 颜色值比例缩小 255 倍

**示例代码：**

```javascript
//常量颜色
var constColor = Color.Red;

//RGB颜色
var rgbColor = 'RGB(255,255,255)';

//16进制颜色
var hexColor = '#FFFEEE';

//数组颜色 支持透明度设置
var colorArr = [0.5,0.5,0.5,1];
```

---

## 三、外部资源引入说明

API 接口调用过程中需要引入外部资源，如弹窗 url 地址、图片、视频、三维模型等。

### 外部资源分两类：

#### 弹窗地址

目前对弹窗网页进行渲染的是 C++ 内置的简化版浏览器渲染引擎，推荐使用原生 JS 语法，避免使用 ES6 新特性，也尽量避免使用一些 CSS3 新特性。

#### 资源文件

包含图片、视频、3dt、shapeFile、pakFile 等文件类型；目前全部接口已经支持资源文件的相对路径写法，示例如下：

```javascript
@path:/images/demo1.png
@path:/movies/demo.mov
@path:/3dt/demo.3dt
@path:/shapefile/demo.shp
```

注意：`@path:` 相当于 CloudMaster 里文件资源的根目录

---

## 四、高级付费接口说明

需要单独授权的对象和接口如下表：

| 需授权对象 | 对象描述 | 需授权接口 | 接口描述 |
|----------|---------|-----------|---------|
| HeatMap3D | 三维热力图 | 三维热力图对象下所有接口 | - |
| WaterFlowField | 水流场 | 水流场对象下所有接口 | - |
| FloodFill | 水淹分析 | 水淹分析对象下所有接口 | - |
| Tools | 分析工具 | startContourLineAnalysis(options, fn) | 开始等高线分析，适用于地形 |
| Tools | 分析工具 | startCutFillAnalysis(options, fn) | 开始填挖方分析，适用于地形 |
| Tools | 分析工具 | startFloodFill(options, fn) | 开始水淹分析 |
| Tools | 分析工具 | startSkylineAnalysis(options, fn) | 开始天际线分析 |
| Tools | 分析工具 | exportSkyline(path, size, options, fn) | 导出天际线图片 |
| Tools | 分析工具 | startSunshineAnalysis(options, fn) | 开始日照分析 |
| Tools | 分析工具 | startTerrainSlopeAnalysis(options, fn) | 开始坡度坡向分析，适用于地形 |
| Tools | 分析工具 | startViewDomeAnalysis(options, fn) | 开始开敞度分析 |
| Tools | 分析工具 | startViewshedAnalysis(options, fn) | 开始视域分析 |
| Tools | 分析工具 | startVisiblityAnalysis(options, fn) | 开始通视分析 |

---

## 五、API 版本修改记录

### 2024.07.04 - Cesium3DTile 对象增加偏移量属性

- **Cesium3DTile 对象新增 offset 属性**
  - offset：可选，基于原始位置的偏移量，默认值：[0,0,0]，单位：米

### 2024.06.21 - Tools 对象各分析方法支持传入坐标参数

- **Tools 对象分析方法增加如下参数**
  - 天际线分析接口新增观察点坐标参数和朝向参数：startPoint、yaw
  - 通视分析接口新增观察点坐标和目标点坐标数组参数：startPoint、endPoints
  - 开敞度分析接口新增观察点坐标参数：startPoint
  - 填挖方分析接口新增分析范围坐标数组参数：cooridates
  - 日照分析接口新增分析范围坐标数组参数：cooridates
  - 坡度坡向分析接口新增分析范围坐标数组参数：cooridates
  - 等高线分析接口新增分析范围坐标数组参数：cooridates

### 2024.06.18 - CustomObject 对象增加按组操作方法、增加 range 属性

- **CustomObject 对象新增方法如下：**
  - 增加 showByGroupId()方法
  - 增加 hideByGroupId()方法
  - 增加 range 可见范围属性

### 2024.05.21 - ODLine 对象新增虚线样式枚举

- **新增虚线样式 lineStyle=3**
  - lineStyle (number) 0:纯色 1:箭头，2:流动点，3：虚线；样式默认值0

### 2024.05.17 - TileLayer、Settings 对象新增方法

- **TileLayer 新增方法设置特定 TileLayer 图层是否支持对网络服务进行贴合**
  - enableImageLayerDecal(data) 设置特定图层是否支持对网络服务进行贴合

- **Settings 新增方法设置网络图层服务是否贴合地形或对象**
  - setImageLayerEnableDecal() 设置网络图层服务是否贴合地形或对象

### 2024.05.08 - Marker、VideoProjection、VectorField 对象新增参数

- **视频投影 VideoProjection 对象新增近裁距离参数**
  - minDistance (number) 近裁距离，取值范围：[0~1000000.0]，单位：米

- **Marker 对象新增参数**
  - viewHeightRange (array) 可见高度范围：[近裁距离, 远裁距离]，默认值: [-1000000000, 1000000000]
  - rangeRatio (number) 可见高度范围的调整系数，取值范围：[0~1]，注意：此参数仅 viewHightRange 设置后生效

- **VectorField 对象新增参数**
  - particleMaxNumber (number) 粒子最大数量限制

- **Polygon 对象新增参数**
  - priority (number) 设置 polygon 显示的优先级，值越大越靠上，取值范围：[-1000,1000]

### 2024.04.17 - Weather 对象新增 setSkyVisibleMaxHeight()方法

- **Weather 对象新增如下方法**
  - **setSkyVisibleMaxHeight(maxHeight, fn)** 控制天空显示的最大相机高度，相机位置的 Z 值超过此高度则进入黑暗模式

### 2024.04.13 - GeoJSONLayer、Marker3D 和 Polygon3D 新增 setViewHeightRange()方法

- **GeoJSONLayer、Marker3D 和 Polygon3D 对象新增如下方法**
  - **setViewHeightRange(id, minVisibleHeight, maxVisibleHeight, fn)** 设置对象的可视高度范围

### 2024.04.11 - Polyline 和 Polygon 新增 setViewHeightRange()方法

- **Polyline 和 Polygon 对象新增如下方法**
  - **setViewHeightRange(id, minVisibleHeight, maxVisibleHeight, fn)** 设置对象的可视高度范围

### 2024.04.10 - GeoJSONLayer 对象支持自定义材质相关参数、Marker3D 新增属性和方法

- **GeoJSONLayer 新增自定义材质参数支持**
  - material 自定义材质路径
  - scalarParameters 材质包含的标量参数
  - vectorParameters 材质包含的向量参数

- **Marker3D 新增固定尺寸属性和调用蓝图函数方法**
  - fixedSize 固定 marker3d 标注对象的尺寸，默认：false 近大远小
  - callBatchBPFunction(data) 调用 marker3d 对象包含的蓝图函数

### 2024.04.09 - MarkerLayer 图层标注对象新增 setViewHeightRange 方法

- **MarkerLayer 对象新增如下方法**
  - **setViewHeightRange(id, minVisibleHeight, maxVisibleHeight, fn)** 设置标注图层对象的可视高度范围

### 2024.03.15 - Settings 对象新增方法

- **Settings 对象新增如下方法**
  - **setGroundHeight(height)** 设置工程场景的海拔（地面高度）
  - **setLabelLayerScale(scale)** 设置工程场景中包含的 VTPK 标注的显示比例

### 2024.03.08 - CameraTour 对象新增方法

- **CameraTour 对象新增如下方法**
  - **setMouseClickToPause(boolean)** 设置播放导览时点击鼠标是否暂停
  - **setTime(time)** 设置从某时刻开始播放

### 2024.03.05 - GeoJSONLayer 对象新增要素可见性渲染器

- **增加根据字段属性值和区间控制要素显隐的渲染器属性**
  - visibleRender 要素可见性渲染器

### 2024.03.01 - Polyline、Polygon 和 Polygon3D 对象增加原色样式枚举

- **OriginColor：原色**

### 2024.02.28 - MarkerLayer 图层标注对象新增 focusByMarkerId 方法

- **MarkerLayer 对象新增如下方法**
  - **focusByMarkerId()** 定位到内部的某一个标记点

### 2024.02.04 - Weather 设置雨效方法新增参数、HydroDynamic2D 对象新增参数

- **Weather 设置雨效和雪效方法新增四个参数**：颜色、大小、相机对齐和阴天程度

  新增雨效参数：setRainParam(strength, speed, raindropSize,rainColor,alignCamera,overcastStrength, fn)

  新增雪效参数：setSnowParam(strength, speed, snowflakeSize,snowColor,alignCamera,overcastStrength, fn)

- **HydroDynamic2D 对象新增泡沫参数**
  新增泡沫宽度参数：foamWidth
  新增泡沫强度参数：foamIntensity

### 2024.01.25 - 新增 MarkerLayer 图层标注对象及操作方法

- **MarkerLayer 对象新增如下方法**
  - **add()** 添加 MarkerLayer 对象
  - **update()** 更新 MarkerLayer 对象
  - **clear()** 清空 MarkerLayer 对象
  - **show()** 显示 MarkerLayer 对象
  - **showAll()** 显示所有 MarkerLayer 对象
  - **hide()** 隐藏 MarkerLayer 对象
  - **hideAll()** 隐藏所有 MarkerLayer 对象
  - **focus()** 定位 MarkerLayer 对象
  - **delete()** 删除 MarkerLayer 对象
  - **get()** 查询 MarkerLayer 对象

### 2024.01.22 - GeoJSONLayer 对象新增方法、HydroDynamic2D 对象新增参数

- **GeoJSONLayer 对象新增 Clear()方法**
  新增方法：clear()

- **HydroDynamic2D 对象新增偏移参数**
  新增设置位置偏移参数：offset

### 2024.01.19 - Tools 对象可视域分析方法新增参数

- **Tools 对象可视域分析增加交互锁定参数**
  新增交互锁定参数：interactiveLock

### 2024.01.18 - HydroDynamic2D 对象支持多种方式数据源构建：tif|sdb|bin

- **新增方法 addByTif()**
- **新增方法 addBySdb()**
- **新增方法 addByBin()**

### 2023.12.29 - Fluid 对象新增 color 颜色属性

- **流体仿真自定义颜色属性：color**

### 2023.12.26 - GeoJSONLayer 对象新增高亮和定位方法

- **高亮某个要素：highlightFeature()**
- **停止高亮：stopHighlightFeature()**
- **高亮多个要素：highlightFeatures()**
- **停止高亮要素：stopHighlightFeatures()**
- **定位某个要素：focusFeature()**
- **停止高亮所有要素：stopAllHighlightFeaturesById()**

### 2023.12.25 - GeoJSONLayer 对象新增属性

- **GeoJSONLayer 新增文字标注属性：textMarkerFiled**
- **GeoJSONLayer 新增文字标注可见范围属性：textRange**
- **GeoJSONLayer 新增贴地属性：onTerrain**

### 2023.12.20 - Tools 对象新增 getUIPanel 方法

- **新增查询系统 UI 面板状态方法如下：**
  新增方法：getUIPanel(type,fn)

### 2023.12.13 - 标注对象 Marker 新增方法、Tools 天际线分析新增参数

- **Marker 对象新增设置视口可见性方法如下：**
  新增方法：setViewportVisible(id,vp,fn)

- **Tools 对象天际线分析增加交互锁定参数**
  新增交互锁定参数：interactiveLock

### 2023.12.08 - Misc 新增统计接口 统计 ACP 工程包含的资产信息

- **projectAssetCountAll()** 统计 ACP 工程包含的全部资产
- **projectAssetCount(assetType)** 统计 ACP 工程包含的各类资产

### 2023.12.01 - HydroDynamic1D 和 2D 对象新增属性

- **HydroDynamic1D 和 2D 对象新增水波纹亮度属性 waveBrightness**

### 2023.11.27 - 设置面板设置后期效果新增相关参数

- globalIllumination: false, //屏幕空间全局光照;
- chromaticAberration: 0, //透镜色差;
- ambientRadius: 100, //环境光遮罩半径
- ambientFadeDistance: 12000, //环境光遮罩淡出距离
- exposureEnabled: false,//自动曝光
- exposureCompensation: 0, //曝光补偿
- depthFiethSwitch: false,//景深开关
- focalLength: 10000,// 焦距
- aperture: 4,// 光圈
- deepBlur: 2,// 深度模糊

### 2023.11.23 - GeoJSONLayer、ImageryLayer 和 CustomObject 新增属性和方法

- **GeoJSONLayer 增加定位方法 focus()**
- **GeoJSONLayer 新增 rotation 属性 控制旋转 新增 range 属性 控制点的可视范围**
- **ImageryLayer 增加定位方法 focus()**
- **CustomObject 对象新增 visible 参数 控制模型加载后是否显示**

### 2023.11.22 - 波束对象增加 range 参数

- **随着相机观察距离的拉远拉近波束透明度会进行线性变化，越远越透明直至看不到**

### 2023.11.21 - TileLayer 新增设置热力样式接口

- **TileLayer 图层对象新增分层热力样式设置接口 setHeatMapStyle()**

### 2023.11.20 - GeoJSONLayer 对象和波束 SignalWave 对象新增属性

- **GeoJSONLayer 新增 offset 属性**
- **SignalWave 新增 opacity 不透明度属性，优化波束样式显示**

### 2023.11.17 - HydroDynamic1D 对象新增属性

- **HydroDynamic1D 新增 waterMode 属性**

### 2023.11.10 - Settings 对象新增设置人物漫游接口

- **Settings 对象新增 setCharacterRoaming()接口**

### 2023.11.6 - 新增 HydroDynamic1D 对象（一维水动力模型）

- **HydroDynamic1D 对象新增如下方法**
  - **add()** 添加一维水动力模型
  - **update()** 更新一维水动力模型
  - **clear()** 清空一维水动力模型
  - **show()** 显示一维水动力模型
  - **hide()** 隐藏一维水动力模型
  - **focus()** 定位一维水动力模型
  - **delete()** 删除一维水动力模型
  - **get()** 查询一维水动力模型

### 2023.11.3 - Misc 对象新增方法

- **Misc 对象新增 reloadPak()方法**
- **Misc 对象新增 download()方法**

### 2023.10.26 - 向量场对象和二维水动力模型支持 TIF 文件构建

- **VectorField 对象新增 tif 类型文件支持**
- **HydroDynamic2D 对象新增 tif 类型文件支持**

### 2023.10.23 - 新增 HydroDynamic2D 对象（二维水动力模型）

- **HydroDynamic2D 对象新增如下方法**
  - **add()** 添加二维水动力模型
  - **update()** 更新二维水动力模型
  - **clear()** 清空二维水动力模型
  - **show()** 显示二维水动力模型
  - **hide()** 隐藏二维水动力模型
  - **focus()** 定位二维水动力模型
  - **delete()** 删除二维水动力模型
  - **get()** 查询二维水动力模型

### 2023.09.20 - Settings 对象新增查询工程坐标系接口

- **Settings 对象新增 getProjectWKT()接口**

### 2023.09.18 - 蓝图函数支持控制 Marker3D 对象拓展参数内的图标和动画

- **蓝图函数新增枚举类型 16，支持设置拓展参数内的图标和样式动画**

### 2023.09.05 - WaterFlowField 和 HeatMap3D 支持多视口

- **水流场对象和三维热力对象支持在不同视口下设置显示**

### 2023.09.04 - 新增天线方向图和波束对象

- **新增天线方向图对象 Antenna 接口如下**
  - **add()** 添加天线方向图对象
  - **update()** 更新天线方向图对象
  - **clear()** 清空天线方向图对象
  - **show()** 显示天线方向图对象
  - **hide()** 隐藏天线方向图对象
  - **focus()** 定位天线方向图对象
  - **delete()** 删除天线方向图对象
  - **get()** 查询天线方向图对象

- **新增波束对象 SignalWave 接口如下**
  - **add()** 添加波束对象
  - **update()** 更新波束对象
  - **clear()** 清空波束对象
  - **show()** 显示波束对象
  - **hide()** 隐藏波束对象
  - **focus()** 定位波束对象
  - **delete()** 删除波束对象
  - **get()** 查询波束对象

### 2023.08.23 - HeatMap3D 支持稀疏体素方式构建

- **支持 sparseVoxels 构建对象**
- **增加查询体素方法 queryVoxel()**
- **新增 textureFilter 属性参数**

### 2023.08.18 - TileLayer 对象新增 clear()方法、GeoJsonLayer 新增属性

- **TileLayer 对象新增 clear()方法**
- **GeoJsonLayer 新增投影转换属性**

### 2023.08.12 - 热力图 HeatMap 对象支持 bin 文件添加和更新

- **热力图对象 add()方法支持 bin 文件**
- **热力图对象 update()方法支持 bin 文件及插值更新动画**

### 2023.08.11 - 新增流体仿真对象 Fluid

- **新增流体仿真对象 Fluid 接口如下**
  - **add()** 添加流体仿真对象
  - **addSource()** 添加流体仿真的出水点
  - **update()** 更新流体仿真对象
  - **clear()** 清空流体仿真对象
  - **show()** 显示流体仿真对象
  - **reset()** 重置流体仿真对象
  - **hide()** 隐藏流体仿真对象
  - **focus()** 定位流体仿真对象
  - **delete()** 删除流体仿真对象
  - **get()** 查询流体仿真对象

### 2023.07.27 - 新增有限元仿真对象 FiniteElement

- **新增有限元仿真对象 FiniteElement 接口如下**
  - **add()** 添加有限元仿真对象
  - **update()** 更新有限元仿真对象
  - **clear()** 清空有限元仿真对象
  - **show()** 显示有限元仿真对象
  - **hide()** 隐藏有限元仿真对象
  - **focus()** 定位有限元仿真对象
  - **delete()** 删除有限元仿真对象
  - **get()** 查询有限元仿真对象

### 2023.07.14 - CustomObject 对象新增参数

- **isEffectRotation (boolean)** 模型执行 moveTo()方法时是否开启旋转效果，注意：仅在 moveTo()方法调用时生效

### 2023.06.28 - 新增向量场对象 VectorField

- **新增向量场对象 VectorField 接口如下**
  - **add()** 添加向量场对象
  - **update()** 更新向量场对象
  - **clear()** 清空向量场对象
  - **show()** 显示向量场对象
  - **hide()** 隐藏向量场对象
  - **focus()** 定位向量场对象
  - **delete()** 删除向量场对象
  - **get()** 查询向量场对象

### 2023.05.30 - Settings 对象和 TileLayer 对象新增方法

- **Settings 对象新增方法如下：**
  - setScreenControlsVisible(visiable) 布尔类型参数，当交互模式为人物或无人机模式时，设置屏幕操纵杆 UI 的可见性

- **图层 TileLayer 对象增加 setEnableDecal()方法**
  - setEnableDecal(data) 设置图层对贴花类型对象的贴合支持，包含 Decal 对象和 HeatMap 对象

### 2023.05.26 - 优化 Reset 接口、Heatmap 新增样式

- **优化 DigitalTwinAPI 类的 Reset 方法**
  - reset 方法增加了一个参数 type，用于设置要重置的类型

  ResetType 是一个可自由组合的枚举类型，定义如下：

  reset 方法如果不传参数，默认行为是清除添加的所有对象。如果要清除对象并复位相机，则可以这样调用：

  ```javascript
  api.reset(ResetType.ClearObjects | ResetType.ResetCamera);
  // 或者
  api.reset(1 | 4);
  // 或者
  api.reset(5);
  ```

  这样用户就不用自己通过调用一大堆对象的 clear 方法去一个一个清除所添加的对象了。

- **Heatmap 新增波峰样式 HeatMapStyle**

### 2023.05.09 - Player 用户自定义信息

- **AirCityPlayer 增加初始化属性：customString**

  customString 可用于存储用户自定义信息，稍候能够在实例管理接口的 GetStatus 后返回。如下的代码设置 customString 后：

  可以在 CloudMaster 的连接信息里看到此内容：

  也可以在实时运行状态里看到：

---

> **注意：** 由于篇幅限制，以上只列出了部分版本更新记录。完整的更新历史请参考官方文档或查看原始版本修改记录文件。

---

## 附录：常用代码片段

### 创建标注

```javascript
let o = {
  id: 'p1',
  coordinate: [495269.37, 2491073.25, 25.4],
  imagePath: HostConfig.Path + '/samples/images/tag.png',
  imageSize: [28, 28],
  text: '北京银行',
  range: [1, 8000.0],
  textRange: 3000,
  showLine: true,
  textColor: Color.Black,
  textBackgroundColor: Color.White,
  autoHeight: true
}
await fdapi.tag.add(o);
fdapi.tag.focus(o.id, 200, 0);
```

### 创建折线

```javascript
let polyline = {
  id: 'polyline1',
  coordinates: [[493217, 2491901, -1.9], [492929, 2492265, 2.3], [492777, 2492419, 0]],
  color: Color.Red,
  lineWidth: 5
}
fdapi.polyline.add(polyline);
```

### 相机飞行到指定位置

```javascript
//方式一：直接传参数
fdapi.camera.set(492035.37, 2488806.75, 402.62, -15.0, -173.0, 0.2);

//方式二：使用对象
let cam = {
  "x": 490088.281250,
  "y": 2485978.750000,
  "z": 1031.461914,
  "pitch": -39.462357,
  "yaw": -152.668823
}
fdapi.camera.set(cam, 0.2);

//方式三：使用数组
let camArr = [488586.843750, 2486889.750000, 713.141602, -36.353725, -124.556442];
fdapi.camera.set(camArr, 0.2);
```
