import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  createWorkshopPoem,
  loadWorkshopDrafts,
  type WorkshopPoem,
} from '../services/ai/workshop'
import { getAiConfigSummary } from '../services/ai/appreciation'

interface WorkshopPanelProps {
  isOpen: boolean
  onClose: () => void
}

const STYLES = ['清新', '豪放', '婉约', '深沉', '灵动']
const SEASONS = ['不限', '春', '夏', '秋', '冬']
const THEMES = ['不限', '山水', '田园', '思乡', '离别', '哲理', '闲适']

export default function WorkshopPanel({ isOpen, onClose }: WorkshopPanelProps) {
  const [style, setStyle] = useState('清新')
  const [season, setSeason] = useState('不限')
  const [theme, setTheme] = useState('不限')
  const [length, setLength] = useState<4 | 8>(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<WorkshopPoem | null>(null)
  const [drafts, setDrafts] = useState<WorkshopPoem[]>([])

  useEffect(() => {
    if (isOpen) setDrafts(loadWorkshopDrafts())
  }, [isOpen])

  if (!isOpen) return null

  const keys = getAiConfigSummary()
  const hasKey = keys.zhipu || keys.deepseek

  const handleCreate = async () => {
    setError(null)
    setLoading(true)
    try {
      const poem = await createWorkshopPoem({
        style,
        season: season === '不限' ? '' : season,
        theme: theme === '不限' ? '' : theme,
        length,
      })
      setResult(poem)
      setDrafts(loadWorkshopDrafts())
    } catch (err) {
      setError(err instanceof Error ? err.message : '创作失败')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-paper text-ink flex flex-col font-serif"
      role="dialog"
      aria-modal="true"
      aria-label="创作工坊"
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-muted/10">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">创作工坊</h2>
          <p className="mt-1 text-xs text-secondary tracking-widest">
            AI 新作 · 非古诗原作 · 不进入每日真诗
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-ink transition-colors p-2 rounded-full hover:bg-muted/10"
          aria-label="关闭工坊"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        <p className="text-sm text-muted leading-relaxed">
          这里生成的是当代原创，仅供欣赏。不会写入精校库，也不会出现在历史日历的当日真诗里。
        </p>

        {!hasKey && (
          <div className="p-4 rounded-lg border border-secondary/30 bg-secondary/5 text-sm text-secondary">
            请先在设置 → 赏析中配置智谱或 DeepSeek API Key。
          </div>
        )}

        <section className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="text-muted mb-2 block">风格</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 border border-muted/20 rounded-lg"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted mb-2 block">季节</span>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 border border-muted/20 rounded-lg"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-muted mb-2 block">主题</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 border border-muted/20 rounded-lg"
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <div className="block text-sm">
            <span className="text-muted mb-2 block">篇幅</span>
            <div className="flex gap-2">
              {([4, 8] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setLength(n)}
                  className={`flex-1 py-2 rounded-lg border text-sm ${
                    length === n
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-white/50 border-muted/20 text-muted'
                  }`}
                >
                  {n === 4 ? '四句' : '八句'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading || !hasKey}
          className="w-full py-3 bg-ink text-paper rounded-lg hover:bg-ink/90 disabled:opacity-40 tracking-widest"
        >
          {loading ? '生成中…' : '开始创作'}
        </button>

        {error && (
          <p className="text-sm text-secondary" role="alert">{error}</p>
        )}

        {result && (
          <article className="p-6 rounded-xl border border-secondary/20 bg-white/50 text-center space-y-4">
            <p className="text-xs text-secondary tracking-[0.2em]">AI · 新作 · 当代</p>
            <h3 className="text-2xl tracking-widest">{result.title}</h3>
            <p className="text-sm text-muted">{result.author}</p>
            <div className="space-y-2 pt-2">
              {result.content.map((line, i) => (
                <p key={`${result.id}-${i}`} className="text-lg tracking-widest leading-loose">
                  {line}
                </p>
              ))}
            </div>
            <p className="text-xs text-muted pt-2">仅供欣赏，非古诗原作</p>
          </article>
        )}

        {drafts.length > 0 && (
          <section>
            <h3 className="text-sm text-muted tracking-widest mb-3">最近草稿</h3>
            <ul className="space-y-2">
              {drafts.slice(0, 5).map((draft) => (
                <li key={draft.id}>
                  <button
                    type="button"
                    onClick={() => setResult(draft)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-muted/15 bg-white/30 hover:bg-white/60 text-sm"
                  >
                    <span className="tracking-widest">{draft.title}</span>
                    <span className="ml-2 text-xs text-secondary">AI</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </motion.div>,
    document.body,
  )
}
