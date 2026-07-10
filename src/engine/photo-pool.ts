// Picks which photo each card on the site shows. The photos themselves live in
// src/content/photos/, in three folders:
//
//   photos/dive-sites/<dive-site-id>/   one or more photos of that dive site
//   photos/general/                     fallback dive shots (unmatched / trips)
//   photos/courses/                     course-class photos
//
// Drop more photos into any folder and they're picked up automatically (the
// glob runs at build time — no manifest to edit, no duplicated files). Used two
// ways: `siteImage(id)` gives a dive site its cover (Sites / Travel / detail
// pages); `eventImage(ev)` gives an event card a photo — a dive matches its site
// by title keyword and gets a random photo (repeats minimised on screen);
// courses draw from the course folder.

const files = import.meta.glob('../content/photos/**/*.{webp,avif,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const sitePools: Record<string, string[]> = {}
const generalPool: string[] = []
const coursePool: string[] = []

for (const [path, url] of Object.entries(files)) {
  if (path.includes('/general/')) generalPool.push(url)
  else if (path.includes('/courses/')) coursePool.push(url)
  else {
    const m = path.match(/\/dive-sites\/([^/]+)\//)
    if (m) (sitePools[m[1]] ??= []).push(url)
  }
}
// Stable order so a site's "cover" (first photo) doesn't change between builds.
for (const k of Object.keys(sitePools)) sitePools[k].sort()

/** A dive site's cover photo (first in its folder), or null if it has none. */
export function siteImage(siteId: string): string | null {
  const pool = sitePools[siteId]
  return pool && pool.length ? pool[0] : null
}

// Map an event title to a dive-site id. Ordered most-specific first so, e.g.,
// "Iron House 2" wins over the generic "Iron House / Iron Reef". Titles name
// spots that aren't all catalog sites (Yehliu, Milky Sea, Flower Wall…); those
// fall through to the general pool.
const SITE_MATCHERS: Array<{ id: string; re: RegExp }> = [
  { id: 'malapascua', re: /malapascua/i },
  { id: 'puerto-galera', re: /puerto\s*galera/i },
  { id: 'panglao-bohol', re: /panglao|bohol/i },
  { id: 'anilao', re: /anilao/i },
  { id: 'palau', re: /palau/i },
  { id: 'iron-house-2', re: /iron\s*(house|reef)\s*2/i },
  { id: 'rainbow-reef', re: /rainbow\s*reef/i },
  { id: 'crystal-temple-wall', re: /crystal\s*(temple|palace|wall)/i },
  { id: 'bat-cave', re: /bat\s*cave/i },
  { id: 'cauliflower-garden', re: /cauliflower/i },
  { id: 'secret-garden', re: /secret\s*garden/i },
  { id: 'turtle-island', re: /turtle\s*island/i },
  { id: 'cathedral', re: /cathedral/i },
  { id: 'canyons', re: /canyon/i },
  { id: 'long-dong-bay', re: /long\s*dong/i },
  { id: 'wan-an-jian-navy-wreck', re: /wan\s*an\s*jian|navy\s*wreck/i },
  { id: 'shipwrecks', re: /shipwreck|\bwrecks?\b/i },
  { id: 'iron-house-iron-reef', re: /iron\s*house|iron\s*reef/i },
  { id: '82-5', re: /\b82\.?5\b/i },
  { id: 'green-island', re: /green\s*island/i },
  { id: 'kenting', re: /kenting|seven\s*star/i },
  { id: 'penghu', re: /penghu/i },
  { id: 'lambai-island', re: /lambai|xiao\s*liuqiu|liuqiu/i },
  { id: 'orchid-island', re: /orchid\s*island|lanyu/i },
]

function siteIdForTitle(title: string): string | null {
  for (const m of SITE_MATCHERS) if (m.re.test(title)) return m.id
  return null
}

// Least-used picker: choose from the least-shown photos in a pool, breaking ties
// at random, so repeats are spread out across everything on screen. Assignments
// are memoized per event id so re-renders keep the same photo (no flicker).
const usedCount = new Map<string, number>()
const assigned = new Map<string, string>()

function pick(pool: string[]): string | null {
  if (!pool.length) return null
  let min = Infinity
  for (const p of pool) min = Math.min(min, usedCount.get(p) ?? 0)
  const candidates = pool.filter((p) => (usedCount.get(p) ?? 0) === min)
  const choice = candidates[Math.floor(Math.random() * candidates.length)]
  usedCount.set(choice, (usedCount.get(choice) ?? 0) + 1)
  return choice
}

/**
 * A pool photo for an event, or null if the pool is empty (→ "Image coming
 * soon" placeholder). Dives resolve to their dive site's photos (else general);
 * courses draw from the course folder.
 */
export function eventImage(ev: { id: string; type: 'dive' | 'course'; title: string }): string | null {
  const cached = assigned.get(ev.id)
  if (cached) return cached

  let pool: string[]
  if (ev.type === 'course') {
    pool = coursePool.length ? coursePool : generalPool
  } else {
    const site = siteIdForTitle(ev.title)
    const sitePool = (site && sitePools[site]) || []
    // A well-stocked site (2+ photos) shows only its own; a site with just its
    // seed cover also draws from the general pool so its cards still vary.
    pool = sitePool.length >= 2 ? sitePool : [...sitePool, ...generalPool]
  }

  const url = pick(pool)
  if (url) assigned.set(ev.id, url)
  return url
}

/** A general dive photo for anything without its own image (keyed + memoized so
 *  it stays stable across re-renders). Used so no card ever shows a placeholder. */
export function fallbackImage(seed: string): string | null {
  const key = `fb:${seed}`
  const cached = assigned.get(key)
  if (cached) return cached
  const url = pick(generalPool)
  if (url) assigned.set(key, url)
  return url
}
