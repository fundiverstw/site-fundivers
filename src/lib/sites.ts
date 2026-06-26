import { supabase } from './supabase'

// Dive sites come straight from the shared `dive_sites` table (anon-readable).

export type Region =
  | 'keelung'
  | 'longdong'
  | 'yilan'
  | 'greenisland'
  | 'lanyu'
  | 'xiaoliuqiu'
  | 'kenting'
  | 'penghu'

export type DiveSite = {
  id: string
  name: string
  tagline: string | null
  latitude: number
  longitude: number
  region: Region
  dive_type: 'shore' | 'boat' | null
  wix_slug: string | null
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
}

export const AREA_ORDER: Array<'North' | 'South' | 'Outlying Islands'> = [
  'North',
  'South',
  'Outlying Islands',
]

export async function fetchDiveSites(): Promise<DiveSite[]> {
  const { data, error } = await supabase
    .from('dive_sites')
    .select('id, name, tagline, latitude, longitude, region, dive_type, wix_slug')
    .order('name')
  if (error) throw error
  return (data ?? []) as DiveSite[]
}
