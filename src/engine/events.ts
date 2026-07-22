import { supabase } from './supabase'
import {
  EVENT_DIVE_COLS,
  EVENT_COURSE_COLS,
  EVENT_UPCOMING_DIVE_COLS,
  EVENT_UPCOMING_COURSE_COLS,
  EVENT_DETAIL_COLS,
  EVENT_TRIP_TITLE_COLS,
  PRICE_COLS,
  CERT_LEVEL_COLS,
} from './db-columns'
import { type DiveOuting } from './event-colors'
import { eventImage } from './photo-pool'
import type { ResponsiveImage } from './responsive-image'

// Public, read-only view of the shared event catalog. The app consolidated the
// old EO_dives + EO_courses Wix-sync tables into a single `events` table keyed
// on `id` and discriminated by `kind` ('dive' | 'course'); descriptive copy
// (included / schedule / prereqs) is now inline on the row rather than joined
// from DiveTravel. Trimmed to what a marketing calendar needs: title, date
// span, starting price, and full/cancelled flags.

export type UpcomingEvent = {
  id: string
  type: 'dive' | 'course'
  isTrip: boolean // a dive flagged is_trip — a multi-day / away outing, not a local fun dive
  title: string
  category: string | null // admin_title short code (e.g. 'OW', 'AOW') — course-page matching
  startDate: string // 'YYYY-MM-DD'
  endDate: string | null
  time: string | null // 'HH:mm'
  startingAt: number | null // TWD
  fullyBooked: boolean
  featured: boolean
  description: string | null // short blurb for cards (dive notes / course schedule)
  image: ResponsiveImage | null // resolved cover photo, in its several sizes
}

type DiveRow = {
  id: string
  display_title: string | null
  admin_title: string | null
  start_date: string | null
  end_date: string | null
  start_time: string | null
  price: string | null
  fully_booked: boolean | null
  featured: boolean | null
  notes: string | null
  is_trip: boolean | null
}

type CourseRow = {
  id: string
  display_title: string | null
  admin_title: string | null
  start_time: string | null
  price: string | null
  course_days: string[] | null
  fully_booked: boolean | null
  schedule: string | null
}

type PriceRow = { id: string; starting_at: number | null }

/** Today in the shop's timezone (Asia/Taipei), as 'YYYY-MM-DD'. */
function todayKey(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })
}

/** Normalize a PostgREST time string ('HH:MM:SS' / 'HH:MM') to 'HH:mm'. */
function toHhmm(raw: string | null | undefined): string | null {
  if (!raw) return null
  const m = /^(\d{1,2}):(\d{2})/.exec(raw.trim())
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null
}

// Starting prices live in the shared `prices` table (anon-readable), referenced
// by `events.price` (a uuid). The inline `events.starting_at` column is not
// populated, so we always resolve through the price row.
async function fetchPrices(ids: Array<string | null>): Promise<Map<string, number | null>> {
  const priceIds = [...new Set(ids.filter((x): x is string => !!x))]
  if (!priceIds.length) return new Map()
  const { data } = await supabase.from('prices').select(PRICE_COLS).in('id', priceIds)
  return new Map((data ?? []).map((p: PriceRow) => [p.id, p.starting_at]))
}

/**
 * Upcoming dives (non-private, non-cancelled, starting today or later) plus
 * courses with at least one remaining session day, merged and sorted by date.
 * Limited to a reasonable horizon for the public calendar.
 */
