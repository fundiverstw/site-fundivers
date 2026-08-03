import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { FakeDb, FakeOptions } from './__fixtures__/fake-supabase'

// The public read of the shared event catalog. Everything here is mapping and
// filtering over rows the booking app owns, and none of it ran under the unit
// suite before: the browser tests drive the calendar, but they stub the database
// at the network boundary and seed it with three rows, so whole shapes — an
// adventure, a course whose days are not consecutive, an event with no
// descriptive copy — were never exercised anywhere.
//
// The rows below are shaped like the real table (see src/engine/db-columns.ts
// for the column lists). The fake client applies the query filters for real, so
// a test that expects a dive back is also asserting that the dive query did not
// quietly fetch the courses too.

const { state } = vi.hoisted(() => ({
  state: { db: {} as FakeDb, options: {} as FakeOptions },
}))

vi.mock('./supabase', async () => {
  const { createFakeSupabase } = await import('./__fixtures__/fake-supabase')
  return {
    supabase: createFakeSupabase(
      () => state.db,
      () => state.options,
    ),
  }
})

const {
  fetchUpcomingEvents,
  fetchUpcomingTripTitles,
  fetchEventsInRange,
  fetchEventDetails,
  isPastEvent,
} = await import('./events')

// Midday in Taipei, so that "today" is the same calendar day whether the code
// asks in UTC or in Asia/Taipei. A time near midnight would make the expected
// values depend on which zone won, which is a property worth testing on purpose
// (see the timezone test at the bottom) but not worth smearing over every case.
const NOW = new Date('2026-06-15T04:00:00Z')
const TODAY = '2026-06-15'

/** Every column the queries filter on, so a row is never dropped by accident. */
const base = { cancelled_at: null, is_private: false }

const dive = (over: Record<string, unknown> = {}) => ({
  ...base,
  kind: 'dive',
  id: 'd1',
  display_title: 'Bat Cave fun dive',
  admin_title: 'FUN',
  calendar_title: 'Bat Cave',
  start_date: '2026-06-20',
  end_date: '2026-06-20',
  start_time: '08:30:00',
  price: null,
  fully_booked: false,
  featured: false,
  notes: null,
  is_trip: false,
  is_boat_dive: false,
  capacity: 8,
  ...over,
})

const course = (over: Record<string, unknown> = {}) => ({
  ...base,
  kind: 'course',
  id: 'c1',
  display_title: 'PADI Open Water',
  admin_title: 'OW',
  calendar_title: 'OW',
  start_time: '09:00:00',
  price: null,
  course_days: ['2026-06-20', '2026-06-21'],
  fully_booked: false,
  schedule: null,
  capacity: 4,
  ...over,
})

const adventure = (over: Record<string, unknown> = {}) => ({
  ...base,
  kind: 'adventure',
  id: 'a1',
  display_title: 'YouBike river tour',
  admin_title: 'BIKE',
  calendar_title: 'YouBike',
  start_date: '2026-06-22',
  end_date: '2026-06-22',
  start_time: '14:00:00',
  price: null,
  fully_booked: false,
  featured: false,
  notes: null,
  capacity: 10,
  ...over,
})

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
  state.db = {}
  state.options = {}
})

afterEach(() => {
  vi.useRealTimers()
})

