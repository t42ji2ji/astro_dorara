import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { packBento } from './bento'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger, SplitText, Flip)

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

// lottie 與動畫檔另外載入，不拖慢首屏腳本；捲出畫面就暫停，不在背景每幀計算
async function initAvatar() {
  const container = document.getElementById('avatarContainer')
  if (!container)
    return
  const [{ default: lottie }, { default: animationData }] = await Promise.all([
    import('lottie-web'),
    import('~/assets/resume/avatar.json'),
  ])
  const anim = lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, animationData })
  anim.playSegments([17, 32], true)
  container.addEventListener('mouseenter', () => anim.playSegments([34, 56], true))
  container.addEventListener('mouseleave', () => anim.playSegments([17, 32], true))
  new IntersectionObserver(([e]) => e.isIntersecting ? anim.play() : anim.pause()).observe(container)
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

  // 手機：左右滑的卡片，一次一個 app，整區只佔約一個螢幕
  mm.add('(max-width: 1023px)', () => {
    const track = qs('.stage-frames', section)!
    let current = -1
    let inView = false

    const setActive = (i: number) => {
      if (i === current)
        return
      current = i
      frames.forEach((f, k) => f.classList.toggle('is-active', k === i))
      rows.forEach((r, k) => r.classList.toggle('is-active', k === i))
      if (counter)
        counter.textContent = String(i + 1).padStart(2, '0')
      rows[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
      if (inView)
        setZone(section, frames[i].dataset.tint, 1)
    }

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2
      let best = 0
      frames.forEach((f, k) => {
        const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - center)
        if (d < Math.abs(frames[best].offsetLeft + frames[best].offsetWidth / 2 - center))
          best = k
      })
      setActive(best)
    }

    const onRow = (e: Event) => {
      const f = frames[Number((e.currentTarget as HTMLElement).dataset.stageRow)]
      track.scrollTo({ left: f.offsetLeft - (track.clientWidth - f.offsetWidth) / 2, behavior: 'smooth' })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    rows.forEach(r => r.addEventListener('click', onRow))
    const zone = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: (self) => {
        inView = self.isActive
        if (inView)
          setZone(section, frames[current].dataset.tint, 1)
        else clearZone(section)
      },
    })
    setActive(0)

    return () => {
      track.removeEventListener('scroll', onScroll)
      rows.forEach(r => r.removeEventListener('click', onRow))
      zone.kill()
      clearZone(section)
    }
  })

  // 桌機但關閉動態：直排，各自換底色
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: reduce)', () => {
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

  // 收成一疊再攤開成扇形；動畫期間關掉 CSS transition，免得兩邊搶 transform 造成閃爍
  const deal = (hand: HTMLElement, delay = 0) => {
    const cards = cardsOf(hand)
    hand.classList.add('is-dealing')
    return gsap.from(cards, {
      x: 0,
      rotation: 0,
      y: 16,
      duration: 0.8,
      stagger: 0.05,
      delay,
      ease: EXPO,
      clearProps: 'transform',
      onComplete: () => hand.classList.remove('is-dealing'),
    })
  }

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
      gsap.killTweensOf([h, ...cardsOf(h)])
      gsap.set(cardsOf(h), { clearProps: 'transform' })
      h.classList.remove('is-dealing')
      if (h !== prev && h !== next) {
        gsap.set(h, { clearProps: 'opacity' })
        h.classList.remove('is-active')
      }
    })
    next.classList.add('is-active')
    if (reduced) {
      prev.classList.remove('is-active')
      return
    }

    gsap.to(prev, {
      opacity: 0,
      duration: 0.25,
      ease: 'power1.out',
      onComplete: () => {
        prev.classList.remove('is-active')
        gsap.set(prev, { clearProps: 'opacity' })
      },
    })
    gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out', clearProps: 'opacity' })
    deal(next, 0.05)
  }

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  let intent = 0
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(i))
    if (fine) {
      // 停一下才切，滑鼠掃過清單不會連換好幾手
      t.addEventListener('pointerenter', () => {
        clearTimeout(intent)
        intent = window.setTimeout(() => show(i), 140)
      })
      t.addEventListener('pointerleave', () => clearTimeout(intent))
    }
  })

  // 第一手牌在捲到時攤開
  if (!reduced) {
    ScrollTrigger.create({
      trigger: section.querySelector('.phones-deck'),
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (current === 0)
          deal(hands[0])
      },
    })
  }
}

