import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getPainting } from '@/lib/paintings'

// Use the same current illustrations as the character cards.
const guardians = ['9549', '438', '5695'].map(id => getPainting(id)!)

const labels = {
  'zh-TW': { carousel: '轮播图', slide: '轮播项', title: '雲庭 · 細看人物', inscription: '雲起時 · 萬象生', names: ['人物一', '人物二', '人物三'], elements: ['先看神態', '再看衣紋', '留意持物'], previous: '上一位人物', next: '下一位人物', pause: '暫停輪播', play: '播放輪播', hint: '從原畫出發，讓舊筆觸動起來。' },
  en: { carousel: 'carousel', slide: 'slide', title: 'THE CLOUD COURT', inscription: 'CLOUDS RISE · ALL THINGS AWAKEN', names: ['Figure I', 'Figure II', 'Figure III'], elements: ['Look at the face', 'Look at the robe', 'Look at the object'], previous: 'Previous figure', next: 'Next figure', pause: 'Pause carousel', play: 'Play carousel', hint: 'Old brushstrokes in motion.' },
}

export function GuardianCarousel() {
  const { i18n } = useTranslation()
  const copy = labels[i18n.language === 'en' ? 'en' : 'zh-TW']
  const container = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (container.current) observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  const [active, setActive] = useState(1)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const move = (direction: number) => setActive(index => (index + direction + guardians.length) % guardians.length)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (interacting || reducedMotion || !visible) return
    const timer = setInterval(() => { if (!document.hidden) setActive(index => (index + 1) % guardians.length) }, 7000)
    return () => clearInterval(timer)
  }, [interacting, reducedMotion, active, visible])

  return <section ref={container} className="guardian-carousel" tabIndex={0} aria-roledescription={copy.carousel} aria-label={copy.title}
    onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
    <div className="guardian-stage"
      onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
      onTouchEnd={event => { if (touch.current) { const x = event.changedTouches[0].clientX - touch.current.x; const y = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1) } touch.current = null }}>
      <div className="guardian-cloud-backdrop" aria-hidden="true"/>
      {guardians.map((guardian, index) => {
        const offset = (index - active + guardians.length) % guardians.length
        return <div key={guardian.id} role="group" className={`guardian-slide ${offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : 'is-previous'}`} aria-hidden={index !== active} aria-roledescription={copy.slide} aria-label={`${index + 1} / ${guardians.length}: ${guardian.identity.name[i18n.language === 'en' ? 'en' : 'zh']}`}>
          <img className={`painted-guardian guardian-character${guardian.id === '438' ? ' guardian-character-doumu' : ''}${index === active && !interacting && visible && !reducedMotion ? ' is-moving' : ''}`} src={guardian.character} alt={guardian.identity.name[i18n.language === 'en' ? 'en' : 'zh']} decoding="async" draggable={false}/>
        </div>
      })}
      <span className="stage-cloud stage-cloud-left"/><span className="stage-cloud stage-cloud-right"/>

    </div>


  </section>
}
