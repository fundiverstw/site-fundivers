import { SOCIAL } from './settings'

// The outside places people review us, listed at /reviews.
//
// Nothing here is a review — this site hosts none. Each entry is a pair of
// links: where to read what people wrote, and where to add to it. That is the
// whole point of the page: the words live somewhere we cannot edit them.
//
// Brand names are not translated. The one-line blurb under each is, and lives
// in content/text/ under `reviews.platforms.<id>` — so a new platform here
// needs a matching key in all three language files or the build fails.
//
// ── Links still to confirm ──────────────────────────────────────────────────
//
// Google, TripAdvisor and PADI are **search URLs, not the shop's own listing**:
// a direct "write a review" link needs the Google place id and the TripAdvisor
// and PADI listing ids, which nobody has handed over yet. They land the visitor
// on the right result rather than the right page. Replace them with the real
// listing URLs — open each listing, copy the address, and paste it below.

export type ReviewPlatformId = 'google' | 'facebook' | 'tripadvisor' | 'padi'

export type ReviewPlatform = {
  id: ReviewPlatformId
  /** The brand, as it writes itself. Never translated. */
  label: string
  /** Where the reviews are. */
  readUrl: string
  /** Where to add one. Same page, on some platforms. */
  writeUrl: string
}

const SHOP_QUERY = encodeURIComponent('Fun Divers Taiwan Yonghe')

export const REVIEW_PLATFORMS: ReviewPlatform[] = [
  {
    id: 'google',
    label: 'Google',
    readUrl: `https://www.google.com/maps/search/?api=1&query=${SHOP_QUERY}`,
    writeUrl: `https://www.google.com/maps/search/?api=1&query=${SHOP_QUERY}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    readUrl: `${SOCIAL.facebook}reviews/`,
    writeUrl: `${SOCIAL.facebook}reviews/`,
  },
  {
    id: 'tripadvisor',
    label: 'TripAdvisor',
    readUrl: `https://www.tripadvisor.com/Search?q=${SHOP_QUERY}`,
    writeUrl: `https://www.tripadvisor.com/Search?q=${SHOP_QUERY}`,
  },
  {
    id: 'padi',
    label: 'PADI',
    readUrl: 'https://www.padi.com/dive-shop-locator?location=Taipei%2C%20Taiwan',
    writeUrl: 'https://www.padi.com/dive-shop-locator?location=Taipei%2C%20Taiwan',
  },
]
