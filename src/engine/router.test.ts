import { describe, it, expect, beforeEach, vi } from 'vitest'

// router.ts reads `window.location.pathname` while it is being imported, to seed
// the `path` store, so it cannot be loaded in Node without a window standing
// there first. Hence the stub below and the dynamic import: both are about
// getting the module to load at all, not about what is being tested.
const { fakeWindow } = vi.hoisted(() => {
  const fakeWindow = {
    location: { pathname: '/', hash: '' },
    addEventListener: () => {},
    removeEventListener: () => {},
  }
  ;(globalThis as unknown as { window: typeof fakeWindow }).window = fakeWindow
  return { fakeWindow }
})

const { internalHref, hashId, movedTo } = await import('./router')

// The router's own navigation — clicking a link, going back, deep-loading a
// route — is driven by the browser tests (e2e/navigation.spec.ts), which is
// where it belongs. What is *not* tested anywhere is the rule that decides
// which links the router is allowed to touch.
//
// That rule is the dangerous half. Everything it lets through is a link the SPA
// swallows: pushState, no page load, no request. Get it wrong in the permissive
// direction and a `mailto:` becomes a history entry for a route that does not
// exist — which would take the contact form with it, since sending a request is
// a mailto: link (see e2e/contact.spec.ts). The failure is silent: the address
// bar changes, the mail client never opens, and nothing throws.
//
// `internalHref` reads attributes and nothing else, so a stub anchor is enough
// and no DOM is needed.

/** The smallest thing `internalHref` can be asked about. */
function anchor(attrs: Record<string, string | null>): Element {
  return {
    getAttribute: (name: string) => attrs[name] ?? null,
  } as unknown as Element
}

describe('internalHref', () => {
  it.each([
    ['/', '/'],
    ['/courses', '/courses'],
    ['/sites/bat-cave', '/sites/bat-cave'],
    ['/photos?tag=nudibranch', '/photos?tag=nudibranch'],
    ['/photos#nudibranchs', '/photos#nudibranchs'],
  ])('handles the internal link %j', (href, expected) => {
    expect(internalHref(anchor({ href }))).toBe(expected)
  })

  it.each([
    ['https://example.com', 'another site over https'],
    ['http://example.com', 'another site over http'],
    ['mailto:hello@fundivers.tw', 'an email link'],
    ['tel:+886912345678', 'a phone link'],
    ['#contact', 'an anchor on this page'],
  ])('leaves %j alone (%s)', (href) => {
    expect(internalHref(anchor({ href }))).toBeNull()
  })

  it('leaves a link that opens in a new tab alone', () => {
    expect(internalHref(anchor({ href: '/courses', target: '_blank' }))).toBeNull()
  })

  it('still handles a link that names a target other than _blank', () => {
    expect(internalHref(anchor({ href: '/courses', target: '_self' }))).toBe('/courses')
  })

  it('returns null when there is no anchor', () => {
    expect(internalHref(null)).toBeNull()
    expect(internalHref(undefined)).toBeNull()
  })

  it('returns null for an anchor with no href', () => {
    expect(internalHref(anchor({}))).toBeNull()
  })

  it('returns null for an empty href', () => {
    expect(internalHref(anchor({ href: '' }))).toBeNull()
  })

  it('is not fooled by a scheme in the middle of a path', () => {
    // The exclusion is anchored to the start of the string, so a route that
    // merely contains "http" is still ours to handle.
    expect(internalHref(anchor({ href: '/travel/https-diving' }))).toBe('/travel/https-diving')
  })

  it('treats a protocol-relative link as internal, which is worth knowing', () => {
    // `//example.com` reaches another origin in a browser but does not match
    // the scheme test, so the router keeps it. Nothing on the site writes one —
    // this pins the behaviour so that if one ever appears, the fix is here and
    // not a puzzled hour in the network tab.
    expect(internalHref(anchor({ href: '//example.com' }))).toBe('//example.com')
  })
})

describe('hashId', () => {
  const stubHash = (hash: string) => {
    fakeWindow.location.hash = hash
  }

  beforeEach(() => {
    fakeWindow.location.hash = ''
  })

  it('returns the id without its leading hash', () => {
    stubHash('#nudibranchs')
    expect(hashId()).toBe('nudibranchs')
  })

  it('returns an empty string when there is no hash', () => {
    stubHash('')
    expect(hashId()).toBe('')
  })

  it('decodes a percent-encoded id', () => {
    // Marine-life slugs and dive-site anchors travel through the address bar,
    // and a browser encodes what it must. Comparing the raw form against an
    // element id would quietly never match.
    stubHash('#%E6%B5%B7%E6%9C%88')
    expect(hashId()).toBe('海月')
  })

  it('decodes an encoded space', () => {
    stubHash('#bat%20cave')
    expect(hashId()).toBe('bat cave')
  })

  it('strips only the first hash', () => {
    stubHash('##double')
    expect(hashId()).toBe('#double')
  })
})

// ── Moved addresses ─────────────────────────────────────────────────────────
//
// The four-section reorganisation moved two pages. The old addresses are in
// bookmarks, in search results and on the shop's old Wix site, and answering
// them with a 404 loses that traffic silently — nobody reports a page they
// found through Google that no longer exists.
//
// The mapping is a pure function of the path, so it is checked here rather than
// in a browser; that the redirect actually happens is e2e's job.

describe('movedTo', () => {
  it('sends the moved pages to their new addresses', () => {
    expect(movedTo('/photos')).toBe('/sealife')
    expect(movedTo('/news')).toBe('/logbook')
    // The blog's middle name. Both of its old addresses point at the current
    // one directly — a chain of redirects survives only until somebody tidies
    // away the address in the middle.
    expect(movedTo('/surface-interval')).toBe('/logbook')
  })

  it('sends both halves of the old reputation pages to the one that replaced them', () => {
    expect(movedTo('/testimonials')).toBe('/reputation')
    expect(movedTo('/reviews')).toBe('/reputation')
  })

  it('brings a dive site up to the root, but not the list page', () => {
    expect(movedTo('/sites/bat-cave')).toBe('/bat-cave')
    expect(movedTo('/sites/82-5')).toBe('/82-5')
    expect(movedTo('/sites'), 'the list page did not move').toBeNull()
  })

  it('moves an article with its feed', () => {
    expect(movedTo('/news/womens-dive-day')).toBe('/logbook/womens-dive-day')
    expect(movedTo('/surface-interval/womens-dive-day')).toBe('/logbook/womens-dive-day')
  })

  it('ignores a trailing slash', () => {
    expect(movedTo('/photos/')).toBe('/sealife')
    expect(movedTo('/news/')).toBe('/logbook')
    expect(movedTo('/surface-interval/')).toBe('/logbook')
  })

  it('leaves every other address alone', () => {
    // Including the new addresses themselves: a redirect that fired on its own
    // destination would replaceState in a loop.
    // /team and /bat-cave are here on purpose. /team was a moved address until
    // About Us split into /origins and /team; /bat-cave is where a dive site
    // ends up, and a rule that also fired there would loop.
    const untouched = ['/', '/sealife', '/logbook', '/about', '/team', '/bat-cave']
    for (const p of untouched) {
      expect(movedTo(p), p).toBeNull()
    }
  })

  it('does not mistake a longer path for a moved one', () => {
    expect(movedTo('/newsletter')).toBeNull()
    expect(movedTo('/photography')).toBeNull()
  })
})
