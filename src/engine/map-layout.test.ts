import { describe, it, expect } from 'vitest'
import { placeLabels, type LabelRect, type MarkerInput } from './map-layout'

// placeLabels decides where every dive-site name sits on the Taiwan map, and
// draws a leader line from the name back to its pin. It is 300 lines of geometry
// with no DOM and no network, so it can be checked exactly.
//
// The failure it exists to prevent is a label sitting on top of another label,
// another pin, or somebody else's leader line — all of which look like a bug to
// a visitor and like nothing at all to every other test we have.

/** Do two axis-aligned rectangles share any area? */
const overlaps = (a: LabelRect, b: LabelRect) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1])

/** Markers spread far enough apart that every label should place cleanly. */
const roomy: MarkerInput[] = [
  { name: 'Keelung', vx: 100, vy: 60 },
  { name: 'Yilan', vx: 320, vy: 180 },
  { name: 'Kenting', vx: 140, vy: 480 },
  { name: 'Penghu', vx: 40, vy: 300 },
]

const BOUNDS = { width: 400, height: 560 }

describe('placeLabels', () => {
  it('returns one placement per marker, in the order they were given', () => {
    const placed = placeLabels(roomy, { bounds: BOUNDS })
    expect(placed).toHaveLength(roomy.length)
    // Placement sorts north-to-south internally, then sorts back. If that last
    // sort is ever dropped, the map draws Kenting's name next to Keelung's pin.
    expect(placed.map((p) => p.index)).toEqual([0, 1, 2, 3])
    placed.forEach((p, i) => {
      expect([p.vx, p.vy], `marker ${i} moved`).toEqual([roomy[i].vx, roomy[i].vy])
    })
  })

  it('gives the same answer every time', () => {
    // The map re-renders on every zoom. Labels that shuffle between renders
    // would be worse than labels in a poor position.
    const a = placeLabels(roomy, { bounds: BOUNDS })
    const b = placeLabels(roomy, { bounds: BOUNDS })
    expect(a).toEqual(b)
  })

  it('never lets two labels overlap, when there is room', () => {
    const placed = placeLabels(roomy, { bounds: BOUNDS })
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        expect(
          overlaps(placed[i].rect, placed[j].rect),
          `${roomy[i].name} overlaps ${roomy[j].name}`,
        ).toBe(false)
      }
    }
  })

  it('never covers another marker with a label, when there is room', () => {
    const placed = placeLabels(roomy, { bounds: BOUNDS })
    placed.forEach((p, i) => {
      roomy.forEach((m, j) => {
        if (i === j) return
        const inside = m.vx >= p.rect.x && m.vx <= p.rect.x + p.rect.w
        const within = m.vy >= p.rect.y && m.vy <= p.rect.y + p.rect.h
        expect(inside && within, `${roomy[i].name}'s label covers ${m.name}'s pin`).toBe(false)
      })
    })
  })

  it('keeps every label inside the map, when asked', () => {
    const placed = placeLabels(roomy, { bounds: BOUNDS })
    for (const p of placed) {
      expect(p.rect.x).toBeGreaterThanOrEqual(0)
      expect(p.rect.y).toBeGreaterThanOrEqual(0)
      expect(p.rect.x + p.rect.w).toBeLessThanOrEqual(BOUNDS.width)
      expect(p.rect.y + p.rect.h).toBeLessThanOrEqual(BOUNDS.height)
    }
  })

  it('draws each leader line from the label back to its own pin', () => {
    const placed = placeLabels(roomy, { bounds: BOUNDS })
    for (const p of placed) {
      // The line stops just short of the marker centre rather than on it.
      const gap = dist(p.leaderEnd, [p.vx, p.vy])
      expect(gap).toBeGreaterThan(0)
      expect(gap).toBeLessThan(10)
      // And it starts at the label, not somewhere else on the map.
      const toLabel = dist(p.leaderStart, [p.rect.x + p.rect.w / 2, p.rect.y + p.rect.h / 2])
      expect(toLabel).toBeLessThan(p.rect.w + p.rect.h)
    }
  })

  it('gives a longer name a wider box', () => {
    const [short] = placeLabels([{ name: 'Yilan', vx: 200, vy: 200 }])
    const [long] = placeLabels([{ name: 'Long Dong (Dragon Cave)', vx: 200, vy: 200 }])
    expect(long.rect.w).toBeGreaterThan(short.rect.w)
  })

  it('still places every marker when they are piled on top of each other', () => {
    // Two sites metres apart in reality are the same pixel on the map. The
    // layout cannot satisfy every rule here, and must not crash or drop one.
    const crowded: MarkerInput[] = Array.from({ length: 8 }, (_, i) => ({
      name: `Site ${i}`,
      vx: 200 + (i % 2),
      vy: 200 + i,
    }))
    const placed = placeLabels(crowded, { bounds: BOUNDS })
    expect(placed).toHaveLength(8)
    expect(placed.map((p) => p.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    for (const p of placed) {
      expect(Number.isFinite(p.labelX)).toBe(true)
      expect(Number.isFinite(p.labelY)).toBe(true)
    }
  })

  it('handles a single marker, and none at all', () => {
    expect(placeLabels([])).toEqual([])
    expect(placeLabels([{ name: 'Penghu', vx: 10, vy: 10 }])).toHaveLength(1)
  })
})
