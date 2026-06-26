// Ported from app-fundivers/src/lib/event-colors.ts. Calendar color buckets.
//
//   Courses (by title):  ow → blue, aow → orange, rescue → red, specialty → purple
//   Dives (by location): trip → yellow (boat / beyond Keelung), local → green
export type CourseColor = 'ow' | 'aow' | 'rescue' | 'specialty'
export type DiveOuting = 'local' | 'trip'

/** Strip a trailing capacity hint, e.g. "Open Water Course (2 spots open)". */
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

/**
 * 'trip' (→ yellow) when ANY linked destination is a boat-diving site or sits
 * outside the Northeast coast; 'local' (→ green) when every destination is a
 * Northeast shore site; null when no destination is tagged (caller falls back
 * to title matching).
 */
export function diveOutingFromDestinations(
  dests: Array<{ divetype: string | null; northeast_diving: boolean | null }>,
): DiveOuting | null {
  if (!dests.length) return null
  const trip = dests.some((d) => d.divetype === 'Boat Diving' || d.northeast_diving !== true)
  return trip ? 'trip' : 'local'
}

const TRIP_TITLE_RE =
  /\bboat\b|green island|kenting|penghu|lambai|xiao\s?liuqiu|orchid island|anilao|palau|panglao|bohol|tubbataha|puerto galera/i

/** Final yellow/green decision: trust the tagged destination, else sniff the title. */
export function diveIsTripOrBoat(ev: { title: string; dive_outing: DiveOuting | null }): boolean {
  if (ev.dive_outing === 'trip') return true
  if (ev.dive_outing === 'local') return false
  return TRIP_TITLE_RE.test(ev.title)
}
