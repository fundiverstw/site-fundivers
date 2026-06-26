import { supabase } from './supabase'

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
      .select('_id, display_title, admin_title, start_date, end_date, time, price, fully_booked')
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
    })
  }

  return events.sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, limit)
}
