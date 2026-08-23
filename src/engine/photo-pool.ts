// Picks which photo each card on the site shows. The photos live with the thing
// they are photos of:
//
//   content/dive-sites/<site-id>/photos/   one or more photos of that dive site
//   content/courses/<course-id>/photos/    photos of that specific course type
//   content/photos/hikes/<hike-id>/        photos of that hike (see content/hikes.ts)
//   content/photos/general/                fallback dive shots (unmatched / trips)
//   content/photos/cycling/youbike.jpg     the one bike-tour photo, imported by name
//
// So a dive site's folder holds its row, its write-up and its pictures, and
// deleting the folder deletes all three. Every course photo also joins one shared
// pool, used when a course has no folder of its own and for the mixed calendar,
// which is not tied to a single course.
//
// Drop more photos into any folder and they're picked up automatically (the
// glob runs at build time — no manifest to edit, no duplicated files). Used two
// ways: `siteImage(id)` / `courseImage(id)` give a dive site or a course its
// cover (Sites / Courses / Travel / detail pages); `eventImage(ev)` gives an
// event card a photo — a dive matches its site by title keyword and gets a
// random photo (repeats minimised on screen); courses draw from the course pool.

import { EVENT_TITLE_MATCHERS } from '$content/dive-sites'
import { HIKES } from '$content/hikes'
import youbikeCover from '$content/photos/cycling/youbike.jpg?responsive'
import type { ResponsiveImage } from './responsive-image'

// Only the card-pool folders. The gallery under content/photos/ is catalogued
// elsewhere, so it is not scanned in; nor are the `.ts` files
// sitting beside the photos in a site or course folder.
// The extensions are spelled as case-insensitive character classes ([jJ][pP][gG]
// …) on purpose: a camera or phone that writes `.JPG` (or a stray `.Jpeg`) must
// still be picked up. A plain `{jpg,…}` is case-sensitive, so an uppercase file
// silently vanishes from the pool with no error — a dive site just quietly shows
// fewer photos. (HEIC is deliberately not listed: sharp can't decode it on every
// machine, so those files are converted to .jpg at rest instead.)
// Two globs rather than one, and the extension list is spelled out in both:
// Vite reads these patterns statically at build time, so neither the pattern nor
// the extensions can be lifted into a constant. A pattern built from a variable
// silently matches nothing.
const files = {
  ...(import.meta.glob(
    '../content/{dive-sites,courses}/*/photos/**/*.{[wW][eE][bB][pP],[aA][vV][iI][fF],[jJ][pP][gG],[jJ][pP][eE][gG],[pP][nN][gG]}',
    { eager: true, query: '?responsive', import: 'default' },
  ) as Record<string, ResponsiveImage>),
  ...(import.meta.glob(
    '../content/photos/{general,hikes}/**/*.{[wW][eE][bB][pP],[aA][vV][iI][fF],[jJ][pP][gG],[jJ][pP][eE][gG],[pP][nN][gG]}',
    { eager: true, query: '?responsive', import: 'default' },
  ) as Record<string, ResponsiveImage>),
}

const sitePools: Record<string, ResponsiveImage[]> = {}
const generalPool: ResponsiveImage[] = []
// Per-course pools keyed by course id (the folder the photos sit in), plus every
// course photo in one pool for the fallback / mixed-calendar case.
const coursePools: Record<string, ResponsiveImage[]> = {}
const coursePoolAll: ResponsiveImage[] = []
// Per-hike pools keyed by hike id (the folder name under hikes/).
const hikePools: Record<string, ResponsiveImage[]> = {}

