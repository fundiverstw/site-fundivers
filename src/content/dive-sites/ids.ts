// Just the dive-site ids — the folder names beside this file, and nothing else.
//
// A dive site's page is at the root of the site (`/82-5`, `/bat-cave`), so the
// router has to know which addresses are dive sites before it can decide what
// serves them. Importing the catalog to find that out would pull every site's
// row, name and tagline into the entry bundle, on every page, to answer a
// question about a string.
//
// `import.meta.glob` without `eager` hands back a map of path → loader. The
// keys are resolved at build time; the modules behind them are never fetched.
// So this costs one array of strings.
const folders = import.meta.glob('./*/site.ts')

/** Every dive-site id, sorted, so the order is stable between builds. */
export const DIVE_SITE_IDS: string[] = Object.keys(folders)
  .map((path) => path.split('/')[1])
  .sort()

const ids = new Set(DIVE_SITE_IDS)

/** Is this the id of a dive site? */
export function isDiveSiteId(id: string): boolean {
  return ids.has(id)
}
