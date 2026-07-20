/**
 * One photo, in the several sizes the build generated for it.
 *
 * Produced by the `?responsive` import query — see vite.images.ts, which is
 * where the widths and the encoder settings are chosen and explained. Nothing
 * constructs one of these by hand; they arrive from `import.meta.glob`.
 *
 *   src     the largest copy, for anything that ignores `srcset`
 *   srcset  every copy, each tagged with its real width
 *   width   the largest copy's width in pixels
 *   height  the largest copy's height in pixels
 */
export type ResponsiveImage = {
  src: string
  srcset: string
  width: number
  height: number
}

/**
 * What to tell the browser about how wide this picture will be painted.
 *
 * `srcset` says what sizes exist; `sizes` is the half that says which one to
 * take, and without it the browser assumes the picture fills the window and
 * fetches the largest copy — which is the behaviour we are here to fix. The
 * values are CSS widths at each breakpoint, and they have to be kept honest
 * against the grid the picture actually sits in.
 *
 * Tailwind's breakpoints, for reading the strings below: sm 40rem, lg 64rem.
 */
export const SIZES = {
  /** A card in a 1-col → 2-col → 3-col grid (Home services, Sites, Travel). */
  card: '(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 92vw',
  /** A tile in a grid that stays multi-column even on a phone (Home scenes). */
  tile: '(min-width: 40rem) 15rem, 30vw',
  /**
   * A thumbnail in the 1 → 2 → 3 column masonry on /photos.
   *
   * These numbers understate the real layout on purpose, and that is the one
   * entry here you should not "correct" to match the CSS. A thumbnail is
   * painted about 92vw on a phone; declaring that sends a device-pixel-ratio
   * 2.6 screen after a ~985px copy, which means the largest one we have — and
   * a gallery page of full-size photos is exactly the thing that made the site
   * slow. Declaring 70vw asks for ~760px instead and takes the 768 copy: 423 kB
   * for the page instead of 930 kB.
   *
   * What you give up is a little sharpness in the grid on the densest screens.
   * That trade is deliberate: the grid is for finding a picture, and the
   * lightbox — which asks for `full` and gets the largest copy — is for looking
   * at one. Detail is one tap away, and the tap is the point of the grid.
   */
  gallery: '(min-width: 64rem) 22rem, (min-width: 40rem) 34vw, 70vw',
  /** Something spanning the full column width of a page (detail-page heroes). */
  hero: '(min-width: 64rem) 60rem, 96vw',
  /** The lightbox: as large as the viewport allows, so ask for the big copy. */
  full: '100vw',
} as const
