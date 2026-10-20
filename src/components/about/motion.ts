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
      // 原地交叉淡入淡出，不位移
      gsap.to(prev, { opacity: 0, duration: 0.35, ease: 'power1.out', overwrite: true })
      gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.out', delay: 0.1, overwrite: true })
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

// ---------- 04 Mobile app：直式手風琴 ----------

function phones(lenis: Lenis | null) {
  const section = qs('[data-phones]')
  const acc = qs('[data-acc]', section ?? document)
  if (!section || !acc)
    return
  const cards = qsa('[data-acc-card]', acc)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const shotsOf = (card: HTMLElement) => qsa('.acc-shot', card).filter(el => el.offsetParent)
  let current = 0
  let inView = false
  let cycle = 0

  const updateZone = () => {
    const tint = cards[current].dataset.tint
    if (inView && tint)
      setZone(section, tint, 0.4)
    else clearZone(section)
  }

  // 三張截圖疊放：最前面一張完整，後面的往右錯開、縮小、變淡
  const SLOTS = [{ x: 0, scale: 1, opacity: 1 }, { x: 14, scale: 0.94, opacity: 0.5 }, { x: 28, scale: 0.88, opacity: 0.25 }]
  const order = new Map<HTMLElement, HTMLElement[]>()
  const lay = (card: HTMLElement, animate: boolean) => {
    const shots = order.get(card) ?? shotsOf(card)
    order.set(card, shots)
    shots.forEach((el, k) => {
      const slot = SLOTS[k] ?? SLOTS.at(-1)!
      gsap.to(el, { ...slot, zIndex: shots.length - k, duration: animate ? 0.4 : 0, ease: 'power2.out', overwrite: 'auto' })
    })
  }
  cards.forEach(c => lay(c, false))

  const stopCycle = () => clearInterval(cycle)
  const startCycle = (card: HTMLElement) => {
    stopCycle()
    if (reduced || (order.get(card)?.length ?? 0) < 2)
      return
    cycle = window.setInterval(() => {
      const shots = order.get(card)!
      shots.push(shots.shift()!)
      lay(card, true)
    }, 2400)
  }

  const open = (i: number) => {
    if (i === current)
      return
    current = i
    cards.forEach((c, k) => {
      c.classList.toggle('is-open', k === i)
      c.setAttribute('aria-expanded', String(k === i))
    })
    updateZone()
    startCycle(cards[i])
    const front = order.get(cards[i])?.[0]
    // 截圖往上捲到底，角色從卡片下緣冒上來
    if (front && !reduced)
      gsap.fromTo(front, { objectPosition: '50% 60%' }, { objectPosition: '50% 100%', duration: 1.2, ease: EXPO })
  }

  // 進到這區才染色、才自動換截圖
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onToggle: (self) => {
      inView = self.isActive
      updateZone()
      if (inView)
        startCycle(cards[current])
      else stopCycle()
    },
  })

  // 桌機釘住時，點卡片是捲到那一格，讓捲動位置和展開的卡一致
  let jump: ((i: number) => void) | null = null
  const pick = (i: number) => (jump ? jump(i) : open(i))

  // 點擊（或 Enter／空白鍵）展開；App Store 連結只在展開卡的那行字上
  cards.forEach((card, i) => {
    card.addEventListener('click', () => pick(i))
    card.addEventListener('keydown', (e) => {
      if (e.target === card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        pick(i)
      }
    })
  })

  // 桌機：釘住整區，往下捲一格就展開下一張
  const mm = gsap.matchMedia()
  mm.add(DESKTOP_PIN, () => {
    const n = cards.length
    const step = () => window.innerHeight * 0.8
    const pin = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${step() * (n - 1)}`,
      pin: true,
      snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power1.inOut' },
      onUpdate: self => open(Math.round(self.progress * (n - 1))),
    })
    jump = (i) => {
      const y = pin.start + i * step()
      if (lenis)
        lenis.scrollTo(y, { duration: 1.2 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    return () => {
      jump = null
    }
  })

  if (reduced)
    return

  // 進場：每張由上往下揭開，錯開一點
  gsap.from(cards, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 0.9,
    stagger: 0.07,
    ease: EXPO,
    clearProps: 'clipPath',
    scrollTrigger: { trigger: acc, start: 'top 80%', once: true },
  })

  // 平板（沒有釘住）：捲動時像琴鍵，奇偶反向、幅度不等，區段中心為零位
  mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
    const AMP = [-28, 18, -10, 22, -32]
    const ROT = [-0.6, 0.4, 0, 0.5, -0.7]
    cards.forEach((card, i) => {
      gsap.fromTo(card, { y: -AMP[i % 5], rotation: -ROT[i % 5] }, {
        y: AMP[i % 5],
        rotation: ROT[i % 5],
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  })
  mm.add('(max-width: 767px)', () => {
    cards.forEach((card, i) => {
      const r = i % 2 ? 0.4 : -0.4
      gsap.fromTo(card, { rotation: -r }, {
        rotation: r,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  })
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

  // hover 時圖框照封面比例展開，整張截圖看得到；以塊中心為準，超出 bento 就推回來
  // 浮起的說明卡往圖框旁邊空間比較大的那側長；兩側都太窄就上下
  const POP = 280
  const MIN_W = 340
  tiles.forEach((el) => {
    el.addEventListener('pointerenter', () => {
      const tw = el.offsetWidth
      const th = el.offsetHeight
      const ar = Number(el.dataset.ar) || tw / th
      const w = Math.min(Math.max(tw, Math.sqrt(tw * th * ar), MIN_W), bento.offsetWidth)
      const h = w / ar
      const x = Math.min(Math.max((tw - w) / 2, -el.offsetLeft), bento.offsetWidth - el.offsetLeft - w)
      const y = Math.min(Math.max((th - h) / 2, -el.offsetTop), bento.offsetHeight - el.offsetTop - h)
      el.style.setProperty('--hx', `${x}px`)
      el.style.setProperty('--hy', `${y}px`)
      el.style.setProperty('--hw', `${w}px`)
      el.style.setProperty('--hh', `${h}px`)

      const t = el.getBoundingClientRect()
      const right = bento.offsetWidth - el.offsetLeft - x - w
      const left = el.offsetLeft + x
      el.dataset.pop = Math.max(right, left) >= POP
        ? (right >= left ? 'right' : 'left')
        : (innerHeight - t.top - y - h >= t.top + y ? 'down' : 'up')
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
  // 釘住的區塊要照頁面順序建立，後面的才算得到前面多出來的捲動距離
  phones(lenis)
  stage(lenis)
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
