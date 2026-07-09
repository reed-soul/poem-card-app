/**
 * Phase 1 用户设置：克制、少选项。
 * 真诗来自精校库；AI 只用于赏析增强。
 */

import type { PoemTheme } from './poem'

export type AiAppreciationMode = 'local' | 'auto'

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
  ai: {
    appreciationMode: 'local',
    zhipuApiKey: '',
    deepseekApiKey: '',
  },
}

const SETTINGS_KEY = 'poem-card-settings-v2'

export function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(stored)
    return {
      display: { ...DEFAULT_SETTINGS.display, ...(parsed.display || {}) },
      preferences: {
        ...DEFAULT_SETTINGS.preferences,
        ...(parsed.preferences || {}),
      },
      ai: { ...DEFAULT_SETTINGS.ai, ...(parsed.ai || {}) },
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function resetSettings(): UserSettings {
  saveSettings(DEFAULT_SETTINGS)
  return { ...DEFAULT_SETTINGS }
}
