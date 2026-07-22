// The long editorial guides — dive-site and course write-ups — resolved to the
// current language. Split out from $engine/i18n-content because these are by far
// the largest translated payload: imported only by DiveSiteDetail and
// CourseDetail, so a visitor on the Sites or Courses *list* never downloads
// every guide in three languages just to read a card.
//
// Each guide keeps its English structural data (marine-life identifiers, the
// subsection layout, match codes) canonical; the per-locale overlays carry only
// the prose. See $content/dive-site-guides.ts for the shape, and
// content/i18n-content.test.ts for the parity that keeps the overlays complete.
import type { Locale } from './i18n'

import { DIVE_SITE_GUIDES, type DiveSiteGuide } from '$content/dive-site-guides'
import { diveSiteGuidesJa } from '$content/dive-site-guides.ja'
import { diveSiteGuidesZhTW } from '$content/dive-site-guides.zh-TW'

import { COURSE_GUIDES, type CourseGuide } from '$content/course-guides'
import { courseGuidesJa } from '$content/course-guides.ja'
import { courseGuidesZhTW } from '$content/course-guides.zh-TW'

const DIVE_GUIDE_OVERLAYS: Record<Exclude<Locale, 'en'>, Record<string, Partial<DiveSiteGuide>>> = {
  ja: diveSiteGuidesJa,
  'zh-TW': diveSiteGuidesZhTW,
}

/** A dive-site guide in the current language: the English structural data
 *  (marine-life identifiers) with the prose fields overlaid. Null when the site
 *  has no guide. */
export function diveGuide(id: string, l: Locale): DiveSiteGuide | null {
  const base = DIVE_SITE_GUIDES[id]
  if (!base) return null
  if (l === 'en') return base
  const overlay = DIVE_GUIDE_OVERLAYS[l][id]
  return overlay ? { ...base, ...overlay } : base
}

const COURSE_GUIDE_OVERLAYS: Record<Exclude<Locale, 'en'>, Record<string, Partial<CourseGuide>>> = {
  ja: courseGuidesJa,
  'zh-TW': courseGuidesZhTW,
}

/** A course guide in the current language: the English structural data
 *  (subsections layout, match codes, next-course ids, depth) with the prose
 *  fields overlaid. Null when the course has no guide. */
export function courseGuide(id: string, l: Locale): CourseGuide | null {
  const base = COURSE_GUIDES[id]
  if (!base) return null
  if (l === 'en') return base
  const overlay = COURSE_GUIDE_OVERLAYS[l][id]
  return overlay ? { ...base, ...overlay } : base
}
