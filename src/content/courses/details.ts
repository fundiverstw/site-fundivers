// The long write-ups for the /courses/<id> detail pages, assembled from the
// `details.ts` in each course folder. These are original descriptions of the
// standard PADI curricula (not PADI's own copy), plus quick facts and the
// booking app's category codes (matchCodes) used to surface a course's upcoming
// sessions.
//
// Kept apart from ./index.ts so that the /courses grid, which only needs titles
// and photos, does not pull every write-up in three languages into its bundle.
// Only CourseDetail (via $engine/i18n-details) imports this.

import type { CourseDetails, CourseDetailsFile, CourseDetailsText } from './types'

export type {
  CoursePhase,
  BlockKey,
  CourseDetails,
  CourseDetailsText,
  CourseDetailsFile,
} from './types'

const detailFiles = import.meta.glob('./*/details.ts', { eager: true }) as Record<
  string,
  { details: CourseDetailsFile }
>

const loaded = Object.entries(detailFiles).map(([path, mod]) => ({
  id: path.split('/')[1],
  ...mod.details,
}))

export const COURSE_DETAILS: Record<string, CourseDetails> = Object.fromEntries(
  loaded.map(({ id, ja: _ja, 'zh-TW': _zh, ...details }) => [id, details]),
)

export const courseDetailsJa: Record<string, CourseDetailsText> = Object.fromEntries(
  loaded.map((g) => [g.id, g.ja]),
)

export const courseDetailsZhTW: Record<string, CourseDetailsText> = Object.fromEntries(
  loaded.map((g) => [g.id, g['zh-TW']]),
)

/** Does an upcoming course event (by its category code) belong to this course? */
export function sessionMatchesCourse(
  guide: CourseDetails | undefined,
  category: string | null,
): boolean {
  if (!guide || !category) return false
  const c = category.trim().toLowerCase()
  return guide.matchCodes.includes(c)
}
