import { supabase } from './supabase'
import { DESTINATION_COLS } from './db-columns'

// travel_destinations holds the dive destinations + tour locations. Used by the
// Travel page and to give the Sites page region cards their text. (Renamed from
// the old Wix-synced TravelDestinations table; keyed on `id`, and the
// `northeast_diving` flag was dropped upstream.)
//
// No photos come from here. The rows still carry the old site's
// location_picture / background_picture, but those are `wix:image://` refs into
// a CDN we no longer read, and the local copies they used to resolve against are
// gone — so the columns are not even selected. A destination's picture now comes
// from the dive site it names (`siteImage`), or the general pool.

export type Destination = {
  id: string
  title: string
  slug: string | null
  tagline: string | null
  country: string | null
  international: boolean
  diveType: string | null
  requirements: string | null // diver_requirements — cert / experience needed
}

export async function fetchDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase
    .from('travel_destinations')
    .select(DESTINATION_COLS)
    .order('sort_order')
  if (error) throw error
  return (data ?? []).map((d) => ({
    id: d.id,
    title: d.admin_title ?? 'Destination',
    slug: d.slug,
    tagline: d.tagline,
    country: d.country,
    international: d.international === true,
    diveType: d.divetype,
    requirements: d.diver_requirements,
  }))
}
