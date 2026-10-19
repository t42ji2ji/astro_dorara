// bento 排版：每塊都放進第一個空格（跟 CSS grid dense 的放法一致），
// 並找出剛好填滿矩形、不留洞的形狀組合
export type Shape = '' | 'wide' | 'tall' | 'big'

const SIZE: Record<Shape, [number, number]> = { '': [1, 1], 'wide': [2, 1], 'tall': [1, 2], 'big': [2, 2] }
const PATTERN: Shape[] = ['', 'tall', '', 'wide', '', '', 'tall', '', 'wide', '']
const FALLBACK: Shape[] = ['', 'wide', 'tall', 'big']

export function packBento(featured: boolean[], cols: number): Shape[] {
  const n = featured.length
  const grid: boolean[][] = []
  const shapes: Shape[] = []

  const free = (r: number, c: number) => !grid[r]?.[c]
  const mark = (r: number, c: number, s: Shape, v: boolean) => {
    const [w, h] = SIZE[s]
    for (let y = r; y < r + h; y++) {
      grid[y] ??= Array.from({ length: cols }, () => false)
      for (let x = c; x < c + w; x++) grid[y][x] = v
    }
  }
  const fits = (r: number, c: number, s: Shape) => {
    const [w, h] = SIZE[s]
    if (c + w > cols)
      return false
    for (let y = r; y < r + h; y++) {
      for (let x = c; x < c + w; x++) {
        if (!free(y, x))
          return false
      }
    }
    return true
  }
  const firstEmpty = (): [number, number] => {
    for (let r = 0; ; r++) {
      for (let c = 0; c < cols; c++) {
        if (free(r, c))
          return [r, c]
      }
    }
  }
  // 精選作品輪流當大塊與橫條，避免大塊一路排滿
  const pick = featured.map((f, i) => f ? featured.slice(0, i).filter(Boolean).length % 2 ? 'wide' : 'big' : PATTERN[i % PATTERN.length])
  const prefs = (i: number) => [pick[i], ...FALLBACK.filter(s => s !== pick[i])]

  // 前段照預設形狀貪心排（放不下就退成小格），只在最後 tail 塊裡搜尋能補滿矩形的組合；
  // budget＝tail 裡最多偏離預設幾次，從 0 往上加，找最貼近預設的解
  function place(i: number, tail: number, budget: number): boolean {
    // 退回時留下的空列不算洞
    if (i === n)
      return grid.every(row => row.every(Boolean) || !row.some(Boolean))
    const [r, c] = firstEmpty()
    const greedy = i < n - tail
    for (const s of prefs(i)) {
      const cost = greedy || s === pick[i] ? 0 : 1
      if (cost > budget || !fits(r, c, s))
        continue
      mark(r, c, s, true)
      shapes[i] = s
      if (place(i + 1, tail, budget - cost))
        return true
      mark(r, c, s, false)
      if (greedy)
        return false
    }
    return false
  }

  const maxTail = Math.min(n, 10)
  for (let budget = 0; budget <= maxTail; budget++) {
    for (let tail = Math.min(budget + 3, maxTail); tail <= maxTail; tail += 3) {
      if (place(0, tail, budget))
        return shapes
    }
  }
  return pick.map(() => '')
}
