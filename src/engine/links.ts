// Outbound links built from a dive site's own data.

// Every travel-destination page lives under this path on the shop's marketing
// site, so a dive site only needs to store its slug (see dive_sites.wix_slug).
const WIX_TRAVEL_BASE = 'https://www.fundiverstw.com/traveldestinations/'

/** The dive site's page on the shop's old marketing site, or null when it has none. */
export function wixSiteUrl(slug: string | null | undefined): string | null {
  const s = (slug ?? '').trim()
  return s ? `${WIX_TRAVEL_BASE}${s}` : null
}

/** "Open in Google Maps", pointed at the dive site's coordinates. */
export function mapsUrl(site: { latitude: number; longitude: number }): string {
  return `https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`
}
