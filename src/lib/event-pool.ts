// Local photo pool for event cards. The app is phasing out per-event images, so
// the site assigns each event a photo from images it already bundles — no
// duplicate files. This is a manifest that references the photos in place under
// /imgs/media (and could point anywhere under /public/imgs), grouped by dive
// site, plus a general fallback and a course set.
//
// To give a site more variety, add image paths to its array; a dive event picks
// randomly from its site's list, minimizing repeats on screen. Add the file to
// public/imgs once and reference it here — don't copy it around.

const img = (slug: string) => `/imgs/media/${slug}.webp`

// One or more photos per dive site (keyed by the /sites/<id> id). Seeded with
// each site's own cover photo; append more paths for variety.
const SITE_PHOTOS: Record<string, string[]> = {
  'bat-cave': [img('b37fef_f6fcbc5a749741af99c3fef4b8ea7a9d_mv2_jpg')],
  'long-dong-bay': [img('b37fef_e2975ca5e18b4669a1f480a8c20ba872_mv2_jpg')],
  'secret-garden': [img('b37fef_1d51bc48dbe64b13974e2e42cc5a0eb0_mv2_jpg')],
  'canyons': [img('b37fef_d9cab6f1c752479098c35ed5d6901280_mv2_jpg')],
  '82-5': [img('b37fef_845ffda9d96b4f24bf1083f369cd850c_mv2_jpg')],
  'rainbow-reef': [img('b37fef_8b2bae6712a644cfa0464e7420bc3597_mv2_jpg')],
  'wan-an-jian-navy-wreck': [img('b37fef_e6233d5e9ab746e88cc2054e58642ec5_mv2_jpg')],
  'crystal-temple-wall': [img('b37fef_1d060fa54c0a447ebfedc5d6c34f78fc_mv2_jpg')],
  'iron-house-2': [img('b37fef_60ddb1f8b0a54547a9ce4b45f18c2715_mv2_png')],
  'shipwrecks': [img('b37fef_48516a4e92fa43398e849382d8ae002e_mv2_jpg')],
  'cathedral': [img('b37fef_757bf97dabf14263bb215a8b4f7848f8_mv2_jpg')],
  'turtle-island': [img('b37fef_08800163ce0a42eb9cecfbf26133c457_mv2_jpg')],
  'iron-house-iron-reef': [img('b37fef_2017559b29b447eea2e1fb906ace863f_mv2_jpg')],
  'cauliflower-garden': [img('b37fef_ff042e91927d4e8695e4cbd811fdc2a5_mv2_jpg')],
  'lambai-island': [img('b37fef_1bd8b45dfdd84c2092af24957897caf6_mv2_jpg')],
  'kenting': [img('b37fef_87e95d0417b44597b86897cf2825a07f_mv2_jpg')],
  'green-island': [img('b37fef_60f0aee8faef48e7bd0853c51f83f84a_mv2_jpg')],
  'penghu': [img('b37fef_c3c0324de5bb47b49843a8f63551b4e7_mv2_jpg')],
  'orchid-island': [img('b37fef_51df0bc6686a40829cad1eb790acb3cf_mv2_jpg')],
}

// Fallback dive shots for events whose spot isn't a catalog site (Yehliu, Milky
// Sea, Flower Wall, out-of-Taiwan trips…).
const GENERAL_PHOTOS: string[] = [
  img('b37fef_62e3ef3bf39c43189066945900e212ec_mv2_jpg'), // diver on the wall
  img('b37fef_336fa72d68ae4cd19dcf205ba6cc555a_mv2_jpg'), // divers in the blue
  img('b37fef_544484389a4b4ce4a8ceed361a49989b_mv2_jpg'), // diver + fish school
  img('b37fef_5a2fa90d23cb4698b2583e85cf67ff65_mv2_jpg'), // diver ascending
  img('b37fef_0dffada76b234b76b906813aa39bde86_mv2_jpg'), // divers at the surface
  img('b37fef_6cbdfe09ae2e41eb869ce0e29dcc21ce_mv2_jpg'), // school of fish
]

// Course-class photos for course events.
const COURSE_PHOTOS: string[] = [
  img('b37fef_9c73f7e0bb244570a119812991ef0ab9_mv2_jpg'),
  img('b37fef_357153d63c3245819d71d68d9d2f1790_mv2_jpg'),
  img('b37fef_2900ee49212d439c92922559b79ca105_mv2_jpg'),
  img('b37fef_46289275ed4042b19c10217d10672fc3_mv2_jpg'),
  img('b37fef_aa0190ec4359404db3362a851c7663bd_mv2_jpg'),
  img('b37fef_6bb10d67326442318a8a597b14c807c5_mv2_jpg'),
]

// Map an event title to a dive-site id. Ordered most-specific first so, e.g.,
// "Iron House 2" wins over the generic "Iron House / Iron Reef". Titles name
// spots that aren't all catalog sites (Yehliu, Milky Sea, Flower Wall…); those
// fall through to the general pool.
const SITE_MATCHERS: Array<{ id: string; re: RegExp }> = [
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
 * courses draw from the course set.
 */
export function eventImage(ev: { id: string; type: 'dive' | 'course'; title: string }): string | null {
  const cached = assigned.get(ev.id)
  if (cached) return cached

  let pool: string[]
  if (ev.type === 'course') {
    pool = COURSE_PHOTOS.length ? COURSE_PHOTOS : GENERAL_PHOTOS
  } else {
    const site = siteIdForTitle(ev.title)
    pool = site && SITE_PHOTOS[site]?.length ? SITE_PHOTOS[site] : GENERAL_PHOTOS
  }

  const url = pick(pool)
  if (url) assigned.set(ev.id, url)
  return url
}
