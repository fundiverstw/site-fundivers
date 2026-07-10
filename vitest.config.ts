import { defineConfig } from 'vitest/config'
import { alias } from './vite.alias'

// Unit tests. These run in Node with no browser and no network: they cover the
// pure functions in src/engine/ and the shape of the data in src/content/.
//
// Anything that needs a real page rendered belongs in e2e/ instead (Playwright).
export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // A test that reads files from disk (checking every gallery photo exists)
    // resolves them from the project root, so keep the working directory fixed.
    root: import.meta.dirname,
  },
})
