import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import PoemCard from './components/PoemCard'
import WindowControls from './components/WindowControls'
import poems from './data/poems精选.json'
import { getNearestSolarTerm, recommendBySolarTerm } from './utils/solarTerm'

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

  useEffect(() => {
    // 设置今天的日期
    const now = new Date()
    setToday(format(now, 'yyyy年MM月dd日', { locale: zhCN }))
    
    // 获取节气
    const term = getNearestSolarTerm(now)
    setSolarTerm(term ? term.name : null)
    
    // 根据日期选择诗词（确保同一天显示相同的诗）
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    
    // 使用节气推荐逻辑
    const recommendedPoem = recommendBySolarTerm(poems, term, dayOfYear)
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 背景图片 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>
      
      {/* 窗口控制 */}
      <WindowControls />
      
      {/* 诗词卡片 */}
      <PoemCard poem={currentPoem} date={today} weather={solarTerm} />
    </div>
  )
}

export default App
