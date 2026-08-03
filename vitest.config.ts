import { defineConfig } from 'vitest/config'
import { alias } from './vite.alias'
import { yamlPlugin } from './vite.yaml'
import { imagesPlugin } from './vite.images'

// Unit tests. These run in Node with no browser and no network: they cover the
// pure functions in src/engine/ and the shape of the data in src/content/.
//
// Anything that needs a real page rendered belongs in e2e/ instead (Playwright).
export default defineConfig({
  plugins: [yamlPlugin(), imagesPlugin()],
  resolve: { alias },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // A test that reads files from disk (e.g. scanning the gallery folders)
    // resolves them from the project root, so keep the working directory fixed.
    root: import.meta.dirname,

    // `npm run test:coverage`. Measured over engine/ and content/ only — the
    // Svelte components and pages are covered by the browser tests, and folding
    // them in here would report a number that means nothing either way.
    //
    // The thresholds are a ratchet, set just under what the suite currently
    // reaches. They are not a target to optimise: a test written to colour in a
    // line is worse than no test, because it looks like cover. They exist to
    // fail the day a new module lands with nothing exercising it at all.
    //
    // Three modules sit at zero here on purpose — i18n.ts, radio.ts and
    // supabase.ts talk to localStorage, <audio> and the network, and are driven
    // by e2e/language.spec.ts, e2e/radio.spec.ts and the contract test instead.
    // router.ts is partly covered for the same reason: its link-exclusion rules
    // are unit-tested, its navigation is not.
    coverage: {
      include: ['src/engine/**', 'src/content/**'],
      exclude: ['**/*.test.ts', '**/__fixtures__/**'],
      thresholds: { statements: 85, branches: 72, functions: 85, lines: 87 },
    },
  },
})
