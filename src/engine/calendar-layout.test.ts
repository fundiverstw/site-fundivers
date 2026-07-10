import { describe, it, expect } from 'vitest'
import { assignTracks, segmentsForDay, type LayoutEvent } from './calendar-layout'

// The month grid draws each multi-day trip as a horizontal bar. Two trips that
// share a day must sit on different rows ("tracks") or one hides the other.
// This is pure arithmetic over dates — no DOM, no network.

const ev = (id: string, start: string, end?: string): LayoutEvent => ({
  id,
  start_time: `${start}T00:00:00`,
  end_time: end ? `${end}T00:00:00` : null,
})

const day = (d: string) => new Date(`${d}T00:00:00`)
const trackOf = (ranges: ReturnType<typeof assignTracks>, id: string) =>
  ranges.find((r) => r.event.id === id)!.track

describe('assignTracks', () => {
  it('puts a lone event on the first track', () => {
    expect(assignTracks([ev('a', '2026-07-14', '2026-07-16')])[0].track).toBe(0)
  })

  it('reuses the first track for events that do not overlap', () => {
    const r = assignTracks([
      ev('a', '2026-07-01', '2026-07-03'),
      ev('b', '2026-07-05', '2026-07-07'),
    ])
    expect(trackOf(r, 'a')).toBe(0)
    expect(trackOf(r, 'b')).toBe(0)
  })

  it('stacks overlapping events onto separate tracks', () => {
    const r = assignTracks([
      ev('a', '2026-07-01', '2026-07-05'),
      ev('b', '2026-07-03', '2026-07-08'),
    ])
    expect(trackOf(r, 'a')).not.toBe(trackOf(r, 'b'))
  })

  // The bars are inclusive of their end day, so two trips that merely touch
  // still collide visually.
  it('treats events that touch on one day as overlapping', () => {
    const r = assignTracks([
      ev('a', '2026-07-01', '2026-07-03'),
      ev('b', '2026-07-03', '2026-07-05'),
    ])
    expect(trackOf(r, 'a')).not.toBe(trackOf(r, 'b'))
  })

  it('gives the longer of two same-day starts the lower track', () => {
    // The long bar is the one the eye follows, so it belongs on top.
    const r = assignTracks([
      ev('short', '2026-07-01', '2026-07-02'),
      ev('long', '2026-07-01', '2026-07-09'),
    ])
    expect(trackOf(r, 'long')).toBe(0)
    expect(trackOf(r, 'short')).toBe(1)
  })

  it('does not care what order the events arrive in', () => {
    const a = assignTracks([
      ev('x', '2026-07-05', '2026-07-08'),
      ev('y', '2026-07-01', '2026-07-06'),
    ])
    const b = assignTracks([
      ev('y', '2026-07-01', '2026-07-06'),
      ev('x', '2026-07-05', '2026-07-08'),
    ])
    expect(trackOf(a, 'x')).toBe(trackOf(b, 'x'))
    expect(trackOf(a, 'y')).toBe(trackOf(b, 'y'))
  })

  it('uses no more tracks than there are events sharing a day', () => {
    const r = assignTracks([
      ev('a', '2026-07-01', '2026-07-10'),
      ev('b', '2026-07-02', '2026-07-04'),
      ev('c', '2026-07-06', '2026-07-08'), // b has ended, so c may reuse b's track
    ])
    expect(Math.max(...r.map((x) => x.track))).toBe(1)
    expect(trackOf(r, 'b')).toBe(trackOf(r, 'c'))
  })

  it('treats a single-day event with no end time as one day long', () => {
    const r = assignTracks([ev('a', '2026-07-14')])
    expect(r[0].start.getTime()).toBe(r[0].end.getTime())
  })
})

describe('segmentsForDay', () => {
  const weekStart = day('2026-07-12') // Sunday
  const weekEnd = day('2026-07-18') // Saturday
  const ranges = assignTracks([ev('trip', '2026-07-14', '2026-07-16')])

  it('shows nothing on a day the event does not cover', () => {
    expect(segmentsForDay(day('2026-07-13'), ranges, weekStart, weekEnd).size).toBe(0)
    expect(segmentsForDay(day('2026-07-17'), ranges, weekStart, weekEnd).size).toBe(0)
  })

  it('marks the first day as the start, and titles it', () => {
    const seg = segmentsForDay(day('2026-07-14'), ranges, weekStart, weekEnd).get(0)!
    expect(seg.isStart).toBe(true)
    expect(seg.isEnd).toBe(false)
    expect(seg.showTitle).toBe(true)
  })

  it('marks the middle day as neither end, and does not repeat the title', () => {
    const seg = segmentsForDay(day('2026-07-15'), ranges, weekStart, weekEnd).get(0)!
    expect(seg.isStart).toBe(false)
    expect(seg.isEnd).toBe(false)
    expect(seg.showTitle).toBe(false)
  })

  it('marks the last day as the end', () => {
    const seg = segmentsForDay(day('2026-07-16'), ranges, weekStart, weekEnd).get(0)!
    expect(seg.isEnd).toBe(true)
    expect(seg.isStart).toBe(false)
  })

  // A trip crossing Saturday into Sunday is drawn as two bars, one per week
  // row. Each row needs a rounded left edge and its own copy of the title,
  // otherwise the second row is an anonymous stripe.
  it('restarts the bar and the title on the first day of a new week', () => {
    const crossing = assignTracks([ev('long', '2026-07-16', '2026-07-21')])
    const nextWeekStart = day('2026-07-19')
    const nextWeekEnd = day('2026-07-25')

    const sat = segmentsForDay(day('2026-07-18'), crossing, weekStart, weekEnd).get(0)!
    expect(sat.isEnd, 'the bar should close at the end of the week').toBe(true)
    expect(sat.showTitle).toBe(false)

    const sun = segmentsForDay(day('2026-07-19'), crossing, nextWeekStart, nextWeekEnd).get(0)!
    expect(sun.isStart, 'the bar should reopen on the new row').toBe(true)
    expect(sun.showTitle, 'the new row needs its own title').toBe(true)
    expect(sun.isEnd).toBe(false)
  })

  it('returns one segment per track when events overlap', () => {
    const two = assignTracks([
      ev('a', '2026-07-14', '2026-07-16'),
      ev('b', '2026-07-15', '2026-07-17'),
    ])
    const segs = segmentsForDay(day('2026-07-15'), two, weekStart, weekEnd)
    expect(segs.size).toBe(2)
    expect([...segs.keys()].sort()).toEqual([0, 1])
  })
})
