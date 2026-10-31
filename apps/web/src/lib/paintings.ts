import { paintingBlessings } from './paintingBlessings'
import cardEditions from './card-editions.json'
import identities from './painting-identities.json'
import { readStoredValue } from './localCollectionStorage'
const sourcePaintingFiles = [
  '5683', '5685', '5686', '5687', '5688', '5689', '5690', '5691', '5692', '5693',
  '5694', '5695', '5696 2', '5697 2', '5698', '5699', '5702', '5703', '5704', '5705', '9549', '438',
] as const

export type PaintingId = (typeof sourcePaintingFiles)[number]

// 5699 is another photograph of the same painting as 5697 2.
// Keep the source assets and accept old links, but display/draw the work only once.
export const paintingFiles: PaintingId[] = sourcePaintingFiles.filter(id => id !== '5699')

export interface Painting {
  id: PaintingId
  index: number
  original: string
  display: string
  thumbnail: string
  character: string
  identity: (typeof identities)[PaintingId]
  edition: 'regular' | 'hidden'
  back: string
  blessing: { zh: string; en: string }
}

export const paintings: Painting[] = paintingFiles.map((id, index) => ({
  id,
  index: index + 1,
  identity: identities[id],
  original: publicAsset(`paintings/original/${encodeURIComponent(id)}.webp`),
  display: publicAsset(`paintings/display/${encodeURIComponent(id)}.webp`),
  thumbnail: publicAsset(`paintings/thumb/${encodeURIComponent(id)}.webp`),
  character: publicAsset(`paintings/character-web/${encodeURIComponent(id)}.webp`),
  edition: cardEditions.find(card => card.paintingId === id)!.edition as Painting['edition'],
  back: publicAsset(`cards/back-${cardEditions.find(card => card.paintingId === id)!.back.toLowerCase()}.webp`),
  blessing: paintingBlessings[id],
}))

export function getPainting(id: string) { return paintings.find((painting) => painting.id === (id === '5699' ? '5697 2' : id)) }

const discoveredKey = 'shuilu-discovered-v1'
export function getDiscovered(): string[] {
  try { return [...new Set((JSON.parse(readStoredValue(discoveredKey, 'collection') || '[]') as string[]).map(id => id === '5699' ? '5697 2' : id))] } catch { return [] }
}
export function discover(id: string) {
  localStorage.setItem(discoveredKey, JSON.stringify([...new Set([...getDiscovered(), id])]))
}
import { publicAsset } from './assets'
