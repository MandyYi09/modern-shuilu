import { readStoredValue } from '@/lib/localCollectionStorage'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, RotateCcw, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CollectibleEntry } from '@/components/BlessingExperience'
import { PaintingIdentity } from '@/components/PaintingIdentity'
import { PaintingComparison } from '@/components/PaintingComparison'
import { DetailMatch } from '@/components/DetailMatch'
import { DetailCrop } from '@/components/DetailCrop'
import { PaintingGuide } from '@/components/PaintingGuide'
import { lookingLessons } from '@/lib/lookingLessons'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { clueReadings, paintingClues, type ClueKey } from '@/lib/paintingClues'
import { discover, getPainting, paintings, type PaintingId } from '@/lib/paintings'
import { addToViewingPath, readViewingPath, updateViewingPathNote, type PathEntry } from '@/lib/viewingPath'

export const Route = createFileRoute('/card/$cardId')({
  validateSearch: (search: Record<string, unknown>): { detail?: ClueKey; guide?: boolean; origin?: 'draw' | 'path' } => ({
    ...(search.detail === 'head' || search.detail === 'hands' || search.detail === 'robe' ? { detail: search.detail } : {}),
    ...(search.origin === 'draw' || search.origin === 'path' ? { origin: search.origin } : {}),
    ...(search.guide === true || search.guide === 'true' ? { guide: true } : {}),
  }),
  component: PaintingPage,
})

