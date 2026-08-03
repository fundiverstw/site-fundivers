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

const { internalHref, hashId } = await import('./router')

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
