import identities from './painting-identities.json'
import { publicAsset } from './assets'

export const carouselArtwork = (['9549', '438', '5695'] as const).map(id => ({
  id, identity: identities[id],
  src: publicAsset(`paintings/carousel/${id}-360.webp`),
  srcSet: [180, 360].map(width => `${publicAsset(`paintings/carousel/${id}-${width}.webp`)} ${width}w`)
    .concat(`${publicAsset(`paintings/character-web/${id}.webp`)} ${id === '438' ? 733 : 720}w`).join(', '),
}))