export async function fetchUpcomingEvents(limit = 60): Promise<UpcomingEvent[]> {
  const today = todayKey()

  const [divesResp, coursesResp] = await Promise.all([
    supabase
      .from('events')
      .select(EVENT_UPCOMING_DIVE_COLS)
      .eq('kind', 'dive')
      .is('cancelled_at', null)
      .eq('is_private', false)
      .gte('start_date', today)
      .order('start_date'),
    supabase
      .from('events')
      .select(EVENT_UPCOMING_COURSE_COLS)
      .eq('kind', 'course')
      .is('cancelled_at', null),
  ])

  const dives = (divesResp.data ?? []) as DiveRow[]
  const courses = (coursesResp.data ?? []) as CourseRow[]

  const prices = await fetchPrices([...dives.map((d) => d.price), ...courses.map((c) => c.price)])

  const events: UpcomingEvent[] = []

  for (const d of dives) {
    if (!d.start_date) continue
    events.push({
      id: d.id,
      type: 'dive',
      isTrip: d.is_trip ?? false,
      title: d.display_title || d.admin_title || 'Dive',
      category: d.admin_title,
      startDate: d.start_date,
      endDate: d.end_date,
      time: toHhmm(d.start_time),
      startingAt: d.price ? (prices.get(d.price) ?? null) : null,
      fullyBooked: d.fully_booked ?? false,
      featured: d.featured ?? false,
      description: d.notes && d.notes.trim() ? d.notes.trim() : null,
      image: eventImage({ id: d.id, type: 'dive', title: d.display_title || d.admin_title || '' }),
    })
  }

  for (const c of courses) {
    // A course runs on an explicit list of days; surface it on its next
    // upcoming day. Courses entirely in the past are dropped.
    const future = (c.course_days ?? [])
      .map((s) => s?.slice(0, 10))
      .filter((k): k is string => !!k && k >= today)
      .sort()
    if (!future.length) continue
    events.push({
      id: c.id,
      type: 'course',
      isTrip: false,
      title: c.display_title || c.admin_title || 'Course',
      category: c.admin_title,
      startDate: future[0],
      endDate: future[future.length - 1] !== future[0] ? future[future.length - 1] : null,
      time: toHhmm(c.start_time),
      startingAt: c.price ? (prices.get(c.price) ?? null) : null,
      fullyBooked: c.fully_booked ?? false,
      featured: false,
      description: c.schedule && c.schedule.trim() ? c.schedule.trim() : null,
      image: eventImage({
        id: c.id,
        type: 'course',
        title: c.display_title || c.admin_title || '',
      }),
    })
  }

  return events.sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, limit)
}

/**
 * Titles of upcoming trip dives (is_trip = true, non-cancelled, non-private,
 * today or later). Used by the Travel page to show only the "Around Taiwan"
 * destinations that actually have a trip on the books. Titles are free text
 * (e.g. "Seven Star in Kenting", "Lambai", "Penghu (2 spots open)"), so callers
 * keyword-match them against known destinations.
 */
export async function fetchUpcomingTripTitles(): Promise<string[]> {
  const today = todayKey()
  const { data } = await supabase
    .from('events')
    .select(EVENT_TRIP_TITLE_COLS)
    .eq('kind', 'dive')
    .eq('is_trip', true)
    .is('cancelled_at', null)
    .eq('is_private', false)
    .gte('start_date', today)
  return (data ?? [])
    .map(
      (r: { display_title: string | null; admin_title: string | null }) =>
        r.display_title || r.admin_title || '',
    )
    .filter((s) => s.length > 0)
}

// ── Full month-grid calendar (ported & trimmed from app-fundivers) ──────────
// Richer event shape the MonthCalendar needs: ISO span, color classification,
// calendar title, featured flag. No booking/auth — this is read-only.

export type CalEvent = {
  id: string
  type: 'dive' | 'course'
  title: string
  calendar_title: string | null
  course_category: string | null
  start_time: string // ISO
  end_time: string | null
  start_time_hhmm: string | null
  featured: boolean
  price: number | null
  currency: 'TWD'
  dive_outing: DiveOuting | null
  fully_booked: boolean
  capacity: number | null
}

/** True when an event's last day is before today in Asia/Taipei. */
export function isPastEvent(
  ev: { start_time: string; end_time: string | null },
  now: Date = new Date(),
): boolean {
  const dayKey = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })
  return dayKey(ev.end_time ?? ev.start_time) < dayKey(now)
}

