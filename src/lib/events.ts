import { supabase } from './supabase'
import { diveOutingFromDestinations, type DiveOuting } from './event-colors'

// Public, read-only view of the shared event catalog (EO_dives + EO_courses),
// adapted from app-fundivers/src/lib/events.ts but trimmed to what a marketing
// calendar needs: title, date span, starting price, and full/cancelled flags.

export type UpcomingEvent = {
  id: string
  type: 'dive' | 'course'
  title: string
  startDate: string // 'YYYY-MM-DD'
  endDate: string | null
  time: string | null // 'HH:mm'
  startingAt: number | null // TWD
  fullyBooked: boolean
  featured: boolean
}

type DiveRow = {
  _id: string
  display_title: string | null
  admin_title: string | null
  start_date: string | null
  end_date: string | null
  time: string | null
  price: string | null
  fully_booked: boolean | null
  featured: boolean | null
}

type CourseRow = {
  _id: string
  display_title: string | null
  admin_title: string | null
  start_time: string | null
  price: string | null
  course_days: string[] | null
  fully_booked: boolean | null
}

type PriceRow = { _id: string; starting_at: number | null }

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

async function fetchPrices(ids: Array<string | null>): Promise<Map<string, number | null>> {
  const priceIds = [...new Set(ids.filter((x): x is string => !!x))]
  if (!priceIds.length) return new Map()
  const { data } = await supabase
    .from('EO_prices')
    .select('_id, starting_at')
    .in('_id', priceIds)
  return new Map((data ?? []).map((p: PriceRow) => [p._id, p.starting_at]))
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
      .from('EO_dives')
      .select('_id, display_title, admin_title, start_date, end_date, time, price, fully_booked, featured')
      .is('cancelled_at', null)
      .eq('is_private', false)
      .gte('start_date', today)
      .order('start_date'),
    supabase
      .from('EO_courses')
      .select('_id, display_title, admin_title, start_time, price, course_days, fully_booked')
      .is('cancelled_at', null),
  ])

  const dives = (divesResp.data ?? []) as DiveRow[]
  const courses = (coursesResp.data ?? []) as CourseRow[]

  const prices = await fetchPrices([
    ...dives.map((d) => d.price),
    ...courses.map((c) => c.price),
  ])

  const events: UpcomingEvent[] = []

  for (const d of dives) {
    if (!d.start_date) continue
    events.push({
      id: d._id,
      type: 'dive',
      title: d.display_title || d.admin_title || 'Dive',
      startDate: d.start_date,
      endDate: d.end_date,
      time: toHhmm(d.time),
      startingAt: d.price ? prices.get(d.price) ?? null : null,
      fullyBooked: d.fully_booked ?? false,
      featured: d.featured ?? false,
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
      id: c._id,
      type: 'course',
      title: c.display_title || c.admin_title || 'Course',
      startDate: future[0],
      endDate: future[future.length - 1] !== future[0] ? future[future.length - 1] : null,
      time: toHhmm(c.start_time),
      startingAt: c.price ? prices.get(c.price) ?? null : null,
      fullyBooked: c.fully_booked ?? false,
      featured: false,
    })
  }

  return events.sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, limit)
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

/** ISO timestamp from an EO_* date ('YYYY-MM-DD') + time ('HH:MM:SS'). */
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

/** Classify each dive 'local'|'trip' from its linked destinations (best-effort). */
async function attachDiveOutings(diveIds: string[]): Promise<Map<string, DiveOuting>> {
  const out = new Map<string, DiveOuting>()
  if (!diveIds.length) return out
  const { data: links } = await supabase
    .from('eo_dive_destinations')
    .select('eo_dive_id, destination_id')
    .in('eo_dive_id', diveIds)
  if (!links?.length) return out

  const destIds = [...new Set(links.map((l) => l.destination_id))]
  const { data: dests } = await supabase
    .from('TravelDestinations')
    .select('_id, divetype, northeast_diving')
    .in('_id', destIds)
  const destById = new Map((dests ?? []).map((d) => [d._id, d]))

  const byDive = new Map<string, Array<{ divetype: string | null; northeast_diving: boolean | null }>>()
  for (const l of links) {
    const d = destById.get(l.destination_id)
    if (!d) continue
    const arr = byDive.get(l.eo_dive_id) ?? []
    arr.push({ divetype: d.divetype, northeast_diving: d.northeast_diving })
    byDive.set(l.eo_dive_id, arr)
  }
  for (const [id, ds] of byDive) {
    const o = diveOutingFromDestinations(ds)
    if (o) out.set(id, o)
  }
  return out
}

const DIVE_COLS =
  '_id, admin_title, display_title, calendar_title, start_date, time, end_date, featured, fully_booked, capacity, price, is_private, cancelled_at'
const COURSE_COLS =
  '_id, admin_title, display_title, calendar_title, start_time, price, course_days, cancelled_at, fully_booked, capacity'

type DiveRow2 = {
  _id: string
  admin_title: string | null
  display_title: string | null
  calendar_title: string | null
  start_date: string | null
  time: string | null
  end_date: string | null
  featured: boolean | null
  fully_booked: boolean | null
  capacity: number | null
  price: string | null
}
type CourseRow2 = {
  _id: string
  admin_title: string | null
  display_title: string | null
  calendar_title: string | null
  start_time: string | null
  price: string | null
  course_days: string[] | null
  fully_booked: boolean | null
  capacity: number | null
}