describe('fetchUpcomingEvents', () => {
  it('returns dives, courses and adventures together, sorted by start date', async () => {
    state.db = {
      events: [
        adventure({ id: 'a1', start_date: '2026-06-22' }),
        dive({ id: 'd1', start_date: '2026-06-20' }),
        course({ id: 'c1', course_days: ['2026-06-18'] }),
      ],
    }

    const events = await fetchUpcomingEvents()

    expect(events.map((e) => [e.id, e.type, e.startDate])).toEqual([
      ['c1', 'course', '2026-06-18'],
      ['d1', 'dive', '2026-06-20'],
      ['a1', 'adventure', '2026-06-22'],
    ])
  })

  it('leaves out cancelled, private and past events', async () => {
    state.db = {
      events: [
        dive({ id: 'keep', start_date: '2026-06-20' }),
        dive({ id: 'cancelled', cancelled_at: '2026-06-01T00:00:00Z' }),
        dive({ id: 'private', is_private: true }),
        dive({ id: 'yesterday', start_date: '2026-06-14' }),
      ],
    }

    const events = await fetchUpcomingEvents()

    expect(events.map((e) => e.id)).toEqual(['keep'])
  })

  it('keeps an event starting today', async () => {
    state.db = { events: [dive({ id: 'today', start_date: TODAY })] }

    expect((await fetchUpcomingEvents()).map((e) => e.id)).toEqual(['today'])
  })

  it('falls back from display_title to admin_title, then to a generic label', async () => {
    state.db = {
      events: [
        dive({ id: 'a', display_title: null, admin_title: 'FUN', start_date: '2026-06-20' }),
        dive({ id: 'b', display_title: null, admin_title: null, start_date: '2026-06-21' }),
      ],
    }

    expect((await fetchUpcomingEvents()).map((e) => e.title)).toEqual(['FUN', 'Dive'])
  })

  it.each([
    ['08:30:00', '08:30'],
    ['9:05:00', '09:05'],
    ['14:00', '14:00'],
    ['  07:15:00  ', '07:15'],
    [null, null],
    ['', null],
    ['not a time', null],
  ])('normalizes the start time %j to %j', async (raw, expected) => {
    state.db = { events: [dive({ start_time: raw })] }

    expect((await fetchUpcomingEvents())[0].time).toBe(expected)
  })

  it('resolves the starting price through the prices table', async () => {
    state.db = {
      events: [dive({ id: 'priced', price: 'price-1' }), dive({ id: 'free', price: null })],
      prices: [{ id: 'price-1', starting_at: 3200 }],
    }

    const byId = Object.fromEntries((await fetchUpcomingEvents()).map((e) => [e.id, e.startingAt]))
    expect(byId).toEqual({ priced: 3200, free: null })
  })

  it('reports no price when the referenced price row is missing', async () => {
    state.db = { events: [dive({ price: 'gone' })], prices: [] }

    expect((await fetchUpcomingEvents())[0].startingAt).toBeNull()
  })

  it('surfaces a course on its next remaining day, not its first', async () => {
    state.db = {
      events: [course({ course_days: ['2026-06-01', '2026-06-20', '2026-06-27'] })],
    }

    const [ev] = await fetchUpcomingEvents()
    expect(ev.startDate).toBe('2026-06-20')
    expect(ev.endDate).toBe('2026-06-27')
  })

  it('gives a one-day course no end date', async () => {
    state.db = { events: [course({ course_days: ['2026-06-20'] })] }

    expect((await fetchUpcomingEvents())[0].endDate).toBeNull()
  })

  it('drops a course whose every day has passed', async () => {
    state.db = { events: [course({ course_days: ['2026-05-01', '2026-05-02'] })] }

    expect(await fetchUpcomingEvents()).toEqual([])
  })

  it('drops a course with no days at all', async () => {
    state.db = { events: [course({ course_days: null })] }

    expect(await fetchUpcomingEvents()).toEqual([])
  })

  it('treats blank notes as no description', async () => {
    state.db = {
      events: [
        dive({ id: 'blank', notes: '   ', start_date: '2026-06-20' }),
        dive({ id: 'text', notes: '  Bring a torch.  ', start_date: '2026-06-21' }),
      ],
    }

    const byId = Object.fromEntries((await fetchUpcomingEvents()).map((e) => [e.id, e.description]))
    expect(byId).toEqual({ blank: null, text: 'Bring a torch.' })
  })

  it('carries the trip, fully-booked and featured flags through', async () => {
    state.db = {
      events: [dive({ is_trip: true, fully_booked: true, featured: true, admin_title: 'TRIP' })],
    }

    const [ev] = await fetchUpcomingEvents()
    expect(ev).toMatchObject({
      isTrip: true,
      fullyBooked: true,
      featured: true,
      category: 'TRIP',
    })
  })

  it('defaults the flags to false when the row leaves them null', async () => {
    state.db = {
      events: [dive({ is_trip: null, fully_booked: null, featured: null })],
    }

    expect(await fetchUpcomingEvents()).toMatchObject([
      { isTrip: false, fullyBooked: false, featured: false },
    ])
  })

  it('never marks a course as a trip', async () => {
    state.db = { events: [course()] }

    expect((await fetchUpcomingEvents())[0].isTrip).toBe(false)
  })

  it('applies the limit after sorting, so the soonest events survive', async () => {
    state.db = {
      events: [
        dive({ id: 'third', start_date: '2026-07-03' }),
        dive({ id: 'first', start_date: '2026-06-20' }),
        dive({ id: 'second', start_date: '2026-06-25' }),
      ],
    }

    expect((await fetchUpcomingEvents(2)).map((e) => e.id)).toEqual(['first', 'second'])
  })

  it('returns nothing when the catalog is empty', async () => {
    expect(await fetchUpcomingEvents()).toEqual([])
  })

  it('resolves a cover photo, or null, but never a broken one', async () => {
    state.db = { events: [dive(), course({ id: 'c9' }), adventure({ id: 'a9' })] }

    for (const ev of await fetchUpcomingEvents()) {
      if (ev.image === null) continue
      expect(typeof ev.image.src).toBe('string')
      expect(ev.image.srcset).toContain('w')
    }
  })
})

