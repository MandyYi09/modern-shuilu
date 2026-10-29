import type { Painting } from '@/lib/paintings'
import type { ClueKey } from '@/lib/paintingClues'
import { FocusedPainting } from './FocusedPainting'

export function PaintingComparison({ painting, clue, en, onClueChange }: { painting: Painting; clue: ClueKey | null; en: boolean; onClueChange?: (clue: ClueKey | null) => void }) {
  const names = { head: en ? 'Headwear' : '头冠', hands: en ? 'Hands & objects' : '手势与持物', robe: en ? 'Robes' : '衣纹' }
  return <div className={`source-character-comparison${clue ? ' has-selected-detail' : ''}`}>
    <div className="source-character-pair">
      <figure className="comparison-source"><figcaption>{en ? 'Original painting' : '原画'}</figcaption><div className="comparison-image"><FocusedPainting painting={painting} clue={null} character={false} label={en ? `${painting.identity.name.en}, full original painting` : `${painting.identity.name.zh}，完整原画`}/></div></figure>
      <figure className="comparison-character"><figcaption>{en ? 'Illustrated character' : '卡通角色'}</figcaption><div className="comparison-image"><FocusedPainting painting={painting} clue={null} character label={en ? `${painting.identity.name.en}, contemporary illustrated character` : `${painting.identity.name.zh}，当代卡通改编`}/></div></figure>
    </div>
    {onClueChange && <div className="comparison-mobile-controls" role="group" aria-label={en ? 'Explore details' : '查看细节'}>{(['head', 'hands', 'robe'] as const).map(key => <button key={key} type="button" aria-pressed={clue === key} onClick={() => onClueChange(clue === key ? null : key)}>{names[key]}</button>)}</div>}
    {clue && <div className="source-character-details" role="group" aria-label={en ? `${names[clue]} comparison` : `${names[clue]}对照`}>
      {[false, true].map(character => <figure key={String(character)}><figcaption>{character ? (en ? 'Character' : '角色') : (en ? 'Original' : '原画')} · {names[clue]}</figcaption><div className="comparison-detail-image"><FocusedPainting painting={painting} clue={clue} character={character} label={`${character ? (en ? 'Character' : '角色') : (en ? 'Original' : '原画')} · ${names[clue]}`}/></div></figure>)}
    </div>}
  </div>
}
