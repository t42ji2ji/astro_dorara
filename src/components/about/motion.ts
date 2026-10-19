import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import lottie from 'lottie-web'
import avatarData from '~/assets/resume/avatar.json'
import { initPit } from './pit'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const EXPO = 'expo.out'
const DESKTOP_PIN = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)
function qsa<T extends Element = HTMLElement>(sel: string, root: ParentNode = document) {
  return Array.from(root.querySelectorAll<T>(sel))
}

// ---------- 借色：牆的顏色只來自目前在畫面上的作品 ----------

interface Tint {
  color: string
  amt: number
}

const zones = new Map<Element, Tint>()
let hoverTint: Tint | null = null

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function applyTint() {
  const wall = qs('.wall')
  if (!wall)
    return
  const t = hoverTint ?? [...zones.values()].at(-1)
  gsap.to(wall, {
    '--amt': t?.amt ?? 0,
    ...(t ? { '--stage': t.color } : {}),
    'duration': 0.6,
    'ease': 'power2.inOut',
    'overwrite': 'auto',
  })
  const onDark = !!t && t.amt > 0.6 && luminance(t.color) < 0.2
  document.body.classList.toggle('on-dark', onDark)
}

function setZone(el: Element, color: string | undefined, amt: number) {
  if (!color)
    return
  zones.delete(el)
  zones.set(el, { color, amt })
  applyTint()
}

function clearZone(el: Element) {
  if (zones.delete(el))
    applyTint()
}

function tintZone(el: HTMLElement, amt: number, start = 'top 60%', end = 'bottom 40%') {
  ScrollTrigger.create({
    trigger: el,
    start,
    end,
    onToggle: self => (self.isActive ? setZone(el, el.dataset.tint, amt) : clearZone(el)),
  })
}

// ---------- 頭像 ----------

function initAvatar() {
  const container = document.getElementById('avatarContainer')
  if (!container)
    return
  const anim = lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, animationData: avatarData })
  anim.playSegments([17, 32], true)
  container.addEventListener('mouseenter', () => anim.playSegments([34, 56], true))
  container.addEventListener('mouseleave', () => anim.playSegments([17, 32], true))
}

// ---------- 進場與捲動揭示 ----------

function heroIntro() {
  const name = qs('[data-hero-name]')
  const lines = qs('[data-hero-lines]')
  if (!name || !lines)
    return
  gsap.set(['[data-hero-name]', '[data-hero-lines]', '[data-hero-fade]', '.hero-avatar', '.hero-meta'], { visibility: 'visible' })

  const chars = SplitText.create(name, { type: 'chars', mask: 'chars' }).chars
  const tl = gsap.timeline({ defaults: { ease: EXPO } })
  tl.from(chars, { yPercent: 110, duration: 1.3, stagger: 0.06 })
    .from('.hero-avatar', { opacity: 0, scale: 0.92, duration: 1 }, 0.3)
    .from('[data-hero-fade]', { opacity: 0, duration: 0.8 }, 0.6)
    .from('.hero-meta', { opacity: 0, duration: 0.8 }, 0.6)

  // 中文沒有空格，SplitText 的斷行會斷錯位置，改成整段揭示
  tl.from(lines.children, { y: 20, opacity: 0, duration: 1, stagger: 0.12 }, 0.55)

  gsap.to('.hero-main', {
    yPercent: -12,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })
}

