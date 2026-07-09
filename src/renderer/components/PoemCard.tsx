import { useReducedMotion, motion } from 'framer-motion'
import type { CuratedPoem } from '../types/poem'

export type PoemCardMode = 'daily' | 'history' | 'favorite'

interface PoemCardProps {
  poem: CuratedPoem
  dateLabel: string
  solarTermLabel?: string | null
  reason?: string | null
  appreciation?: string | null
  mode?: PoemCardMode
  showSolarTerm?: boolean
  showDynasty?: boolean
  showAuthor?: boolean
  showReason?: boolean
  favorited?: boolean
  sharing?: boolean
  onToggleFavorite?: () => void
  onShare?: () => void
}

export default function PoemCard({
  poem,
  dateLabel,
  solarTermLabel,
  reason,
  appreciation,
  mode = 'daily',
  showSolarTerm = true,
  showDynasty = true,
  showAuthor = true,
  showReason = true,
  favorited = false,
  sharing = false,
  onToggleFavorite,
  onShare,
}: PoemCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const modeLabel =
    mode === 'favorite' ? '收藏' : mode === 'history' ? '往日' : null

  return (
    <main
      id="content"
      tabIndex={-1}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-paper via-paper-white to-transparent opacity-60 z-0" />
      {!shouldReduceMotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.45, scale: 1 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-[-18%] left-[-12%] w-[420px] h-[420px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        />
      )}

      <motion.article
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-[88%] max-w-md bg-paper/92 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border overflow-hidden"
        style={{ borderColor: 'var(--color-card-border)' }}
        aria-label={`诗词《${poem.title}》`}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-8 pt-10 pb-8 flex flex-col items-center min-h-[520px] text-center">
          <header className="absolute top-5 inset-x-5 flex items-start justify-between gap-3">
            <div className="text-left space-y-1">
              {modeLabel && (
                <p className="text-secondary/80 text-[10px] font-serif tracking-[0.2em]">
                  {modeLabel}
                </p>
              )}
              {showSolarTerm && solarTermLabel && (
                <p className="text-accent/90 text-xs font-serif tracking-[0.18em]">
                  {solarTermLabel}
                </p>
              )}
            </div>
            <time className="text-muted/60 text-xs font-serif tracking-[0.18em] writing-vertical-rl">
              {dateLabel}
            </time>
          </header>

          <div className="w-1.5 h-1.5 rounded-full bg-secondary/60 mb-8 mt-6" aria-hidden />

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-3 tracking-widest">
            {poem.title}
          </h1>

          <p className="flex items-center justify-center gap-2 text-sm text-muted/80 mb-8 font-serif">
            {showDynasty && poem.dynasty && (
              <span className="px-2 py-0.5 border-r border-muted/30">{poem.dynasty}</span>
            )}
            {showAuthor && <span className="px-2 font-medium">{poem.author}</span>}
          </p>

          <div className="space-y-3 mb-8 w-full">
            {poem.content.map((line, index) => (
              <p
                key={`${poem.id}-${index}`}
                className="text-xl md:text-[1.35rem] font-serif text-ink/90 leading-loose tracking-widest"
              >
                {line}
              </p>
            ))}
          </div>

          {showReason && reason && mode !== 'favorite' && (
            <p className="text-xs text-muted/70 font-serif tracking-wide mb-4 max-w-[90%]">
              {reason}
            </p>
          )}

          {appreciation && (
            <details className="w-full max-w-[92%] text-left group mb-6">
              <summary className="cursor-pointer list-none text-sm text-ink/70 font-serif tracking-widest flex items-center justify-center gap-2 py-2 hover:text-ink transition-colors">
                <span>赏析</span>
                <span className="text-muted/50 group-open:rotate-180 transition-transform" aria-hidden>
                  ▾
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink/75 font-serif px-1">
                {appreciation}
              </p>
            </details>
          )}

          <footer className="mt-auto w-full flex items-end justify-between pt-2 gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-pressed={favorited}
                aria-label={favorited ? '取消收藏' : '收藏本诗'}
                className={`px-3 py-2 text-xs font-serif tracking-widest rounded-md border transition-colors ${
                  favorited
                    ? 'border-secondary/40 text-secondary bg-secondary/5'
                    : 'border-muted/20 text-muted hover:text-ink hover:border-ink/30'
                }`}
              >
                {favorited ? '已藏' : '收藏'}
              </button>
              <button
                type="button"
                onClick={onShare}
                disabled={sharing}
                aria-label="分享长图"
                className="px-3 py-2 text-xs font-serif tracking-widest rounded-md border border-muted/20 text-muted hover:text-ink hover:border-ink/30 transition-colors disabled:opacity-40"
              >
                {sharing ? '导出中' : '分享'}
              </button>
            </div>

            <div
              className="w-10 h-10 border-[3px] border-double border-secondary rounded-md flex items-center justify-center rotate-12 mix-blend-multiply opacity-90"
              aria-hidden
            >
              <span className="text-secondary font-serif font-bold text-[10px] scale-x-75 leading-tight">
                诗
                <br />
                韵
              </span>
            </div>
          </footer>
        </div>
      </motion.article>
    </main>
  )
}