describe('fetchUpcomingTripTitles', () => {
  it('returns only upcoming, public, uncancelled trip dives', async () => {
    state.db = {
      events: [
        dive({ id: 't1', is_trip: true, display_title: 'Green Island weekend' }),
        dive({ id: 'not-a-trip', is_trip: false, display_title: 'Local fun dive' }),
        dive({ id: 'past', is_trip: true, start_date: '2026-01-01', display_title: 'Old trip' }),
        dive({ id: 'cancelled', is_trip: true, cancelled_at: 'x', display_title: 'Called off' }),
        dive({ id: 'private', is_trip: true, is_private: true, display_title: 'Charter' }),
        course({ id: 'course', course_days: ['2026-06-20'] }),
      ],
    }

    expect(await fetchUpcomingTripTitles()).toEqual(['Green Island weekend'])
  })

  it('falls back to the admin title and drops rows with neither', async () => {
    state.db = {
      events: [
        dive({ id: 'a', is_trip: true, display_title: null, admin_title: 'PENGHU' }),
        dive({ id: 'b', is_trip: true, display_title: null, admin_title: null }),
        dive({ id: 'c', is_trip: true, display_title: '', admin_title: '' }),
      ],
    }

    expect(await fetchUpcomingTripTitles()).toEqual(['PENGHU'])
  })
})

