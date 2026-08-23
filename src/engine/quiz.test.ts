import { describe, it, expect } from 'vitest'
import { DECK, shuffled, nameParts, type QuizCard } from './quiz'
import { GALLERY } from '$content/photo-gallery'
import { MARINE_LIFE, MARINE_TAXA } from '$content/marine-life'

// The flashcard deck. Everything here is derived from folders on disk, so the
// failures worth catching are the silent ones: a card with no answer on the
// back, a photo that never became a card, or a shuffle that drops one.

describe('DECK', () => {
  it('has a card for every gallery photo, and no others', () => {
    const photos = GALLERY.flatMap((s) => s.photos)
    expect(DECK).toHaveLength(photos.length)
    expect(new Set(DECK.map((c) => c.image.src))).toEqual(new Set(photos.map((p) => p.image.src)))
  })

  it('never puts a photo on a card without a name for the back of it', () => {
    // A card whose answer is blank is a picture you cannot be told the name of.
    // The creature is the fallback of last resort and always exists, because the
    // folder the photo sits in is what says which animal this is.
    for (const card of DECK) {
      expect(card.commonName || card.creature, `${card.image.src} has no common name`).not.toBe('')
    }
  })

  it('names creatures the marine-life vocabulary knows, so the label translates', () => {
    const known = new Set<string>(MARINE_LIFE)
    for (const card of DECK) expect(known.has(card.creature), `${card.creature}`).toBe(true)
  })

  it('points each card at the gallery section it came from', () => {
    const keys = new Map(GALLERY.map((s) => [s.label, s.key]))
    for (const card of DECK) expect(card.key).toBe(keys.get(card.creature))
  })

  it("falls back to the group's taxon when a photo names no species of its own", () => {
    // Most photos.yaml files are still empty templates, so this fallback is what
    // the whole deck is answered with today. If it breaks, the cards silently
    // lose their scientific names rather than erroring.
    for (const card of DECK) {
      const taxon = MARINE_TAXA[card.creature as keyof typeof MARINE_TAXA]
      if (!card.species) {
        expect(taxon, `${card.creature} has a taxon but the card shows none`).toBe('')
      }
    }
  })

  it("prefers the photo's own species to the group taxon", () => {
    // The one caption filled in so far is a cowrie, named Cypraea sp. — sharper
    // than "Cypraeidae", which is the whole family. Where a photo says what it
    // is, the card must say that.
    const withOwnSpecies = GALLERY.flatMap((s) =>
      s.photos.filter((p) => p.meta.species).map((p) => [s.label, p] as const),
    )
    for (const [label, photo] of withOwnSpecies) {
      const card = DECK.find((c) => c.image.src === photo.image.src)
      expect(card?.species, `${label}`).toBe(photo.meta.species)
    }
  })
})

describe('nameParts', () => {
  /** The name as it renders: italic parts wrapped, so a test reads like the card. */
  const render = (species: string) =>
    nameParts(species)
      .map((p) => (p.italic ? `*${p.text}*` : p.text))
      .join(' ')

  it('leaves sp. and spp. upright beside the italic genus', () => {
    // They are abbreviations standing in for a name, not Latin words, so they
    // are not italicized however the name around them is set.
    expect(render('Cypraea sp.')).toBe('*Cypraea* sp.')
    expect(render('Pterois spp.')).toBe('*Pterois* spp.')
  })

  it('italicizes a whole name that has no abbreviation in it', () => {
    expect(render('Rhincodon typus')).toBe('*Rhincodon typus*')
    expect(render('Muraenidae')).toBe('*Muraenidae*')
  })

  it('keeps a list of names together, punctuation and all', () => {
    expect(render('Mobula birostris, M. alfredi')).toBe('*Mobula birostris, M. alfredi*')
    expect(render('Hippocampus bargibanti, H. denise')).toBe('*Hippocampus bargibanti, H. denise*')
  })

  it('knows the other abbreviations that turn up in a caption', () => {
    expect(render('Chromodoris cf. magnifica')).toBe('*Chromodoris* cf. *magnifica*')
    expect(render('Sepia sp. 3')).toBe('*Sepia* sp. *3*')
  })

  it('only matches a whole abbreviation, never the start of a name', () => {
    // 'Sphyraena' begins with the letters of no abbreviation, but 'Spirobranchus'
    // begins with 'sp' — a prefix test would set it upright and be wrong.
    expect(render('Spirobranchus giganteus')).toBe('*Spirobranchus giganteus*')
  })

  it('gives an empty name no parts to render', () => {
    expect(nameParts('')).toEqual([])
    expect(nameParts('   ')).toEqual([])
  })

  it('rejoins to the name it was given', () => {
    for (const card of DECK) {
      expect(
        nameParts(card.species)
          .map((p) => p.text)
          .join(' '),
      ).toBe(card.species)
    }
  })
})

describe('shuffled', () => {
  const cards = (n: number): QuizCard[] =>
    Array.from({ length: n }, (_, i) => ({
      image: { src: `${i}`, srcset: '', width: 1, height: 1 },
      creature: 'Octopus',
      key: 'octopus',
      commonName: '',
      species: '',
    }))

  it('returns every card exactly once', () => {
    const deck = cards(20)
    const out = shuffled(deck, mulberry(7))
    expect(out).toHaveLength(deck.length)
    expect(new Set(out.map((c) => c.image.src))).toEqual(new Set(deck.map((c) => c.image.src)))
  })

  it('leaves the deck it was handed alone', () => {
    // DECK is module state shared by every visit to the page. Shuffling it where
    // it lies would quietly reorder the deck for the next navigation too.
    const deck = cards(10)
    const before = deck.map((c) => c.image.src)
    shuffled(deck, mulberry(1))
    expect(deck.map((c) => c.image.src)).toEqual(before)
  })

  it('actually reorders', () => {
    const deck = cards(30)
    const out = shuffled(deck, mulberry(3))
    expect(out.map((c) => c.image.src)).not.toEqual(deck.map((c) => c.image.src))
  })

  it('handles the decks that have no shuffling to do', () => {
    expect(shuffled([], mulberry(1))).toEqual([])
    expect(shuffled(cards(1), mulberry(1))).toHaveLength(1)
  })
})

/** A small seeded PRNG, so a shuffle test pins one permutation instead of
 *  passing or failing by luck. */
function mulberry(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
