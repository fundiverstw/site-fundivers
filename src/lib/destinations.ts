import { supabase } from './supabase'
import { wixImageLocal } from './images'

// travel_destinations holds the dive destinations + tour locations, each with a
// cover photo (location_picture). Used by the Travel page and to give the Sites
// page region cards an image. (Renamed from the old Wix-synced TravelDestinations
// table; keyed on `id`, and the `northeast_diving` flag was dropped upstream.)

export type Destination = {
  id: string
  title: string
  slug: string | null
  tagline: string | null
  country: string | null
  international: boolean
  diveType: string | null
  requirements: string | null // diver_requirements — cert / experience needed
  image: string | null // location_picture — card / cover photo
  background: string | null // background_picture — wide hero photo
}

export async function fetchDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase
    .from('travel_destinations')
    .select('id, admin_title, slug, tagline, country, international, divetype, diver_requirements, location_picture, background_picture, sort_order')
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
    image: wixImageLocal(d.location_picture),
    background: wixImageLocal(d.background_picture),
  }))
}
