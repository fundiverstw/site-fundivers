// A few rows shaped exactly like the booking app's `events` and `prices` tables,
// so the browser tests can exercise the calendar with something in it.
//
// Dates are built relative to today: the calendar page opens on the current
// month, so a fixture pinned to a hard-coded date would stop appearing the
// moment the month rolled over.

export type Row = Record<string, unknown>

/** 'YYYY-MM-DD' for the nth day of the month we are currently in. */
export function dayOfThisMonth(n: number, now = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth(), n)
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const PRICE_DIVE = '00000000-0000-0000-0000-0000000000d1'
export const PRICE_COURSE = '00000000-0000-0000-0000-0000000000c1'

export const FUN_DIVE = 'Bat Cave fun dive'
export const TRIP = 'Green Island weekend'
export const COURSE = 'PADI Open Water Course'

/** Every column DIVE_COLS / COURSE_COLS ask for, plus the ones the filters use. */
const base = { cancelled_at: null, is_private: false }

export function eventsFixture(now = new Date()): Row[] {
  return [
    {
      ...base,
      id: 'dive-1',
      kind: 'dive',
      admin_title: 'FUN',
      display_title: FUN_DIVE,
      calendar_title: FUN_DIVE,
      start_date: dayOfThisMonth(10, now),
      start_time: '08:30:00',
      end_date: dayOfThisMonth(10, now),
      featured: true,
      fully_booked: false,
      capacity: 8,
      price: PRICE_DIVE,
      is_trip: false,
      is_boat_dive: false,
    },
    {
      // Multi-day, fully booked, and a trip — three different code paths.
      ...base,
      id: 'dive-2',
      kind: 'dive',
      admin_title: 'TRIP',
      display_title: TRIP,
      calendar_title: TRIP,
      start_date: dayOfThisMonth(14, now),
      start_time: '06:00:00',
      end_date: dayOfThisMonth(16, now),
      featured: false,
      fully_booked: true,
      capacity: 12,
      price: null,
      is_trip: true,
      is_boat_dive: true,
    },
    {
      // A course is stored as a list of days, not a start/end pair.
      ...base,
      id: 'course-1',
      kind: 'course',
      admin_title: 'ow',
      display_title: COURSE,
      calendar_title: COURSE,
      start_time: '09:00:00',
      price: PRICE_COURSE,
      course_days: [dayOfThisMonth(20, now), dayOfThisMonth(21, now)],
      fully_booked: false,
      capacity: 4,
    },
  ]
}

/** `events.price` is a uuid into this table; the price is never inline. */
export const pricesFixture: Row[] = [
  { id: PRICE_DIVE, starting_at: 2800 },
  { id: PRICE_COURSE, starting_at: 15400 },
]

/** The cards print prices through twd(); the modal prints the currency code. */
export const DIVE_PRICE_CARD = 'NT$2,800'
export const DIVE_PRICE_MODAL = 'TWD 2,800'
