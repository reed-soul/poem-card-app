import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import PoemCard from './components/PoemCard'
import SettingsPanel from './components/SettingsPanel'
import WindowControls from './components/WindowControls'
import poems from './data/poems精选.json'
import { getNearestSolarTerm, recommendBySolarTerm } from './utils/solarTerm'
import { loadSettings, UserSettings } from './types/settings'

// 类型声明
declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void
      closeWindow: () => void
      maximizeWindow: () => void
    }
  }
}

function App() {
  const [currentPoem, setCurrentPoem] = useState(poems[0])
  const [today, setToday] = useState('')
  const [solarTerm, setSolarTerm] = useState<string | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings())

  useEffect(() => {
    // 加载用户设置
    const loadedSettings = loadSettings()
    setSettings(loadedSettings)
    
    // 设置今天的日期
    const now = new Date()
    setToday(format(now, 'yyyy年MM月dd日', { locale: zhCN }))
    
    // 获取节气
    const term = getNearestSolarTerm(now)
    setSolarTerm(term ? term.name : null)
    
    // 根据用户偏好推荐诗词
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    
    // 根据用户偏好筛选诗词
    let filteredPoems = [...poems]
    
    // 按季节筛选
    if (settings.preferences.favoriteSeasons.length > 0) {
      filteredPoems = filteredPoems.filter(poem => {
        if (!poem.tags) return false
        return poem.tags.some(tag => settings.preferences.favoriteSeasons.includes(tag))
      })
    }
    
    // 按主题筛选
    if (settings.preferences.favoriteThemes.length > 0) {
      filteredPoems = filteredPoems.filter(poem => {
        if (!poem.tags) return false
        return poem.tags.some(tag => settings.preferences.favoriteThemes.includes(tag))
      })
    }
    
    // 按诗人筛选
    if (settings.preferences.favoriteAuthors.length > 0) {
      filteredPoems = filteredPoems.filter(poem => 
        settings.preferences.favoriteAuthors.includes(poem.author)
      )
    }
    
    // 如果筛选后没有诗词，使用全部诗词
    if (filteredPoems.length === 0) {
      filteredPoems = poems
    }
    
    // 使用节气推荐逻辑
    const recommendedPoem = recommendBySolarTerm(filteredPoems, term, dayOfYear)
    setCurrentPoem(recommendedPoem)
    
    // 设置背景图片（根据季节变化）
    const month = now.getMonth() + 1
    let seasonImage = ''
    
    if (month >= 3 && month <= 5) {
      // 春天：樱花或桃花
      seasonImage = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80'
    } else if (month >= 6 && month <= 8) {
      // 夏天：荷花
      seasonImage = 'https://images.unsplash.com/photo-1587327187394-9d9ab0128715?w=1920&q=80'
    } else if (month >= 9 && month <= 11) {
      // 秋天：菊花或枫叶
      seasonImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80'
    } else {
      // 冬天：梅花或雪景
      seasonImage = 'https://images.unsplash.com/photo-1518182170546-0766ba6f6a8e?w=1920&q=80'
    }
    
    setBackgroundImage(seasonImage)
  }, [])

  // 切换到下一首诗词（用于多首诗词显示）
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0)

  const nextPoem = () => {
    const newIndex = (currentPoemIndex + 1) % Math.min(settings.display.poemsPerDay, poems.length)
    setCurrentPoemIndex(newIndex)
    
    // 重新计算推荐的诗词
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const term = getNearestSolarTerm(now)
    
    let filteredPoems = [...poems]
    
    // 应用筛选逻辑（同上）
    if (settings.preferences.favoriteSeasons.length > 0) {
      filteredPoems = filteredPoems.filter(poem => {
        if (!poem.tags) return false
        return poem.tags.some(tag => settings.preferences.favoriteSeasons.includes(tag))
      })
    }
    
    if (settings.preferences.favoriteThemes.length > 0) {
      filteredPoems = filteredPoems.filter(poem => {
        if (!poem.tags) return false
        return poem.tags.some(tag => settings.preferences.favoriteThemes.includes(tag))
      })
    }
    
    if (settings.preferences.favoriteAuthors.length > 0) {
      filteredPoems = filteredPoems.filter(poem => 
        settings.preferences.favoriteAuthors.includes(poem.author)
      )
    }
    
    if (filteredPoems.length === 0) {
      filteredPoems = poems
    }
    
    const recommendedPoem = recommendBySolarTerm(filteredPoems, term, dayOfYear + newIndex)
    setCurrentPoem(recommendedPoem)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: `blur(${settings.background.blur}px)`,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, ${settings.background.opacity / 100})`,
          backdropFilter: 'blur(10px)'
          }}
        ></div>
      </div>
      
      {/* 窗口控制 */}
      <WindowControls />
      
      {/* 设置按钮 */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 left-4 z-20 p-2 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-all group"
        title="设置"
      >
        <svg className="w-6 h-6 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37-2.37a1.724 1.724 0 001.065-2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31 2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.066-2.573c-1.543.94-3.31-.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 001.066 2.573c.94-1.543.826-3.31 2.37-2.37.1.724 1.724 0 002.572-1.065zM12 18a.75.75 0 01.75-.75V7a.75.75 0 01-.75-.75A2.25 2.25 0 019.75 4.5a.75.75 0 01-.75.75v10.5c0 .414.336.75.75.75a.75.75 0 01.75-.75v-6a.75.75 0 01-.75-.75V7a.75.75 0 01-.75-.75A2.25 2.25 0 019.75 4.5a.75.75 0 01-.75.75z" />
        </svg>
      </button>

      {/* 诗词卡片 */}
      <PoemCard 
        poem={currentPoem} 
        date={today} 
        weather={solarTerm}
        showSolarTerm={settings.display.showSolarTerm}
        showDynasty={settings.display.showDynasty}
        showAuthor={settings.display.showAuthor}
      />
      
      {/* 设置面板 */}
      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}

export default App
