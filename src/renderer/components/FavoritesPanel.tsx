import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { listFavoritePoems } from '../content/favorites'
import type { CuratedPoem } from '../types/poem'

interface FavoritesPanelProps {
  isOpen: boolean
  onClose: () => void
  onSelectPoem: (poem: CuratedPoem) => void
}

export default function FavoritesPanel({
  isOpen,
  onClose,
  onSelectPoem,
}: FavoritesPanelProps) {
  if (!isOpen) return null

  const poems = listFavoritePoems()

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-paper text-ink flex flex-col font-serif"
      role="dialog"
      aria-modal="true"
      aria-label="收藏集"
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-muted/10">
        <h2 className="text-2xl font-bold tracking-wide">收藏</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-ink transition-colors p-2 rounded-full hover:bg-muted/10"
          aria-label="关闭收藏"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {poems.length === 0 ? (
          <p className="text-center text-muted tracking-widest mt-24 text-sm">
            尚无收藏 · 在诗卡上点「收藏」即可留下
          </p>
        ) : (
          <ul className="space-y-3">
            {poems.map((poem) => (
              <li key={poem.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPoem(poem)
                    onClose()
                  }}
                  className="w-full text-left px-5 py-4 rounded-xl border border-muted/15 bg-white/40 hover:bg-white/70 transition-colors"
                >
                  <p className="text-lg tracking-widest text-ink">{poem.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {poem.dynasty} · {poem.author}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>,
    document.body,
  )
}
