import { describe, it, expect } from 'vitest'
import { MARINE_LIFE, MARINE_TAXA, marineSlug } from './marine-life'
import { GALLERY } from './photo-gallery'

// The scientific names. TypeScript already guarantees there is one for every
// creature (MARINE_TAXA is keyed on the type), so these cover what it cannot
// see: a name left blank by accident rather than on purpose, and a common name
// pasted into a field that is supposed to hold a Latin one — both of which reach
// the quiz as a card that teaches the reader nothing.

/** The only two entries allowed to have no scientific name: neither is a taxon,
 *  they are places an animal lives. */
const NOT_TAXA = ['Reef fish', 'Pelagic fish']

describe('MARINE_TAXA', () => {
  it('leaves exactly the non-taxonomic entries blank', () => {
    const blank = MARINE_LIFE.filter((name) => MARINE_TAXA[name] === '')
    expect(blank).toEqual(NOT_TAXA)
  })

  it('writes every name as a Latin one', () => {
    // Capitalized genus or family, then only letters, spaces, dots and commas —
    // 'Hippocampus bargibanti, H. denise' passes, 'moray eel family' does not.
    for (const name of MARINE_LIFE) {
      const taxon = MARINE_TAXA[name]
      if (!taxon) continue
      expect(taxon, `${name}`).toMatch(/^[A-Z][A-Za-z]+(?:[ .,]+[A-Za-z.]+)*$/)
    }
  })

  it('never just repeats the English name', () => {
    // A common name in the scientific slot reads as a fact and is not one.
    for (const name of MARINE_LIFE) {
      const taxon = MARINE_TAXA[name]
      if (!taxon) continue
      expect(marineSlug(taxon), `${name}`).not.toBe(marineSlug(name))
    }
  })

  it('gives every creature people have photographed a name to show', () => {
    // The quiz answers most cards at the level of the folder the photo sits in,
    // so a creature with pictures must have a taxon — even though the vocabulary
    // as a whole is allowed its two blanks, neither of which is a folder anyone
    // can photograph.
    for (const section of GALLERY) {
      if (!section.photos.length) continue
      expect(
        MARINE_TAXA[section.label as (typeof MARINE_LIFE)[number]],
        `${section.label} has photos but no scientific name`,
      ).not.toBe('')
    }
  })
})
