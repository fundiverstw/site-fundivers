import { fileURLToPath } from 'node:url'

// Folder shortcuts. An import says which of the four folders it comes from, so
// you never count `../../` and you always know what kind of file you're opening:
//
//   $content    the words, prices, links and facts        (edit these often)
//   $styles     colours, fonts, the reusable looks
//   $engine     the machinery — router, database, drawing (rarely touched)
//   $components reusable pieces of UI
//   $pages      one file per page of the site
//   $assets     branding files (logos) that the build fingerprints
//
// $assets is small and exists for one reason: a file imported from here goes
// through the bundler, which renames it with a hash of its contents, which is
// what lets it be cached forever. A file in public/ keeps its name across
// builds and so can never be, because a stale copy would never be replaced.
//
// Shared by vite.config.ts (the site) and vitest.config.ts (the tests) so the
// two cannot drift apart. The same list must also be mirrored in the "paths"
// block of tsconfig.json, which is what the editor and `npm run check` read.
const p = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

export const alias = {
  $content: p('./src/content'),
  $styles: p('./src/styles'),
  $engine: p('./src/engine'),
  $components: p('./src/components'),
  $pages: p('./src/pages'),
  $assets: p('./src/assets'),
}
