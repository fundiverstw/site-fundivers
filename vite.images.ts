import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'
import type { Plugin } from 'vite'

// Turns `import photo from './x.avif?responsive'` into a set of sized copies
// plus the `srcset` that lets the browser pick one.
//
// Why this exists: every photo on the site was harvested from the old Wix site
// at roughly 1200px wide, and every photo was sent at that width to everybody.
// A phone showing a card three-across in a grid paints it about 120px wide and
// then throws away 90% of the pixels it just paid for over a mobile connection.
// The pictures are the whole weight of this site — 15.7 MB across 124 files, an
// order of magnitude more than all the JavaScript — so this is *the* thing that
// makes the site slow away from a desk.
//
// The module it returns looks like this, and is what CoverPhoto expects:
//
//   { src, srcset, width, height }
//
// `src` is the largest copy, for anything that ignores `srcset`; `width` and
// `height` are the largest copy's real pixels, so an `<img>` can reserve the
// right shape before the bytes land and the page doesn't jump.
//
// Registered in vite.config.ts and vitest.config.ts both — the content modules
// import photos, and the unit tests import the content modules, so a test run
// without this plugin fails on an import it cannot resolve.

/** Widths we generate. */
//
// Chosen against what the site actually paints: a three-across tile on a phone
// (~120px), a one-across card (~360px), and a full-bleed hero (~390px), each
// times a device pixel ratio of 2 or 3. Nothing is generated above the source's
// own width — upscaling invents detail and costs bytes to store the invention.
const WIDTHS = [384, 480, 640, 768, 960, 1216]

// AVIF everywhere. It beats WebP by a wide margin on these underwater photos,
// and every browser we serve has taken it since Safari 16.4 (2023).
//
// quality 50 is measured, not guessed: on this library it is the point where
// the file stops shrinking noticeably but the backscatter has not yet turned
// into mush.
const QUALITY = 50

// effort 2, and this one is worth explaining because the obvious choice is
// wrong. sharp's AVIF `effort` runs 0–9 and trades encode time for size. On
// ordinary photographs higher effort pays. On *these* it does not: the pictures
// are full of suspended particulate, which is close to noise, and no amount of
// extra searching finds structure in noise. Measured on a representative
// sample, effort 4 costs 6–10x the time of effort 2 and returns files within a
// kilobyte — sometimes larger. At effort 6 a full build took ~44 minutes, which
// is also longer than the e2e suite's 120s budget for `vite build`.
const EFFORT = 2

// Generated copies are cached on disk by content hash, so the ~2 minute first
// build is paid once and every build after it is a set of file reads. Lives in
// node_modules/.cache, which is already gitignored and already understood to be
// disposable — deleting it costs a rebuild and nothing else.
const CACHE_DIR = fileURLToPath(new URL('./node_modules/.cache/fundivers-images/', import.meta.url))

/** Path in dev where the middleware below serves generated copies from. */
const DEV_PREFIX = '/@responsive/'

const RESPONSIVE = /[?&]responsive\b/
const IMAGE_FILE = /\.(avif|webp|jpe?g|png)$/i

type Variant = { file: string; width: number; bytes: Buffer }

/** The generated copies of one source image, smallest first. */
async function variantsOf(file: string): Promise<{ variants: Variant[]; height: number }> {
  const source = readFileSync(file)
  // Hash the bytes, not the path or the mtime: a photo that is re-saved without
  // changing gets a cache hit, and a photo swapped for a different one under
  // the same name does not. `git checkout` moves mtimes around freely.
  const digest = createHash('sha256').update(source).digest('hex').slice(0, 16)

  const image = sharp(source)
  const meta = await image.metadata()
  const sourceWidth = meta.width ?? Math.max(...WIDTHS)
  const sourceHeight = meta.height ?? 0

  // Never upscale, and always emit at least one copy: a photo narrower than our
  // smallest width still needs a variant to point `src` at.
  const widths = WIDTHS.filter((w) => w <= sourceWidth)
  if (!widths.length) widths.push(sourceWidth)

  mkdirSync(CACHE_DIR, { recursive: true })
  const variants: Variant[] = []
  for (const width of widths) {
    const name = `${digest}-${width}.avif`
    const cached = path.join(CACHE_DIR, name)
    if (!existsSync(cached)) {
      const bytes = await sharp(source)
        .resize({ width })
        .avif({ quality: QUALITY, effort: EFFORT })
        .toBuffer()
      writeFileSync(cached, bytes)
    }
    variants.push({ file: name, width, bytes: readFileSync(cached) })
  }

  // The tallest copy's height, in proportion to the widest copy's width, so an
  // `<img>` can hold the right box open while the picture downloads.
  const widest = variants[variants.length - 1]
  const height = sourceWidth ? Math.round((sourceHeight * widest.width) / sourceWidth) : 0
  return { variants, height }
}

export function imagesPlugin(): Plugin {
  let isBuild = false

  return {
    name: 'fundivers-images',
    // Before Vite's own asset handling, and it has to be. Vite already knows
    // what a `.avif` import means, and without `pre` it answers this one first:
    // the build succeeds, every photo resolves to its original full-size self,
    // and nothing anywhere reports that the sized copies were never made. The
    // symptom is a fast build and an unchanged site.
    enforce: 'pre',

    configResolved(config) {
      isBuild = config.command === 'build'
    },

    // In dev nothing is emitted into a bundle, so the generated copies are
    // served straight out of the cache directory instead. Keeping dev and the
    // built site on the same `srcset` shape matters: a `sizes` attribute that
    // is wrong is invisible unless the browser has a choice to get wrong.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith(DEV_PREFIX)) return next()
        const name = path.basename(req.url.slice(DEV_PREFIX.length).split('?')[0])
        const file = path.join(CACHE_DIR, name)
        if (!existsSync(file)) return next()
        res.setHeader('Content-Type', 'image/avif')
        res.setHeader('Cache-Control', 'no-cache')
        res.end(readFileSync(file))
      })
    },

    async load(id) {
      if (!RESPONSIVE.test(id)) return null
      const file = id.split('?')[0]
      if (!IMAGE_FILE.test(file)) return null

      const { variants, height } = await variantsOf(file)

      // Two ways to name the copies. In a build each one is handed to Rollup,
      // which hashes it and puts it beside every other asset; the URL is not
      // known until then, hence the placeholder. In dev they are served by the
      // middleware above.
      const urls = variants.map((v) => {
        if (!isBuild) return JSON.stringify(DEV_PREFIX + v.file)
        const ref = this.emitFile({ type: 'asset', name: v.file, source: v.bytes })
        return `import.meta.ROLLUP_FILE_URL_${ref}`
      })

      const widest = variants[variants.length - 1]
      // Plain concatenation rather than a template literal: in a build each URL
      // is a `import.meta.ROLLUP_FILE_URL_…` expression that Rollup rewrites
      // later, and those have to sit in the code as bare expressions.
      const srcset = variants.map((v, i) => `${urls[i]} + " ${v.width}w"`).join(' + ", " + ')

      return {
        code: [
          `export default {`,
          `  src: ${urls[urls.length - 1]},`,
          `  srcset: ${srcset},`,
          `  width: ${widest.width},`,
          `  height: ${height},`,
          `}`,
        ].join('\n'),
        map: null,
      }
    },
  }
}
