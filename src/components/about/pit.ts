// Web 作品的物理場：每個作品是一塊，從上方掉進來、撞牆、堆疊，可以抓起來甩。
// 換分類時地板打開讓舊的掉出去，再落下新的一批。
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Matter from 'matter-js'

const { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Sleeping } = Matter

const WALL = 200
const FILL = 0.4 // 塊的總面積約佔場地的比例

interface Brick {
  el: HTMLElement
  body: Matter.Body
  w: number
  h: number
}

interface PitOptions {
  onHover: (el: HTMLElement | null) => void
}

export function initPit(pit: HTMLElement, opts: PitOptions) {
  const all = Array.from(pit.querySelectorAll<HTMLElement>('.brick'))
  const engine = Engine.create({ gravity: { x: 0, y: 1.2 }, enableSleeping: true })
  const world = engine.world
  let bricks: Brick[] = []
  let walls: Matter.Body[] = []
  let floor: Matter.Body | null = null
  let floorOpen = false
  let W = 0
  let H = 0
  let running = false
  let started = false
  let timers: number[] = []

  pit.classList.add('is-live')

  function buildWalls() {
    Composite.remove(world, walls)
    W = pit.clientWidth
    H = pit.clientHeight
    const opts = { isStatic: true, friction: 0.6 }
    floor = Bodies.rectangle(W / 2, H + WALL / 2, W * 3, WALL, opts)
    walls = [
      floor,
      Bodies.rectangle(-WALL / 2, -H, WALL, H * 4, opts),
      Bodies.rectangle(W + WALL / 2, -H, WALL, H * 4, opts),
    ]
    Composite.add(world, walls)
  }

  function clearBricks() {
    timers.forEach(clearTimeout)
    timers = []
    bricks.forEach((b) => {
      Composite.remove(world, b.body)
      b.el.classList.remove('is-dropped')
    })
    bricks = []
  }

  function drop(els: HTMLElement[]) {
    clearBricks()
    const area = els.reduce((sum, el) => sum + Number(el.dataset.size) ** 2 / Number(el.dataset.aspect), 0)
    const base = Math.sqrt((FILL * W * H) / area)

    els.forEach((el, i) => {
      const w = Math.max(72, Math.min(W * 0.46, base * Number(el.dataset.size)))
      const h = w / Number(el.dataset.aspect)
      el.style.width = `${w}px`
      el.style.height = `${h}px`
      const x = w / 2 + Math.random() * Math.max(1, W - w)
      const body = Bodies.rectangle(x, -h, w, h, {
        chamfer: { radius: 6 },
        restitution: 0.25,
        friction: 0.5,
        frictionAir: 0.012,
        density: 0.002,
        angle: (Math.random() - 0.5) * 0.6,
      })
      const brick = { el, body, w, h }
      bricks.push(brick)
      timers.push(
        window.setTimeout(() => {
          Composite.add(world, body)
          el.classList.add('is-dropped')
          paint(brick)
        }, i * 90),
      )
    })
  }

  function paint(b: Brick) {
    const { x, y } = b.body.position
    b.el.style.transform = `translate3d(${x - b.w / 2}px, ${y - b.h / 2}px, 0) rotate(${b.body.angle}rad)`
  }

  function tick(_time: number, delta: number) {
    if (!running)
      return
    Engine.update(engine, Math.min(delta, 32))
    for (const b of bricks) {
      // 被甩出場外的撿回來
      if (!floorOpen && b.body.position.y > H + 400) {
        Body.setPosition(b.body, { x: W / 2, y: -b.h })
        Body.setVelocity(b.body, { x: 0, y: 0 })
      }
      if (!b.body.isSleeping)
        paint(b)
    }
  }

  const visible = (cat: string) =>
    all.filter(el => cat === 'all' || el.dataset.categories!.split(' ').includes(cat))

  let current = 'personal'

  function setCategory(cat: string) {
    current = cat
    all.forEach(el => el.classList.toggle('is-hidden', !visible(cat).includes(el)))
    if (!started)
      return
    // 地板打開，舊的掉出去
    timers.forEach(clearTimeout)
    timers = []
    if (floor && !floorOpen)
      Composite.remove(world, floor)
    floorOpen = true
    bricks.forEach(b => Sleeping.set(b.body, false))
    timers.push(
      window.setTimeout(() => {
        if (floor)
          Composite.add(world, floor)
        floorOpen = false
        drop(visible(cat))
      }, 750),
    )
  }

  buildWalls()
  gsap.ticker.add(tick)

  ScrollTrigger.create({
    trigger: pit,
    start: 'top 75%',
    end: 'bottom top',
    onToggle: (self) => {
      running = self.isActive
      if (running && !started) {
        started = true
        drop(visible(current))
      }
    },
  })

  // 滑鼠可以抓塊；觸控裝置不抓，免得擋住頁面捲動
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const mouse = Mouse.create(pit)
    const m = mouse as Matter.Mouse & { mousewheel: EventListener }
    pit.removeEventListener('wheel', m.mousewheel)
    const grab = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, damping: 0.1 } })
    Composite.add(world, grab)

    let downAt = { x: 0, y: 0 }
    pit.addEventListener('pointerdown', (e) => {
      downAt = { x: e.clientX, y: e.clientY }
    })
    pit.addEventListener('click', (e) => {
      if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6)
        e.preventDefault()
    })
  }

  all.forEach((el) => {
    el.addEventListener('pointerenter', () => opts.onHover(el))
    el.addEventListener('pointerleave', () => opts.onHover(null))
  })

  let lastW = pit.clientWidth
  let resizeTimer = 0
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (Math.abs(pit.clientWidth - lastW) < 40)
        return
      lastW = pit.clientWidth
      buildWalls()
      if (started)
        drop(visible(current))
    }, 250)
  })

  return { setCategory }
}
