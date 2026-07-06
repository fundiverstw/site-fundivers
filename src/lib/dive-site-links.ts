// Every travel-destination page lives under this path on the shop's marketing
// site, so a dive site only needs to store its slug (see dive_sites.wix_slug).
// Returns null when the site has no page. Mirrors Sites.svelte's readMore().
const WIX_TRAVEL_BASE = 'https://www.fundiverstw.com/traveldestinations/'

export function wixSiteUrl(slug: string | null | undefined): string | null {
  const s = (slug ?? '').trim()
  return s ? `${WIX_TRAVEL_BASE}${s}` : null
}
