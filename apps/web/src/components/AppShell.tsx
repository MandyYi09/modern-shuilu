import { GarmentOrnament } from './GarmentOrnament'
import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const pathname = useLocation({ select: location => location.pathname })
  const [introOpen, setIntroOpen] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)
  const en = i18n.language === 'en'
  useEffect(() => {
    const navigation = navigationRef.current
    const shell = navigation?.parentElement
    if (!navigation || !shell) return
    const update = () => shell.style.setProperty('--navigation-height', `${navigation.getBoundingClientRect().height}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(navigation)
    return () => { observer.disconnect(); shell.style.removeProperty('--navigation-height') }
  }, [])
  useEffect(() => { document.documentElement.lang = en ? 'en' : 'zh-Hant' }, [en])
  useEffect(() => {
    document.title = en ? 'Modern Shuilu | Collect Chinese Heritage' : 'Modern Shuilu | 收藏传统文化之美'
    document.querySelector('meta[name="description"]')?.setAttribute('content', en
      ? 'Discover collectible art cards inspired by Chinese Shuilu paintings. Collect the art, reconnect with history, and carry your heritage forward.'
      : '探索以中国水陆画为灵感的艺术收藏卡。收藏艺术，重识历史，让传统文化走进今天的生活。')
  }, [en, pathname])
  const toggleLanguage = () => {
    const next = en ? 'zh-TW' : 'en'
    void i18n.changeLanguage(next)
  }
  const navigation = [
    { to: '/' as const, zh: '首页', en: 'Home', shortEn: 'Home', active: pathname === '/' },
    { to: '/draw' as const, zh: '每日抽卡', en: 'Daily Draw', shortEn: 'Draw', active: pathname === '/draw' },
    { to: '/collection' as const, zh: '原画图集', en: 'Paintings', shortEn: 'Paintings', active: pathname === '/collection' || pathname.startsWith('/card/') },
    { to: '/create' as const, zh: '制作壁纸', en: 'Wallpaper', shortEn: 'Wallpaper', active: pathname === '/create' },
    { to: '/path' as const, zh: '我的收藏', en: 'Saved details', shortEn: 'Saved', active: pathname === '/path' },
  ]

  return <div className={`app-shell${pathname === "/" ? " app-shell-home" : ""}`}>
    <header ref={navigationRef} className={`navigation-bar${en ? " navigation-en" : ""}`}>
    <div className="navigation-clouds" aria-hidden="true"/>
    <nav className="page-dock" aria-label={en ? 'Main navigation' : '主导航'}>
      {navigation.map(item => <Link key={item.to} to={item.to} className={`page-dock-link${item.active ? ' is-active' : ''}`} aria-current={item.active ? 'page' : undefined}><span className="nav-full-label">{en ? item.shortEn : item.zh}</span><span className="nav-mobile-label">{en ? item.shortEn : item.zh}</span></Link>)}
    </nav>
    <div className="navbar-utilities">
    <button type="button" className="intro-trigger" aria-haspopup="dialog" onClick={() => setIntroOpen(true)}>{en ? 'New here?' : '初次来访？'}</button>
    <button className="language-button navbar-language" type="button" onClick={toggleLanguage} aria-label={en ? 'Switch to Chinese' : '切换至英文'} title={en ? 'Switch to Chinese' : '切换至英文'}><span className={en ? 'is-current' : undefined} aria-hidden="true">EN</span><span className="language-divider" aria-hidden="true">/</span><span className={!en ? 'is-current' : undefined} aria-hidden="true">中</span></button>
    </div>
    </header>
    {introOpen && <SiteIntroduction en={en} onClose={() => setIntroOpen(false)}/>}
    <main><div className="page-ribbon"><GarmentOrnament/></div>{children}<div className="page-hem"><GarmentOrnament variant="hem"/></div></main>
    <footer className="site-footer"><span className="footer-note">{en ? 'A way into Shuilu paintings' : '从一张画，开始看'}</span></footer>
  </div>
}

function SiteIntroduction({ en, onClose }: { en: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; previousFocus?.focus() }
  }, [])
  return <dialog ref={dialog} className="site-introduction" aria-labelledby="site-introduction-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose() } }}>
    <button type="button" className="intro-close" onClick={onClose} aria-label={en ? 'Close introduction' : '关闭介绍'}>×</button>
    <span className="overline">Modern Shuilu</span>
    <h2 id="site-introduction-title">{en ? 'A small discovery in an old painting.' : '从一张卡，走近一幅画。'}</h2>
    <p>{en ? 'Shuilu paintings are used in Buddhist Shuilu rituals and depict deities and people from many walks of life. Here, illustrated characters and small details offer an easy way into these paintings—no art history knowledge needed.' : '水陆画是寺庙举行水陆法会时使用的绘画，画中既有神佛，也有世间百态。这里用插画角色和画中细节，带你轻松走近这些古画，无需古画知识。'}</p>
    <ul>
      <li><strong>{en ? 'Draw a card' : '抽一张卡'}</strong><span>{en ? 'Meet one illustrated character each day.' : '每天遇见一位卡通角色，收下一句祝福。'}</span></li>
      <li><strong>{en ? 'Follow the detail' : '跟着细节看原画'}</strong><span>{en ? 'Look closer at the paintings and save your favourite details.' : '细看原画，把喜欢的细节留在「我的收藏」。'}</span></li>
      <li><strong>{en ? 'Keep a discovery' : '留下喜欢的发现'}</strong><span>{en ? 'Save a detail as you explore. Wallpaper making is there whenever you want to take an image home.' : '看画时可以收藏细节；想把喜欢的画带走，再去制作壁纸。'}</span></li>
    </ul>
    <button type="button" className="paper-button" onClick={onClose}>{en ? 'Start exploring' : '开始逛逛'} →</button>
  </dialog>
}
