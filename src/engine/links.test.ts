import { describe, it, expect } from 'vitest'
import { wixSiteUrl } from './links'

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