describe('fetchEventsInRange', () => {
  const RANGE: [string, string] = ['2026-06-01', '2026-06-30']

  it('keeps only dives whose start date falls inside the window', async () => {
    state.db = {
      events: [
        dive({ id: 'inside', start_date: '2026-06-10' }),
        dive({ id: 'before', start_date: '2026-05-31' }),
        dive({ id: 'after', start_date: '2026-07-01' }),
        dive({ id: 'first-day', start_date: '2026-06-01' }),
        dive({ id: 'last-day', start_date: '2026-06-30' }),
      ],
    }

    const ids = (await fetchEventsInRange(...RANGE)).map((e) => e.id)
    expect(ids.sort()).toEqual(['first-day', 'inside', 'last-day'])
  })

  it('splits a course into one bar per run of consecutive days', async () => {
    // Two weekends: the 6th–7th and the 13th–14th. Rendering that as a single
    // bar from the 6th to the 14th would claim the whole intervening week.
    state.db = {
      events: [
        course({
          course_days: ['2026-06-06', '2026-06-07', '2026-06-13', '2026-06-14'],
        }),
      ],
    }

    const events = await fetchEventsInRange(...RANGE)
    expect(events).toHaveLength(2)
    expect(events.map((e) => [localDay(e.start_time), localDay(e.end_time!)])).toEqual([
      ['2026-06-06', '2026-06-07'],
      ['2026-06-13', '2026-06-14'],
    ])
  })

  it('keeps a fully consecutive course as one bar', async () => {
    state.db = {
      events: [course({ course_days: ['2026-06-06', '2026-06-07', '2026-06-08'] })],
    }

    const events = await fetchEventsInRange(...RANGE)
    expect(events).toHaveLength(1)
    expect(localDay(events[0].end_time!)).toBe('2026-06-08')
  })

  it('sorts and de-duplicates a course whose days arrive out of order', async () => {
    state.db = {
      events: [course({ course_days: ['2026-06-08', '2026-06-06', '2026-06-07', '2026-06-06'] })],
    }

    const events = await fetchEventsInRange(...RANGE)
    expect(events).toHaveLength(1)
    expect([localDay(events[0].start_time), localDay(events[0].end_time!)]).toEqual([
      '2026-06-06',
      '2026-06-08',
    ])
  })

  it('cannot see course days stored as full timestamps', async () => {
    // Worth pinning because the mapping code looks like it handles this and
    // does not. `toDateKey` slices a value down to its first ten characters, so
    // a timestamp would map fine — but the row never gets that far. The query
    // selects courses with `.overlaps('course_days', datesInRange(from, to))`,
    // and PostgREST compares array elements exactly, so '2026-06-06T00:00:00Z'
    // does not overlap '2026-06-06' and the course is filtered out in the
    // database.
    //
    // In other words `course_days` must hold bare 'YYYY-MM-DD' keys, and that
    // is a constraint owned by app-fundivers' schema rather than by this repo.
    // If a migration ever widens the column to timestamps, this test fails and
    // says where to look — which is the query, not the mapping.
    state.db = {
      events: [course({ course_days: ['2026-06-06T00:00:00Z', '2026-06-07T00:00:00Z'] })],
    }

    expect(await fetchEventsInRange(...RANGE)).toEqual([])
  })

  it.each([
    [{ is_trip: true, is_boat_dive: false }, 'trip'],
    [{ is_trip: false, is_boat_dive: true }, 'trip'],
    [{ is_trip: true, is_boat_dive: true }, 'trip'],
    [{ is_trip: false, is_boat_dive: false }, null],
  ])('classifies %j as %j', async (flags, expected) => {
    state.db = { events: [dive({ ...flags, start_date: '2026-06-10' })] }

    expect((await fetchEventsInRange(...RANGE))[0].dive_outing).toBe(expected)
  })

  it('never classifies a course or an adventure as a trip', async () => {
    state.db = {
      events: [
        course({ course_days: ['2026-06-10'] }),
        adventure({ id: 'a1', start_date: '2026-06-11' }),
      ],
    }

    expect((await fetchEventsInRange(...RANGE)).map((e) => e.dive_outing)).toEqual([null, null])
  })

  it('sorts every kind together by start time', async () => {
    state.db = {
      events: [
        adventure({ id: 'a', start_date: '2026-06-25' }),
        dive({ id: 'd', start_date: '2026-06-05' }),
        course({ id: 'c', course_days: ['2026-06-15'] }),
      ],
    }

    expect((await fetchEventsInRange(...RANGE)).map((e) => e.id)).toEqual(['d', 'c', 'a'])
  })

  it('drops a dive with no start date rather than emitting an invalid span', async () => {
    state.db = { events: [dive({ start_date: null })] }

    expect(await fetchEventsInRange(...RANGE)).toEqual([])
  })

  it('gives an event with no time a midnight start', async () => {
    state.db = { events: [dive({ start_date: '2026-06-10', start_time: null })] }

    const [ev] = await fetchEventsInRange(...RANGE)
    expect(new Date(ev.start_time).getTime()).toBe(new Date('2026-06-10T00:00:00').getTime())
    expect(ev.start_time_hhmm).toBeNull()
  })

  it('carries the calendar title, capacity and price through', async () => {
    state.db = {
      events: [dive({ start_date: '2026-06-10', price: 'p1', capacity: 12 })],
      prices: [{ id: 'p1', starting_at: 2500 }],
    }

    expect((await fetchEventsInRange(...RANGE))[0]).toMatchObject({
      calendar_title: 'Bat Cave',
      capacity: 12,
      price: 2500,
      currency: 'TWD',
    })
  })

  it('records the course category but leaves it off dives', async () => {
    state.db = {
      events: [
        course({ course_days: ['2026-06-10'], admin_title: 'AOW' }),
        dive({ start_date: '2026-06-11', admin_title: 'FUN' }),
      ],
    }

    const byType = Object.fromEntries(
      (await fetchEventsInRange(...RANGE)).map((e) => [e.type, e.course_category]),
    )
    expect(byType).toEqual({ course: 'AOW', dive: null })
  })
})

