Line icons, ported from the booking app (`app-fundivers`, `src/components/icons/`)
so the two halves of FunDivers look like one product — the same 24×24 grid, the
same `currentColor` stroke, the same weight.

They are copies, not a shared package: the app is React and this site is Svelte,
and one small folder of paths is cheaper to keep in step by hand than a package
to publish. If you redraw one there, redraw it here.

Every icon takes a `size` (default 20) and inherits its color from the parent,
so a tile can tint it by setting `text-…` on the link.
