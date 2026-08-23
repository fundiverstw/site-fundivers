// The flashcard deck behind /quiz: a photo on the front, what it is on the back.
//
// The cards are the gallery photos — the only pictures on the site that say
// which animal is in them, because they sit in a folder named after it
// (content/photos/gallery/moray_eels/…). Dive-site and course photos are not in
// the deck: nothing records what is swimming through them, and a flashcard that
// cannot be marked right is not a flashcard.
//
// So the deck grows the same way the gallery does. Drop photos into a creature's
// folder and they become cards; there is no list here to keep in step.
//
// Two names go on the back, and each has two possible sources:
//
//   common name  the photo's own `commonName` in photos.yaml when it has one
//                ("Cowrie, mantle extended"), otherwise the creature the folder
//                is named for — which the page translates, so a Japanese reader
//                is quizzed in Japanese.
//   scientific   the photo's own `species` when it has one (sharpest: it names
//                the individual animal), otherwise the group's MARINE_TAXA
//                entry, otherwise nothing.
//
// The fallbacks are what make the quiz work today: almost every photos.yaml is
// still an empty template, so most cards are answered at the level of the folder
// they sit in. Fill a caption in and that card gets sharper on its own.

import { GALLERY } from '$content/photo-gallery'
import { MARINE_TAXA } from '$content/marine-life'
import type { ResponsiveImage } from './responsive-image'

export type QuizCard = {
  image: ResponsiveImage
  /** The creature's English name — the identifier, which `marineLabel` translates. */
  creature: string
  /** That creature's gallery slug, so a card can link to /photos#moray_eels. */
  key: string
  /** The photo's own common name, or '' to fall back to the creature's label. */
  commonName: string
  /** Scientific name, or '' when there is none to show (see MARINE_TAXA). */
  species: string
}

/** Every card there is, in gallery order. Shuffle it before showing it. */
export const DECK: QuizCard[] = GALLERY.flatMap((section) =>
  section.photos.map((photo) => ({
    image: photo.image,
    creature: section.label,
    key: section.key,
    commonName: photo.meta.commonName ?? '',
    species: photo.meta.species ?? MARINE_TAXA[section.label as keyof typeof MARINE_TAXA] ?? '',
  })),
)

/**
 * A shuffled copy of a deck — Fisher-Yates, unbiased.
 *
 * A copy, never in place: DECK is module state shared by every visit to the
 * page, and shuffling it where it lies would reorder the deck for the next
 * navigation too. `random` is injectable so the tests can pin the permutation;
 * nothing in the app passes it.
 */
export function shuffled(deck: QuizCard[], random: () => number = Math.random): QuizCard[] {
  const out = [...deck]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
