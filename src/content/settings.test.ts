import { describe, it, expect } from 'vitest'
import { bookUrl, signInUrl, registerUrl, CONTACT, SOCIAL } from './settings'

// Every outward-facing link on the site, in one file. None of these is checked
// by anything else: they are strings that leave the site, so a typo does not
// break a build, fail a type check, or throw in a browser. It produces a dead
// link, a mail client that never opens, or — for the booking deep links — a
// 404 in the app at the exact moment someone tried to give the shop money.

describe('booking links', () => {
  it('points the book button at the app calendar', () => {
    expect(() => new URL(bookUrl)).not.toThrow()
    expect(new URL(bookUrl).pathname).toBe('/calendar')
  })

  it.each(['dive', 'course', 'adventure'] as const)(
    'builds a registration link for a %s',
    (type) => {
      const url = new URL(registerUrl(type, 'abc-123'))
      expect(url.pathname).toBe(`/register/${type}/abc-123`)
    },
  )

  it('puts the registration links on the same origin as the book button', () => {
    expect(new URL(registerUrl('dive', 'x')).origin).toBe(new URL(bookUrl).origin)
  })

  it('points the nav sign-in at the app login page', () => {
    // The nav's "Sign in" is the only way off this site into an account. If it
    // lands anywhere but the app's own /login, a visitor who wants to see their
    // bookings gets a 404 instead.
    expect(new URL(signInUrl).pathname).toBe('/login')
    expect(new URL(signInUrl).origin).toBe(new URL(bookUrl).origin)
  })

  it('serves the booking app over https', () => {
    // These are pasted into a browser's address bar by a real visitor; an
    // http:// deep link is a redirect at best and a warning at worst.
    expect(new URL(bookUrl).protocol).toBe('https:')
    expect(new URL(signInUrl).protocol).toBe('https:')
  })
})

describe('contact details', () => {
  it('has an email address that could actually be mailed', () => {
    expect(CONTACT.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('has a tel: link with no spaces or punctuation in the number', () => {
    // A `tel:` href with spaces in it is not reliably dialable; the display
    // string is allowed to be pretty, the href is not.
    expect(CONTACT.phoneHref).toMatch(/^tel:\+\d+$/)
  })

  it('agrees between the number it shows and the number it dials', () => {
    // The two are written out separately, so they can drift — and the one
    // people read is not the one that gets dialled.
    const digits = (s: string) => s.replace(/\D/g, '')
    expect(digits(CONTACT.phoneHref)).toBe(digits(CONTACT.phone))
  })

  it('gives an address', () => {
    expect(CONTACT.address.trim().length).toBeGreaterThan(0)
  })
})

describe('social and streaming links', () => {
  const links = Object.entries(SOCIAL)

  it('has links to check', () => {
    expect(links.length).toBeGreaterThan(0)
  })

  it.each(links)('%s is a valid absolute https URL', (_name, url) => {
    expect(() => new URL(url)).not.toThrow()
    expect(new URL(url).protocol).toBe('https:')
  })

  it.each(links)('%s has no stray whitespace', (_name, url) => {
    expect(url).toBe(url.trim())
    expect(url).not.toMatch(/\s/)
  })

  it('points the radio player at a stream, not at a web page', () => {
    // The nav player sets this as an <audio> src. A link to the radio *site*
    // would leave the button spinning and then show "off air" forever.
    const url = new URL(SOCIAL.radioStream)
    expect(url.hostname).toContain('stream')
  })
})
