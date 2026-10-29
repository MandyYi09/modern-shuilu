import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaintingIdentity } from '@/components/PaintingIdentity'
import { DetailCrop } from '@/components/DetailCrop'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { paintingClues, type ClueKey } from '@/lib/paintingClues'
import { paintings } from '@/lib/paintings'
import { publicAsset } from '@/lib/assets'
import { useDailyDraw } from '@/lib/useDailyDraw'
import { drawDailyPainting } from '@/lib/dailyDraw'

export const Route = createFileRoute('/draw')({ component: DrawPage })

type CardPhase = 'sealed' | 'character' | 'original'

export function DrawPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const drawn = useDailyDraw()
  const [drawing, setDrawing] = useState(false)
  // The saved daily result and this visit’s reveal are separate states.
  const [revealed, setRevealed] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const phase: CardPhase = !revealed || !drawn ? 'sealed' : showOriginal ? 'original' : 'character'
  const previousPhase = useRef(phase)
  useLayoutEffect(() => {
    if (previousPhase.current !== phase) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      previousPhase.current = phase
    }
  }, [phase])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const daily = drawn ?? paintings[0]
  useEffect(() => { setSelectedId(null); setShowOriginal(false) }, [drawn?.id])
  const blessing = en ? daily.blessing.en : daily.blessing.zh
  // The secret card changes the facial gestures; compare the preserved robe instead.
  const focus = daily.edition === 'hidden' ? 'robe' : (['head', 'hands', 'robe'] as const)[(daily.index - 1) % 3]
  const detail = paintingClues[daily.id][focus]
  const matched = selectedId === daily.id
  const candidates = [daily, ...getDetailComparisons(daily.id, focus).map(item => item.painting)]
  const offset = daily.index % candidates.length
  const choices = [...candidates.slice(offset), ...candidates.slice(0, offset)]
  // Warm only the next interaction, instead of fetching the whole collection.
  const clueSources = choices.map(item => publicAsset(`paintings/detail/${encodeURIComponent(item.id)}-${focus}.webp`)).join('|')
  useEffect(() => {
    if (phase !== 'sealed') return
    const images = [daily.character, ...clueSources.split('|')].map(src => {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
      return image
    })
    return () => { images.forEach(image => { image.onload = null }) }
  }, [daily.character, clueSources, phase])
  const labels: Record<ClueKey, { zh: string; en: string }> = {
    head: { zh: '头冠', en: 'headwear' },
    hands: { zh: '手势与持物', en: 'hands and objects' },
    robe: { zh: '衣纹', en: 'clothing' },
  }
  const nextPhase = async () => {
    if (drawing) return
    if (phase === 'sealed') {
      setDrawing(true)
      try { await drawDailyPainting(); setRevealed(true) } finally { setDrawing(false) }
    } else if (showOriginal) setShowOriginal(false)
    else if (matched) setShowOriginal(true)
  }

  return <section className="draw-page restored-draw-journey">
    <header className="feature-heading"><h1>{en ? 'Daily draw' : '每日抽卡'}</h1><p>{en ? 'Turn a card, find a detail, then reveal its source painting.' : '翻开角色，找到细节，再揭晓它来自的原画。'}</p></header>

    <ol className="journey-progress" aria-label={en ? 'Draw progress' : '抽卡进度'}>{(['sealed', 'character', 'original'] as const).map((step, index) => <li key={step} aria-current={phase === step ? 'step' : undefined}><span>{index + 1}</span>{(en ? ['Turn the card', 'Find the detail', 'Reveal the painting'] : ['翻开角色', '寻找细节', '揭晓原画'])[index]}</li>)}</ol>

    <div className="draw-workspace">
      <div className="draw-card-column">
      <button className={`daily-card daily-card-${phase} daily-edition-${daily.edition}`} type="button" onClick={() => void nextPhase()} disabled={drawing || (phase === 'character' && !matched)} aria-label={phase === 'sealed' ? (en ? 'Turn today’s card' : '翻开今日卡片') : phase === 'character' ? (en ? 'View the original after finding its clue' : '找到线索后查看对应原画') : (en ? 'Return to the character card' : '回到角色卡')}>
        {phase === 'sealed' && <div className="daily-card-back illustrated-card-back" aria-hidden="true"><img decoding="async" src={daily.back} alt=""/></div>}
        {phase === 'character' && <div className="daily-card-character">
          <span className="daily-character-index">{String(daily.index).padStart(2, '0')} / {paintings.length} · {daily.edition === 'hidden' ? (en ? 'SECRET' : '隐藏款') : (en ? 'REGULAR' : '常规款')}</span>
          {daily.edition === 'hidden' && <span className="daily-character-foil" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index}/>)}</span>}
          <img decoding="async" src={daily.character} alt={en ? `Illustrated character adapted from painting ${daily.id}` : `根据原画 ${daily.id} 绘制的角色形象`}/>
          <span className="daily-card-message"><small>{en ? 'A WISH FOR TODAY' : '今日祝福'}</small><strong>{blessing}</strong></span>
          <span className="daily-card-hint">{matched ? (en ? 'Clue found · tap to see the source' : '线索已找到 · 轻触翻看原画') : (en ? 'Find its detail to unlock the source' : '找到对应局部 · 解锁原画')} {matched && <ArrowRight size={14}/>}</span>
        </div>}
        {phase === 'original' && <div className="daily-card-original"><img decoding="async" src={daily.display} alt={en ? `Original Shuilu painting ${daily.id}` : `水陆画原画 ${daily.id}`}/></div>}
      </button>
      </div>
      <div className="draw-side">
        {phase !== 'sealed' && <div className="mobile-card-blessing"><span className="overline">{en ? 'A WISH FOR TODAY' : '今日祝福'}</span><p>{blessing}</p></div>}
        {phase !== 'sealed' && <PaintingIdentity painting={daily} en={en}/>}
        <span className="overline">{phase === 'sealed' ? (en ? 'STAGE 01 · MEET' : '第一关 · 相遇') : phase === 'character' ? (en ? 'STAGE 02 · FIND' : '第二关 · 寻迹') : (en ? 'STAGE 03 · DISCOVER' : '第三关 · 入画')}</span>
        <h2>{phase === 'sealed' ? (en ? 'Who will you meet today?' : '今天会遇见谁？') : phase === 'character' ? (en ? 'Which detail belongs to your character?' : '哪处细节，属于你的角色？') : (en ? 'You found the way into the painting.' : '你找到了走进画里的线索。')}</h2>
        <p>{phase === 'sealed' ? (en ? 'Turn the card, then find its detail in the original painting.' : '翻开卡片，再找找它在原画中的细节。') : phase === 'character' ? (en ? `Look at the character’s ${labels[focus].en}. Which of the three original fragments shows the same detail? Start with shapes and colours; you do not need to know the figure’s name.` : `留意角色的${labels[focus].zh}。下面三处原画局部，哪一处和它对应？先比较形状和颜色，不需要认识人物名字。`) : (en ? 'The illustration and this painting share the detail you found. Open it to read an explanation and connect the observation to an experience today.' : '角色卡与这幅原画，保留着你刚刚找到的细节。带着这个发现继续看，认识它怎样塑造人物，再和今天的经验连起来。')}</p>
        {phase === 'character' && <>
          <div className="draw-clue-choices" aria-label={en ? 'Choose the matching original detail' : '选择对应的原画局部'}>{choices.map((item, index) => <button type="button" key={item.id} className={selectedId === item.id ? (matched ? 'is-matched' : 'is-tried') : ''} aria-pressed={selectedId === item.id} disabled={matched} onClick={() => setSelectedId(item.id)}><DetailCrop painting={item} clue={focus} label={en ? `Original detail ${String.fromCharCode(65 + index)}` : `原画局部 ${String.fromCharCode(65 + index)}`}/><span>{en ? 'CLUE' : '线索'} {String.fromCharCode(65 + index)}</span></button>)}</div>
          <div className={`draw-clue-feedback${matched ? ' is-matched' : ''}`} role="status">{matched ? <><strong>{en ? 'Clue found. The source is unlocked.' : '找到线索，原画已解锁。'}</strong><p>{detail.observed[en ? 'en' : 'zh']}</p></> : selectedId ? <><strong>{en ? 'Look a little closer and try again.' : '再靠近一点，试试另一处。'}</strong><p>{en ? 'Look for this shape in your character: ' : '对照角色，可以留意：'}{detail.observed[en ? 'en' : 'zh']}</p></> : <p>{en ? 'Choose a fragment above. There is no timer; you can try again.' : '选一处局部试试。没有计时，可以慢慢找。'}</p>}</div>
        </>}
        {phase === 'original' ? <Link to="/card/$cardId" params={{ cardId: daily.id }} search={{ detail: focus, origin: 'draw' }} className="paper-button">{en ? 'Continue to painting details' : '继续 · 查看原画详情'} <ArrowRight size={16}/></Link> : (phase === 'sealed' || matched) && <button className="paper-button" type="button" disabled={drawing} onClick={() => void nextPhase()}>{phase === 'sealed' ? (en ? 'Turn today’s card' : '翻开今日卡片') : (en ? 'Reveal the source painting' : '揭晓对应原画')} <ArrowRight size={16}/></button>}
        {phase === 'original' ? <button className="draw-reset" type="button" onClick={() => setShowOriginal(false)}><RotateCcw size={14}/>{en ? 'Back to character card' : '回到角色卡'}</button> : null}
      </div>
    </div>

  </section>
}