function PaintingPage() {
  const { cardId } = Route.useParams()
  const { detail, guide, origin } = Route.useSearch()
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const painting = getPainting(cardId)
  const guided = guide === true && painting?.id === '5683'
  const [clue, setClue] = useState<ClueKey | null>(detail || null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [comparedId, setComparedId] = useState<PaintingId | null>(null)
  const [pathEntries, setPathEntries] = useState<PathEntry[]>([])

  useEffect(() => {
    if (!painting) return
    discover(painting.id)
    setClue(detail || null)
    setComparedId(null)
    setNote(readStoredValue(`shuilu-note-${painting.id}`, 'note') || '')
    setSaved(false)
    setPathEntries(readViewingPath())
  }, [painting?.id, detail, guided])

  if (!painting) return <section className="painting-not-found"><p>{en ? 'This image is not in the paintings.' : '画册里没有这张图。'}</p><Link to="/collection">{en ? 'Browse paintings' : '打开画册'}</Link></section>
  const clueCopy: Record<ClueKey, { zh: string; en: string }> = {
    head: { zh: '看头冠', en: 'Headwear' },
    hands: { zh: '看手中', en: 'Hands & objects' },
    robe: { zh: '看衣纹', en: 'Robes' },
  }
  const selectedClue = clue ? paintingClues[painting.id][clue] : null
  const selectedReading = selectedClue ? clueReadings[selectedClue.motif] : null
  const lesson = clue ? lookingLessons[clue] : null
  const comparisons = clue ? getDetailComparisons(painting.id, clue) : []
  const compared = comparisons.find(item => item.painting.id === comparedId)
  const inPath = clue && pathEntries.some(entry => entry.paintingId === painting.id && entry.clue === clue)
  const addDetail = () => { if (clue) setPathEntries(addToViewingPath({ paintingId: painting.id, clue, note: note.trim() })) }
  const addPair = () => { if (clue && compared) setPathEntries(addToViewingPath({ paintingId: painting.id, clue, note: note.trim() }, { paintingId: compared.painting.id, clue })) }
  const saveNote = () => { localStorage.setItem(`shuilu-note-${painting.id}`, note); if (clue) setPathEntries(updateViewingPathNote(painting.id, clue, note)); setSaved(true) }

  return <section className="painting-page">
    <div className="painting-topline"><Link to={origin === 'draw' ? '/draw' : origin === 'path' ? '/path' : '/collection'} className="return-link"><ArrowLeft size={15}/>{origin === 'draw' ? (en ? 'Back to daily draw' : '返回每日抽卡') : origin === 'path' ? (en ? 'Back to saved details' : '返回我的收藏') : (en ? 'Back to paintings' : '返回原画图集')}</Link><span>{en ? `IMAGE ${String(painting.index).padStart(2, '0')}` : `第 ${String(painting.index).padStart(2, '0')} 幅`} / {paintings.length} · {painting.edition === 'hidden' ? (en ? 'SECRET' : '隐藏款') : (en ? 'REGULAR' : '常规款')}</span></div>
    <div className={`painting-layout painting-comparison-layout${guided ? ' is-guided' : ''}`}>
      <div className="painting-view is-revealed">
        <PaintingComparison painting={painting} clue={clue} en={en} onClueChange={next => { setClue(next); setComparedId(null) }}/>
        {clue && <button className="reset-view" type="button" onClick={() => setClue(null)}><RotateCcw size={14}/>{en ? 'Show both full images' : '回看两张完整图像'}</button>}
      </div>
      <div className="painting-notes">
        <PaintingIdentity painting={painting} en={en}/>
        {guided ? <PaintingGuide painting={painting} onFocusChange={setClue}/> : <>
          {painting.id === '9549' && <details className="secret-edition-note"><summary>{en ? 'About this adaptation' : '关于这次角色改编'}</summary><span className="overline">{en ? 'SECRET EDITION · BACK E' : '隐藏款 · E 卡背'}</span><p>{en ? 'A peace sign on one side, a thumbs-up on the other. The two hands in place of eyes become a playful greeting, below a softly tied blue-grey headwrap. The blue robe, seated pose and peaches preserve the connection to the source. These new gestures are a contemporary adaptation.' : '一边比耶，一边点赞：代替眼睛的两只小手，变成轻松的招呼，蓝灰软巾的巾尾也轻轻扬起。蓝袍、坐姿和托桃仍与原图呼应；新手势是当代趣味改编。其余常规款统一使用 K 卡背。'}</p><img decoding="async" src={painting.back} alt={en ? 'E secret card back' : 'E 隐藏款卡背'}/></details>}
          <h2 className="detail-title">{en ? 'Explore details' : '查看细节'}</h2>
          <div className="clue-list">{(['head', 'hands', 'robe'] as const).map(key => <button key={key} className={clue === key ? 'active' : ''} aria-pressed={clue === key} type="button" onClick={() => { setClue(clue === key ? null : key); setComparedId(null) }}><span>{clueCopy[key][en ? 'en' : 'zh']}</span><small aria-hidden="true">{clue === key ? '−' : '＋'}</small></button>)}</div>
          <div className={`clue-response${selectedClue ? ' has-detail' : ''}`} aria-live="polite">{selectedClue && selectedReading ? <>
            <span className="clue-response-eyebrow">{en ? 'LOOK CLOSER / VISUAL READING' : '细看 / 图像释读'}</span>
            <h3>{selectedReading.title[en ? 'en' : 'zh']}</h3>
            <p className="clue-observation"><strong>{en ? 'What is visible' : '画中所见'}</strong>{selectedClue.observed[en ? 'en' : 'zh']}</p>
            <p className="clue-meaning"><strong>{en ? 'How to read it' : '如何理解'}</strong>{selectedReading.meaning[en ? 'en' : 'zh']}</p>
            {lesson && <p className="clue-takeaway"><strong>{en ? 'A way to look' : '学到一种看法'}</strong>{lesson.takeaway[en ? 'en' : 'zh']}</p>}
          </> : (en ? 'Select a detail above to read more.' : '点击上方细节，查看画中所见与图像含义。')}</div>
          {lesson && <section className="everyday-connection"><span className="overline">{en ? 'A CONNECTION TO TODAY' : '和今天的生活连起来'}</span><p>{lesson.today[en ? 'en' : 'zh']}</p><blockquote>{lesson.question[en ? 'en' : 'zh']}</blockquote></section>}
          {clue && selectedReading && <>
            <div className="detail-keep-row"><button type="button" className="detail-keep" aria-pressed={!!inPath} onClick={addDetail}><Plus size={15}/>{inPath ? (en ? 'Detail saved ✓' : '细节已收藏 ✓') : (en ? 'Keep this detail' : '留住这个细节')}</button><span className="save-location" role="status">{inPath ? (en ? 'Find it later in Saved.' : '之后可在「我的收藏」回看。') : (en ? 'Save without leaving this painting.' : '收藏后可以留在这里继续看。')}</span></div>
            <details key={clue} className="comparison-section journey-disclosure"><summary>{en ? 'Compare this detail in other paintings' : '展开对照：别的画怎么画这个细节？'}</summary>
              <span className="overline">{en ? 'FOLLOW THE DETAIL' : '顺着细节继续看'}</span>
              <h2>{en ? 'How does it appear elsewhere?' : '别的画，怎么画这个细节？'}</h2>
              <div className="comparison-choices">{comparisons.map(item => {
                const detail = paintingClues[item.painting.id][clue]
                return <button key={item.painting.id} type="button" className={`comparison-choice${comparedId === item.painting.id ? ' is-selected' : ''}`} aria-pressed={comparedId === item.painting.id} onClick={() => setComparedId(comparedId === item.painting.id ? null : item.painting.id)}>
                  <DetailCrop painting={item.painting} clue={clue} label={en ? `Detail of image ${item.painting.index}` : `第 ${item.painting.index} 幅的局部`}/>
                  <span><small>{item.relation === 'echo' ? (en ? 'A VISUAL ECHO' : '相近的造型') : (en ? 'A DIFFERENT TREATMENT' : '不同的画法')}</small><strong>{en ? `Image ${String(item.painting.index).padStart(2, '0')}` : `第 ${String(item.painting.index).padStart(2, '0')} 幅`}</strong><em>{clueReadings[detail.motif].title[en ? 'en' : 'zh']}</em></span>
                </button>
              })}</div>
              {compared && <div className="comparison-open" aria-live="polite">
                <div className="comparison-pair">
                  {[painting, compared.painting].map(item => <figure key={item.id}><DetailCrop painting={item} clue={clue} label={en ? `Image ${item.index}, ${clueCopy[clue].en}` : `第 ${item.index} 幅，${clueCopy[clue].zh}`}/><figcaption><strong>{en ? `Image ${String(item.index).padStart(2, '0')}` : `第 ${String(item.index).padStart(2, '0')} 幅`}</strong><span>{paintingClues[item.id][clue].observed[en ? 'en' : 'zh']}</span></figcaption></figure>)}
                </div>
                <button className="comparison-keep" type="button" onClick={addPair}>{en ? 'Save both details' : '收藏这两个细节'} <Plus size={15}/></button><p role="status">{pathEntries.some(entry => entry.paintingId === painting.id && entry.clue === clue) && pathEntries.some(entry => entry.paintingId === compared.painting.id && entry.clue === clue) ? (en ? 'Both details are saved.' : '两个细节均已收藏。') : null}</p>
              </div>}
            </details>
          </>}
          <DetailMatch key={painting.id} painting={painting} en={en}/>
          <details className="optional-observation"><summary>{en ? 'Leave a thought for yourself (optional)' : '想给自己留一句话？（可选）'}</summary><p>{en ? 'Your encounter is complete without a note. Write only if something stays with you.' : '不填写也已经完成这次看画。有想记住的发现，再写下来。'}</p><label className="observer-note">{en ? 'Your discovery or question' : '你的发现或疑问'}<textarea value={note} onChange={event => { setNote(event.target.value); setSaved(false) }} placeholder={en ? 'For example: I noticed the crown and flames are separate.' : '例如：原来冠饰和头后的火焰是分开的。'} rows={3}/></label><button className="save-observation" type="button" onClick={saveNote}>{saved ? (en ? 'Saved on this device ✓' : '已记在这台设备上 ✓') : (en ? 'Keep this observation' : '记下这个观察')}</button></details>
        <div className="painting-next"><Link to="/collection" className="paper-button">{en ? 'Return to the paintings' : '返回原画图集'} <ArrowRight size={16}/></Link></div>
        </>}
      </div>
    </div>
    <details key={painting.id} className="journey-extras journey-disclosure"><summary>{en ? 'Keep something from this painting (optional)' : '想把这次发现留下来？（可选）'}</summary><p>{en ? 'Your exploration is complete. These options take you to a different activity.' : '这次看画已经完成。下面可以查看收藏、制作壁纸，或了解实体卡。'}</p><div className="journey-extra-links"><Link to="/path">{en ? 'Go to saved details' : '前往我的收藏'} →</Link><Link to="/create" search={{ from: painting.id, focus: clue ?? undefined }}>{en ? 'Make a wallpaper with this painting' : '用这幅画制作壁纸'} →</Link></div><CollectibleEntry painting={painting} en={en}/></details>
  </section>
}
