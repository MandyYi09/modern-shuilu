import { useEffect, useState } from 'react'
import type { Painting } from './paintings'
import { dailyDrawEvent, readDailyPainting } from './dailyDraw'

export function useDailyDraw() {
  const [painting, setPainting] = useState<Painting | null>(null)
  useEffect(() => {
    const sync = () => setPainting(readDailyPainting())
    sync()
    const timer = window.setInterval(sync, 30_000)
    window.addEventListener('focus', sync)
    window.addEventListener('storage', sync)
    window.addEventListener(dailyDrawEvent, sync)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', sync)
      window.removeEventListener('storage', sync)
      window.removeEventListener(dailyDrawEvent, sync)
    }
  }, [])
  return painting
}
