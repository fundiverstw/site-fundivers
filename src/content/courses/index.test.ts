import { describe, it, expect } from 'vitest'
import { COURSES, coursePath, courseByRouteId } from './index'

describe('the course catalog', () => {
  it('is not empty', () => {
    expect(COURSES.length).toBeGreaterThan(0)
  })

  it('gives every course a title, an id and a photo', () => {
    for (const c of COURSES) {
      expect(c.title.trim()).not.toBe('')
      expect(c.id.trim()).not.toBe('')
      expect(c.image, `${c.id} has no cover photo`).toBeTruthy()
      expect(c.desc.trim()).not.toBe('')
    }
  })

  it('gives every course a distinct id', () => {
    const ids = COURSES.map((c) => c.id)
    expect(ids).toHaveLength(new Set(ids).size)
  })

  // The id goes straight into a URL, a filesystem folder name
  // (photos/courses/<id>/) and an object key. Anything outside this alphabet
  // would need escaping in at least one of those places.
  it('keeps every id url-safe and tidy', () => {
    for (const c of COURSES) {
      expect(c.id, `${c.title} has an id that is not plain lowercase-and-hyphens`).toMatch(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
      )
    }
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
