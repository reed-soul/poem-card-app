import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import PoemCard, { type PoemCardMode } from './components/PoemCard'
import SettingsPanel from './components/SettingsPanel'
import HistoryCalendar from './components/HistoryCalendar'
import FavoritesPanel from './components/FavoritesPanel'
import WorkshopPanel from './components/WorkshopPanel'
import WindowControls from './components/WindowControls'
import { curatedPoems } from './content/poems'
import { isFavorite, toggleFavorite } from './content/favorites'
import { isSameDay, markDateViewed, startOfDay } from './content/history'
import { pickDailyPoem } from './engine/dailyPick'
import {
  getAppreciation,
  getLocalAppreciation,
  saveProviderApiKey,
} from './services/ai/appreciation'
import {
  copyPoemText,
  downloadShareImage,
  readThemeColorsFromDom,
} from './services/shareImage'
import {
  applyThemeToDocument,
  loadSettings,
  type UserSettings,
} from './types/settings'
import type { CuratedPoem, DailyPickResult } from './types/poem'

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
  const [viewDate, setViewDate] = useState<Date>(() => startOfDay())
  const [pick, setPick] = useState<DailyPickResult | null>(null)
  const [overridePoem, setOverridePoem] = useState<CuratedPoem | null>(null)
  const [dateLabel, setDateLabel] = useState('')
  const [appreciation, setAppreciation] = useState<string | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showWorkshop, setShowWorkshop] = useState(false)

  const cardMode: PoemCardMode = overridePoem
    ? 'favorite'
    : isSameDay(viewDate, startOfDay())
      ? 'daily'
      : 'history'

  const displayedPoem = overridePoem ?? pick?.poem ?? null

  const loadPoemForDate = (date: Date, nextSettings: UserSettings) => {
    const day = startOfDay(date)
    setViewDate(day)
    setOverridePoem(null)
    setDateLabel(format(day, 'yyyy年MM月dd日', { locale: zhCN }))
    markDateViewed(day)

    const result = pickDailyPoem(curatedPoems, {
      date: day,
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
    applyThemeToDocument(settings.appearance.theme)
    loadPoemForDate(startOfDay(), settings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openOverlay = async (kind: 'settings' | 'calendar' | 'favorites' | 'workshop') => {
    await window.electronAPI?.enterSettings()
    setShowSettings(kind === 'settings')
    setShowCalendar(kind === 'calendar')
    setShowFavorites(kind === 'favorites')
    setShowWorkshop(kind === 'workshop')
  }

  const closeOverlay = () => {
    window.electronAPI?.leaveSettings()
    setShowSettings(false)
    setShowCalendar(false)
    setShowFavorites(false)
    setShowWorkshop(false)
  }

  const handleShare = async () => {
    if (!displayedPoem) return
    setSharing(true)
    try {
      await downloadShareImage({
        poem: displayedPoem,
        dateLabel,
        solarTermLabel:
          cardMode === 'favorite' ? null : pick ? buildSolarTermLabel(pick) : null,
        theme: readThemeColorsFromDom(),
      })
    } catch (error) {
      console.error('share failed', error)
      alert(error instanceof Error ? error.message : '分享导出失败')
    } finally {
      setSharing(false)
    }
  }

  const handleCopy = async () => {
    if (!displayedPoem) return
    try {
      await copyPoemText({
        poem: displayedPoem,
        dateLabel,
        solarTermLabel:
          cardMode === 'favorite' ? null : pick ? buildSolarTermLabel(pick) : null,
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : '复制失败')
    }
  }

  const navBtn =
    'px-3 py-2 text-xs font-serif tracking-widest rounded-md border border-muted/20 bg-white/30 backdrop-blur-md text-muted hover:text-ink hover:border-ink/30 transition-colors'

  return (
    <div className="relative w-full h-full overflow-hidden app-shell">
      <div className="absolute inset-0 opacity-40 pointer-events-none app-shell-glow" />

      <WindowControls />

      <button
        type="button"
        onClick={() => openOverlay('settings')}
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

      {displayedPoem && (
        <PoemCard
          poem={displayedPoem}
          dateLabel={dateLabel}
          solarTermLabel={
            cardMode === 'favorite' ? null : pick ? buildSolarTermLabel(pick) : null
          }
          reason={cardMode === 'favorite' ? null : pick?.reason}
          appreciation={appreciation}
          mode={cardMode}
          showSolarTerm={settings.display.showSolarTerm}
          showDynasty={settings.display.showDynasty}
          showAuthor={settings.display.showAuthor}
          showReason={settings.display.showReason}
          favorited={favorited}
          sharing={sharing}
          onToggleFavorite={() => {
            const next = toggleFavorite(displayedPoem.id)
            setFavorited(next.includes(displayedPoem.id))
          }}
          onShare={handleShare}
          onCopy={handleCopy}
        />
      )}

      <nav
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
        aria-label="次级入口"
      >
        <button type="button" className={navBtn} onClick={() => openOverlay('calendar')}>
          日历
        </button>
        <button type="button" className={navBtn} onClick={() => openOverlay('favorites')}>
          收藏
        </button>
        <button
          type="button"
          className={`${navBtn} text-muted/70`}
          onClick={() => openOverlay('workshop')}
        >
          创作
        </button>
      </nav>

      <SettingsPanel
        isOpen={showSettings}
        onClose={closeOverlay}
        onSaved={(next) => {
          setSettings(next)
          loadPoemForDate(viewDate, next)
        }}
      />

      <HistoryCalendar
        isOpen={showCalendar}
        selectedDate={viewDate}
        onClose={closeOverlay}
        onSelectDate={(date) => loadPoemForDate(date, settings)}
        onBackToToday={() => loadPoemForDate(startOfDay(), settings)}
      />

      <FavoritesPanel
        isOpen={showFavorites}
        onClose={closeOverlay}
        onSelectPoem={(poem) => {
          setOverridePoem(poem)
          setDateLabel('收藏')
          setFavorited(isFavorite(poem.id))
          const local = getLocalAppreciation(poem)
          setAppreciation(local.text)
        }}
      />

      <WorkshopPanel isOpen={showWorkshop} onClose={closeOverlay} />
    </div>
  )
}

export default App
