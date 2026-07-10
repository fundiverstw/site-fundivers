import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  EVENT_DIVE_COLS,
  EVENT_COURSE_COLS,
  EVENT_UPCOMING_DIVE_COLS,
  EVENT_UPCOMING_COURSE_COLS,
  EVENT_DETAIL_COLS,
  EVENT_TRIP_TITLE_COLS,
  PRICE_COLS,
  CERT_LEVEL_COLS,
  DESTINATION_COLS,
  FILTERED_COLUMNS,
} from '../src/engine/db-columns'

// The one thing every other test in this repository cannot check.
//
// The calendar, the prices and the travel covers come from a database owned by
// `app-fundivers`. The browser tests answer every query from a fake database, so
// a migration over there that renames `start_date` or drops `is_trip` leaves
// this whole suite green while the real calendar renders nothing.
//
// These tests talk to the real database, with the real read-only key, and run
// the real queries. They are deliberately NOT part of `npm run verify`: they
// need the network and they can fail for reasons that have nothing to do with
// the change you just made. Run them with `npm run test:contract`, and CI runs
// them on a schedule.
//
// They only ever read.

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const configured = Boolean(url && key)

let db: SupabaseClient

beforeAll(() => {
  if (configured) db = createClient(url, key, { auth: { persistSession: false } })
})

describe.skipIf(!configured)('the live database still has what the site reads', () => {
  // Every select the site issues. If a column has been renamed or dropped,
  // PostgREST answers 42703 and the test names the column.
  const selects: Array<[string, string]> = [
    ['events (calendar, dives)', EVENT_DIVE_COLS],
    ['events (calendar, courses)', EVENT_COURSE_COLS],
    ['events (homepage, dives)', EVENT_UPCOMING_DIVE_COLS],
    ['events (homepage, courses)', EVENT_UPCOMING_COURSE_COLS],
    ['events (modal details)', EVENT_DETAIL_COLS],
    ['events (trip titles)', EVENT_TRIP_TITLE_COLS],
  ]

  it.each(selects)('%s', async (_name, cols) => {
    const { error } = await db.from('events').select(cols).limit(1)
    expect(error?.message ?? null, `selecting "${cols}"`).toBeNull()
  })

  it('prices', async () => {
    const { error } = await db.from('prices').select(PRICE_COLS).limit(1)
    expect(error?.message ?? null).toBeNull()
  })

  it('cert_levels', async () => {
    const { error } = await db.from('cert_levels').select(CERT_LEVEL_COLS).limit(1)
    expect(error?.message ?? null).toBeNull()
  })

  it('travel_destinations', async () => {
    const { error } = await db.from('travel_destinations').select(DESTINATION_COLS).limit(1)
    expect(error?.message ?? null).toBeNull()
  })
})

describe.skipIf(!configured)('the columns the site filters and sorts on', () => {
  // A column can still exist and stop being usable in a filter — revoked from
  // the anon role, say, or retyped. Ordering by it is the cheapest probe.
  const cases = Object.entries(FILTERED_COLUMNS).flatMap(([table, cols]) =>
    cols.map((col) => [table, col] as [string, string]),
  )

  it.each(cases)('%s.%s can be sorted on', async (table, column) => {
    const { error } = await db.from(table).select(column).order(column).limit(1)
    expect(error?.message ?? null, `${table}.${column}`).toBeNull()
  })
})

describe.skipIf(!configured)('the queries the site actually runs', () => {
  it('fetches upcoming dives the way the homepage does', async () => {
    const today = new Date().toISOString().slice(0, 10)
    const { error } = await db
      .from('events')
      .select(EVENT_UPCOMING_DIVE_COLS)
      .eq('kind', 'dive')
      .is('cancelled_at', null)
      .eq('is_private', false)
      .gte('start_date', today)
      .order('start_date')
      .limit(1)
    expect(error?.message ?? null).toBeNull()
  })

  it('fetches courses by overlapping day, the way the calendar does', async () => {
    const today = new Date().toISOString().slice(0, 10)
    const { error } = await db
      .from('events')
      .select(EVENT_COURSE_COLS)
      .eq('kind', 'course')
      .is('cancelled_at', null)
      .overlaps('course_days', [today])
      .limit(1)
    expect(error?.message ?? null).toBeNull()
  })

  // events.price is a uuid into `prices`. If that relationship stops resolving,
  // every price on the site silently disappears and the pages still render.
  it('resolves an event price through the prices table', async () => {
    const { data: events, error } = await db
      .from('events')
      .select('id, price')
      .not('price', 'is', null)
      .limit(1)
    expect(error?.message ?? null).toBeNull()

    if (!events?.length) {
      // Nothing priced right now. Not a failure of the schema.
      return
    }
    const { data: price, error: priceError } = await db
      .from('prices')
      .select(PRICE_COLS)
      .eq('id', events[0].price)
      .maybeSingle()

    expect(priceError?.message ?? null).toBeNull()
    expect(price, `events.price ${events[0].price} has no row in prices`).not.toBeNull()
    expect(typeof price!.starting_at === 'number' || price!.starting_at === null).toBe(true)
  })
})

// Two things this file deliberately does NOT test.
//
// Whether the anon key can WRITE. You cannot find out from a client without
// trying it: when row-level security denies a DELETE, Postgres removes zero
// rows and reports no error — exactly what a permitted DELETE that matched
// nothing looks like. Telling them apart means aiming a real statement at a
// real row, which a test suite must not do to a production database.
//
// Whether the anon key can read the shop's customers. It cannot today
// (profiles, package_registrations, scheduled_trip_registrations,
// waiver_signatures and event_waivers all return nothing), but those tables
// belong to `app-fundivers` and that is where the row-level-security policies
// live and where they should be tested. Asserting other people's table names
// from here would rot the first time one is renamed, and would pass silently
// when it did.