describe('fetchEventDetails', () => {
  it('returns the descriptive copy, trimmed', async () => {
    state.db = {
      events: [
        {
          id: 'd1',
          notes: '  Two tanks, shore entry.  ',
          included: 'Tanks and weights',
          schedule: '08:00 meet',
          prereqs: 'Open Water',
          req_dives: 20,
          prereq_cert_id: null,
        },
      ],
    }

    expect(await fetchEventDetails({ id: 'd1', type: 'dive' })).toEqual({
      description: 'Two tanks, shore entry.',
      included: 'Tanks and weights',
      not_included: null,
      schedule: '08:00 meet',
      transportation: null,
      prerequisites: 'Open Water',
      required_cert: null,
      required_dives: 20,
    })
  })

  it('returns null when the event carries no copy at all', async () => {
    state.db = {
      events: [
        {
          id: 'd1',
          notes: null,
          included: '   ',
          schedule: '',
          prereqs: null,
          req_dives: null,
          prereq_cert_id: null,
        },
      ],
    }

    expect(await fetchEventDetails({ id: 'd1', type: 'dive' })).toBeNull()
  })

  it('counts a required dive count of zero as copy worth showing', async () => {
    // `0` is falsy, so a `||` check here would drop a genuine "0 dives
    // required" and render nothing.
    state.db = {
      events: [
        {
          id: 'd1',
          notes: null,
          included: null,
          schedule: null,
          prereqs: null,
          req_dives: 0,
          prereq_cert_id: null,
        },
      ],
    }

    expect(await fetchEventDetails({ id: 'd1', type: 'dive' })).toMatchObject({
      required_dives: 0,
    })
  })

  it('resolves the prerequisite certification to its name', async () => {
    state.db = {
      events: [
        {
          id: 'c1',
          notes: null,
          included: null,
          schedule: null,
          prereqs: null,
          req_dives: null,
          prereq_cert_id: 'cert-1',
        },
      ],
      cert_levels: [{ id: 'cert-1', name: 'Advanced Open Water' }],
    }

    expect(await fetchEventDetails({ id: 'c1', type: 'course' })).toMatchObject({
      required_cert: 'Advanced Open Water',
    })
  })

  it('survives a prerequisite certification that no longer exists', async () => {
    state.db = {
      events: [
        {
          id: 'c1',
          notes: 'Something to show',
          included: null,
          schedule: null,
          prereqs: null,
          req_dives: null,
          prereq_cert_id: 'missing',
        },
      ],
      cert_levels: [],
    }

    expect(await fetchEventDetails({ id: 'c1', type: 'course' })).toMatchObject({
      required_cert: null,
    })
  })

  it('ignores a non-numeric dive requirement', async () => {
    state.db = {
      events: [
        {
          id: 'd1',
          notes: 'Copy',
          included: null,
          schedule: null,
          prereqs: null,
          req_dives: 'twenty',
          prereq_cert_id: null,
        },
      ],
    }

    expect(await fetchEventDetails({ id: 'd1', type: 'dive' })).toMatchObject({
      required_dives: null,
    })
  })

  it('returns null when the event is not there', async () => {
    state.db = { events: [] }

    expect(await fetchEventDetails({ id: 'nope', type: 'dive' })).toBeNull()
  })
})

describe('isPastEvent', () => {
  it('judges a multi-day event by its last day, not its first', () => {
    const ev = { start_time: '2026-06-14T00:00:00Z', end_time: '2026-06-16T00:00:00Z' }

    expect(isPastEvent(ev, NOW)).toBe(false)
  })

  it('treats an event ending today as still current', () => {
    const ev = { start_time: '2026-06-15T01:00:00Z', end_time: '2026-06-15T09:00:00Z' }

    expect(isPastEvent(ev, NOW)).toBe(false)
  })

  it('treats an event that ended yesterday as past', () => {
    const ev = { start_time: '2026-06-14T01:00:00Z', end_time: '2026-06-14T09:00:00Z' }

    expect(isPastEvent(ev, NOW)).toBe(true)
  })

  it('falls back to the start when there is no end', () => {
    expect(isPastEvent({ start_time: '2026-06-14T01:00:00Z', end_time: null }, NOW)).toBe(true)
    expect(isPastEvent({ start_time: '2026-06-16T01:00:00Z', end_time: null }, NOW)).toBe(false)
  })

  it('uses Taipei time, not UTC, to decide what "today" means', () => {
    // 2026-06-15T20:00Z is already the 16th in Taipei (UTC+8). An event on the
    // 15th is therefore yesterday's, even though UTC still calls it today.
    const lateInTaipei = new Date('2026-06-15T20:00:00Z')

    expect(isPastEvent({ start_time: '2026-06-15T02:00:00Z', end_time: null }, lateInTaipei)).toBe(
      true,
    )
  })
})

/** The local calendar day of an ISO timestamp the app built from a date + time.
 *  `toIso` parses 'YYYY-MM-DDTHH:mm:ss' without a zone, which JavaScript reads
 *  as local time — so reading it back has to be local too, or the assertion
 *  would pass or fail depending on the machine's timezone. */
function localDay(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
