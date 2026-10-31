// Shared artwork and motion, without React, routing, or release polling.
import { carouselArtwork } from './lib/carousel-artwork'
import { mountCarousel } from './lib/carousel-motion'
import './styles.css'
import './silk-theme.css'
import './preview.css'

document.getElementById('app')!.innerHTML = `<div class="app-shell preview-shell">
  <header class="preview-navigation"><span>Home</span><span>Draw</span><span>Atlas</span><span>Path</span><span>Compose</span></header>
  <main><section class="opening-scene"><div class="living-painting guardian-gallery gallery-cloud-court">
    <section class="guardian-carousel" aria-label="THE CLOUD COURT"><div class="guardian-stage"><div class="guardian-cloud-backdrop"></div></div></section>
  </div><div class="home-feature-actions"><span class="art-ticket art-ticket-primary">Draw a card →</span><span class="art-ticket">Browse paintings →</span><span class="art-ticket">Make a wallpaper →</span></div></section></main></div>`
const stage = document.querySelector('.guardian-stage')!
const images = carouselArtwork.map((guardian, index) => {
  const slide = document.createElement('div')
  slide.className = 'guardian-slide'
  slide.setAttribute('aria-label', `${index + 1} / 3: ${guardian.identity.name.en}`)
  const image = new Image()
  image.className = `painted-guardian guardian-character${guardian.id === '438' ? ' guardian-character-doumu' : ''}`
  image.alt = guardian.identity.name.en; image.decoding = 'async'; image.sizes = '42vw'
  if (guardian.id === '438') {
    image.srcset = [180, 360, 733].map(width => `./paintings/carousel/438-cover-${width}.webp ${width}w`).join(', ')
    image.src = './paintings/carousel/438-cover-360.webp'
  } else { image.srcset = guardian.srcSet; image.src = guardian.src }
  slide.append(image); stage.append(slide)
  return image
})
mountCarousel(document.querySelector<HTMLElement>('.guardian-carousel')!)
let decoded = 0
void Promise.all(images.map(image => image.decode().then(() => {
  parent.postMessage({ type: 'portfolio-preview', event: 'progress', stage: 'download', loaded: ++decoded, total: images.length }, location.origin)
}))).then(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => parent.postMessage({ type: 'portfolio-preview', event: 'ready' }, location.origin)))
}).catch(() => parent.postMessage({ type: 'portfolio-preview', event: 'error' }, location.origin))
