import React from 'react'
import './App.css'
import PoemCard from './components/PoemCard'
import WindowControls from './components/WindowControls'

function App() {
  const today = new Date()

  // 示例诗词数据（后续从数据库加载）
  const samplePoem = {
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: [
      '床前明月光，',
      '疑是地上霜。',
      '举头望明月，',
      '低头思故乡。',
    ],
  }

  const formattedDate = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="app">
      <WindowControls />
      <div className="poem-container">
        <div className="date-badge">{formattedDate}</div>
        <PoemCard poem={samplePoem} />
      </div>
    </div>
  )
}

export default App
