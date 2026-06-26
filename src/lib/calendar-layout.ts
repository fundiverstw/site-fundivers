import { isAfter, isSameDay, startOfDay } from 'date-fns'

// Ported from app-fundivers/src/lib/calendar-layout.ts. Pure track-allocation
// helpers for laying multi-day event bars into stacked rows within day cells.

export interface LayoutEvent {
  id: string
  start_time: string
  end_time: string | null
}

export interface EventRange<T extends LayoutEvent = LayoutEvent> {
  event: T
  start: Date
  end: Date
  /** 0-based vertical track the bar occupies within each day cell. */
  track: number
}

export interface CellSegment<T extends LayoutEvent = LayoutEvent> {
  event: T
  track: number
  /** This cell is the left edge of the bar (event start, or first day of the week). */
  isStart: boolean
  /** This cell is the right edge (event end, or last day of the week). */
  isEnd: boolean
  /** True only on the cell that renders the title (event start, or start of each week it spans). */
  showTitle: boolean
}

/**
 * Assign each event to the lowest track that doesn't overlap any prior event.
 * Sorted ascending by start (ties → longer duration first, so the longer bar
 * gets the lower track).
 */
export function assignTracks<T extends LayoutEvent>(events: T[]): EventRange<T>[] {
  const ranges: EventRange<T>[] = events.map((event) => ({
    event,
    start: startOfDay(new Date(event.start_time)),
    end: startOfDay(new Date(event.end_time ?? event.start_time)),
    track: 0,
  }))
  ranges.sort((a, b) => {
    const s = a.start.getTime() - b.start.getTime()
    if (s !== 0) return s
    return b.end.getTime() - b.start.getTime() - (a.end.getTime() - a.start.getTime())
  })

  const trackEnds: Date[] = []
  for (const r of ranges) {
    let t = 0
    while (t < trackEnds.length && !isAfter(r.start, trackEnds[t])) t++
    r.track = t
    trackEnds[t] = r.end
  }
  return ranges
}

/**
 * For a given day, return a map track → segment, including only tracks that
 * have an event on this day. `weekStart`/`weekEnd` decide where the bar
 * "resets" (rounded edge + title re-shown on the first cell of each week it spans).
 */
export function segmentsForDay<T extends LayoutEvent>(
  day: Date,
  ranges: EventRange<T>[],
  weekStart: Date,
  weekEnd: Date,
): Map<number, CellSegment<T>> {
  const out = new Map<number, CellSegment<T>>()
  const d = startOfDay(day)
  for (const r of ranges) {
    if (d < r.start || d > r.end) continue
    const isEventStart = isSameDay(d, r.start)
    const isEventEnd = isSameDay(d, r.end)
    const isWeekStart = isSameDay(d, weekStart)
    const isWeekEnd = isSameDay(d, weekEnd)
    out.set(r.track, {
      event: r.event,
      track: r.track,
      isStart: isEventStart || isWeekStart,
      isEnd: isEventEnd || isWeekEnd,
      showTitle: isEventStart || isWeekStart,
    })
  }
  return out
}
