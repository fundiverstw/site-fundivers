import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'
import prettier from 'eslint-config-prettier/flat'
import svelteConfig from './svelte.config.js'

// The linter. It reads the code without running it and reports mistakes that
// TypeScript does not: unreachable code, a promise nobody waits for, a Svelte
// component that mutates a prop, an accessibility problem in the markup.
//
// Run it with `npm run lint`. `npm run lint:fix` corrects what it can.
//
// Formatting rules are deliberately NOT here — Prettier owns those (see
// .prettierrc). `eslint-config-prettier` switches off every ESLint rule that
// would argue with it, so the two never fight over the same line.
export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.wrangler/',
      'playwright-report/',
      'test-results/',
      'coverage/',
      // Reference material copied from app-fundivers. It is React, it is never
      // compiled into this site, and it does not follow these rules.
      'reference/',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  svelte.configs.recommended,

  // Must come after the configs above so it can switch their stylistic rules off.
  prettier,
  svelte.configs.prettier,

  {
    files: ['src/**/*.{ts,svelte}'],
    languageOptions: { globals: globals.browser },
  },

  {
    // Config files, tests and the Playwright suite run in Node, not a browser.
    files: ['*.config.{js,ts}', 'e2e/**/*.ts', '**/*.test.ts'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
        svelteConfig,
      },
    },
  },

  {
    rules: {
      // An underscore prefix is the agreed way to say "declared, deliberately unused".
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // console.warn and console.error are how this site reports a failed
      // Supabase read. A stray console.log is usually left-over debugging.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // Off, deliberately. Keys matter when a list is reordered or filtered, and
      // every list on this site that does so (the calendar's events) already has
      // one. The 22 blocks this rule flagged all iterate static content — a dive
      // site's highlights, a guide's paragraphs — rendered once and never moved.
      //
      // Worse, the only key available for those is the string itself, and Svelte
      // throws at runtime on a duplicate key. Obeying this rule would turn
      // "somebody listed Nudibranch twice" from a harmless repeat into a blank
      // page. If you add a list that genuinely reorders, key it by hand.
      'svelte/require-each-key': 'off',
    },
  },
)
