// The long write-ups — a dive site's or a course's `details.ts` — resolved to the
// current language. Split out from $engine/i18n-content because these are by far
// the largest translated payload: imported only by DiveSiteDetail and
// CourseDetail, so a visitor on the Sites or Courses *list* never downloads
// every write-up in three languages just to read a card.
//
// Each entry keeps its English structural data (marine-life identifiers, the
// subsection layout, match codes) canonical; the per-locale overlays carry only
// the prose. See $content/dive-sites/details.ts for the shape, and
// content/i18n-content.test.ts for the parity that keeps the overlays complete.
import type { Locale } from './i18n'

import { DIVE_SITE_DETAILS, type DiveSiteDetails } from '$content/dive-sites/details'
import { diveSiteDetailsJa } from '$content/dive-sites/details'
import { diveSiteDetailsZhTW } from '$content/dive-sites/details'

import {
  COURSE_DETAILS,
  courseDetailsJa,
  courseDetailsZhTW,
  type CourseDetails,
} from '$content/courses/details'

const DIVE_DETAILS_OVERLAYS: Record<
  Exclude<Locale, 'en'>,
  Record<string, Partial<DiveSiteDetails>>
> = {
  ja: diveSiteDetailsJa,
  'zh-TW': diveSiteDetailsZhTW,
}

/** A dive site's details in the current language: the English structural data
 *  (marine-life identifiers) with the prose fields overlaid. Null when the site
 *  has none. */
export function siteDetails(id: string, l: Locale): DiveSiteDetails | null {
  const base = DIVE_SITE_DETAILS[id]
  if (!base) return null
  if (l === 'en') return base
  const overlay = DIVE_DETAILS_OVERLAYS[l][id]
  return overlay ? { ...base, ...overlay } : base
}

const COURSE_DETAILS_OVERLAYS: Record<
  Exclude<Locale, 'en'>,
  Record<string, Partial<CourseDetails>>
> = {
  ja: courseDetailsJa,
  'zh-TW': courseDetailsZhTW,
}

/** A course's details in the current language: the English structural data
 *  (subsections layout, match codes, next-course ids, depth) with the prose
 *  fields overlaid. Null when the course has none. */
export function courseDetails(id: string, l: Locale): CourseDetails | null {
  const base = COURSE_DETAILS[id]
  if (!base) return null
  if (l === 'en') return base
  const overlay = COURSE_DETAILS_OVERLAYS[l][id]
  return overlay ? { ...base, ...overlay } : base
}
