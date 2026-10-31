import type { Painting } from '@/lib/paintings'

export function PaintingIdentity({ painting, en = false }: { painting: Painting; en?: boolean }) {
  const identity = painting.identity
  const language = en ? 'en' : 'zh'
  return <section className="painting-identity" aria-label={en ? 'Figure and source date' : '人物与原画年代'}>
    <span className="overline">{en ? 'FIGURE / SOURCE' : '人物 / 原画资料'}</span>
    <h1>{identity.name[language]}</h1>
    {identity.date[language] && <p className="identity-date"><strong>{en ? 'Source artwork: ' : '原画版本：'}</strong>{identity.date[language]}</p>}
    {identity.source[language] && <p className="identity-source"><strong>{en ? 'Source: ' : '出处：'}</strong>{identity.source[language]}</p>}
    {(identity.catalogueUrl || identity.facsimileUrl) && <details><summary>{en ? 'Source and dating notes' : '查看出处与年代说明'}</summary>
      {identity.location[language] && <p><strong>{en ? 'Image reference: ' : '图像定位：'}</strong>{identity.location[language]}</p>}{identity.note[language] && <p>{identity.note[language]}</p>}
      {identity.catalogueUrl && <a href={identity.catalogueUrl} target="_blank" rel="noreferrer">{en ? 'Tenri Library catalogue ↗' : '天理图书馆版本著录 ↗'}</a>}
      {identity.facsimileUrl && <a href={identity.facsimileUrl} target="_blank" rel="noreferrer">{en ? 'Compare the facsimile ↗' : '对照原书影印图 ↗'}</a>}
    </details>}
    {painting.id === '438' && <details>
      <summary>{en ? 'The seven pigs and the Northern Dipper' : '七只小猪与北斗的故事'}</summary>
      <p>{en ? 'In the biography of Yixing in volume 5 of the Song Biographies of Eminent Monks, seven piglets are sealed in a jar and the seven stars of the Northern Dipper disappear. After an amnesty, the stars return over seven nights. This legend offers a literary parallel for reading the seven pigs beneath the lotus seat.' : '《宋高僧传》卷五〈唐中岳嵩阳寺一行传〉记载：一行将七只小猪封入瓮中，北斗七星随之隐去；皇帝大赦后，七星在七夜间复现。看莲座下的七只小猪时，可以对照这个把七猪与北斗相连的传说。'}</p>
      <a href="https://ctext.org/wiki.pl?chapter=788537&if=gb" target="_blank" rel="noreferrer">{en ? 'Read volume 5 of Song Biographies of Eminent Monks ↗' : '阅读《宋高僧传》卷五原文 ↗'}</a>
    </details>}
  </section>
}
