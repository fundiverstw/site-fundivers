import { describe, it, expect } from 'vitest'
import { formatEventSpan, formatSpan, formatNewsDate, twd } from './format'

// These functions decide what a visitor reads on a calendar card, so the tests
// assert the exact string. Dates are given without a timezone so they are read
// as local time, which is what the site does.

describe('formatEventSpan', () => {
  const ev = (start: string, end: string | null = null, hhmm: string | null = null) => ({
    start_time: start,
    end_time: end,
    start_time_hhmm: hhmm,
  })

  it('shows one date when the event lasts a single day', () => {
    expect(formatEventSpan(ev('2026-07-14T00:00:00'))).toBe('Tue, Jul 14')
  })

  it('treats an end time on the same day as a single day', () => {
    expect(formatEventSpan(ev('2026-07-14T08:00:00', '2026-07-14T17:00:00'))).toBe('Tue, Jul 14')
  })

  it('appends the start time when there is one', () => {
    expect(formatEventSpan(ev('2026-07-14T00:00:00', null, '09:00'))).toBe('Tue, Jul 14 · 09:00')
  })

  it('shows an arrow between two dates for a multi-day trip', () => {
    expect(formatEventSpan(ev('2026-07-14T00:00:00', '2026-07-16T00:00:00'))).toBe(
      'Tue, Jul 14 → Jul 16',
    )
  })

  it('keeps the time on the start date of a multi-day trip', () => {
    expect(formatEventSpan(ev('2026-07-14T00:00:00', '2026-07-16T00:00:00', '06:30'))).toBe(
      'Tue, Jul 14 · 06:30 → Jul 16',
    )
  })

  it('spells the day and month out in the long style', () => {
    expect(formatEventSpan(ev('2026-07-14T00:00:00'), { style: 'long' })).toBe('Tuesday, July 14')
  })

  it('drops the weekday in the compact style', () => {
    expect(formatEventSpan(ev('2026-07-14T00:00:00'), { style: 'compact' })).toBe('Jul 14')
  })

  it('adds the year on both ends when asked', () => {
    expect(
      formatEventSpan(ev('2026-07-14T00:00:00', '2026-07-16T00:00:00'), { withYear: true }),
    ).toBe('Tue, Jul 14 2026 → Jul 16 2026')
  })
})

describe('formatSpan', () => {
  it('formats a single day key', () => {
    expect(formatSpan('2026-07-14', null, null)).toBe('Tue, Jul 14')
  })

  it('treats an identical end key as a single day', () => {
    expect(formatSpan('2026-07-14', '2026-07-14', null)).toBe('Tue, Jul 14')
  })

  it('formats a range with a time', () => {
    expect(formatSpan('2026-07-14', '2026-07-16', '06:30')).toBe('Tue, Jul 14 · 06:30 → Jul 16')
  })

  it('does not drift across a month boundary', () => {
    expect(formatSpan('2026-07-31', '2026-08-02', null)).toBe('Fri, Jul 31 → Aug 2')
  })

  it('reads a date key as local time, not UTC', () => {
    // parsing '2026-01-01' as UTC would print Dec 31 anywhere west of Greenwich
    expect(formatSpan('2026-01-01', null, null)).toBe('Thu, Jan 1')
  })
})

describe('twd', () => {
  it('groups thousands', () => {
    expect(twd(15400)).toBe('NT$15,400')
  })

  it('leaves small amounts alone', () => {
    expect(twd(800)).toBe('NT$800')
  })

  it('passes null through, so the caller can hide the price', () => {
    expect(twd(null)).toBeNull()
  })

  it('renders a free event as NT$0 rather than hiding it', () => {
    expect(twd(0)).toBe('NT$0')
  })
})

describe('formatNewsDate', () => {
  // A news date is written by Intl, so these assert the shape rather than an
  // exact string — the exact wording belongs to the platform's locale data and
  // changing with it is correct, not a regression.

  it('writes an English date in full', () => {
    expect(formatNewsDate('2026-06-14', 'en')).toMatch(/June/)
    expect(formatNewsDate('2026-06-14', 'en')).toMatch(/2026/)
    expect(formatNewsDate('2026-06-14', 'en')).toMatch(/14/)
  })

  it('writes a Japanese date the Japanese way', () => {
    expect(formatNewsDate('2026-06-14', 'ja')).toBe('2026年6月14日')
  })

  it('writes a Chinese date the Chinese way', () => {
    expect(formatNewsDate('2026-06-14', 'zh-TW')).toBe('2026年6月14日')
  })

  // The bug this rules out: parsing 'YYYY-MM-DD' without a zone gives local
  // midnight, and formatting that in UTC lands on the previous day for anyone
  // east of Greenwich — which is everyone reading this site. A post dated the
  // 1st would read as the 31st.
  it('keeps the day it was given, whatever the machine timezone', () => {
    expect(formatNewsDate('2026-01-01', 'ja')).toBe('2026年1月1日')
    expect(formatNewsDate('2026-12-31', 'ja')).toBe('2026年12月31日')
  })

  it('hands back an unparseable date rather than showing "Invalid Date"', () => {
    expect(formatNewsDate('not-a-date', 'en')).toBe('not-a-date')
  })
})