function reveals() {
  qsa('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: EXPO,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  // 行是在標記裡手動切好的（.ln > span），遮罩往上推
  qsa('[data-reveal-lines]').forEach((el) => {
    gsap.from(qsa('.ln > span', el), {
      yPercent: 105,
      duration: 1.1,
      stagger: 0.1,
      ease: EXPO,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  })

  gsap.from('[data-ledger]', {
    clipPath: 'inset(0 0 100% 0)',
    y: 16,
    duration: 0.9,
    stagger: 0.1,
    ease: EXPO,
    scrollTrigger: { trigger: '.ledger', start: 'top 85%', once: true },
  })

  qsa('[data-plate]').forEach((frame) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
    tl.from(frame, { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: EXPO })
    tl.from(qs('img', frame), { scale: 1.15, duration: 1.4, ease: EXPO }, 0)
  })
}

// ---------- 05 Mac app 舞台 ----------

function stage(lenis: Lenis | null) {
  const section = qs('[data-stage]')
  if (!section)
    return
  const frames = qsa('[data-stage-frame]', section)
  const rows = qsa('[data-stage-row]', section)
  const counter = qs('[data-stage-current]', section)
  const mm = gsap.matchMedia()

  mm.add(DESKTOP_PIN, () => {
    const n = frames.length
    const step = () => window.innerHeight * 0.8
    let current = 0
    let zoneActive = false

    const go = (i: number) => {
      if (i === current)
        return
      const prev = frames[current]
      const next = frames[i]
      current = i
      gsap.to(prev, { y: -24, opacity: 0, duration: 0.45, ease: 'power2.in', overwrite: true })
      gsap.fromTo(next, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: EXPO, delay: 0.15, overwrite: true })
      frames.forEach((f, k) => f.classList.toggle('is-active', k === i))
      rows.forEach((r, k) => r.classList.toggle('is-active', k === i))
      if (counter)
        counter.textContent = String(i + 1).padStart(2, '0')
      if (zoneActive)
        setZone(section, next.dataset.tint, 1)
    }

    const pin = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${step() * (n - 1)}`,
      pin: true,
      snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power1.inOut' },
      onUpdate: self => go(Math.round(self.progress * (n - 1))),
    })

    ScrollTrigger.create({
      trigger: section.parentElement,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        zoneActive = self.isActive
        if (zoneActive)
          setZone(section, frames[current].dataset.tint, 1)
        else clearZone(section)
      },
    })

    const onRow = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.stageRow)
      const y = pin.start + i * step()
      if (lenis)
        lenis.scrollTo(y, { duration: 1.2 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    rows.forEach(r => r.addEventListener('click', onRow))

    return () => {
      rows.forEach(r => r.removeEventListener('click', onRow))
      clearZone(section)
    }
  })

  mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
    frames.forEach(f => tintZone(f, 1))
    return () => frames.forEach(clearZone)
  })
}

// ---------- 04 Mobile app：一手牌 ----------

function phones() {
  const section = qs('[data-phones]')
  if (!section)
    return
  const tabs = qsa('[data-phone-tab]', section)
  const hands = qsa('[data-phone-hand]', section)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const cardsOf = (hand: HTMLElement) => qsa('.phones-card, .phones-solo', hand)
  let current = 0
  let inView = false

  const updateZone = () => {
    const tint = hands[current].dataset.tint
    if (inView && tint)
      setZone(section, tint, 0.4)
    else clearZone(section)
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onToggle: (self) => {
      inView = self.isActive
      updateZone()
    },
  })

  const show = (i: number) => {
    if (i === current)
      return
    const prev = hands[current]
    const next = hands[i]
    current = i
    tabs.forEach((t, k) => {
      t.classList.toggle('is-active', k === i)
      t.setAttribute('aria-pressed', String(k === i))
    })
    updateZone()
    hands.forEach((h) => {
      if (h !== prev && h !== next) {
        gsap.killTweensOf(cardsOf(h))
        gsap.set(cardsOf(h), { clearProps: 'transform,opacity' })
        h.classList.remove('is-active')
      }
    })
    next.classList.add('is-active')
    if (reduced) {
      prev.classList.remove('is-active')
      return
    }

    const out = cardsOf(prev)
    const incoming = cardsOf(next)
    gsap.killTweensOf([...out, ...incoming])
    gsap.set(incoming, { clearProps: 'transform,opacity' })
    gsap.to(out, {
      y: -60,
      rotation: '+=10',
      opacity: 0,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power2.in',
      onComplete: () => {
        prev.classList.remove('is-active')
        gsap.set(out, { clearProps: 'transform,opacity' })
      },
    })
    gsap.from(incoming, {
      y: 140,
      rotation: 0,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      delay: 0.12,
      ease: EXPO,
      clearProps: 'transform,opacity',
    })
  }

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(i))
    if (fine)
      t.addEventListener('pointerenter', () => show(i))
  })

  // 第一手牌在捲到時發牌
  if (!reduced) {
    gsap.from(cardsOf(hands[0]), {
      y: 140,
      rotation: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: EXPO,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: section.querySelector('.phones-deck'), start: 'top 75%', once: true },
    })
  }
}

// ---------- 06 Web 作品：物理場 + 篩選 ----------

function works() {
  const pit = qs('[data-pit]')
  if (!pit)
    return
  const filters = qsa('[data-filter]')
  const bricks = qsa('.brick', pit)
  const bar = qs('.filter-bar')
  const count = qs('[data-works-count]')
  const title = qs('[data-pit-title]')
  const desc = qs('[data-pit-desc]')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  const onHover = (el: HTMLElement | null) => {
    if (title)
      title.textContent = el?.querySelector('.brick-title')?.textContent ?? ''
    if (desc)
      desc.textContent = el?.dataset.desc ?? ''
    hoverTint = el?.dataset.tint ? { color: el.dataset.tint, amt: 0.3 } : null
    applyTint()
  }

  const physics = reduced ? null : initPit(pit, { onHover })
  if (!physics) {
    bricks.forEach((el) => {
      el.addEventListener('pointerenter', () => onHover(el))
      el.addEventListener('pointerleave', () => onHover(null))
    })
  }

  const moveBar = (btn: HTMLElement, animate: boolean) => {
    if (!bar)
      return
    gsap.to(bar, { x: btn.offsetLeft, width: btn.offsetWidth, duration: animate ? 0.4 : 0, ease: 'power3.out' })
  }
  const active = filters.find(b => b.classList.contains('is-active'))
  if (active)
    moveBar(active, false)
  window.addEventListener('resize', () => {
    const a = filters.find(b => b.classList.contains('is-active'))
    if (a)
      moveBar(a, false)
  })

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active'))
        return
      const cat = btn.dataset.filter!
      filters.forEach((b) => {
        b.classList.toggle('is-active', b === btn)
        b.setAttribute('aria-selected', String(b === btn))
      })
      moveBar(btn, true)
      const shown = bricks.filter(el => cat === 'all' || el.dataset.categories!.split(' ').includes(cat))
      if (count)
        count.textContent = String(shown.length).padStart(2, '0')
      if (physics) {
        physics.setCategory(cat)
      }
      else {
        bricks.forEach(el => el.classList.toggle('is-hidden', !shown.includes(el)))
        ScrollTrigger.refresh()
      }
    })
  })
}

// ---------- 入口 ----------

export function initAbout() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  let lenis: Lenis | null = null

  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(t => lenis!.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  initAvatar()
  qsa('.plate, .book').forEach(p => tintZone(p, 0.35))
  stage(lenis)
  phones()
  works()

  if (!reduced) {
    // 字型慢的時候最多等 1.2 秒，不讓首屏空白
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(() => {
      heroIntro()
      reveals()
      ScrollTrigger.refresh()
    })
  }

  window.addEventListener('load', () => ScrollTrigger.refresh())
}
