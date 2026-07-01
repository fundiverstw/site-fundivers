# Hidden mini-games — reference (port to Svelte)

FunDivers' three easter-egg mini-games, lifted out of the booking app. They were
removed there because they're shop whimsy, not dive-center functionality — the
open-source platform shouldn't ship them. They belong on the public site as a bit
of fun.

**Status:** React (TSX), as they lived in the app. They need porting to Svelte 5
to run here — kept verbatim as the reference implementation, not wired in.

## What's here

- `EelPage.tsx`, `TurtlerPage.tsx`, `NudibranchoutPage.tsx` — the three games
  (full self-contained pages; each was routed at `/minigame/*`).
- `Bouncer.tsx` — the shared "a creature bounces around the home screen; click it
  while visible to launch that game" easter-egg mechanic.
- `EelBouncer.tsx`, `FrogBouncer.tsx`, `NudibranchBouncer.tsx` — the per-game
  bouncers that were rendered on the app's dashboard.
- `creature-icons.tsx` — the SVG creature icons the bouncers use.

## Porting notes

- The games are self-contained canvas/DOM + timer logic — the game loops port
  directly; only the React state/JSX shell needs rewriting in Svelte.
- The bouncer mechanic (`Bouncer.tsx`) is pointer-math + a visibility timer — also
  framework-agnostic logic.
- They used the raw Tailwind `slate-*` palette (never the app's brand tokens), so
  no theme wiring is needed.
