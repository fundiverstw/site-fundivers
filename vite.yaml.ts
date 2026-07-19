import { readFileSync } from 'node:fs'
import { load, CORE_SCHEMA } from 'js-yaml'
import type { Plugin } from 'vite'

// Lets a `.yaml` file be imported like any other module.
//
// The photo galleries keep their captions in YAML next to the pictures, because
// that is a format somebody can edit without knowing what a comma is worth (see
// docs/adding-photos.md). This turns each file into a plain object *while the
// site is being built*, so the finished site carries the captions as data and no
// YAML parser is shipped to the browser.
//
// It has to be registered in vite.config.ts and vitest.config.ts both, or the
// tests import a file the test runner cannot read.
export function yamlPlugin(): Plugin {
  return {
    name: 'fundivers-yaml',
    transform(_code, id) {
      // Match on the path alone. Vite appends query strings to ids (`?t=…` when
      // a file changes during `npm run dev`), and an anchored test against the
      // whole id would quietly stop matching the moment it did — handing raw
      // YAML to the browser as if it were JavaScript.
      const file = id.split('?')[0]
      if (!/\.ya?ml$/.test(file)) return null
      // ...but leave `?raw` and `?url` alone: those ask for the file itself.
      if (/[?&](raw|url)\b/.test(id)) return null
      // Read from disk rather than trusting `code`: Vite may hand us the file
      // already mangled by an earlier plugin.
      const text = readFileSync(file, 'utf8')

      // A file that is all comments is how these start life — the template in
      // each gallery folder is nothing but comments. That is not an error, but
      // the parser treats an empty document as one, so answer it here.
      const hasContent = text
        .split('\n')
        .some((line) => line.trim() && !line.trim().startsWith('#'))
      if (!hasContent) return { code: 'export default {}', map: null }

      try {
        // CORE_SCHEMA, so `taken: 2025-08-14` stays the text somebody typed
        // rather than becoming a Date that renders as
        // "Thu Aug 14 2025 08:00:00 GMT+0800" on the page.
        const parsed = load(text, { schema: CORE_SCHEMA }) ?? {}
        return { code: `export default ${JSON.stringify(parsed)}`, map: null }
      } catch (err) {
        // Name the file. The parser's own message says the line but not the
        // file, which is no help when sixty folders each have one.
        throw new Error(`Could not read ${file}: ${(err as Error).message}`, { cause: err })
      }
    },
  }
}
