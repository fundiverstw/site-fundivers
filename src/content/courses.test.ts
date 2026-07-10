import { describe, it, expect } from 'vitest'
import { COURSES, courseId, coursePath, courseByRouteId } from './courses'

describe('courseId', () => {
  it('leaves a plain slug alone', () => {
    expect(courseId('padi-open-water-course')).toBe('padi-open-water-course')
  })

  // The slugs come from the old website and some are percent-encoded, e.g.
  // 'padi-search-%26-recovery-specialty'. Those must not leak into our own URLs.
  it('collapses percent-encoding into hyphens', () => {
    expect(courseId('padi-search-%26-recovery-specialty')).toBe('padi-search-recovery-specialty')
  })

  it('never produces a leading, trailing, or doubled hyphen', () => {
    for (const c of COURSES) {
      expect(courseId(c.slug)).not.toMatch(/^-|-$|--/)
    }
  })
})

describe('the course catalog', () => {
  it('is not empty', () => {
    expect(COURSES.length).toBeGreaterThan(0)
  })

  it('gives every course a title, a slug and a photo', () => {
    for (const c of COURSES) {
      expect(c.title.trim()).not.toBe('')
      expect(c.slug.trim()).not.toBe('')
      expect(c.image).toBeTruthy()
      expect(c.desc.trim()).not.toBe('')
    }
  })

  it('produces a distinct route id for every course', () => {
    const routeIds = COURSES.map((c) => courseId(c.slug))
    expect(routeIds).toHaveLength(new Set(routeIds).size)
  })

  // Every card on /courses links to /courses/<id>. If that id does not resolve
  // back to a course, the visitor lands on the Not Found page.
  it('resolves every card back to its own detail page', () => {
    for (const c of COURSES) {
      const path = coursePath(c)
      expect(path.startsWith('/courses/')).toBe(true)
      const id = path.slice('/courses/'.length)
      expect(courseByRouteId(id), `${c.title} has a dead link`).toBe(c)
    }
  })

  it('returns null for an unknown route id rather than throwing', () => {
    expect(courseByRouteId('no-such-course')).toBeNull()
  })
})
