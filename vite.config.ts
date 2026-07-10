import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// Folder shortcuts. An import says which of the four folders it comes from, so
// you never count `../../` and you always know what kind of file you're opening:
//
//   $content    the words, prices, links and facts        (edit these often)
//   $styles     colours, fonts, the reusable looks
//   $engine     the machinery — router, database, drawing (rarely touched)
//   $components reusable pieces of UI
//   $pages      one file per page of the site
//
// Keep this list and the "paths" block in tsconfig.json in step with each other.
const alias = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      $content: alias('./src/content'),
      $styles: alias('./src/styles'),
      $engine: alias('./src/engine'),
      $components: alias('./src/components'),
      $pages: alias('./src/pages'),
    },
  },
  build: {
    target: 'es2022',
  },
})
