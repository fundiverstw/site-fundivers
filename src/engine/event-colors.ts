// Ported from app-fundivers/src/lib/event-colors.ts. Calendar color buckets.
//
//   Courses (by title):  ow → blue, aow → orange, rescue → red, specialty → purple
//   Dives (by location): trip → yellow (boat / beyond Keelung), local → green
export type CourseColor = 'ow' | 'aow' | 'rescue' | 'specialty'
export type DiveOuting = 'local' | 'trip'

/** Strip a trailing capacity hint, e.g. "Open Water Course (2 spots open)".
 *  Only courseColor() calls this; it is exported so the tests can pin it. */
export function stripTitleSuffix(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

export function courseColor(title: string): CourseColor {
  const base = stripTitleSuffix(title).toLowerCase()
  if (base.startsWith('advanced open water')) return 'aow'
  if (base.startsWith('open water')) return 'ow'
  if (/rescue|efr|emergency first response|o2 provider|oxygen provider/.test(base)) return 'rescue'
  return 'specialty'
}

// Dive 'outing' classification now comes straight off the event row's
// is_trip/is_boat_dive flags (see events.ts) — the old destination-join
// heuristic that read travel_destinations.northeast_diving was removed when that
// column was dropped upstream. diveIsTripOrBoat() still title-sniffs as a
// fallback when the row leaves the outing null.

const TRIP_TITLE_RE =
  /\bboat\b|green island|kenting|penghu|lambai|xiao\s?liuqiu|orchid island|anilao|palau|panglao|bohol|tubbataha|puerto galera/i

/** Final yellow/green decision: trust the tagged destination, else sniff the title. */
export function diveIsTripOrBoat(ev: { title: string; dive_outing: DiveOuting | null }): boolean {
  if (ev.dive_outing === 'trip') return true
  if (ev.dive_outing === 'local') return false
  return TRIP_TITLE_RE.test(ev.title)
}
