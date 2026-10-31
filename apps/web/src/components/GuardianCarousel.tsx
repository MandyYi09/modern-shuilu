import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { getPainting, paintings } from '@/lib/paintings'
import { publicAsset } from '@/lib/assets'

// Open with the three favourites together. Starting at index 1 spotlights
// the two secret editions consecutively, then continues through the atlas.
const featuredIds = ['5695', '9549', '438']
const guardians = [
  ...featuredIds.map(id => getPainting(id)!),
  ...paintings.filter(painting => !featuredIds.includes(painting.id)),
]
const responsiveArtwork = (painting: (typeof guardians)[number]) => {
  const cutout = painting.id === '438'
  if (!cutout && !['5695', '9549'].includes(painting.id)) return { src: painting.character }
  const stem = `paintings/carousel/${painting.id}${cutout ? '-cutout' : ''}`
  return {
    src: publicAsset(`${stem}-360.webp`),
    srcSet: [180, 360].map(width => `${publicAsset(`${stem}-${width}.webp`)} ${width}w`)
      .concat(`${cutout ? publicAsset(`${stem}-720.webp`) : painting.character} 720w`).join(', '),
    sizes: '(max-width: 767px) 55vw, 31vw',
  }
}

const labels = {
  'zh-TW': { carousel: '轮播图', slide: '轮播项', title: '雲庭 · 細看人物', inscription: '雲起時 · 萬象生', names: ['人物一', '人物二', '人物三'], elements: ['先看神態', '再看衣紋', '留意持物'], previous: '上一位人物', next: '下一位人物', pause: '暫停輪播', play: '播放輪播', hint: '從原畫出發，讓舊筆觸動起來。' },
  en: { carousel: 'carousel', slide: 'slide', title: 'THE CLOUD COURT', inscription: 'CLOUDS RISE · ALL THINGS AWAKEN', names: ['Figure I', 'Figure II', 'Figure III'], elements: ['Look at the face', 'Look at the robe', 'Look at the object'], previous: 'Previous figure', next: 'Next figure', pause: 'Pause carousel', play: 'Play carousel', hint: 'Old brushstrokes in motion.' },
}

