import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  formatDateKey,
  getSolarTermsForYear,
} from '../engine/solarTerm'
import { isDateViewed, isSameDay, startOfDay } from '../content/history'
import type { SolarTermName } from '../types/poem'

interface HistoryCalendarProps {
  isOpen: boolean
  selectedDate: Date
  onClose: () => void
  onSelectDate: (date: Date) => void
  onBackToToday: () => void
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function buildMonthCells(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startPad = first.getDay()
  const cells: Array<Date | null> = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(year, month, d))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function HistoryCalendar({
  isOpen,
  selectedDate,
  onClose,
  onSelectDate,
  onBackToToday,
}: HistoryCalendarProps) {
  const today = startOfDay()
  const [cursor, setCursor] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  const termMap = useMemo(() => {
    const map = new Map<string, SolarTermName>()
    for (const term of getSolarTermsForYear(cursor.getFullYear())) {
      map.set(formatDateKey(term.date), term.name)
    }
    // 跨年边界：1 月可能需要上年冬至等，12 月需要下年小寒
    if (cursor.getMonth() === 0) {
      for (const term of getSolarTermsForYear(cursor.getFullYear() - 1)) {
        map.set(formatDateKey(term.date), term.name)
      }
    }
    if (cursor.getMonth() === 11) {
      for (const term of getSolarTermsForYear(cursor.getFullYear() + 1)) {
        map.set(formatDateKey(term.date), term.name)
      }
    }
    return map
  }, [cursor])

  const cells = useMemo(
    () => buildMonthCells(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  )

  if (!isOpen) return null

  const monthLabel = `${cursor.getFullYear()}年${cursor.getMonth() + 1}月`
  const showingToday = isSameDay(selectedDate, today)

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] bg-paper text-ink flex flex-col font-serif"
      role="dialog"
      aria-modal="true"
      aria-label="历史日历"
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-muted/10">
        <h2 className="text-2xl font-bold tracking-wide">日历</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-ink transition-colors p-2 rounded-full hover:bg-muted/10"
          aria-label="关闭日历"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-8 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
          }
          className="px-3 py-2 text-sm text-muted hover:text-ink"
          aria-label="上一月"
        >
          ‹
        </button>
        <p className="text-lg tracking-widest">{monthLabel}</p>
        <button
          type="button"
          onClick={() =>
            setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
          }
          className="px-3 py-2 text-sm text-muted hover:text-ink"
          aria-label="下一月"
        >
          ›
        </button>
      </div>

      <div className="px-8 pb-4 grid grid-cols-7 gap-1 text-center text-xs text-muted tracking-widest">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2">
            {w}
          </div>
        ))}
      </div>

      <div className="px-8 flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }
            const key = formatDateKey(day)
            const term = termMap.get(key)
            const selected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, today)
            const viewed = isDateViewed(key)

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelectDate(startOfDay(day))
                  onClose()
                }}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors border ${
                  selected
                    ? 'bg-ink text-paper border-ink'
                    : isToday
                      ? 'border-secondary/50 text-ink bg-secondary/5'
                      : 'border-transparent hover:bg-muted/10 text-ink'
                }`}
                aria-label={`${key}${term ? ` ${term}` : ''}`}
                aria-pressed={selected}
              >
                <span className="text-sm">{day.getDate()}</span>
                {term ? (
                  <span
                    className={`text-[9px] tracking-wider ${
                      selected ? 'text-paper/80' : 'text-accent'
                    }`}
                  >
                    {term.slice(0, 2)}
                  </span>
                ) : viewed ? (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      selected ? 'bg-paper/70' : 'bg-muted/50'
                    }`}
                  />
                ) : (
                  <span className="h-1" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-8 py-6 border-t border-muted/10 bg-white/40 backdrop-blur-sm flex items-center justify-between">
        <p className="text-xs text-muted tracking-wide">
          点选日期回顾当日一诗 · 同日同诗
        </p>
        <button
          type="button"
          onClick={() => {
            onBackToToday()
            onClose()
          }}
          disabled={showingToday}
          className="px-6 py-2.5 bg-ink text-paper rounded-lg hover:bg-ink/90 transition-all disabled:opacity-40 tracking-wide text-sm"
        >
          回到今日
        </button>
      </div>
    </motion.div>,
    document.body,
  )
}
