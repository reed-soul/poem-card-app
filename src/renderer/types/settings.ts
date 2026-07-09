/**
 * Phase 1–2 用户设置：克制、少选项。
 * 真诗来自精校库；AI 只用于赏析增强与创作工坊。
 */

import type { PoemTheme } from './poem'

export type AiAppreciationMode = 'local' | 'auto'
export type AppThemeId = 'spring' | 'night' | 'plain'

export interface UserSettings {
  display: {
    showSolarTerm: boolean
    showDynasty: boolean
    showAuthor: boolean
    showReason: boolean
  }
  preferences: {
    favoriteAuthors: string[]
    favoriteThemes: PoemTheme[]
  }
  appearance: {
    theme: AppThemeId
  }
  ai: {
    /** local=只用预置赏析；auto=有 Key 时尝试增强 */
    appreciationMode: AiAppreciationMode
    zhipuApiKey: string
    deepseekApiKey: string
  }
}

export const DEFAULT_SETTINGS: UserSettings = {
  display: {
    showSolarTerm: true,
    showDynasty: true,
    showAuthor: true,
    showReason: true,
  },
  preferences: {
    favoriteAuthors: [],
    favoriteThemes: [],
  },
  appearance: {
    theme: 'spring',
  },
  ai: {
    appreciationMode: 'local',
    zhipuApiKey: '',
    deepseekApiKey: '',
  },
}

export const THEME_OPTIONS: Array<{ id: AppThemeId; label: string; hint: string }> = [
  { id: 'spring', label: '春纸', hint: '暖纸金墨' },
  { id: 'night', label: '夜墨', hint: '深底朱印' },
  { id: 'plain', label: '素屏', hint: '素白静墨' },
]

const SETTINGS_KEY = 'poem-card-settings-v2'

export function applyThemeToDocument(theme: AppThemeId): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
}

export function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) {
      applyThemeToDocument(DEFAULT_SETTINGS.appearance.theme)
      return { ...DEFAULT_SETTINGS }
    }
    const parsed = JSON.parse(stored)
    const settings: UserSettings = {
      display: { ...DEFAULT_SETTINGS.display, ...(parsed.display || {}) },
      preferences: {
        ...DEFAULT_SETTINGS.preferences,
        ...(parsed.preferences || {}),
      },
      appearance: {
        ...DEFAULT_SETTINGS.appearance,
        ...(parsed.appearance || {}),
        theme: (['spring', 'night', 'plain'] as AppThemeId[]).includes(
          parsed.appearance?.theme,
        )
          ? parsed.appearance.theme
          : DEFAULT_SETTINGS.appearance.theme,
      },
      ai: { ...DEFAULT_SETTINGS.ai, ...(parsed.ai || {}) },
    }
    applyThemeToDocument(settings.appearance.theme)
    return settings
  } catch {
    applyThemeToDocument(DEFAULT_SETTINGS.appearance.theme)
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  applyThemeToDocument(settings.appearance.theme)
}

export function resetSettings(): UserSettings {
  saveSettings(DEFAULT_SETTINGS)
  return { ...DEFAULT_SETTINGS }
}
