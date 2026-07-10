import { defineConfig } from 'vitest/config'
import { alias } from './vite.alias'

// The contract tests. They talk to the real database over the network, so they
// are kept out of `npm run verify` — a Supabase outage must not redden a pull
// request about a typo. Run them with `npm run test:contract`; CI runs them on
// a schedule and shouts if the schema has moved.
export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'node',
    include: ['contract/**/*.test.ts'],
    root: import.meta.dirname,
    // A slow network call is not a flake; a hanging one is.
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
})
