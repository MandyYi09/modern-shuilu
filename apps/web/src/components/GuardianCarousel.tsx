import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { carouselArtwork } from '@/lib/carousel-artwork'
import { mountCarousel } from '@/lib/carousel-motion'

export function GuardianCarousel() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const container = useRef<HTMLElement>(null)
  const decoded = useRef(new Set<string>())
  const [loaded, setLoaded] = useState(0)
  useEffect(() => { if (container.current) return mountCarousel(container.current) }, [])
  return <section ref={container} className="guardian-carousel" tabIndex={0}
    aria-roledescription={en ? 'carousel' : '轮播图'} aria-label={en ? 'THE CLOUD COURT' : '雲庭 · 細看人物'}>
    <div className="guardian-stage" aria-busy={loaded < 3}>
      <div className="guardian-cloud-backdrop" aria-hidden="true"/>
      {carouselArtwork.map((guardian, index) => <div key={guardian.id} role="group"
        className={`guardian-slide ${index === 1 ? 'is-active' : index === 2 ? 'is-next' : 'is-previous'}`}
        aria-hidden={index !== 1} aria-roledescription={en ? 'slide' : '轮播项'}
        aria-label={`${index + 1} / ${carouselArtwork.length}: ${guardian.identity.name[en ? 'en' : 'zh']}`}>
        <img className={`painted-guardian guardian-character${guardian.id === '438' ? ' guardian-character-doumu' : ''}`}
          src={guardian.src} srcSet={guardian.srcSet} sizes="(max-width: 800px) 52vw, 36vw"
          fetchPriority={index === 1 ? 'high' : 'low'} alt={guardian.identity.name[en ? 'en' : 'zh']} decoding="async" draggable={false}
          onLoad={event => { void event.currentTarget.decode().then(() => { decoded.current.add(guardian.id); setLoaded(decoded.current.size) }).catch(() => {}) }}/>
      </div>)}
      <span className="stage-cloud stage-cloud-left"/><span className="stage-cloud stage-cloud-right"/>
      {loaded < 3 && <div className="carousel-loading" role="status"><span>{en ? 'Loading artwork…' : '画作加载中…'}</span><progress max={3} value={loaded} aria-label={en ? 'Artwork loading' : '画作加载进度'}/></div>}
    </div>
  </section>
}
