import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  DEFAULT_SETTINGS,
  THEME_OPTIONS,
  applyThemeToDocument,
  loadSettings,
  resetSettings,
  saveSettings,
  type AppThemeId,
  type UserSettings,
} from '../types/settings'
import { saveProviderApiKey } from '../services/ai/appreciation'
import type { PoemTheme } from '../types/poem'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (settings: UserSettings) => void
}

const AUTHORS = [
  '李白', '杜甫', '王维', '白居易', '苏轼',
  '李清照', '辛弃疾', '陆游', '杜牧', '李煜',
]

const THEMES: PoemTheme[] = [
  '山水', '田园', '边塞', '思乡', '离别',
  '爱情', '怀古', '咏物', '哲理', '闲适',
]

export default function SettingsPanel({ isOpen, onClose, onSaved }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [tab, setTab] = useState<'display' | 'taste' | 'ai'>('display')

  useEffect(() => {
    if (isOpen) setSettings(loadSettings())
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    saveSettings(settings)
    if (settings.ai.zhipuApiKey) {
      saveProviderApiKey('zhipu', settings.ai.zhipuApiKey)
    }
    if (settings.ai.deepseekApiKey) {
      saveProviderApiKey('deepseek', settings.ai.deepseekApiKey)
    }
    window.electronAPI?.leaveSettings()
    onSaved(settings)
    onClose()
  }

  const handleClose = () => {
    window.electronAPI?.leaveSettings()
    onClose()
  }

  const handleReset = () => {
    if (confirm('确定重置所有设置？')) {
      const next = resetSettings()
      setSettings(next)
    }
  }

  const selectTheme = (theme: AppThemeId) => {
    setSettings({
      ...settings,
      appearance: { ...settings.appearance, theme },
    })
    applyThemeToDocument(theme)
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-paper text-ink flex flex-col font-serif"
      role="dialog"
      aria-modal="true"
      aria-label="设置"
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-muted/10">
        <h2 className="text-2xl font-bold tracking-wide">设置</h2>
        <button
          type="button"
          onClick={handleClose}
          className="text-muted hover:text-ink transition-colors p-2 rounded-full hover:bg-muted/10"
          aria-label="关闭设置"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex px-8 border-b border-muted/10 gap-8">
        {([
          ['display', '显示'],
          ['taste', '口味'],
          ['ai', '赏析'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`py-4 text-base tracking-widest transition-all relative ${
              tab === id ? 'text-ink font-bold' : 'text-muted hover:text-ink/80'
            }`}
          >
            {label}
            {tab === id && (
              <motion.div layoutId="settingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
            )}
          </button>
        ))}
      </div>

      <div className="p-8 overflow-y-auto flex-1 bg-white/30">
        {tab === 'display' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg mb-4">主题</h3>
              <div className="grid grid-cols-3 gap-3">
                {THEME_OPTIONS.map((opt) => {
                  const active = settings.appearance.theme === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectTheme(opt.id)}
                      className={`px-3 py-4 rounded-xl border text-center transition-all ${
                        active
                          ? 'border-ink bg-ink text-paper'
                          : 'border-muted/20 bg-white/50 text-ink/80 hover:border-ink/40'
                      }`}
                    >
                      <span className="block text-sm tracking-widest">{opt.label}</span>
                      <span className={`block text-[10px] mt-1 ${active ? 'text-paper/70' : 'text-muted'}`}>
                        {opt.hint}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg mb-2">显示元素</h3>
              {(
                [
                  ['showSolarTerm', '显示节气'],
                  ['showDynasty', '显示朝代'],
                  ['showAuthor', '显示作者'],
                  ['showReason', '显示今日缘由'],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-muted/10 cursor-pointer"
                >
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={settings.display[key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        display: { ...settings.display, [key]: e.target.checked },
                      })
                    }
                    className="w-5 h-5 accent-secondary"
                  />
                </label>
              ))}
            </section>
          </div>
        )}

        {tab === 'taste' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg mb-4">偏爱诗人（可选）</h3>
              <div className="flex flex-wrap gap-3">
                {AUTHORS.map((author) => {
                  const active = settings.preferences.favoriteAuthors.includes(author)
                  return (
                    <button
                      key={author}
                      type="button"
                      onClick={() => {
                        const next = active
                          ? settings.preferences.favoriteAuthors.filter((a) => a !== author)
                          : [...settings.preferences.favoriteAuthors, author]
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, favoriteAuthors: next },
                        })
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? 'bg-ink text-paper border-ink'
                          : 'bg-white/50 text-ink/70 border-muted/20'
                      }`}
                    >
                      {author}
                    </button>
                  )
                })}
              </div>
            </section>
            <section>
              <h3 className="text-lg mb-4">偏爱主题（可选）</h3>
              <div className="grid grid-cols-4 gap-3">
                {THEMES.map((theme) => {
                  const active = settings.preferences.favoriteThemes.includes(theme)
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => {
                        const next = active
                          ? settings.preferences.favoriteThemes.filter((t) => t !== theme)
                          : [...settings.preferences.favoriteThemes, theme]
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, favoriteThemes: next },
                        })
                      }}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                        active
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white/50 text-ink/70 border-muted/20'
                      }`}
                    >
                      {theme}
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-muted">口味只影响排序，不会让今日无诗可读。</p>
            </section>
          </div>
        )}

        {tab === 'ai' && (
          <div className="space-y-6">
            <p className="text-sm text-muted leading-relaxed">
              AI 只用于短赏析增强与「创作工坊」现代新作，不会改写或冒充古诗原作。无 Key 时使用精校库预置赏析。
            </p>
            <div className="flex gap-2 p-1 bg-muted/10 rounded-xl">
              {(
                [
                  ['local', '仅本地'],
                  ['auto', '自动增强'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      ai: { ...settings.ai, appreciationMode: mode },
                    })
                  }
                  className={`flex-1 px-4 py-3 rounded-lg text-sm transition-all ${
                    settings.ai.appreciationMode === mode
                      ? 'bg-white shadow-sm text-ink font-bold'
                      : 'text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {settings.ai.appreciationMode === 'auto' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-muted mb-2 block">智谱 API Key</span>
                  <input
                    type="password"
                    value={settings.ai.zhipuApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ai: { ...settings.ai, zhipuApiKey: e.target.value },
                      })
                    }
                    placeholder="可选，优先用于中文赏析"
                    className="w-full px-4 py-3 bg-white/50 border border-muted/20 rounded-lg focus:outline-none focus:border-secondary"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted mb-2 block">DeepSeek API Key</span>
                  <input
                    type="password"
                    value={settings.ai.deepseekApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ai: { ...settings.ai, deepseekApiKey: e.target.value },
                      })
                    }
                    placeholder="可选，智谱失败时回退"
                    className="w-full px-4 py-3 bg-white/50 border border-muted/20 rounded-lg focus:outline-none focus:border-secondary"
                  />
                </label>
              </div>
            )}
            <p className="text-xs text-muted leading-relaxed">
              创作工坊入口在主界面底栏「创作」。工坊产出强制标注「AI · 新作」，永不进入每日真诗与历史日历。
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-8 py-6 border-t border-muted/10 bg-white/40 backdrop-blur-sm">
        <button type="button" onClick={handleReset} className="text-sm text-muted hover:text-red-600">
          重置
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-2.5 bg-ink text-paper rounded-lg hover:bg-ink/90 transition-all shadow-lg tracking-wide"
        >
          保存
        </button>
      </div>
    </motion.div>,
    document.body,
  )
}
