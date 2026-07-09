import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import PoemCard from './components/PoemCard'
import SettingsPanel from './components/SettingsPanel'
import WindowControls from './components/WindowControls'
import { curatedPoems } from './content/poems'
import { isFavorite, toggleFavorite } from './content/favorites'
import { pickDailyPoem } from './engine/dailyPick'
import {
  getAppreciation,
  getLocalAppreciation,
  saveProviderApiKey,
} from './services/ai/appreciation'
import { loadSettings, type UserSettings } from './types/settings'
import type { DailyPickResult } from './types/poem'

declare global {
  interface Window {
    electronAPI?: {
      close: () => void
      minimize: () => void
      maximize: () => void
      enterSettings: () => Promise<void>
      leaveSettings: () => Promise<void>
      saveApiKey: (key: string) => Promise<{ success: boolean; message?: string }>
      loadApiKey: () => Promise<string>
      clearApiKey: () => Promise<{ success: boolean; message?: string }>
    }
  }
}

function buildSolarTermLabel(pick: DailyPickResult): string {
  if (!pick.solarTerm) return ''
  const { name, isToday, daysUntil } = pick.solarTerm
  if (isToday) return `今日${name}`
  if (daysUntil > 0) return `${name}将至`
  return `近${name}`
}

function App() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings())
  const [pick, setPick] = useState<DailyPickResult | null>(null)
  const [dateLabel, setDateLabel] = useState('')
  const [appreciation, setAppreciation] = useState<string | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const refreshDaily = (nextSettings: UserSettings) => {
    const now = new Date()
    setDateLabel(format(now, 'yyyy年MM月dd日', { locale: zhCN }))

    const result = pickDailyPoem(curatedPoems, {
      date: now,
      preferredAuthors: nextSettings.preferences.favoriteAuthors,
      preferredThemes: nextSettings.preferences.favoriteThemes,
    })
    setPick(result)
    setFavorited(isFavorite(result.poem.id))

    const local = getLocalAppreciation(result.poem)
    setAppreciation(local.text)

    if (nextSettings.ai.appreciationMode === 'auto') {
      if (nextSettings.ai.zhipuApiKey) {
        saveProviderApiKey('zhipu', nextSettings.ai.zhipuApiKey)
      }
      if (nextSettings.ai.deepseekApiKey) {
        saveProviderApiKey('deepseek', nextSettings.ai.deepseekApiKey)
      }
      void getAppreciation({
        poem: result.poem,
        reason: result.reason,
      }).then((enhanced) => {
        setAppreciation(enhanced.text)
      })
    }
  }

  useEffect(() => {
    refreshDaily(settings)
    // 仅首屏；设置保存后由 onSaved 触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#f3efe6] via-[#f7f4ee] to-[#ebe4d8]">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 0%, rgba(212,175,55,0.12), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(200,16,46,0.06), transparent 45%)',
        }}
      />

      <WindowControls />

      <button
        type="button"
        onClick={async () => {
          await window.electronAPI?.enterSettings()
          setShowSettings(true)
        }}
        className="absolute top-4 left-4 z-20 p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all"
        title="设置"
        aria-label="打开设置"
      >
        <svg className="w-6 h-6 text-ink/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {pick && (
        <PoemCard
          poem={pick.poem}
          dateLabel={dateLabel}
          solarTermLabel={buildSolarTermLabel(pick)}
          reason={pick.reason}
          appreciation={appreciation}
          showSolarTerm={settings.display.showSolarTerm}
          showDynasty={settings.display.showDynasty}
          showAuthor={settings.display.showAuthor}
          showReason={settings.display.showReason}
          favorited={favorited}
          onToggleFavorite={() => {
            const next = toggleFavorite(pick.poem.id)
            setFavorited(next.includes(pick.poem.id))
          }}
        />
      )}

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSaved={(next) => {
          setSettings(next)
          refreshDaily(next)
        }}
      />
    </div>
  )
}

export default App
