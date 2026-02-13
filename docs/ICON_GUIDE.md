/**
 * 应用图标配置
 * 
 * 注意：要在 Electron 应用中显示自定义图标，需要：
 * 1. 将图标文件放在 build/ 目录下
 * 2. 在 electron-builder.json 中配置图标路径
 * 
 * 支持的图标格式：
 * - macOS: .icns 或 .png (512x512)
 * - Windows: .ico (256x256)
 * - Linux: .png (512x512)
 */

// 图标尺寸要求
export const ICON_SIZES = {
  // Windows
  ico: [16, 32, 48, 64, 128, 256],
  
  // macOS
  icns: [16, 32, 64, 128, 256, 512, 1024],
  
  // Linux / 通用
  png: [16, 32, 64, 128, 256, 512, 1024],
};

// 图标设计建议
export const ICON_DESIGN_TIPS = [
  {
    title: "中国风诗词图标",
    description: "使用毛笔字、印章、梅花等元素",
    colors: ["#C41E3A", "#8B4513", "#2C5F2D", "#FFD700"],
    elements: ["毛笔", "印章", "梅花", "兰花", "竹子", "菊花"],
  },
  {
    title: "极简中国风",
    description: "简洁的线条和几何图形",
    colors: ["#333333", "#666666", "#999999", "#CCCCCC"],
    elements: ["圆形", "方形", "线条", "几何"],
  },
  {
    title: "古风水墨",
    description: "黑白水墨风格",
    colors: ["#000000", "#FFFFFF", "#666666", "#999999"],
    elements: ["山水", "云雾", "墨迹", "留白"],
  },
];

// 图标生成工具推荐
export const ICON_TOOLS = [
  {
    name: "Figma",
    url: "https://www.figma.com",
    description: "专业的设计工具，支持中国风设计",
  },
  {
    name: "Canva",
    url: "https://www.canva.com",
    description: "在线设计工具，有很多中国风模板",
  },
  {
    name: "GIMP",
    url: "https://www.gimp.org",
    description: "开源的图像编辑器",
  },
  {
    name: "Paint.NET",
    url: "https://www.getpaint.net",
    description: "Windows 平台的图像编辑器",
  },
];

// 在线图标资源
export const ICON_RESOURCES = [
  {
    name: "Flaticon",
    url: "https://www.flaticon.com/search?word=poetry",
    description: "免费图标，搜索 poetry, book, ink 等",
  },
  {
    name: "The Noun Project",
    url: "https://thenounproject.com/search/?q=poem",
    description: "高质量图标集",
  },
  {
    name: "Iconfinder",
    url: "https://www.iconfinder.com/search?q=poetry",
    description: "专业图标资源",
  },
];

// AI 图标生成工具
export const AI_ICON_TOOLS = [
  {
    name: "Midjourney",
    prompt: "minimalist Chinese poetry app icon, flat design, ink style, --v 5",
    description: "使用 AI 生成中国风图标",
  },
  {
    name: "DALL-E",
    prompt: "app icon for Chinese poetry, traditional style, clean, --v 5",
    description: "OpenAI 的图像生成工具",
  },
  {
    name: "Stable Diffusion",
    prompt: "Chinese poetry app icon, traditional Chinese art style, minimalist, 512x512",
    description: "开源的图像生成模型",
  },
];
