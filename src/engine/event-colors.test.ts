import { describe, it, expect } from 'vitest'
import { stripTitleSuffix, courseColor, diveIsTripOrBoat } from './event-colors'

describe('stripTitleSuffix', () => {
  it('removes a trailing capacity hint', () => {
    expect(stripTitleSuffix('Open Water Course (2 spots open)')).toBe('Open Water Course')
  })

  it('leaves a title without a suffix untouched', () => {
    expect(stripTitleSuffix('Rescue Diver')).toBe('Rescue Diver')
  })

  it('only removes brackets at the end', () => {
    expect(stripTitleSuffix('EFR (CPR) Course')).toBe('EFR (CPR) Course')
  })
})

describe('courseColor', () => {
  it('gives Open Water its own colour', () => {
    expect(courseColor('Open Water Course')).toBe('ow')
  })

  // The check that matters: 'Advanced Open Water' also starts with 'Advanced',
  // but it contains 'Open Water'. If the two tests are ever reordered, every
  // advanced course silently turns blue.
  it('does not mistake Advanced Open Water for Open Water', () => {
    expect(courseColor('Advanced Open Water')).toBe('aow')
    expect(courseColor('Advanced Open Water Course (1 spot open)')).toBe('aow')
  })

  it('ignores a capacity suffix when choosing the colour', () => {
    expect(courseColor('Open Water Course (2 spots open)')).toBe('ow')
  })

  it('ignores capitalisation', () => {
    expect(courseColor('OPEN WATER COURSE')).toBe('ow')
  })

  it.each(['Rescue Diver', 'EFR Course', 'Emergency First Response', 'O2 Provider'])(
    'treats %s as a rescue course',
    (title) => {
      expect(courseColor(title)).toBe('rescue')
    },
  )

  it('falls back to specialty for anything else', () => {
    expect(courseColor('Enriched Air Nitrox')).toBe('specialty')
    expect(courseColor('Divemaster')).toBe('specialty')
  })
})

describe('diveIsTripOrBoat', () => {
  it('trusts an explicit trip tag over the title', () => {
    expect(diveIsTripOrBoat({ title: 'Bat Cave', dive_outing: 'trip' })).toBe(true)
  })

  it('trusts an explicit local tag over the title', () => {
    // 'Green Island' would otherwise sniff as a trip — the tag must win.
    expect(diveIsTripOrBoat({ title: 'Green Island', dive_outing: 'local' })).toBe(false)
  })

  it('sniffs the title when the row is untagged', () => {
    expect(diveIsTripOrBoat({ title: 'Green Island weekend', dive_outing: null })).toBe(true)
    expect(diveIsTripOrBoat({ title: 'Boat dive at Yehliu', dive_outing: null })).toBe(true)
    expect(diveIsTripOrBoat({ title: 'Fun dive — Bat Cave', dive_outing: null })).toBe(false)
  })

  it('recognises the overseas destinations by name', () => {
    for (const title of ['Anilao macro week', 'Palau liveaboard', 'Panglao, Bohol']) {
      expect(diveIsTripOrBoat({ title, dive_outing: null })).toBe(true)
    }
  })
})
