/**
 * 用户设置类型定义
 */

export interface UserSettings {
  // 偏好设置
  preferences: {
    favoriteAuthors: string[]      // 喜欢的诗人
    favoriteSeasons: string[]      // 喜欢的季节
    favoriteThemes: string[]       // 喜欢的主题
  };

  // 显示设置
  display: {
    poemsPerDay: number;           // 每天显示的诗词数量
    showSolarTerm: boolean;        // 是否显示节气
    showDynasty: boolean;          // 是否显示朝代
    showAuthor: boolean;           // 是否显示作者
  };

  // 背景设置
  background: {
    source: 'online' | 'local';    // 背景图片源
    blur: number;                    // 模糊度 (0-100)
    opacity: number;                  // 透明度 (0-100)
  };
}

// 默认设置
export const DEFAULT_SETTINGS: UserSettings = {
  preferences: {
    favoriteAuthors: [],
    favoriteSeasons: [],
    favoriteThemes: [],
  },
  display: {
    poemsPerDay: 1,
    showSolarTerm: true,
    showDynasty: true,
    showAuthor: true,
  },
  background: {
    source: 'online',
    blur: 30,
    opacity: 30,
  },
};

// 季储键
export const SETTINGS_STORAGE_KEY = 'poem-card-settings';

/**
 * AI 设置
 */
export interface AISettings {
  enabled: boolean              // 是否启用 AI
  apiKey: string              // 智谱 AI API Key
  useMock: boolean            // 是否使用模拟模式（测试用）
  generation: {
    style: string              // 风格：豪放、婉约、清新、深沉
    season: string             // 季节：春、夏、秋、冬
    theme: string              // 主题：山水、田园、边塞、思乡
    length: number            // 长度：4句、8句
  };
}

// 默认 AI 设置
export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  apiKey: '',
  useMock: false,
  generation: {
    style: '清新',
    season: '不限',
    theme: '不限',
    length: 4,
  },
};

export interface UserSettings {
  // 偏好设置
  preferences: {
    favoriteAuthors: string[]      // 喜欢的诗人
    favoriteSeasons: string[]      // 喜欢的季节
    favoriteThemes: string[]       // 喜欢的主题
  };

  // 显示设置
  display: {
    poemsPerDay: number;           // 每天显示的诗词数量
    showSolarTerm: boolean;        // 是否显示节气
    showDynasty: boolean;          // 是否显示朝代
    showAuthor: boolean;           // 是否显示作者
  };

  // 背景设置
  background: {
    source: 'online' | 'local';    // 背景图片源
    blur: number;                    // 模糊度 (0-100)
    opacity: number;                  // 透明度 (0-100)
  };

  // AI 设置
  ai: AISettings;
}

// 默认设置
export const DEFAULT_SETTINGS: UserSettings = {
  preferences: {
    favoriteAuthors: [],
    favoriteSeasons: [],
    favoriteThemes: [],
  },
  display: {
    poemsPerDay: 1,
    showSolarTerm: true,
    showDynasty: true,
    showAuthor: true,
  },
  background: {
    source: 'online',
    blur: 30,
    opacity: 30,
  },
  ai: DEFAULT_AI_SETTINGS,
};
