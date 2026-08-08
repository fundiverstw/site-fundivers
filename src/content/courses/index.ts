// The PADI course catalog, assembled from the folders beside this file.
//
// One folder per course. The folder name is the course id: it is the
// /courses/<id> address, the key the write-up is found by, and the name of that
// course's photo folder under photos/courses/. To add a course, copy a folder —
// see docs/adding-a-course.md. There is no list to keep in step.
//
// The card and the write-up are read by two separate barrels on purpose.
// `/courses` renders 21 tiles and must not download 3,000 lines of write-ups to
// do it, so the write-ups live in ./details.ts, which only CourseDetail imports.

import type { CourseCard, CourseCardFile, CourseText } from './types'

export type {
  CourseCard,
  CourseCardFile,
  CourseText,
  CoursePhase,
  BlockKey,
  CourseDetails,
  CourseDetailsText,
  CourseDetailsFile,
} from './types'

const cardFiles = import.meta.glob('./*/card.ts', { eager: true }) as Record<
  string,
  { card: CourseCardFile }
>

/** The folder name, which is the course id: './padi-deep-diver-specialty/card.ts'. */
function folderOf(path: string): string {
  return path.split('/')[1]
}

const loaded = Object.entries(cardFiles)
  .map(([path, mod]) => ({ id: folderOf(path), ...mod.card }))
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))

// The translations and the ordering hint are stripped here: a page asking for
// COURSES wants the cards, and leaving `ja` on them would let a component read a
// translation without going through $engine/i18n-content.
export const COURSES: CourseCard[] = loaded.map(
  ({ order: _order, ja: _ja, 'zh-TW': _zh, ...card }) => card,
)

export function coursePath(c: Pick<CourseCard, 'id'>): string {
  return `/courses/${c.id}`
}

/** The course whose id matches the /courses/<id> param, or null. */
export function courseByRouteId(id: string): CourseCard | null {
  return COURSES.find((c) => c.id === id) ?? null
}

// English title + desc keyed by course id — the fallback, and what the overlay
// parity test measures against. Built from the folders so a new course can never
// be missed here.
export const COURSES_TEXT_EN: Record<string, CourseText> = Object.fromEntries(
  loaded.map((c) => [c.id, { title: c.title, desc: c.desc }]),
)

export const coursesJa: Record<string, CourseText> = Object.fromEntries(
  loaded.map((c) => [c.id, c.ja]),
)

export const coursesZhTW: Record<string, CourseText> = Object.fromEntries(
  loaded.map((c) => [c.id, c['zh-TW']]),
)

/** Every course id, in the order the grid shows them. Exported for the tests. */
export const COURSE_IDS: string[] = loaded.map((c) => c.id)

/** Card order numbers, for the test that no two courses claim the same slot. */
export const COURSE_ORDER: Array<{ id: string; order: number }> = loaded.map((c) => ({
  id: c.id,
  order: c.order,
}))
