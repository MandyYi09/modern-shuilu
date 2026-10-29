import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { paintings } from '@/lib/paintings'
import { drawDailyPainting } from '@/lib/dailyDraw'
import { useDailyDraw } from '@/lib/useDailyDraw'

export const Route = createFileRoute('/draw')({ component: DrawPage })
function DrawPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const drawn = useDailyDraw()
  const daily = drawn ?? paintings[0]
  const revealed = drawn !== null
  const [drawing, setDrawing] = useState(false)
  const reveal = async () => {
    if (drawing) return
    setDrawing(true)
    try { await drawDailyPainting() } finally { setDrawing(false) }
  }
  return <section className="draw-page daily-encounter">
    <header className="feature-heading"><h1>{en ? 'Daily draw' : '每日抽卡'}</h1><p>{en ? 'One illustrated character card each day. Come back tomorrow for your next encounter.' : '每天只能抽到一位角色的卡通卡，明天再来遇见下一位。'}</p></header>
    <div className="draw-workspace">
      <div className="draw-card-column">
        {revealed ? <figure className="daily-revealed-card"><img src={daily.character} alt={en ? daily.identity.name.en : daily.identity.name.zh}/><figcaption>{en ? 'TODAY’S CHARACTER' : '今日角色'} · {String(daily.index).padStart(2, '0')}</figcaption></figure> : <button className="daily-sealed-card" type="button" disabled={drawing} onClick={() => void reveal()} aria-label={en ? 'Turn today’s card' : '翻开今日卡片'}><img src={daily.back} alt=""/></button>}
      </div>
      <div className="draw-side" aria-live="polite">
        <span className="overline">{revealed ? (en ? 'YOUR CARD FOR TODAY' : '今日卡片 · 已揭晓') : (en ? 'ONE DAY · ONE CHARACTER' : '一天 · 一位角色')}</span>
        <h2>{revealed ? daily.identity.name[en ? 'en' : 'zh'] : (en ? 'Who will you meet today?' : '今天会遇见谁？')}</h2>
        {revealed ? <><div className="daily-wish"><span className="overline">{en ? 'A WISH FOR TODAY' : '今日祝福'}</span><p>{daily.blessing[en ? 'en' : 'zh']}</p></div><p>{en ? 'This is your character for today. Returning today will show the same card; a new encounter awaits tomorrow.' : '这就是你今天遇见的角色。今天再次打开，仍然是这张卡；明天再来，遇见下一位。'}</p><p className="daily-atlas-note">{en ? 'To explore the paintings and their details, open Paintings in the navigation and choose a painting.' : '想了解原画与细节，可以从导航进入「原画图集」，点击画卡慢慢看。'}</p></> : <><p>{en ? 'Turn the card to reveal today’s illustrated character and a wish for your day.' : '翻开卡片，揭晓今天的卡通角色，收下一句今日祝福。'}</p><button className="paper-button" type="button" disabled={drawing} onClick={() => void reveal()}>{en ? 'Turn today’s card' : '翻开今日卡片'} <ArrowRight size={16}/></button></>}
      </div>
    </div>
  </section>
}
