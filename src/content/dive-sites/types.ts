// The shapes a dive-site folder is written in.
//
// One folder per dive site, named after the site id: `site.ts` is the catalog
// row behind /sites and /map, `details.ts` is the write-up on /sites/<id>, and
// `photos/` holds its pictures. Both files carry all three languages, so
// everything about a site — data, prose, photos — is in the one folder, and
// deleting the folder deletes the site.
//
// The folder name is the id, so it cannot disagree with itself.

import type { MarineLife } from '../marine-life'

// Regions that sit on the Taiwan map (Map.svelte draws exactly these)…
export type TaiwanRegion =
  'keelung' | 'longdong' | 'yilan' | 'greenisland' | 'lanyu' | 'xiaoliuqiu' | 'kenting' | 'penghu'

// …and the overseas trip destinations, which never appear on it.
export type InternationalRegion =
  'malapascua' | 'puerto-galera' | 'panglao-bohol' | 'anilao' | 'palau'

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

/** One dive site's shown-to-the-reader text. */
export type SiteText = { name: string; tagline: string }

/** What a site's `site.ts` exports: the catalog row minus its id (the folder
 *  name supplies that), with each translation nested under its locale. */
export type DiveSiteFile = Omit<DiveSite, 'id'> & {
  ja: SiteText
  'zh-TW': SiteText
}

/** A Taiwan region as the /map page names it — a fuller label than REGION_META's
 *  and a paragraph of description, distinct from the short Sites-page label. */
export type MapRegionText = { name: string; description: string }

/** Everything on the dive-site pages that gets translated, in one shape. */
export type DiveSitesText = {
  /** Short region label (the Sites-page heading). */
  regions: Record<Region, string>
  /** The /map page's region name + blurb. */
  mapRegions: Record<TaiwanRegion, MapRegionText>
  /** Per dive-site name + tagline, keyed by site id. */
  sites: Record<string, SiteText>
}

export type DiveSiteDetails = {
  overview: string
  highlights: string[]
  /** What you might see. Must be wording from MARINE_LIFE: each chip links to
   *  its section of the photo gallery, and the type is what keeps that link
   *  pointing somewhere real. */
  marineLife: MarineLife[]
  depthRange: string
  difficulty: string
  bestSeason: string
  waterTemp: string
  visibility: string
  // The shop's own "above / below the surface" copy. Optional: a site without
  // them falls back to the overview + marine-life chips alone.
  /** What you'll see underwater, in prose. Rendered above the marine-life chips. */
  belowSurface?: string
  /** The site's setting on land, scenery, wildlife, what makes the trip worth it. */
  aboveSurface?: string
  /** Getting to the entry point: driving, bus, train. */
  gettingThere?: string
  /** Certification / experience needed, in the shop's words. Shown in Quick facts,
   *  in preference to the travel_destinations copy. */
  requirements?: string
}

// The translatable half of a write-up: everything except `marineLife`. That field
// is an array of MARINE_LIFE identifiers (they double as photo-gallery links),
// so it stays in English and is supplied by the canonical entry; a translation
// that restated it would break the gallery links on that language's pages only.
// $engine/i18n-details merges the two back together at read time.
export type DiveSiteDetailsText = Omit<DiveSiteDetails, 'marineLife'>

/** What a site's `details.ts` exports. */
export type DiveSiteDetailsFile = DiveSiteDetails & {
  ja: DiveSiteDetailsText
  'zh-TW': DiveSiteDetailsText
}
