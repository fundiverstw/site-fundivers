// What we charge for building and running FunDive, and for building websites.
//
// The numbers live here, once. The words that surround them are translated in
// content/text/. Putting a price in the language files would mean changing it in
// three places and quietly shipping two different prices.
//
// Amounts are New Taiwan dollars, and are rendered through twd() so they read as
// NT$3,000 wherever they appear.

export const SERVICE_PRICING = {
  /** One-off. We build and configure the shop's whole FunDive environment. */
  fundiveSetup: 3000,
  /** Flat monthly. Updates, security, dependencies, support. */
  fundiveMonthly: 3000,
  /** Websites start here; the real figure depends on the shop. */
  websiteSetupFrom: 9000,
  /** Flat monthly. Content, maintenance, infrastructure, support. */
  websiteMonthly: 3000,
} as const

/** FunDive itself: free, open source, AGPL-3.0. The whole point of the pitch. */
export const FUNDIVE_REPO_URL = 'https://github.com/fundive/fundive'
export const FUNDIVE_LICENSE = 'AGPL-3.0'
