/**
 * 用户设置类型定义
 */

/**
 * AI 设置
 */
export interface AISettings {
  enabled: boolean              // 是否启用 AI
  apiKey: string              // 智谱 AI API Key
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
  generation: {
    style: '清新',
    season: '不限',
    theme: '不限',
    length: 4,
  },
};

// 用户设置
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

// 存储键
export const SETTINGS_STORAGE_KEY = 'poem-card-settings';

/**
 * 从 localStorage 加载设置
 */
export function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(stored),
      };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * 保存设置到 localStorage
 */
export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * 重置设置为默认值
 */
export function resetSettings(): UserSettings {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

/**
 * 导出设置到文件
 */
export function exportSettings(settings: UserSettings): void {
  const data = JSON.stringify(settings, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'poem-card-settings.json';
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 从文件导入设置
 */
export async function importSettings(file: File): Promise<UserSettings> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const settings = JSON.parse(event.target?.result as string);
        resolve({
          ...DEFAULT_SETTINGS,
          ...settings,
        });
      } catch (error) {
        reject(new Error('Invalid settings file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
