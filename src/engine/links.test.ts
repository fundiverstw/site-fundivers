import { describe, it, expect } from 'vitest'
import { wixSiteUrl, mapsUrl } from './links'

describe('wixSiteUrl', () => {
  it('builds the marketing-site link from a slug', () => {
    expect(wixSiteUrl('bat-cave')).toBe('https://www.fundiverstw.com/traveldestinations/bat-cave')
  })

  // A dive site with no page on the old site stores null. Returning a URL here
  // would render a "Read more" link that leads to a 404.
  it('returns null when there is no slug', () => {
    expect(wixSiteUrl(null)).toBeNull()
    expect(wixSiteUrl(undefined)).toBeNull()
    expect(wixSiteUrl('')).toBeNull()
    expect(wixSiteUrl('   ')).toBeNull()
  })

  it('trims stray whitespace around a slug', () => {
    expect(wixSiteUrl(' bat-cave ')).toBe('https://www.fundiverstw.com/traveldestinations/bat-cave')
  })
})

describe('mapsUrl', () => {
  it('points Google Maps at the coordinates', () => {
    expect(mapsUrl({ latitude: 25.1429625, longitude: 121.8129844 })).toBe(
      'https://www.google.com/maps/search/?api=1&query=25.1429625,121.8129844',
    )
  })

  // Latitude first. Swapped, the pin lands in the Indian Ocean and nobody
  // notices until a diver drives there.
  it('puts latitude before longitude', () => {
    expect(mapsUrl({ latitude: 1, longitude: 2 })).toContain('query=1,2')
  })
})
