import { isDiveSiteId } from '$content/dive-sites/ids'

// Which addresses this site answers, and which one serves a given link.
//
// The list of paths lives here rather than in App.svelte because two other
// things need it: `routeKey` below, and the collision test in routes.test.ts.
// That test is not optional — dive sites are served from the root of the site,
// so a site whose folder were named `map` or `radio` would be shadowed by a
// page and simply never open.
//
// The components themselves stay in App.svelte, loaded on demand one file each.
// `RoutePath` is what keeps the two halves in step: App's table is typed as a
// Record over this union, so a path added here and nowhere else does not
// compile, and a component added there for an address not listed here does not
// either. It is a stronger promise than a test could make, and it is checked
// before anything runs.

export const ROUTE_PATHS = [
  '/',

  // Education
  '/education',
  '/courses',
  '/sealife',
  '/quiz',

  // Community
  '/community',
  '/surface-interval',
  '/testimonials',
  '/reviews',
  '/radio',
  '/fundive',

  // About Us — the hub, plus the story and the roster it splits into
  '/about',
  '/origins',
  '/team',

  // Go Diving
  '/go-diving',
  '/calendar',
  '/sites',
  '/map',
  '/travel',
  '/build-trip',

  // Not in the bar; reached from the footer's link map and from each other
  '/services',
  '/gear',
  '/cycling',
  '/hiking',
  '/websites',
] as const

export type RoutePath = (typeof ROUTE_PATHS)[number]

/** The detail pages. Each serves every address under a prefix — or, for a dive
 *  site, every id at the root — so none of them can be a plain path.
 *  `:missing` is the 404. */
export type DetailKey = ':site' | ':course' | ':news' | ':missing'

export type RouteKey = RoutePath | DetailKey

const paths = new Set<string>(ROUTE_PATHS)

/** Which entry of App's page table serves this address. */
export function routeKey(href: string): RouteKey {
  // Links carry anchors and query strings (/sealife#moray_eels); the page that
  // serves them is the same either way.
  const p = href.split(/[#?]/)[0]

  if (p.startsWith('/courses/') && p.length > '/courses/'.length) return ':course'
  const post = '/surface-interval/'
  if (p.startsWith(post) && p.length > post.length) return ':news'

  // A page always wins over a dive site. That is the safe way round — a name
  // clash makes a dive site unreachable, which routes.test.ts fails on, rather
  // than silently replacing a page with one.
  if (paths.has(p)) return p as RoutePath

  // A dive site sits at the root: /82-5, /bat-cave. Only ids that exist match,
  // so an unknown address is still a 404 rather than an empty detail page.
  const id = p.slice(1)
  if (!id.includes('/') && isDiveSiteId(id)) return ':site'

  return ':missing'
}
