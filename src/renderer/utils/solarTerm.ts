/**
 * 24 节气计算
 * 来源：https://github.com/kairu/24-jieqi
 */

export interface SolarTerm {
  name: string        // 节气名称
  month: number      // 月份 (1-12)
  day: number        // 日期
  keywords: string[]  // 相关关键词
}

export const SOLAR_TERMS: SolarTerm[] = [
  { name: '立春', month: 2, day: 4, keywords: ['春天', '开始', '温暖'] },
  { name: '雨水', month: 2, day: 19, keywords: ['雨水', '春雨', '润物'] },
  { name: '惊蛰', month: 3, day: 6, keywords: ['春天', '春雷', '苏醒'] },
  { name: '春分', month: 3, day: 21, keywords: ['春天', '平衡', '生机'] },
  { name: '清明', month: 4, day: 5, keywords: ['春天', '清明', '祭祖'] },
  { name: '谷雨', month: 4, day: 20, keywords: ['春天', '雨水', '谷雨'] },
  { name: '立夏', month: 5, day: 6, keywords: ['夏天', '开始', '生长'] },
  { name: '小满', month: 5, day: 21, keywords: ['夏天', '饱满', '生长'] },
  { name: '芒种', month: 6, day: 6, keywords: ['夏天', '种植', '忙碌'] },
  { name: '夏至', month: 6, day: 21, keywords: ['夏天', '最热', '白昼长'] },
  { name: '小暑', month: 7, day: 7, keywords: ['夏天', '炎热', '避暑'] },
  { name: '大暑', month: 7, day: 23, keywords: ['夏天', '最热', '炎热'] },
  { name: '立秋', month: 8, day: 8, keywords: ['秋天', '开始', '凉爽'] },
  { name: '处暑', month: 8, day: 23, keywords: ['秋天', '结束', '转凉'] },
  { name: '白露', month: 9, day: 8, keywords: ['秋天', '露水', '转凉'] },
  { name: '秋分', month: 9, day: 23, keywords: ['秋天', '平衡', '收获'] },
  { name: '寒露', month: 10, day: 8, keywords: ['秋天', '寒冷', '露水'] },
  { name: '霜降', month: 10, day: 23, keywords: ['秋天', '霜降', '红叶'] },
  { name: '立冬', month: 11, day: 7, keywords: ['冬天', '开始', '寒冷'] },
  { name: '小雪', month: 11, day: 22, keywords: ['冬天', '雪', '寒冷'] },
  { name: '大雪', month: 12, day: 7, keywords: ['冬天', '大雪', '严寒'] },
  { name: '冬至', month: 12, day: 22, keywords: ['冬天', '最冷', '夜晚长'] },
  { name: '小寒', month: 1, day: 6, keywords: ['冬天', '寒冷', '最冷'] },
  { name: '大寒', month: 1, day: 20, keywords: ['冬天', '最冷', '岁末'] },
]

/**
 * 获取当前日期的节气
 */
export function getSolarTerm(date: Date): SolarTerm | null {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // 查找当天的节气
  return SOLAR_TERMS.find(term => term.month === month && term.day === day) || null
}

/**
 * 获取当前日期最近的节气（用于推荐）
 * 返回过去或未来最近的节气
 */
export function getNearestSolarTerm(date: Date): SolarTerm {
  const today = new Date(date)
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()
  
  // 先查找今天是否是节气
  const todayTerm = SOLAR_TERMS.find(
    term => term.month === currentMonth && term.day === currentDay
  )
  if (todayTerm) {
    return todayTerm
  }
  
  // 查找最近的节气（未来7天内的）
  const futureTerms: Array<{term: SolarTerm, daysDiff: number}> = []
  const pastTerms: Array<{term: SolarTerm, daysDiff: number}> = []
  
  SOLAR_TERMS.forEach(term => {
    const termDate = new Date(today.getFullYear(), term.month - 1, term.day)
    const daysDiff = Math.floor((termDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff >= 0 && daysDiff <= 7) {
      futureTerms.push({ term, daysDiff })
    } else if (daysDiff < 0 && daysDiff >= -3) {
      pastTerms.push({ term, daysDiff })
    }
  })
  
  // 优先返回未来的节气，如果没有则返回过去的
  if (futureTerms.length > 0) {
    return futureTerms.sort((a, b) => a.daysDiff - b.daysDiff)[0].term
  } else if (pastTerms.length > 0) {
    return pastTerms.sort((a, b) => b.daysDiff - a.daysDiff)[0].term
  }
  
  // 默认返回立春
  return SOLAR_TERMS[0]
}

/**
 * 根据节气推荐诗词
 * @param poems 诗词数组
 * @param solarTerm 当前节气
 * @param seed 随机种子（基于日期）
 */
export function recommendBySolarTerm(
  poems: any[],
  solarTerm: SolarTerm,
  seed: number
): any {
  // 先尝试匹配诗词标签与节气关键词
  const matchedPoems = poems.filter(poem => {
    if (!poem.tags) return false
    return poem.tags.some(tag => 
      solarTerm.keywords.includes(tag)
    )
  })
  
  if (matchedPoems.length > 0) {
    // 从匹配的诗词中随机选择
    const index = seed % matchedPoems.length
    return matchedPoems[index]
  }
  
  // 如果没有匹配的，随机选择一首
  const index = seed % poems.length
  return poems[index]
}
