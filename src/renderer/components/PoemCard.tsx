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

import { motion } from 'framer-motion'

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
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 动态背景光晕 */}
      <div className="absolute inset-0 bg-gradient-to-br from-paper via-paper-white to-gray-100 opacity-50 z-0"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
      />
      
      {/* 主卡片 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[85%] max-w-md bg-paper/90 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden"
      >
        {/* 纸张纹理层 */}
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")` }}>
        </div>

        {/* 内容区域 */}
        <div className="relative p-8 md:p-12 flex flex-col items-center min-h-[500px] justify-center text-center">
          
          {/* 顶部日期信息 */}
          <div className="absolute top-6 right-6 flex flex-col items-end">
             <div className="text-muted/60 text-xs font-serif tracking-[0.2em] writing-vertical-rl">
                {date}
             </div>
          </div>

          {/* 装饰性元素：顶部红点 */}
          <div className="w-1.5 h-1.5 rounded-full bg-secondary/60 mb-8"></div>

          {/* 标题 */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif font-bold text-ink mb-2 tracking-widest"
          >
            {poem.title}
          </motion.h1>

          {/* 作者/朝代 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center space-x-2 text-sm text-muted/80 mb-10 font-serif"
          >
            {showDynasty && poem.dynasty && (
              <span className="px-2 py-0.5 border-r border-muted/30">{poem.dynasty}</span>
            )}
            {showAuthor && (
              <span className="px-2 font-medium">{poem.author}</span>
            )}
          </motion.div>

          {/* 诗词内容 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="space-y-4 mb-12"
          >
            {poem.content.map((line, index) => (
              <p key={index} className="text-xl md:text-2xl font-serif text-ink/90 leading-loose tracking-widest">
                {line}
              </p>
            ))}
          </motion.div>

          {/* 底部印章 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
            className="absolute bottom-8 right-8 mix-blend-multiply opacity-90"
          >
            <div className="w-10 h-10 border-[3px] border-double border-secondary rounded-md flex items-center justify-center">
               <span className="text-secondary font-serif font-bold text-[10px] transform scale-x-75">
                  诗<br/>韵
               </span>
            </div>
          </motion.div>

          {/* 天气信息 (如果有) */}
          {weather && showSolarTerm && (
            <div className="absolute bottom-6 left-6 text-accent/80 text-xs font-serif flex items-center gap-1 opacity-70">
              <span>{weather}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default PoemCard
