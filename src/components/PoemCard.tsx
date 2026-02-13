import React from 'react'

interface PoemCardProps {
  poem: {
    title: string
    author: string
    dynasty?: string
    content: string[]
  }
  date: string
  weather?: string | null
  showSolarTerm?: boolean
  showDynasty?: boolean
  showAuthor?: boolean
}

const PoemCard: React.FC<PoemCardProps> = ({ 
  poem, 
  date, 
  weather,
  showSolarTerm = true,
  showDynasty = true,
  showAuthor = true
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      {/* 主卡片 */}
      <div className="relative w-[85%] h-[88%] bg-paper/95 backdrop-blur-xl rounded-sm shadow-2xl paper-texture overflow-hidden">
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80"></div>
        
        {/* 装饰角 */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-accent/50"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-accent/50"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-accent/50"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-accent/50"></div>
        
        {/* 内容区域 */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 py-16">
          {/* 日期和天气/节气 */}
          <div className="absolute top-10 right-10 text-right">
            <div className="text-muted text-sm tracking-widest mb-1">{date}</div>
            {weather && showSolarTerm && (
              <div className="text-accent/70 text-xs">🌤️ {weather}</div>
            )}
          </div>
          
          {/* 印章 */}
          <div className="absolute bottom-10 right-10">
            <div className="seal-stamp w-12 h-12 border-2 border-accent/80 flex items-center justify-center rotate-12">
              <span className="text-accent/90 text-xs font-medium">诗韵</span>
            </div>
          </div>
          
          {/* 诗词标题 */}
          <h1 className="text-3xl font-semibold text-ink mb-3 tracking-wide">
            {poem.title}
          </h1>
          
          {/* 作者和朝代 */}
          {(showAuthor || showDynasty) && (
            <div className="text-muted text-base mb-8 tracking-wider">
              {showDynasty && poem.dynasty && (
                <span className="mr-2">{poem.dynasty}</span>
              )}
              {showAuthor && (
                <span className="font-bold text-secondary">{poem.author}</span>
              )}
            </div>
          )}
          
          {/* 诗词内容 */}
          <div className="text-xl text-ink leading-loose tracking-wide font-medium">
            {poem.content.map((line, index) => (
              <div key={index} className="mb-3">
                {line}
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80"></div>
      </div>
    </div>
  )
}

export default PoemCard
