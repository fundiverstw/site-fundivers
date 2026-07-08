import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

// Read-only public client for the same Supabase project as app-fundivers.
// No auth: this site never signs anyone in — RLS exposes only public catalog
// rows (events, travel_destinations, prices, cert_levels) to `anon`. Dive-site
// map data is bundled locally now (see dive-sites.data.ts), not read from here.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
