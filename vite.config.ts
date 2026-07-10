import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { alias } from './vite.alias'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: { alias },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // Borrowed libraries go in their own file, separate from our code.
        //
        // Two reasons. Our code changes every deploy; supabase-js and date-fns
        // change a few times a year, so a returning visitor re-downloads only
        // the part that actually moved. And it keeps each file under the 500 kB
        // that Vite warns about — together they were 600 kB in one lump, of
        // which supabase-js alone is 205 kB.
        manualChunks: {
          vendor: ['@supabase/supabase-js', 'date-fns'],
        },
      },
    },
  },
})
