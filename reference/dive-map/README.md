# Dive-site map — reference (port to Svelte)

This is the interactive dive-site map lifted out of **app-fundivers** (the booking
app). It was removed there because the geographic map belongs on the public site,
not the booking app. It's the natural fit for the **Sites** section here.

**Status:** React (TSX), as it lived in app-fundivers. It needs porting to Svelte 5
to run in this project — these files are kept verbatim as the reference
implementation, not wired in.

## What's here

- `MapPage.tsx` — the whole feature: an inline SVG map of Taiwan with clickable
  regions, a per-region site list, and links out to each site's travel page.
  Contains the region metadata (center / bbox / description / zoom for keelung,
  longdong, yilan, greenisland, lanyu, xiaoliuqiu, kenting, penghu) and the
  lon/lat → SVG projection math (`VIEW_W`, `COS_MID_LAT`, `LON_MIN`, …).
- `taiwan.geo.json` — offline Taiwan coastline (GADM 4.1), drawn as the base shape.
- `dive-site-links.ts` — `wixSiteUrl(slug)` builds a travel-destination URL from a
  dive site's `wix_slug`.
- `MapIcon.tsx` — the nav icon that opened the map.
- `*.test.tsx` — the original React tests (region interaction, external links).

## Porting notes

- **Data:** reads the `dive_sites` table (Supabase, public/anon read) — coordinates,
  `region`, `wix_slug`. This project already has an anon Supabase client, so the
  query ports directly; only the rendering needs rewriting in Svelte.
- **Rendering:** the SVG projection + region hit-testing is framework-agnostic
  logic — copy it as-is; swap the React state/JSX for Svelte runes + markup.
- `taiwan.geo.json` can move straight into `src/lib` (or `src/assets`) unchanged.
- The travel-destination base URL (`wixSiteUrl`) came from app config
  (`siteConfig.urls.travelDestinationsBase`); source it from this project's config
  instead.
