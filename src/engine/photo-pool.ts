// Picks which photo each card on the site shows. The photos themselves live in
// src/content/photos/, in three folders:
//
//   photos/dive-sites/<dive-site-id>/   one or more photos of that dive site
//   photos/general/                     fallback dive shots (unmatched / trips)
//   photos/courses/<course-route-id>/   photos of that specific course type
//
// Course photos are grouped by course: `photos/courses/<id>/` (the id is
// courseId(slug) from content/courses.ts) holds shots of that course, so a
// course's detail page draws from its own folder. Any loose photo left directly
// under photos/courses/ joins a shared course pool used as the fallback when a
// course's own folder is empty (and for the mixed calendar, which isn't tied to
// one course).
//
// Drop more photos into any folder and they're picked up automatically (the
// glob runs at build time — no manifest to edit, no duplicated files). Used two
// ways: `siteImage(id)` gives a dive site its cover (Sites / Travel / detail
// pages); `eventImage(ev)` gives an event card a photo — a dive matches its site
// by title keyword and gets a random photo (repeats minimised on screen);
// courses draw from the course pool.

import { EVENT_TITLE_MATCHERS } from '$content/dive-sites'
import type { ResponsiveImage } from './responsive-image'

// Only the card-pool folders — the gallery and media folders live alongside
// these under photos/ but are catalogued elsewhere, so they are not scanned in.
// The extensions are spelled as case-insensitive character classes ([jJ][pP][gG]
// …) on purpose: a camera or phone that writes `.JPG` (or a stray `.Jpeg`) must
// still be picked up. A plain `{jpg,…}` is case-sensitive, so an uppercase file
// silently vanishes from the pool with no error — a dive site just quietly shows
// fewer photos. (HEIC is deliberately not listed: sharp can't decode it on every
// machine, so those files are converted to .jpg at rest instead.)
const files = import.meta.glob(
  '../content/photos/{dive-sites,courses,general}/**/*.{[wW][eE][bB][pP],[aA][vV][iI][fF],[jJ][pP][gG],[jJ][pP][eE][gG],[pP][nN][gG]}',
  {
    eager: true,
    query: '?responsive',
    import: 'default',
  },
) as Record<string, ResponsiveImage>

const sitePools: Record<string, ResponsiveImage[]> = {}
const generalPool: ResponsiveImage[] = []
// Per-course pools keyed by course route id (the folder name under courses/),
// plus every course photo in one pool for the fallback / mixed-calendar case.
const coursePools: Record<string, ResponsiveImage[]> = {}
const coursePoolAll: ResponsiveImage[] = []

for (const [path, image] of Object.entries(files)) {
  if (path.includes('/general/')) generalPool.push(image)
  else if (path.includes('/courses/')) {
    coursePoolAll.push(image)
    // A photo inside courses/<id>/ also joins that course's own pool; one left
    // loose directly under courses/ has no subfolder and stays fallback-only.
    const m = path.match(/\/courses\/([^/]+)\//)
    if (m) (coursePools[m[1]] ??= []).push(image)
  } else {
    const m = path.match(/\/dive-sites\/([^/]+)\//)
    if (m) (sitePools[m[1]] ??= []).push(image)
  }
}
// Stable order so a "cover" (first photo) doesn't change between builds.
for (const k of Object.keys(sitePools)) sitePools[k].sort((a, b) => a.src.localeCompare(b.src))
for (const k of Object.keys(coursePools)) coursePools[k].sort((a, b) => a.src.localeCompare(b.src))
coursePoolAll.sort((a, b) => a.src.localeCompare(b.src))

/** A dive site's cover photo (first in its folder), or null if it has none. */
export function siteImage(siteId: string): ResponsiveImage | null {
  const pool = sitePools[siteId]
  return pool && pool.length ? pool[0] : null
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
