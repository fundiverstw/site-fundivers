import { defineConfig, devices } from '@playwright/test'

// End-to-end tests. These drive a real browser against the real built site —
// the same files `npm run deploy` uploads — so they catch what unit tests cannot:
// a component that throws on mount, a route that renders nothing, a photo whose
// path is wrong.
//
// They do NOT talk to the booking app's database. Every request to it is
// intercepted and answered with an empty list (see e2e/helpers.ts), so a run is
// deterministic, needs no password, and does not depend on the network.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',

    // Ask every page for less motion. Without it the octopus beside the logo
    // stays hidden for 12 seconds, slides out, wiggles, and hides again for up
    // to 90 — so a test that waits on the mascot's banner is racing that cycle.
    // With reduced motion it simply sits there in view.
    //
    // It goes under `contextOptions`, not straight into `use`. `reducedMotion`
    // is a browser-context option, not one of the test options, so a top-level
    // `use: { reducedMotion: 'reduce' }` is a type error — and if the config
    // file is not type-checked, it is silently ignored instead.
    contextOptions: { reducedMotion: 'reduce' },
  },

  projects: [
    // Every spec runs in both projects, except the handful that only make sense
    // in one — e.g. the desktop-nav layout tests, which only apply at 1280px and
    // wider. Excluding them by tag means they never appear as "skipped": each
    // test either runs or is not collected.
    {
      name: 'desktop',
      // Wide enough for the nav mascot, which is hidden below 1280px.
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      grepInvert: /@mobile-only/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      grepInvert: /@desktop-only/,
    },
  ],

  // Build the site and serve it exactly as Cloudflare will.
  //
  // reuseExistingServer is off on purpose. With it on, a `vite preview` left
  // running from an earlier run gets reused, the build never happens, and the
  // suite passes against stale files — green tests for code that is not there.
  // The rebuild costs about two seconds. Pay it.
  webServer: {
    command: 'npx vite build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
