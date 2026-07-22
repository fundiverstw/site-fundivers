// The reader-facing text that lives in the content *data* files — dive-site
// names and taglines, region labels, course titles, marine-life labels, and the
// long editorial guides — resolved to the current language.
//
// Those files keep their English as the canonical value, because it is also an
// identifier (the calendar matches a trip against a site's English name; a
// creature's English name makes its gallery slug). Translations sit beside each
// file in per-locale overlays keyed by the same id — dive-sites.ja.ts,
// course-guides.zh-TW.ts, and so on. This module is the one place that stitches
// canonical + overlay together for a given locale; a parity test
// (content/text/content.test.ts) keeps every overlay complete.
//
// Pages read these with the current `$locale`, e.g.
//   {siteText(site.id, $locale).name}
//   {@const g = diveGuide(site.id, $locale)}
// so the page re-renders when the language switches.
import type { Locale } from './i18n'

import {
  DIVE_SITES_TEXT_EN,
  type DiveSitesText,
  type SiteText,
  type MapRegionText,
  type Region,
  type TaiwanRegion,
} from '$content/dive-sites'
import { diveSitesJa } from '$content/dive-sites.ja'
import { diveSitesZhTW } from '$content/dive-sites.zh-TW'

import { COURSES_TEXT_EN, courseId, type CourseText, type CourseCard } from '$content/courses'
import { coursesJa } from '$content/courses.ja'
import { coursesZhTW } from '$content/courses.zh-TW'

import { marineLifeJa } from '$content/marine-life.ja'
import { marineLifeZhTW } from '$content/marine-life.zh-TW'
import type { MarineLifeText } from '$content/marine-life'

// The long editorial guides — the biggest translated payload — resolve in their
// own module ($engine/i18n-guides), imported only by the two detail pages that
// render them. Keeping them out of here is what stops the Sites / Courses / Map
// list pages from shipping every guide in three languages just to show a name.

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
  const id = courseId(course.slug)
  return COURSES_TEXT[l][id] ?? { title: course.title, desc: course.desc }
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