// Hit-test the displayed alpha so transparent margins do not start a drag.
const characterPixels = new WeakMap<HTMLImageElement, ImageData>()
function hitsCharacter(image: HTMLImageElement, clientX: number, clientY: number) {
  if (!image.complete || !image.naturalWidth) return false
  const bounds = image.getBoundingClientRect()
  const scale = Math.min(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight)
  if (!scale) return false
  const x = Math.floor((clientX - bounds.left - (bounds.width - image.naturalWidth * scale) / 2) / scale)
  const y = Math.floor((clientY - bounds.top - (bounds.height - image.naturalHeight * scale) / 2) / scale)
  if (x < 0 || y < 0 || x >= image.naturalWidth || y >= image.naturalHeight) return false
  let pixels = characterPixels.get(image)
  if (!pixels) {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return false
    try {
      context.drawImage(image, 0, 0)
      pixels = context.getImageData(0, 0, canvas.width, canvas.height)
      characterPixels.set(image, pixels)
    } catch { return false }
  }
  return pixels.data[(y * pixels.width + x) * 4 + 3] > 32
}
function hitsAnyCharacter(stage: HTMLDivElement, x: number, y: number) {
  return Array.from(stage.querySelectorAll<HTMLImageElement>('.guardian-character')).some(image => hitsCharacter(image, x, y))
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
  // Warm the next incoming image without loading the entire cast at once.
  useEffect(() => {
    const image = new Image()
    const artwork = responsiveArtwork(guardians[(active + 2) % guardians.length])
    if (artwork.sizes) image.sizes = artwork.sizes
    if (artwork.srcSet) image.srcset = artwork.srcSet
    image.src = artwork.src
  }, [active])
  const [interacting, setInteracting] = useState(false)
  const [hoveringFigure, setHoveringFigure] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const track = useRef<HTMLDivElement>(null)
  const dragFrame = useRef<number | null>(null)
  const dragOffset = useRef(0)
  const setDragX = (offset: number) => {
    dragOffset.current = offset
    if (dragFrame.current !== null) return
    dragFrame.current = requestAnimationFrame(() => {
      dragFrame.current = null
      if (track.current) track.current.style.transform = `translateX(${dragOffset.current}px)`
    })
  }
  useEffect(() => () => { if (dragFrame.current !== null) cancelAnimationFrame(dragFrame.current) }, [])
  const [pagePaused, setPagePaused] = useState(false)
  useEffect(() => {
    const update = () => setPagePaused(document.hidden || document.documentElement.hasAttribute('data-preview-paused'))
    update()
    document.addEventListener('visibilitychange', update)
    window.addEventListener('portfolio-preview-visibility', update)
    return () => {
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('portfolio-preview-visibility', update)
    }
  }, [])
  const [dragging, setDragging] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const rippleId = useRef(0)
  const release = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = drag.current
    if (!start || start.id !== event.pointerId) return
    const x = event.clientX - start.x
    const y = event.clientY - start.y
    if (!cancelled && Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1)
    else if (!cancelled && Math.hypot(x, y) < 10 && !reducedMotion) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const ripple = { id: ++rippleId.current, x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      setRipples(items => [...items.slice(-5), ripple])
    }
    drag.current = null
    setDragging(false)
    setDragX(0)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  const move = (direction: number) => setActive(index => (index + direction + guardians.length) % guardians.length)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (interacting || hoveringFigure || dragging || reducedMotion || !visible || pagePaused) return
    const timer = setInterval(() => { if (!document.hidden) setActive(index => (index + 1) % guardians.length) }, 7000)
    return () => clearInterval(timer)
  }, [interacting, hoveringFigure, dragging, reducedMotion, active, visible, pagePaused])

  return <section ref={container} className="guardian-carousel" tabIndex={0} aria-roledescription={copy.carousel} aria-label={copy.title}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
    <div className={`guardian-stage${dragging ? ' is-dragging' : ''}${hoveringFigure ? ' is-over-figure' : ''}`}
      onPointerLeave={() => setHoveringFigure(false)}
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0 || !hitsAnyCharacter(event.currentTarget, event.clientX, event.clientY)) return
        drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
      }}
      onPointerMove={event => {
        const start = drag.current
        if (!start && event.pointerType === 'mouse') setHoveringFigure(hitsAnyCharacter(event.currentTarget, event.clientX, event.clientY))
        if (start?.id === event.pointerId) {
          const x = event.clientX - start.x
          const y = event.clientY - start.y
          if (Math.abs(x) > Math.abs(y)) setDragX(Math.max(-180, Math.min(180, x * .65)))
        }
      }}
      onPointerUp={event => release(event)}
      onPointerCancel={event => release(event, true)}
      onLostPointerCapture={event => release(event, true)}>
      <div className="scene-cloud-colours" aria-hidden="true"/>
      <div className="scene-cloud-wisp scene-cloud-wisp-left" aria-hidden="true"/>
      <div className="scene-cloud-wisp scene-cloud-wisp-right" aria-hidden="true"/>
      <div className="guardian-cloud-backdrop" aria-hidden="true"/>
      <div ref={track} className="guardian-drag-track">
      {guardians.map((guardian, index) => {
        const offset = (index - active + guardians.length) % guardians.length
        if (offset !== 0 && offset !== 1 && offset !== guardians.length - 1) return null
        return <div key={guardian.id} role="group" className={`guardian-slide ${offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : 'is-previous'}${guardian.edition === 'hidden' ? ' is-secret-edition' : ''}`} aria-hidden={index !== active} aria-roledescription={copy.slide} aria-label={`${index + 1} / ${guardians.length}: ${guardian.identity.name[i18n.language === 'en' ? 'en' : 'zh']}`}>
          <img className={`painted-guardian guardian-character${index === active && !interacting && !hoveringFigure && !dragging && visible && !pagePaused && !reducedMotion ? ' is-moving' : ''}`} {...responsiveArtwork(guardian)} fetchPriority={index === active ? 'high' : 'low'} alt={guardian.identity.name[i18n.language === 'en' ? 'en' : 'zh']} decoding="async" draggable={false}/>
        </div>
      })}
      </div>
      {ripples.map(ripple => <span key={ripple.id} className="guardian-ripple" aria-hidden="true" style={{ left: ripple.x, top: ripple.y }} onAnimationEnd={event => { if (event.target === event.currentTarget) setRipples(items => items.filter(item => item.id !== ripple.id)) }}><i/><i/><i/></span>)}
      <span className="stage-cloud stage-cloud-left"/><span className="stage-cloud stage-cloud-right"/>

    </div>

  </section>
}
