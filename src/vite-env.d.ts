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

// A photo imported directly rather than through one of the folder globs —
// `import youbike from './youbike.jpg?responsive'`. The `?responsive` query is
// answered by vite.images.ts with the sized copies plus their srcset, which is
// what Photo/CoverPhoto take. Without this the type checker only knows the
// unsuffixed image modules vite/client declares, and a direct import fails to
// resolve.
declare module '*?responsive' {
  const image: import('./engine/responsive-image').ResponsiveImage
  export default image
}
