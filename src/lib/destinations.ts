import { supabase } from './supabase'
import { wixImageLocal } from './images'

// TravelDestinations holds the dive destinations + tour locations, each with a
// cover photo (location_picture). Used by the Travel page and to give the Sites
// page region cards an image.

export type Destination = {
  id: string
  title: string
  slug: string | null
  tagline: string | null
  country: string | null
  international: boolean
  northeastDiving: boolean
  diveType: string | null
  image: string | null
}

export async function fetchDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase
    .from('TravelDestinations')
    .select('_id, admin_title, slug, tagline, country, international, northeast_diving, divetype, location_picture, sort_order')
    .order('sort_order')
  if (error) throw error
  return (data ?? []).map((d) => ({
    id: d._id,
    title: d.admin_title ?? 'Destination',
    slug: d.slug,
    tagline: d.tagline,
    country: d.country,
    international: d.international === true,
    northeastDiving: d.northeast_diving === true,
    diveType: d.divetype,
    image: wixImageLocal(d.location_picture),
  }))
}
