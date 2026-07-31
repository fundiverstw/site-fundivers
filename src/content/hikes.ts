// The hike catalog — the list behind the /hiking service page.
//
// This is plain data: to add or rename a hike, add a row here and drop its
// photo(s) into src/content/photos/hikes/<id>/ (any jpg/png/webp/avif). The
// image is discovered by the build-time glob in photo-pool.ts and resolved with
// hikeImage(id); nothing else needs to change.
//
// `eventSlug` is the booking app's admin_title for the matching adventure event
// (kind='adventure'), so the homepage Adventures tile can find the right cover —
// see adventureImage() in photo-pool.ts.

export type Hike = {
  id: string
  name: string
  location: string
  tagline: string
  eventSlug: string
}

export const HIKES: Hike[] = [
  {
    id: 'elephant-mountain',
    name: 'Elephant Mountain',
    location: 'Xiangshan · Xinyi, Taipei',
    tagline:
      'A short, steep climb to the classic postcard view over Taipei 101 and the whole city skyline.',
    eventSlug: 'elephant-mountain-hike',
  },
]

// Photo credits (kept for provenance; these licenses don't require attribution):
//   elephant-mountain — Virginia Chien, via Pexels (Pexels License, commercial use OK)
