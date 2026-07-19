/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Photo captions are written in YAML and turned into data while the site is
// built (vite.yaml.ts). This tells the type checker what an import of one is
// worth: an object whose shape is not known here, so callers cast it — see
// PhotoMeta in content/photo-gallery.ts.
declare module '*.yaml' {
  const data: Record<string, unknown>
  export default data
}
declare module '*.yml' {
  const data: Record<string, unknown>
  export default data
}
