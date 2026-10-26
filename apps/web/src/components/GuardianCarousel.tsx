import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import guardians from '@/lib/cloud-court-guardians.json'
import celestialPreview from '@/assets/guardian-celestial-inline.webp'
import jadePreview from '@/assets/guardian-jade-inline.webp'
import flamePreview from '@/assets/guardian-flame-inline.webp'

// Separate cacheable images keep artwork bytes out of the application bundle.
const previews: Record<string, { src: string; width: number; height: number }> = {
  'guardian-celestial.jpg': { src: celestialPreview, width: 1124, height: 1912 },
  'guardian-jade.jpg': { src: jadePreview, width: 1128, height: 1870 },
  'guardian-flame.jpg': { src: flamePreview, width: 1094, height: 1918 },
}

const labels = {
  'zh-TW': { title: '雲庭 · 細看人物', inscription: '雲起時 · 萬象生', names: ['人物一', '人物二', '人物三'], elements: ['先看神態', '再看衣紋', '留意持物'], previous: '上一位人物', next: '下一位人物', pause: '暫停輪播', play: '播放輪播', hint: '從原畫出發，讓舊筆觸動起來。' },
  en: { title: 'THE CLOUD COURT', inscription: 'CLOUDS RISE · ALL THINGS AWAKEN', names: ['Figure I', 'Figure II', 'Figure III'], elements: ['Look at the face', 'Look at the robe', 'Look at the object'], previous: 'Previous figure', next: 'Next figure', pause: 'Pause carousel', play: 'Play carousel', hint: 'Old brushstrokes in motion.' },
}

function PaintedGuardian({ guardian, animate }: { guardian: typeof guardians[number]; animate: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [rendered, setRendered] = useState(false)
  const preview = previews[guardian.file]
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const image = new Image()
    let disposed = false
    let texture: HTMLCanvasElement | null = null
    const render = () => {
      if (!texture || disposed) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      const height = 505
      const width = height * texture.width / texture.height
      context.drawImage(texture, 210 - width / 2, 284 - height / 2, width, height)
    }
    image.onload = () => {
      if (disposed) return
      try {
        const [x, y, width, height] = guardian.bounds
        texture = document.createElement('canvas')
        texture.width = width
        texture.height = height
        const paint = texture.getContext('2d')
        if (!paint) return
        paint.translate(-x, -y)
        paint.save()
        paint.clip(new Path2D(guardian.outline))
        paint.drawImage(image, 0, 0, preview.width, preview.height)
        paint.restore()
        paint.globalCompositeOperation = 'destination-out'
        guardian.holes.forEach(hole => paint.fill(new Path2D(hole)))
        render()
        setRendered(true)
      } catch {
        // Some embedded mobile browsers fail to create the clipped canvas.
        // The still image remains visible instead of leaving an empty stage.
        texture = null
        setRendered(false)
      }
    }
    image.src = preview.src
    return () => { disposed = true }
  }, [guardian, preview])
  return <>
    {!rendered && <img decoding="async" className="guardian-fallback" src={preview.src} alt="" aria-hidden="true" />}
    <canvas ref={ref} width={420} height={560} className={`painted-guardian${animate ? ' is-moving' : ''}`} aria-hidden="true" />
  </>
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

  return <section ref={container} className="guardian-carousel" tabIndex={0} aria-roledescription="carousel" aria-label={copy.title}
    onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
    <div className="guardian-stage"
      onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
      onTouchEnd={event => { if (touch.current) { const x = event.changedTouches[0].clientX - touch.current.x; const y = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1) } touch.current = null }}>
      <div className="guardian-cloud-backdrop" aria-hidden="true"/>
      {guardians.map((guardian, index) => {
        const offset = (index - active + guardians.length) % guardians.length
        return <div key={guardian.file} role="group" className={`guardian-slide ${offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : 'is-previous'}`} aria-hidden={index !== active} aria-roledescription="slide" aria-label={`${index + 1} / ${guardians.length}: ${copy.names[index]}`}>
          <PaintedGuardian guardian={guardian} animate={index === active && !interacting && visible && !reducedMotion}/>
        </div>
      })}
      <span className="stage-cloud stage-cloud-left"/><span className="stage-cloud stage-cloud-right"/>

    </div>


  </section>
}