function diveToCalEvent(d: DiveRow2, prices: Map<string, number | null>, outing: DiveOuting | null): CalEvent | null {
  const start = toIso(d.start_date, d.time)
  if (!start) return null
  return {
    id: d._id,
    type: 'dive',
    title: d.display_title || d.admin_title || 'Dive',
    calendar_title: d.calendar_title ?? null,
    course_category: null,
    start_time: start,
    end_time: toIso(d.end_date, d.time),
    start_time_hhmm: toHhmm(d.time),
    featured: d.featured ?? false,
    price: d.price ? prices.get(d.price) ?? null : null,
    currency: 'TWD',
    dive_outing: outing,
    fully_booked: d.fully_booked ?? false,
    capacity: d.capacity ?? null,
  }
}

function courseToCalEvents(c: CourseRow2, prices: Map<string, number | null>): CalEvent[] {
  const dayKeys = (c.course_days ?? []).map(toDateKey).filter((k): k is string => !!k)
  if (!dayKeys.length) return []
  const shared = {
    id: c._id,
    type: 'course' as const,
    title: c.display_title || c.admin_title || 'Course',
    calendar_title: c.calendar_title ?? null,
    course_category: c.admin_title ?? null,
    start_time_hhmm: toHhmm(c.start_time),
    featured: false,
    price: c.price ? prices.get(c.price) ?? null : null,
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
      .from('EO_dives')
      .select(DIVE_COLS)
      .is('cancelled_at', null)
      .eq('is_private', false)
      .gte('start_date', fromDate)
      .lte('start_date', toDate)
      .order('start_date'),
    supabase
      .from('EO_courses')
      .select(COURSE_COLS)
      .is('cancelled_at', null)
      .overlaps('course_days', datesInRange(fromDate, toDate)),
  ])

  const dives = (divesResp.data ?? []) as DiveRow2[]
  const courses = (coursesResp.data ?? []) as CourseRow2[]

  const [prices, outings] = await Promise.all([
    fetchPrices([...dives.map((d) => d.price), ...courses.map((c) => c.price)]),
    attachDiveOutings(dives.map((d) => d._id)),
  ])

  return [
    ...dives
      .map((d) => diveToCalEvent(d, prices, outings.get(d._id) ?? null))
      .filter((x): x is CalEvent => !!x),
    ...courses.flatMap((c) => courseToCalEvents(c, prices)),
  ].sort((a, b) => a.start_time.localeCompare(b.start_time))
}

// ── Per-event descriptive text (schedule, what's included, prereqs) ──────────
// Fetched on demand when an event is opened. Column set reflects the live prod
// schema (verified): courses carry included/schedule/req_dives/prereq_cert_id;
// dives carry notes + a DiveTravel_reference whose row holds included/itinerary/
// transportation/etc. (EO_dives has no schedule/included of its own).

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
    d.description || d.included || d.not_included || d.schedule ||
    d.transportation || d.prerequisites || d.required_cert || d.required_dives != null
  return has ? d : null
}

async function certName(id: string | null | undefined): Promise<string | null> {
  if (!id) return null
  const { data } = await supabase.from('cert_levels').select('name').eq('id', id).maybeSingle()
  return data?.name ?? null
}

/** Descriptive copy for a single event, or null when it has none. */
export async function fetchEventDetails(ev: CalEvent): Promise<EventDetails | null> {
  if (ev.type === 'course') {
    const { data } = await supabase
      .from('EO_courses')
      .select('included, schedule, req_dives, prereq_cert_id')
      .eq('_id', ev.id)
      .maybeSingle()
    if (!data) return null
    const reqRaw = data.req_dives != null ? Number(String(data.req_dives).trim()) : NaN
    return nonEmptyDetails({
      description: null,
      included: cleanText(data.included),
      not_included: null,
      schedule: cleanText(data.schedule),
      transportation: null,
      prerequisites: null,
      required_cert: await certName(data.prereq_cert_id),
      required_dives: Number.isFinite(reqRaw) ? reqRaw : null,
    })
  }

  const { data } = await supabase
    .from('EO_dives')
    .select('notes, req_dives, prereq_cert_id, DiveTravel_reference')
    .eq('_id', ev.id)
    .maybeSingle()
  if (!data) return null

  let travel: {
    included: string | null
    not_included: string | null
    transportation: string | null
    itinerary: string | null
    prerequisites: string | null
  } | null = null
  if (data.DiveTravel_reference) {
    const { data: t } = await supabase
      .from('DiveTravel')
      .select('included, not_included, transportation, itinerary, prerequisites')
      .eq('_id', data.DiveTravel_reference)
      .maybeSingle()
    travel = t
  }

  return nonEmptyDetails({
    description: cleanText(data.notes),
    included: cleanText(travel?.included),
    not_included: cleanText(travel?.not_included),
    schedule: cleanText(travel?.itinerary),
    transportation: cleanText(travel?.transportation),
    prerequisites: cleanText(travel?.prerequisites),
    required_cert: await certName(data.prereq_cert_id),
    required_dives: typeof data.req_dives === 'number' ? data.req_dives : null,
  })
}
