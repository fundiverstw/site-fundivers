import type { Dict } from './text/en'

// The shape of the site: four sections, each a hub page with its own children.
//
// One list, read by three places — the bar, the mobile menu, and the hub pages
// themselves — so a page cannot appear in the dropdown and be missing from the
// hub it belongs to. Structure only: every label comes from `$t.nav[key]`, so
// this file never needs touching to change a word.
//
// Anything not listed here (Services, Gear, the tours, Websites) is reached
// from the footer's link map — see Footer.svelte.

/** A key in the `nav` block of content/text/. */
export type NavKey = keyof Dict['nav']

export type NavItem = { href: string; key: NavKey }

export type NavSection = NavItem & {
  /** Used in the DOM (`data-nav-section`) and as the dropdown's element id. */
  id: string
  /** What sits under this section. Empty for a section that is only a page. */
  items: NavItem[]
}

export const SECTIONS: NavSection[] = [
  {
    id: 'education',
    href: '/education',
    key: 'education',
    items: [
      { href: '/courses', key: 'courses' },
      { href: '/sealife', key: 'life' },
    ],
  },
  {
    id: 'community',
    href: '/community',
    key: 'community',
    items: [
      { href: '/surface-interval', key: 'news' },
      { href: '/testimonials', key: 'testimonials' },
      { href: '/reviews', key: 'reviews' },
      { href: '/radio', key: 'radio' },
      { href: '/fundive', key: 'fundive' },
    ],
  },
  {
    id: 'about',
    href: '/about',
    key: 'about',
    items: [
      { href: '/origins', key: 'origins' },
      { href: '/team', key: 'team' },
    ],
  },
  {
    id: 'go-diving',
    href: '/go-diving',
    key: 'goDiving',
    items: [
      { href: '/calendar', key: 'calendar' },
      { href: '/sites', key: 'sites' },
      { href: '/map', key: 'map' },
      { href: '/travel', key: 'travel' },
      { href: '/build-trip', key: 'buildTrip' },
    ],
  },
]

/** The pages the four sections do not cover, listed in the footer. */
export const FOOTER_LINKS: NavItem[] = [
  { href: '/services', key: 'services' },
  { href: '/gear', key: 'gear' },
  { href: '/cycling', key: 'cycling' },
  { href: '/hiking', key: 'hiking' },
  { href: '/websites', key: 'websites' },
]
