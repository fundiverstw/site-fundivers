// The per-dive-site write-ups for the dive-site detail pages, assembled from
// the `details.ts` in each site folder.
//
// The prose (overview, below/above the surface, how to get there, diver
// requirements) is the shop's own copy, harvested once from the
// fundiverstw.com/traveldestinations/<slug> pages and frozen here. The
// reference data (marine life, depth, season, water temperature, visibility) is
// researched from public diving sources. Static, so the detail pages render
// instantly with no extra round-trip; edit and redeploy to revise.
//
// Not every site needs a details.ts — the detail page degrades gracefully when one
// is missing.
//
// Kept apart from ./index.ts so the /sites and /map list pages do not pull every
// write-up in three languages into their bundle. Only DiveSiteDetail imports
// this, via $engine/i18n-details.

import type { DiveSiteDetails, DiveSiteDetailsFile, DiveSiteDetailsText } from './types'

export type { DiveSiteDetails, DiveSiteDetailsText, DiveSiteDetailsFile } from './types'

const detailFiles = import.meta.glob('./*/details.ts', { eager: true }) as Record<
  string,
  { details: DiveSiteDetailsFile }
>

const loaded = Object.entries(detailFiles).map(([path, mod]) => ({
  id: path.split('/')[1],
  ...mod.details,
}))

export const DIVE_SITE_DETAILS: Record<string, DiveSiteDetails> = Object.fromEntries(
  loaded.map(({ id, ja: _ja, 'zh-TW': _zh, ...details }) => [id, details]),
)

export const diveSiteDetailsJa: Record<string, DiveSiteDetailsText> = Object.fromEntries(
  loaded.map((g) => [g.id, g.ja]),
)

export const diveSiteDetailsZhTW: Record<string, DiveSiteDetailsText> = Object.fromEntries(
  loaded.map((g) => [g.id, g['zh-TW']]),
)