// ---------- 06 Web 作品：bento + 篩選 ----------

function works() {
  const bento = qs('[data-bento]')
  if (!bento)
    return
  const filters = qsa('[data-filter]')
  const tiles = qsa('.tile', bento)
  const bar = qs('.filter-bar')
  const count = qs('[data-works-count]')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  // 依目前欄數把顯示中的塊重新排成不留洞的便當
  const cols = () => getComputedStyle(bento).gridTemplateColumns.split(' ').length
  const layout = () => {
    const shown = tiles.filter(el => !el.classList.contains('is-hidden'))
    const shapes = packBento(shown.map(el => el.dataset.featured !== undefined), cols())
    tiles.forEach(el => el.classList.remove('is-wide', 'is-tall', 'is-big'))
    shown.forEach((el, i) => shapes[i] && el.classList.add(`is-${shapes[i]}`))
    return shown.length
  }
  layout()
  let lastCols = cols()
  window.addEventListener('resize', () => {
    if (cols() === lastCols)
      return
    lastCols = cols()
    layout()
  })

  // 浮起的說明卡往塊旁邊空間比較大的那側長；兩側都太窄就上下
  const POP = 280
  tiles.forEach((el) => {
    el.addEventListener('pointerenter', () => {
      const b = bento.getBoundingClientRect()
      const t = el.getBoundingClientRect()
      const right = b.right - t.right
      const left = t.left - b.left
      el.dataset.pop = Math.max(right, left) >= POP
        ? (right >= left ? 'right' : 'left')
        : (innerHeight - t.bottom >= t.top ? 'down' : 'up')
      hoverTint = el.dataset.tint ? { color: el.dataset.tint, amt: 0.3 } : null
      applyTint()
    })
    el.addEventListener('pointerleave', () => {
      hoverTint = null
      applyTint()
    })
  })

  if (!reduced) {
    gsap.from(tiles.filter(el => !el.classList.contains('is-hidden')), {
      y: 40,
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      stagger: 0.05,
      ease: EXPO,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: bento, start: 'top 80%', once: true },
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

      const state = reduced ? null : Flip.getState(tiles)
      const h0 = bento.offsetHeight
      tiles.forEach((el) => {
        const show = cat === 'all' || el.dataset.categories!.split(' ').includes(cat)
        el.classList.toggle('is-hidden', !show)
      })
      const n = layout()
      if (count)
        count.textContent = String(n).padStart(2, '0')

      if (!state) {
        ScrollTrigger.refresh()
        return
      }
      // 換位期間關掉 .tile 的 CSS transition，免得跟 Flip 搶 transform
      bento.classList.add('is-flipping')
      // absolute 換位時格子不撐高度，先鎖住舊高度再補間到新高度，下面的內容才不會蓋上來
      const h1 = bento.offsetHeight
      gsap.fromTo(bento, { height: h0 }, { height: h1, duration: 0.8, delay: h1 < h0 ? 0.2 : 0, ease: EXPO, clearProps: 'height' })
      Flip.from(state, {
        duration: 0.8,
        ease: EXPO,
        absolute: true,
        stagger: 0.012,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.15, ease: EXPO }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
        onComplete: () => {
          // Flip 清掉 inline transform 後隔一幀再開回 transition，不然 CSS 會從舊位置再播一次
          requestAnimationFrame(() => requestAnimationFrame(() => bento.classList.remove('is-flipping')))
          ScrollTrigger.refresh()
        },
      })
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
