// The dive-site catalog — the list behind the /sites and /map pages, assembled
// from the folders beside this file.
//
// One folder per dive site. The folder name is the site id: it is the address —
// `/bat-cave`, at the root of the site — the key the write-up is found by, and
// the name of its photos/ folder. To add a site, copy a folder —
// there is no list to keep in step, and nothing to renumber.
//
// The row and the write-up are read by two separate barrels on purpose. /sites
// and /map render names on a list and must not download every write-up in three
// languages to do it, so the write-ups live in ./details.ts, which only
// DiveSiteDetail imports.
//
// The data used to come from the shared Supabase `dive_sites` table, but the app
// team dropped that table, so the rows were recovered verbatim from
// app-fundivers' pre-drop migrations and bundled here.

import type { DiveSite, DiveSiteFile, DiveSitesText, Region, SiteText } from './types'
import { REGION_META, MAP_REGION_TEXT, REGIONS_JA, REGIONS_ZH_TW } from './regions'

export { REGION_META, MAP_REGION_TEXT } from './regions'
export type {
  DiveSite,
  DiveSiteFile,
  SiteText,
  MapRegionText,
  DiveSitesText,
  Region,
  TaiwanRegion,
  InternationalRegion,
  DiveSiteDetails,
  DiveSiteDetailsText,
  DiveSiteDetailsFile,
} from './types'

const siteFiles = import.meta.glob('./*/site.ts', { eager: true }) as Record<
  string,
  { site: DiveSiteFile }
>

const loaded = Object.entries(siteFiles)
  .map(([path, mod]) => ({ id: path.split('/')[1], ...mod.site }))
  .sort((a, b) => a.name.localeCompare(b.name))

// The translations are stripped here so a component cannot read one without
// going through $engine/i18n-content, which is what applies the fallbacks.
export const DIVE_SITES: DiveSite[] = loaded.map(({ ja: _ja, 'zh-TW': _zh, ...site }) => site)

// English text in the DiveSitesText shape — the fallback every locale falls back
// to, and the yardstick the overlay parity test measures against. Assembled from
// the folders so a new site or region can never be forgotten here.
export const DIVE_SITES_TEXT_EN: DiveSitesText = {
  regions: Object.fromEntries(
    (Object.keys(REGION_META) as Region[]).map((r) => [r, REGION_META[r].label]),
  ) as Record<Region, string>,
  mapRegions: MAP_REGION_TEXT,
  sites: Object.fromEntries(loaded.map((s) => [s.id, { name: s.name, tagline: s.tagline ?? '' }])),
}

const siteTextFor = (locale: 'ja' | 'zh-TW'): Record<string, SiteText> =>
  Object.fromEntries(loaded.map((s) => [s.id, s[locale]]))

export const diveSitesJa: DiveSitesText = { ...REGIONS_JA, sites: siteTextFor('ja') }
export const diveSitesZhTW: DiveSitesText = { ...REGIONS_ZH_TW, sites: siteTextFor('zh-TW') }

// Async to preserve the call sites (Map/Sites await it) even though the data is
// now local and needs no round-trip.
export async function fetchDiveSites(): Promise<DiveSite[]> {
  return [...DIVE_SITES].sort((a, b) => a.name.localeCompare(b.name))
}

/** A single dive site by its id (which is its address), or null. */
export function diveSiteById(id: string): DiveSite | null {
  return DIVE_SITES.find((s) => s.id === id) ?? null
}

/** Path to a dive site's dedicated detail page. */
export function diveSitePath(site: Pick<DiveSite, 'id'>): string {
  return `/${site.id}`
}

// Which dive site is a calendar event about?
//
// A trip on the calendar is just a title like "Fun Dive — Bat Cave". To give its
// card the right photo we match that title against the patterns below and use the
// matching site's photos. Ordered most-specific first, so "Iron House 2" wins over
// the general "Iron House / Iron Reef". A title that matches nothing (Yehliu,
// Milky Sea…) just gets a general dive photo, which is fine.
//
// This stays a single ordered list rather than a `match:` field in each folder,
// because the order between sites is the whole point — it cannot be expressed one
// folder at a time.
//
// `/bat\s*cave/i` means "bat, then any spaces, then cave; upper or lower case".
export const EVENT_TITLE_MATCHERS: Array<{ id: string; re: RegExp }> = [
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
