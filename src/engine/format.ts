import { format as dfFormat, isSameDay, parseISO } from 'date-fns'

// Display helpers shared across pages.

/**
 * Human date span for a calendar event (ISO start/end + optional HH:mm).
 * Ported from app-fundivers/src/lib/events.ts formatEventSpan.
 */
export function formatEventSpan(
  event: { start_time: string; end_time: string | null; start_time_hhmm: string | null },
  opts: { style?: 'long' | 'short' | 'compact'; withYear?: boolean } = {},
): string {
  const style = opts.style ?? 'short'
  const year = opts.withYear ? ' yyyy' : ''
  const start = parseISO(event.start_time)
  const end = event.end_time ? parseISO(event.end_time) : null
  const singleDay = !end || isSameDay(start, end)
  const startFmt = { long: 'EEEE, MMMM d', short: 'EEE, MMM d', compact: 'MMM d' }[style] + year
  const timeSuffix = event.start_time_hhmm ? ` · ${event.start_time_hhmm}` : ''
  if (singleDay) return dfFormat(start, startFmt) + timeSuffix
  const endFmt = { long: 'MMMM d', short: 'MMM d', compact: 'MMM d' }[style] + year
  return `${dfFormat(start, startFmt)}${timeSuffix} → ${dfFormat(end!, endFmt)}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Parse a 'YYYY-MM-DD' key into a local Date (no timezone drift). */
function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 'Sat, May 1' style, optionally a range and time. */
export function formatSpan(startKey: string, endKey: string | null, time: string | null): string {
  const start = fromKey(startKey)
  const head = `${WEEKDAYS[start.getDay()]}, ${MONTHS[start.getMonth()]} ${start.getDate()}`
  const timeSuffix = time ? ` · ${time}` : ''
  if (!endKey || endKey === startKey) return head + timeSuffix
  const end = fromKey(endKey)
  return `${head}${timeSuffix} → ${MONTHS[end.getMonth()]} ${end.getDate()}`
}

/**
 * A news article's date, written the way each language writes dates.
 *
 * '2026-06-14' → '14 June 2026' · '2026年6月14日' · '2026年6月14日'
 *
 * The other date helpers here spell the months out in English by hand, because
 * they render inside a calendar grid where every cell has to be the same width
 * and the English abbreviations are what the layout was measured against. A
 * news date sits in a sentence of running text instead, so it should follow the
 * reader's language — and `Intl` already knows how, for free, in the browser.
 *
 * The site's locale codes are BCP 47 tags already, so they pass straight
 * through. Parsed as UTC and formatted in UTC: these are plain calendar days
 * with no time in them, and reading one as local midnight would show the
 * previous day to anybody west of Taiwan.
 */
export function formatNewsDate(dateKey: string, locale: string): string {
  const date = new Date(`${dateKey}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return dateKey
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** TWD price, e.g. 15400 → 'NT$15,400'. */
export function twd(amount: number | null): string | null {
  if (amount == null) return null
  return `NT$${amount.toLocaleString('en-US')}`
}
