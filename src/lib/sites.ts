import { DIVE_SITES } from './dive-sites.data'

// Dive sites are a static, bundled catalog (see dive-sites.data.ts) — the shared
// `dive_sites` Supabase table they used to come from was dropped upstream.

// Regions that sit on the Taiwan map (Map.svelte draws exactly these)…
export type TaiwanRegion =
  | 'keelung'
  | 'longdong'
  | 'yilan'
  | 'greenisland'
  | 'lanyu'
  | 'xiaoliuqiu'
  | 'kenting'
  | 'penghu'

// …and the overseas trip destinations, which never appear on it.
export type InternationalRegion =
  | 'malapascua'
  | 'puerto-galera'
  | 'panglao-bohol'
  | 'anilao'
  | 'palau'

export type Region = TaiwanRegion | InternationalRegion

export type DiveSite = {
  id: string
  name: string
  tagline: string | null
  latitude: number
  longitude: number
  region: Region
  dive_type: 'shore' | 'boat' | null
  wix_slug: string | null
  international?: boolean // outside Taiwan (trip destination), grouped separately
}

export type Area = 'North' | 'South' | 'Outlying Islands' | 'International'

// Display metadata for each region: a human label and a broad area grouping
// mirroring how fundiverstw.com frames Taiwan diving (North / South / Islands).
export const REGION_META: Record<Region, { label: string; area: Area }> = {
  keelung: { label: 'Keelung', area: 'North' },
  longdong: { label: 'Long Dong (Dragon Cave)', area: 'North' },
  yilan: { label: 'Yilan', area: 'North' },
  kenting: { label: 'Kenting', area: 'South' },
  greenisland: { label: 'Green Island', area: 'Outlying Islands' },
  lanyu: { label: 'Orchid Island (Lanyu)', area: 'Outlying Islands' },
  xiaoliuqiu: { label: 'Xiaoliuqiu', area: 'Outlying Islands' },
  penghu: { label: 'Penghu', area: 'Outlying Islands' },
  malapascua: { label: 'Malapascua, Philippines', area: 'International' },
  'puerto-galera': { label: 'Puerto Galera, Philippines', area: 'International' },
  'panglao-bohol': { label: 'Panglao, Bohol, Philippines', area: 'International' },
  anilao: { label: 'Anilao, Philippines', area: 'International' },
  palau: { label: 'Palau', area: 'International' },
}

export const AREA_ORDER: Area[] = ['North', 'South', 'Outlying Islands', 'International']

// Async to preserve the call sites (Map/Sites await it) even though the data is
// now local and needs no round-trip.
export async function fetchDiveSites(): Promise<DiveSite[]> {
  return [...DIVE_SITES].sort((a, b) => a.name.localeCompare(b.name))
}

/** A single dive site by its id (the /sites/<id> route param), or null. */
export function diveSiteById(id: string): DiveSite | null {
  return DIVE_SITES.find((s) => s.id === id) ?? null
}

/** Path to a dive site's dedicated detail page. */
export function diveSitePath(site: Pick<DiveSite, 'id'>): string {
  return `/sites/${site.id}`
}
