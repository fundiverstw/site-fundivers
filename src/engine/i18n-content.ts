// The reader-facing text that lives in the content *data* files — dive-site
// names and taglines, region labels, course titles, marine-life labels, and the
// long write-ups — resolved to the current language.
//
// Those files keep their English as the canonical value, because it is also an
// identifier (the calendar matches a trip against a site's English name; a
// creature's English name makes its gallery slug). The translations sit in the
// same file as the English they translate — inside each dive site's and course's
// folder, under a `ja:` / `'zh-TW':` key — and the folder barrels collect them
// into the per-locale maps this module reads. This is the one place that
// stitches canonical + overlay together for a given locale; a parity test
// (content/i18n-content.test.ts) keeps every overlay complete.
//
// Pages read these with the current `$locale`, e.g.
//   {siteText(site.id, $locale).name}
//   {@const g = siteDetails(site.id, $locale)}
// so the page re-renders when the language switches.
import type { Locale } from './i18n'

import {
  DIVE_SITES_TEXT_EN,
  diveSitesJa,
  diveSitesZhTW,
  type DiveSitesText,
  type SiteText,
  type MapRegionText,
  type Region,
  type TaiwanRegion,
} from '$content/dive-sites'

import {
  COURSES_TEXT_EN,
  coursesJa,
  coursesZhTW,
  type CourseText,
  type CourseCard,
} from '$content/courses'

import { marineLifeJa, marineLifeZhTW, type MarineLifeText } from '$content/marine-life'

import { TEAM_TEXT_EN, teamJa, teamZhTW, type MemberText } from '$content/team'

import { NEWS_TEXT_EN, newsJa, newsZhTW, type NewsText } from '$content/news'

import {
  TESTIMONIALS_TEXT_EN,
  testimonialsJa,
  testimonialsZhTW,
  type TestimonialText,
} from '$content/testimonials'

// The long write-ups — the biggest translated payload — resolve in their
// own module ($engine/i18n-details), imported only by the two detail pages that
// render them. Keeping them out of here is what stops the Sites / Courses / Map
// list pages from shipping every write-up in three languages just to show a name.

// ── Dive sites, regions, the map ────────────────────────────────────────────

const DIVE_SITES_TEXT: Record<Locale, DiveSitesText> = {
  en: DIVE_SITES_TEXT_EN,
  ja: diveSitesJa,
  'zh-TW': diveSitesZhTW,
}

/** A dive site's localized name + tagline (falls back to English). */
export function siteText(id: string, l: Locale): SiteText {
  return DIVE_SITES_TEXT[l].sites[id] ?? DIVE_SITES_TEXT_EN.sites[id] ?? { name: id, tagline: '' }
}

/** The short region label used on the Sites page (falls back to English). */
export function regionLabel(region: Region, l: Locale): string {
  return DIVE_SITES_TEXT[l].regions[region] ?? DIVE_SITES_TEXT_EN.regions[region] ?? region
}

/** The /map page's region name + description (falls back to English). */
export function mapRegionText(region: TaiwanRegion, l: Locale): MapRegionText {
  return DIVE_SITES_TEXT[l].mapRegions[region] ?? DIVE_SITES_TEXT_EN.mapRegions[region]
}

// ── Courses ─────────────────────────────────────────────────────────────────

const COURSES_TEXT: Record<Locale, Record<string, CourseText>> = {
  en: COURSES_TEXT_EN,
  ja: coursesJa,
  'zh-TW': coursesZhTW,
}

/** A course card's localized title + description (falls back to its English). */
export function courseText(course: CourseCard, l: Locale): CourseText {
  return COURSES_TEXT[l][course.id] ?? { title: course.title, desc: course.desc }
}

// ── Marine life ─────────────────────────────────────────────────────────────

const MARINE_TEXT: Record<Exclude<Locale, 'en'>, MarineLifeText> = {
  ja: marineLifeJa,
  'zh-TW': marineLifeZhTW,
}

/** The localized display label for a creature named by its English identifier.
 *  English is the identifier, so `l === 'en'` returns it unchanged. */
export function marineLabel(name: string, l: Locale): string {
  if (l === 'en') return name
  return MARINE_TEXT[l][name as keyof MarineLifeText] ?? name
}

// ── Team ────────────────────────────────────────────────────────────────────

const TEAM_TEXT: Record<Locale, Record<string, MemberText>> = {
  en: TEAM_TEXT_EN,
  ja: teamJa,
  'zh-TW': teamZhTW,
}

/** A team member's bio in the current language, keyed by name (falls back to
 *  English). */
export function memberBio(name: string, l: Locale): string {
  return TEAM_TEXT[l][name]?.bio ?? TEAM_TEXT_EN[name]?.bio ?? ''
}

/** Everything translatable about a member — bio plus the two profile lines the
 *  About page shows. Falls back to the English entry, then to empty strings, so
 *  a member added without translations still renders. */
export function memberText(name: string, l: Locale): MemberText {
  return TEAM_TEXT[l][name] ?? TEAM_TEXT_EN[name] ?? { bio: '', interests: '', why: '' }
}

// ── Testimonials ────────────────────────────────────────────────────────────

const TESTIMONIALS_TEXT: Record<Locale, Record<string, TestimonialText>> = {
  en: TESTIMONIALS_TEXT_EN,
  ja: testimonialsJa,
  'zh-TW': testimonialsZhTW,
}

/** One testimonial's quote + context, keyed by its id (falls back to English). */
export function testimonialText(id: string, l: Locale): TestimonialText {
  return TESTIMONIALS_TEXT[l][id] ?? TESTIMONIALS_TEXT_EN[id] ?? { quote: '', context: '' }
}

// ── News ────────────────────────────────────────────────────────────────────

const NEWS_TEXT: Record<Locale, Record<string, NewsText>> = {
  en: NEWS_TEXT_EN,
  ja: newsJa,
  'zh-TW': newsZhTW,
}

/** A news article's title, summary and body in the current language.
 *
 *  Unlike every other overlay here, this one is *expected* to have holes: a
 *  post goes up in English and is translated afterwards, so an untranslated
 *  article falls back to English on purpose rather than as a failure. The
 *  fallback is per-article, not per-field — a half-written entry would mix two
 *  languages inside one story, and news.test.ts fails on one instead. */
export function newsText(slug: string, l: Locale): NewsText {
  return NEWS_TEXT[l][slug] ?? NEWS_TEXT_EN[slug] ?? { title: slug, summary: '', body: '' }
}

/** Slugs with no translation yet, for the reminder the test prints. */
export function untranslatedNews(l: Exclude<Locale, 'en'>): string[] {
  return Object.keys(NEWS_TEXT_EN).filter((slug) => !NEWS_TEXT[l][slug])
}
