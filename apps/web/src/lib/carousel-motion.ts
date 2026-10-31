// Shared by the React website and the framework-free portfolio cover.
export function mountCarousel(root: HTMLElement) {
  const slides = [...root.querySelectorAll<HTMLElement>('.guardian-slide')]
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  let active = 1, visible = true, hovered = false, focused = false, running = false
  let timer: ReturnType<typeof setTimeout> | undefined, remaining = 7000, deadline = 0
  let touch: { x: number; y: number } | undefined
  const cleanups: (() => void)[] = []
  function render() {
    slides.forEach((slide, index) => {
      const offset = (index - active + slides.length) % slides.length
      for (const name of ['is-active', 'is-next', 'is-previous']) slide.classList.remove(name)
      slide.classList.add(offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : 'is-previous')
      slide.setAttribute('aria-hidden', String(index !== active))
      slide.querySelector('img')?.classList.toggle('is-moving', index === active && running)
    })
  }
  function update() {
    const next = visible && !hovered && !focused && !preference.matches && !document.hidden && !document.documentElement.hasAttribute('data-preview-paused')
    if (!next && timer !== undefined) {
      clearTimeout(timer); timer = undefined
      remaining = Math.max(0, deadline - performance.now())
    }
    running = next
    render()
    if (next && timer === undefined) {
      deadline = performance.now() + remaining
      timer = setTimeout(() => {
        timer = undefined; remaining = 7000
        active = (active + 1) % slides.length; update()
      }, remaining)
    }
  }
  function move(direction: number) {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined; remaining = 7000
    active = (active + direction + slides.length) % slides.length; update()
  }
  function listen(target: EventTarget, type: string, handler: EventListener) {
    target.addEventListener(type, handler)
    cleanups.push(() => target.removeEventListener(type, handler))
  }
  listen(root, 'mouseenter', () => { hovered = true; update() })
  listen(root, 'mouseleave', () => { hovered = false; update() })
  listen(root, 'focusin', () => { focused = true; update() })
  listen(root, 'focusout', event => {
    focused = root.contains((event as FocusEvent).relatedTarget as Node | null); update()
  })
  listen(root, 'keydown', event => {
    const key = (event as KeyboardEvent).key
    if (key === 'ArrowLeft' || key === 'ArrowRight') { event.preventDefault(); move(key === 'ArrowRight' ? 1 : -1) }
  })
  listen(root, 'touchstart', event => {
    const point = (event as TouchEvent).touches[0]; touch = { x: point.clientX, y: point.clientY }
  })
  listen(root, 'touchend', event => {
    if (!touch) return
    const point = (event as TouchEvent).changedTouches[0], x = point.clientX - touch.x, y = point.clientY - touch.y
    if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1)
    touch = undefined
  })
  listen(document, 'visibilitychange', update)
  listen(window, 'portfolio-preview-visibility', update)
  listen(preference, 'change', update)
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
  observer.observe(root); update()
  return () => { observer.disconnect(); if (timer !== undefined) clearTimeout(timer); cleanups.forEach(cleanup => cleanup()) }
}
