import { describe, it, expect } from 'vitest'
import { ROUTE_PATHS, routeKey } from './routes'
import { DIVE_SITE_IDS } from '$content/dive-sites/ids'

// Dive sites are served from the root of the site — /bat-cave, not
// /sites/bat-cave — which means a site id and a page path are competing for the
// same namespace. A page wins, so a site whose folder happened to be named
// `map` or `radio` would simply never open: no error, no 404, just the wrong
// page under the right address.
//
// Nothing else can catch that. The site would still be in the catalog, still on
// the list page, still on the map, and its link would still go somewhere that
// renders. So the guard is here, and it runs on every commit.

const pagePaths: readonly string[] = ROUTE_PATHS

describe('dive sites at the root', () => {
  it('do not collide with a page', () => {
    const taken = new Set(pagePaths.map((p) => p.slice(1)))
    const clashes = DIVE_SITE_IDS.filter((id) => taken.has(id))
    expect(
      clashes,
      'a dive site is shadowed by a page of the same name and can never open',
    ).toEqual([])
  })

  it('are reachable, every one of them', () => {
    for (const id of DIVE_SITE_IDS) {
      expect(routeKey(`/${id}`), `/${id} does not open its dive site`).toBe(':site')
    }
  })

  it('keep their anchors and query strings', () => {
    expect(routeKey('/bat-cave#below')).toBe(':site')
    expect(routeKey('/bat-cave?from=map')).toBe(':site')
  })
})

describe('routeKey', () => {
  it('serves each page from its own address', () => {
    for (const p of pagePaths) expect(routeKey(p), p).toBe(p)
  })

  it('sends an unknown address to the 404, not to an empty dive site', () => {
    // The failure this rules out: matching anything at the root as a dive site,
    // which turns every typo into a detail page saying nothing was found —
    // indistinguishable, to a search engine, from a real page.
    for (const p of ['/nonsense', '/sites/bat-cave', '/a/b', '/photos']) {
      expect(routeKey(p), p).toBe(':missing')
    }
  })

  it('routes the two prefixed detail pages', () => {
    expect(routeKey('/courses/padi-open-water-course')).toBe(':course')
    expect(routeKey('/surface-interval/example-post')).toBe(':news')
    // The list pages themselves are not detail pages.
    expect(routeKey('/courses')).toBe('/courses')
    expect(routeKey('/surface-interval')).toBe('/surface-interval')
  })
})