// Sorted by the path on disk, so a pool is in the order the folder reads and the
// first photo — the cover — is the first filename alphabetically. It has to be
// the path and not `image.src`: a built photo's URL is a content hash with the
// filename nowhere in it, so sorting on that would pick a cover nobody chose,
// and a different one in `vite dev` than in the build.
for (const [path, image] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  if (path.includes('/general/')) generalPool.push(image)
  else if (path.includes('/courses/')) {
    coursePoolAll.push(image)
    const m = path.match(/\/courses\/([^/]+)\/photos\//)
    if (m) (coursePools[m[1]] ??= []).push(image)
  } else if (path.includes('/hikes/')) {
    const m = path.match(/\/hikes\/([^/]+)\//)
    if (m) (hikePools[m[1]] ??= []).push(image)
  } else {
    const m = path.match(/\/dive-sites\/([^/]+)\/photos\//)
    if (m) (sitePools[m[1]] ??= []).push(image)
  }
}

/** A dive site's cover photo (first in its folder), or null if it has none. */
export function siteImage(siteId: string): ResponsiveImage | null {
  const pool = sitePools[siteId]
  return pool && pool.length ? pool[0] : null
}

/** A course's cover photo (first in its `photos/` folder), or null if it has
 *  none. What the /courses tile and the top of the detail page show, unless the
 *  course pins its own in `card.ts`. */
export function courseImage(courseId: string): ResponsiveImage | null {
  const pool = coursePools[courseId]
  return pool && pool.length ? pool[0] : null
}

/** A hike's cover photo (first in its folder), or null if it has none. */
export function hikeImage(hikeId: string): ResponsiveImage | null {
  const pool = hikePools[hikeId]
  return pool && pool.length ? pool[0] : null
}

/** The cover photo for an adventure event (kind='adventure' — e.g. the YouBike
 *  tours or a guided hike). Matches the event to a hike by its admin_title slug
 *  (`eventSlug`) or its name in the title → that hike's photo; otherwise the
 *  cycling cover for bike tours; otherwise a general dive shot so no card is
 *  ever blank. */
export function adventureImage(ev: {
  title: string
  category: string | null
}): ResponsiveImage | null {
  const slug = (ev.category ?? '').toLowerCase()
  const title = ev.title.toLowerCase()
  const hike = HIKES.find(
    (h) => h.eventSlug.toLowerCase() === slug || title.includes(h.name.toLowerCase()),
  )
  if (hike) {
    const img = hikeImage(hike.id)
    if (img) return img
  }
  if (/youbike|bike|cycl/.test(title) || /youbike|bike|cycl/.test(slug)) return youbikeCover
  return generalPool.length ? generalPool[0] : null
}

/** The dive site a calendar-event title refers to, or null if none matches.
 *  Exported so the tests can pin the ordering of EVENT_TITLE_MATCHERS: the
 *  specific patterns must be tried before the general ones. */
export function siteIdForTitle(title: string): string | null {
  for (const m of EVENT_TITLE_MATCHERS) if (m.re.test(title)) return m.id
  return null
}

// Least-used picker: choose from the least-shown photos in a pool, breaking ties
// at random, so repeats are spread out across everything on screen. Assignments
// are memoized per event id so re-renders keep the same photo (no flicker).
const usedCount = new Map<string, number>()
const assigned = new Map<string, ResponsiveImage>()

function pick(pool: ResponsiveImage[]): ResponsiveImage | null {
  if (!pool.length) return null
  // Counted by `src`, not by object identity: the same photo can reach two
  // pools as two glob entries, and counting the objects would let it show up
  // twice on one screen while the tally said each had been used once.
  let min = Infinity
  for (const p of pool) min = Math.min(min, usedCount.get(p.src) ?? 0)
  const candidates = pool.filter((p) => (usedCount.get(p.src) ?? 0) === min)
  const choice = candidates[Math.floor(Math.random() * candidates.length)]
  usedCount.set(choice.src, (usedCount.get(choice.src) ?? 0) + 1)
  return choice
}

/**
 * A pool photo for an event, or null if the pool is empty (→ "Image coming
 * soon" placeholder). Dives resolve to their dive site's photos (else general);
 * courses draw from the course folder.
 */
export function eventImage(ev: {
  id: string
  type: 'dive' | 'course'
  title: string
}): ResponsiveImage | null {
  const cached = assigned.get(ev.id)
  if (cached) return cached

  let pool: ResponsiveImage[]
  if (ev.type === 'course') {
    // The calendar mixes every course, so it draws from all course photos (not
    // one course's folder), falling back to general shots if there are none.
    pool = coursePoolAll.length ? coursePoolAll : generalPool
  } else {
    const site = siteIdForTitle(ev.title)
    const sitePool = (site && sitePools[site]) || []
    // A well-stocked site (2+ photos) shows only its own; a site with just its
    // seed cover also draws from the general pool so its cards still vary.
    pool = sitePool.length >= 2 ? sitePool : [...sitePool, ...generalPool]
  }

  const image = pick(pool)
  if (image) assigned.set(ev.id, image)
  return image
}

/** A photo for a course that hasn't pinned its own (keyed + memoized so it stays
 *  stable across re-renders). Prefers the course's own folder
 *  (photos/courses/<courseId>/); falls back to the shared course pool, then the
 *  general pool, when that folder is empty. Used to fill the staggered detail
 *  page. `seed` keeps repeat calls for the same course distinct. */
export function coursePoolImage(courseId: string, seed: string): ResponsiveImage | null {
  const key = `course-pool:${courseId}:${seed}`
  const cached = assigned.get(key)
  if (cached) return cached
  const own = coursePools[courseId] ?? []
  const pool = own.length ? own : coursePoolAll.length ? coursePoolAll : generalPool
  const image = pick(pool)
  if (image) assigned.set(key, image)
  return image
}

/** A general dive photo for anything without its own image (keyed + memoized so
 *  it stays stable across re-renders). Used so no card ever shows a placeholder. */
export function fallbackImage(seed: string): ResponsiveImage | null {
  const key = `fb:${seed}`
  const cached = assigned.get(key)
  if (cached) return cached
  const image = pick(generalPool)
  if (image) assigned.set(key, image)
  return image
}
