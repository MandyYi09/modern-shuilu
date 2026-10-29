import { useState } from 'react'
import { DetailCrop } from './DetailCrop'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { paintingClues } from '@/lib/paintingClues'
import type { Painting } from '@/lib/paintings'

export function DetailMatch({ painting, en }: { painting: Painting; en: boolean }) {
  const [selected, setSelected] = useState<string | null>(null)
  const focus = painting.edition === 'hidden' ? 'robe' : (['head', 'hands', 'robe'] as const)[(painting.index - 1) % 3]
  const candidates = [painting, ...getDetailComparisons(painting.id, focus).map(item => item.painting)]
  const offset = painting.index % candidates.length
  const choices = [...candidates.slice(offset), ...candidates.slice(0, offset)]
  const matched = selected === painting.id
  return <details className="journey-disclosure detail-match"><summary>{en ? 'Try matching the character to an original detail' : '试一试：找到角色对应的原画细节'}</summary><img className="detail-match-character" src={painting.character} alt={painting.identity.name[en ? 'en' : 'zh']}/><p>{en ? 'Compare the shapes and colours. Which fragment belongs to this character?' : '比较形状与颜色，哪处原画细节属于这位角色？'}</p><div className="draw-clue-choices">{choices.map((item, index) => <button type="button" key={item.id} className={selected === item.id ? (matched ? 'is-matched' : 'is-tried') : ''} disabled={matched} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><DetailCrop painting={item} clue={focus} label={en ? `Detail ${String.fromCharCode(65 + index)}` : `细节 ${String.fromCharCode(65 + index)}`}/><span>{String.fromCharCode(65 + index)}</span></button>)}</div><p role="status">{matched ? (en ? 'You found it! ' : '找到了！') + paintingClues[painting.id][focus].observed[en ? 'en' : 'zh'] : selected ? (en ? 'Look closer and try another detail.' : '再仔细看看，试试另一处细节。') : (en ? 'Take your time. You can try again.' : '慢慢找，可以多次尝试。')}</p></details>
}