/** ISO timestamp from an event date ('YYYY-MM-DD') + time ('HH:MM:SS'). */
function toIso(date: string | null | undefined, time: string | null | undefined): string | null {
  if (!date) return null
  const t = time && time.trim() ? time.trim() : '00:00:00'
  return new Date(`${date}T${t}`).toISOString()
}

function toDateKey(raw: string | null | undefined): string | null {
  if (!raw) return null
  const s = String(raw).trim()
  return s ? s.slice(0, 10) : null
}

function dayDiff(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

/** Group sorted day keys into runs of consecutive calendar days. */
function groupConsecutive(dayKeys: string[]): [string, string][] {
  const sorted = [...new Set(dayKeys)].sort()
  const runs: [string, string][] = []
  for (const key of sorted) {
    const last = runs[runs.length - 1]
    if (last && dayDiff(last[1], key) === 1) last[1] = key
    else runs.push([key, key])
  }
  return runs
}

/** Every 'YYYY-MM-DD' from fromDate to toDate inclusive. */
function datesInRange(fromDate: string, toDate: string): string[] {
  const out: string[] = []
  const end = new Date(toDate + 'T00:00:00Z')
  for (let d = new Date(fromDate + 'T00:00:00Z'); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

// Dive/course share the `events` table. `is_trip`/`is_boat_dive` (populated,
// NOT NULL) replace the old destination-join heuristic that read the now-dropped
// travel_destinations.northeast_diving flag: a boat dive or an out-of-town trip
// colors yellow; otherwise leave null so diveIsTripOrBoat() can title-sniff.

type DiveRow2 = {
  id: string
  admin_title: string | null
  display_title: string | null
  calendar_title: string | null
  start_date: string | null
  start_time: string | null
  end_date: string | null
  featured: boolean | null
  fully_booked: boolean | null
  capacity: number | null
  price: string | null
  is_trip: boolean | null
  is_boat_dive: boolean | null
}
type CourseRow2 = {
  id: string
  admin_title: string | null
  display_title: string | null
  calendar_title: string | null
  start_time: string | null
  price: string | null
  course_days: string[] | null
  fully_booked: boolean | null
  capacity: number | null
}

function diveToCalEvent(d: DiveRow2, prices: Map<string, number | null>): CalEvent | null {
  const start = toIso(d.start_date, d.start_time)
  if (!start) return null
  return {
    id: d.id,
    type: 'dive',
    title: d.display_title || d.admin_title || 'Dive',
    calendar_title: d.calendar_title ?? null,
    course_category: null,
    start_time: start,
    end_time: toIso(d.end_date, d.start_time),
    start_time_hhmm: toHhmm(d.start_time),
    featured: d.featured ?? false,
    price: d.price ? (prices.get(d.price) ?? null) : null,
    currency: 'TWD',
    dive_outing: d.is_trip || d.is_boat_dive ? 'trip' : null,
    fully_booked: d.fully_booked ?? false,
    capacity: d.capacity ?? null,
  }
}

function courseToCalEvents(c: CourseRow2, prices: Map<string, number | null>): CalEvent[] {
  const dayKeys = (c.course_days ?? []).map(toDateKey).filter((k): k is string => !!k)
  if (!dayKeys.length) return []
  const shared = {
    id: c.id,
    type: 'course' as const,
    title: c.display_title || c.admin_title || 'Course',
    calendar_title: c.calendar_title ?? null,
    course_category: c.admin_title ?? null,
    start_time_hhmm: toHhmm(c.start_time),
    featured: false,
    price: c.price ? (prices.get(c.price) ?? null) : null,
    currency: 'TWD' as const,
    dive_outing: null,
    fully_booked: c.fully_booked ?? false,
    capacity: c.capacity ?? null,
  }
  return groupConsecutive(dayKeys)
    .map(([from, to]): CalEvent | null => {
      const start = toIso(from, c.start_time)
      if (!start) return null
      return { ...shared, start_time: start, end_time: toIso(to, c.start_time) }
    })
    .filter((x): x is CalEvent => !!x)
}

/**
 * Dives whose start_date is within [fromDate, toDate] plus courses with any
 * session day in the window. Non-private, non-cancelled. Returns CalEvent[]
 * sorted by start. Widen the range ±7 days at the call site so bars crossing
 * the month boundary render continuously.
 */
export async function fetchEventsInRange(fromDate: string, toDate: string): Promise<CalEvent[]> {
  const [divesResp, coursesResp] = await Promise.all([
    supabase
      .from('events')
      .select(EVENT_DIVE_COLS)
      .eq('kind', 'dive')
      .is('cancelled_at', null)
      .eq('is_private', false)
      .gte('start_date', fromDate)
      .lte('start_date', toDate)
      .order('start_date'),
    supabase
      .from('events')
      .select(EVENT_COURSE_COLS)
      .eq('kind', 'course')
      .is('cancelled_at', null)
      .overlaps('course_days', datesInRange(fromDate, toDate)),
  ])

  const dives = (divesResp.data ?? []) as DiveRow2[]
  const courses = (coursesResp.data ?? []) as CourseRow2[]

  const prices = await fetchPrices([...dives.map((d) => d.price), ...courses.map((c) => c.price)])

  return [
    ...dives.map((d) => diveToCalEvent(d, prices)).filter((x): x is CalEvent => !!x),
    ...courses.flatMap((c) => courseToCalEvents(c, prices)),
  ].sort((a, b) => a.start_time.localeCompare(b.start_time))
}

// ── Per-event descriptive text (schedule, what's included, prereqs) ──────────
// Fetched on demand when an event is opened. The consolidated `events` table
// carries the copy inline (notes / included / schedule / prereqs / req_dives /
// prereq_cert_id) for both dives and courses — the old EO_dives→DiveTravel join
// is gone, so `not_included` and `transportation` no longer have a source.

// Normalized shape the shared EventModal renders — both the calendar
// (CalEvent) and the homepage (UpcomingEvent) map into this.
export type ModalEvent = {
  id: string
  type: 'dive' | 'course'
  title: string
  spanLabel: string
  price: number | null
  currency: string
  fullyBooked: boolean
}

export type EventDetails = {
  description: string | null
  included: string | null
  not_included: string | null
  schedule: string | null
  transportation: string | null
  prerequisites: string | null
  required_cert: string | null
  required_dives: number | null
}

function cleanText(s: string | null | undefined): string | null {
  return s && s.trim() ? s.trim() : null
}

function nonEmptyDetails(d: EventDetails): EventDetails | null {
  const has =
    d.description ||
    d.included ||
    d.not_included ||
    d.schedule ||
    d.transportation ||
    d.prerequisites ||
    d.required_cert ||
    d.required_dives != null
  return has ? d : null
}

async function certName(id: string | null | undefined): Promise<string | null> {
  if (!id) return null
  const { data } = await supabase
    .from('cert_levels')
    .select(CERT_LEVEL_COLS)
    .eq('id', id)
    .maybeSingle()
  return data?.name ?? null
}

/** Descriptive copy for a single event, or null when it has none. */
export async function fetchEventDetails(
  ev: Pick<CalEvent, 'id' | 'type'>,
): Promise<EventDetails | null> {
  const { data } = await supabase
    .from('events')
    .select(EVENT_DETAIL_COLS)
    .eq('id', ev.id)
    .maybeSingle()
  if (!data) return null

  return nonEmptyDetails({
    description: cleanText(data.notes),
    included: cleanText(data.included),
    not_included: null,
    schedule: cleanText(data.schedule),
    transportation: null,
    prerequisites: cleanText(data.prereqs),
    required_cert: await certName(data.prereq_cert_id),
    required_dives: typeof data.req_dives === 'number' ? data.req_dives : null,
  })
}
