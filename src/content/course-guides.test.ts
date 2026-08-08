import { describe, it, expect } from 'vitest'
import { COURSE_GUIDES, sessionMatchesCourse } from './course-guides'
import { COURSES } from './courses'

// CourseDetail.svelte looks a guide up with COURSE_GUIDES[course.id].
// Misspell a key and the page renders with the photo, the title, and none of the
// text you wrote — no error, anywhere. Same trap as dive-site-guides.ts.

const courseIds = COURSES.map((c) => c.id)
const entries = Object.entries(COURSE_GUIDES)

describe('course guides', () => {
  it('are all keyed by a course that exists', () => {
    for (const [key] of entries) {
      expect(courseIds, `no course has the id '${key}'`).toContain(key)
    }
  })

  it('cover every course', () => {
    const missing = courseIds.filter((id) => !(id in COURSE_GUIDES))
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
        expect(courseIds, `${key}.next points at '${next}', which is not a course`).toContain(next)
      }
    }
  })

  it('never suggest the course you are already reading', () => {
    for (const [key, g] of entries) {
      expect(g.next, `${key} suggests itself`).not.toContain(key)
    }
  })
})

// The join between a course page and the calendar: an upcoming course event
// carries an admin_title short code ('OW', 'aow'), and this decides which
// course page should list it as a session. Getting it wrong shows a course page
// with no upcoming dates while the dates sit right there in the calendar —
// which looks like "nothing scheduled" rather than like a bug.
describe('sessionMatchesCourse', () => {
  const guide = COURSE_GUIDES[Object.keys(COURSE_GUIDES)[0]]

  it('matches a category listed in the guide', () => {
    for (const code of guide.matchCodes) {
      expect(sessionMatchesCourse(guide, code)).toBe(true)
    }
  })

  it('ignores case, because the codes are typed by hand in the booking app', () => {
    for (const code of guide.matchCodes) {
      expect(sessionMatchesCourse(guide, code.toUpperCase())).toBe(true)
    }
  })

  it('ignores surrounding whitespace', () => {
    expect(sessionMatchesCourse(guide, `  ${guide.matchCodes[0]}  `)).toBe(true)
  })

  it('does not match a category the guide never claims', () => {
    expect(sessionMatchesCourse(guide, 'not-a-real-code')).toBe(false)
  })

  it('returns false when there is no guide', () => {
    expect(sessionMatchesCourse(undefined, 'ow')).toBe(false)
  })

  it('returns false for an event with no category', () => {
    expect(sessionMatchesCourse(guide, null)).toBe(false)
  })

  it('returns false for an empty category rather than matching everything', () => {
    expect(sessionMatchesCourse(guide, '')).toBe(false)
    expect(sessionMatchesCourse(guide, '   ')).toBe(false)
  })

  it('claims every match code for exactly one course', () => {
    // Two guides claiming the same code would list the same calendar session on
    // two different course pages.
    const seen = new Map<string, string>()
    for (const [key, g] of entries) {
      for (const code of g.matchCodes) {
        const already = seen.get(code)
        expect(already, `'${code}' is claimed by both ${already} and ${key}`).toBeUndefined()
        seen.set(code, key)
      }
    }
  })
})
