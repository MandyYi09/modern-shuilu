import { getPainting, paintings, type PaintingId } from './paintings'

export const dailyDrawStorageKey = 'shuilu-daily-draw-v1'
export const dailyDrawEvent = 'shuilu-daily-draw-changed'
type DrawRecord = { day: string; paintingId: PaintingId }
let unsavedDraw: DrawRecord | null = null

export function dailyDrawDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

/** Reading a result never consumes today's draw. */
export function readDailyPainting(date = new Date()) {
  if (typeof window === 'undefined') return null
  const day = dailyDrawDay(date)
  try {
    const record = JSON.parse(localStorage.getItem(dailyDrawStorageKey) || 'null')
    if (record?.day === day && typeof record.paintingId === 'string') {
      const painting = getPainting(record.paintingId)
      if (painting) return painting
    }
  } catch { /* Storage may be disabled or contain an invalid record. */ }
  return unsavedDraw?.day === day ? getPainting(unsavedDraw.paintingId) ?? null : null
}

export async function drawDailyPainting(date = new Date()) {
  const draw = () => {
    const saved = readDailyPainting(date)
    if (saved) return saved
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000
    const painting = paintings[Math.floor(random * paintings.length)]
    const record: DrawRecord = { day: dailyDrawDay(date), paintingId: painting.id }
    try {
      localStorage.setItem(dailyDrawStorageKey, JSON.stringify(record))
      unsavedDraw = null
    } catch { unsavedDraw = record }
    window.dispatchEvent(new Event(dailyDrawEvent))
    return painting
  }
  // Two tabs drawing together share a lock, then re-read the stored result.
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request(dailyDrawStorageKey, draw)
  }
  return draw()
}
