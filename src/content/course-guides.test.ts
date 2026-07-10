import { describe, it, expect } from 'vitest'
import { COURSE_GUIDES } from './course-guides'
import { COURSES, courseId } from './courses'

// CourseDetail.svelte looks a guide up with COURSE_GUIDES[courseId(course.slug)].
// Misspell a key and the page renders with the photo, the title, and none of the
// text you wrote — no error, anywhere. Same trap as dive-site-guides.ts.

const routeIds = COURSES.map((c) => courseId(c.slug))
const entries = Object.entries(COURSE_GUIDES)

describe('course guides', () => {
  it('are all keyed by a course that exists', () => {
    for (const [key] of entries) {
      expect(routeIds, `no course has the route id '${key}'`).toContain(key)
    }
  })

  it('cover every course', () => {
    const missing = routeIds.filter((id) => !(id in COURSE_GUIDES))
    expect(missing, 'these courses would render an empty detail page').toEqual([])
  })

  it('fill in every required field', () => {
    for (const [key, g] of entries) {
      for (const field of [
        'overview',
        'prerequisites',
        'minAge',
        'duration',
        'certifies',
      ] as const) {
        expect(g[field]?.trim(), `${key}.${field}`).not.toBe('')
      }
      expect(g.youWillLearn.length, `${key}.youWillLearn`).toBeGreaterThan(0)
    }
  })

  it('leave depth as null rather than an empty string when it does not apply', () => {
    // A dry course (EFR) has no depth. '' would render the heading with nothing
    // under it; null hides the row.
    for (const [key, g] of entries) {
      if (g.depth !== null) expect(g.depth.trim(), `${key}.depth`).not.toBe('')
    }
  })

  it('do not repeat a line in "what you will learn"', () => {
    for (const [key, g] of entries) {
      expect(g.youWillLearn, `${key}.youWillLearn repeats a line`).toHaveLength(
        new Set(g.youWillLearn).size,
      )
    }
  })

  // matchCodes are compared against an event's lowercased admin_title to find
  // upcoming sessions of this course. An upper-case entry silently matches nothing.
  it('keep every match code lowercase', () => {
    for (const [key, g] of entries) {
      for (const code of g.matchCodes) {
        expect(code, `${key}.matchCodes contains '${code}'`).toBe(code.toLowerCase())
        expect(code.trim()).not.toBe('')
      }
    }
  })

  // "You might do this next" links. A typo here is a link to the Not Found page.
  it('suggest next courses that exist', () => {
    for (const [key, g] of entries) {
      for (const next of g.next) {
        expect(routeIds, `${key}.next points at '${next}', which is not a course`).toContain(next)
      }
    }
  })

  it('never suggest the course you are already reading', () => {
    for (const [key, g] of entries) {
      expect(g.next, `${key} suggests itself`).not.toContain(key)
    }
  })
})
