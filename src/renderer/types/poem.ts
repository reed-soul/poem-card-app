/**
 * 精校诗词内容模型（Phase 1）
 * 真诗只来自精校库；AI 不得写入此结构冒充原作。
 */

export type Dynasty = '先秦' | '汉' | '魏晋' | '南北朝' | '唐' | '五代' | '宋' | '元' | '明' | '清'

export type PoemForm =
  | '五言绝句'
  | '七言绝句'
  | '五言律诗'
  | '七言律诗'
  | '乐府'
  | '古体'
  | '词'
  | '曲'

export type Season = '春' | '夏' | '秋' | '冬'

/** 二十四节气名称 */
export type SolarTermName =
  | '立春' | '雨水' | '惊蛰' | '春分' | '清明' | '谷雨'
  | '立夏' | '小满' | '芒种' | '夏至' | '小暑' | '大暑'
  | '立秋' | '处暑' | '白露' | '秋分' | '寒露' | '霜降'
  | '立冬' | '小雪' | '大雪' | '冬至' | '小寒' | '大寒'

export type PoemTheme =
  | '山水'
  | '田园'
  | '边塞'
  | '思乡'
  | '离别'
  | '爱情'
  | '怀古'
  | '咏物'
  | '哲理'
  | '闲适'
  | '忧国'
  | '节令'
  | '友情'
  | '壮志'

export interface CuratedPoem {
  /** 稳定 ID，格式：dynasty-author-title-slug */
  id: string
  title: string
  author: string
  dynasty: Dynasty
  content: string[]
  form: PoemForm
  themes: PoemTheme[]
  seasons: Season[]
  /** 显式关联的节气；空数组表示不绑定节气 */
  solarTerms: SolarTermName[]
  /** 本地预置短赏析（2–4 句），可被 AI 缓存覆盖展示但不改原作 */
  appreciation?: string
  /** 出处说明，便于校对 */
  source?: string
  /** 是否允许进入每日选定；缺省视为 true */
  dailyEligible?: boolean
  /** 节选作品；UI 可显示角标 */
  excerpt?: boolean
}

export interface DailyPickResult {
  poem: CuratedPoem
  dateKey: string
  solarTerm: {
    name: SolarTermName
    isToday: boolean
    daysUntil: number
  } | null
  season: Season
  reason: string
  matchRank: 'solarTerm' | 'season' | 'theme' | 'fallback'
}
