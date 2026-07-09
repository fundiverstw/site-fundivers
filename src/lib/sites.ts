import { DIVE_SITES } from './dive-sites.data'

// Dive sites are a static, bundled catalog (see dive-sites.data.ts) — the shared
// `dive_sites` Supabase table they used to come from was dropped upstream.

export type Region =
  | 'keelung'
  | 'longdong'
  | 'yilan'
  | 'greenisland'
  | 'lanyu'
  | 'xiaoliuqiu'
  | 'kenting'
  | 'penghu'
  | 'malapascua'

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

// Display metadata for each region: a human label and a broad area grouping
// mirroring how fundiverstw.com frames Taiwan diving (North / South / Islands).
export const REGION_META: Record<Region, { label: string; area: 'North' | 'South' | 'Outlying Islands' }> = {
  keelung: { label: 'Keelung', area: 'North' },
  longdong: { label: 'Long Dong (Dragon Cave)', area: 'North' },
  yilan: { label: 'Yilan', area: 'North' },
  kenting: { label: 'Kenting', area: 'South' },
  greenisland: { label: 'Green Island', area: 'Outlying Islands' },
  lanyu: { label: 'Orchid Island (Lanyu)', area: 'Outlying Islands' },
  xiaoliuqiu: { label: 'Xiaoliuqiu', area: 'Outlying Islands' },
  penghu: { label: 'Penghu', area: 'Outlying Islands' },
  malapascua: { label: 'Malapascua, Philippines', area: 'Outlying Islands' },
}

export const AREA_ORDER: Array<'North' | 'South' | 'Outlying Islands'> = [
  'North',
  'South',
  'Outlying Islands',
]

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
