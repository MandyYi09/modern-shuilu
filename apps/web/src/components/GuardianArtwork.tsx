import type { GuardianCard } from '@/lib/types'
import { useTranslation } from 'react-i18next'

export function GuardianArtwork({ card, className = '' }: { card: GuardianCard; className?: string }) {
  const { i18n } = useTranslation()
  if (card.image) return <img decoding="async" className={`guardian-art ${className}`} src={card.image} alt="" />
  return <div className={`guardian-art generated-art palette-${card.palette} ${className}`} aria-hidden="true">
    <span className="halo"/><span className="cloud cloud-one"/><span className="cloud cloud-two"/>
    <span className="figure"><i/><b>{card.name[i18n.language === 'en' ? 'en' : 'zh-TW'].slice(0, 1)}</b></span>
  </div>
}
