import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ClueKey } from '@/lib/paintingClues'
import type { Painting } from '@/lib/paintings'
import { publicAsset } from '@/lib/assets'

export function DetailCrop({ painting, clue, label, className = '' }: { painting: Painting; clue: ClueKey; label: string; className?: string }) {
  const { i18n } = useTranslation()
  const src = publicAsset(`paintings/detail/${encodeURIComponent(painting.id)}-${clue}.webp`)
  const [failed, setFailed] = useState<string | null>(null)
  return <div className={`detail-crop detail-crop-${clue} ${className}`}>
    {failed === src ? <span className="image-unavailable" role="status">{label} · {i18n.language === 'en' ? 'Image unavailable' : '图片未载入'}</span> : <img src={src} decoding="async" alt={label} onError={() => setFailed(src)}/>}
  </div>
}
