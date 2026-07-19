<script lang="ts">
  import { SOCIAL } from '$content/settings'
  import { t } from '$engine/i18n'
  import { scrollToId, hashId } from '$engine/router'
  import { GALLERY, ALL_PHOTOS, type PhotoMeta } from '$content/photo-gallery'
  import PageHeader from '$components/PageHeader.svelte'

  // The section open when you arrive with no anchor. Everything else starts
  // shut: there is one section per creature in the marine-life vocabulary —
  // about sixty — and opening them all would mean laying out and decoding every
  // photo on the site to show you the one you came for.
  const AUTO_OPEN = 'nudibranchs'

  // `open` holds the keys currently expanded.
  let open = $state<Record<string, boolean>>({ [AUTO_OPEN]: true })

  // Lightbox: index into ALL_PHOTOS, or null when closed.
  let lightbox = $state<number | null>(null)
  let shown = $derived(lightbox === null ? null : ALL_PHOTOS[lightbox])

  function show(src: string) {
    // Guard the -1: a miss would leave the viewer "open" on nothing, showing no
    // picture but still answering the arrow keys.
    const i = ALL_PHOTOS.findIndex((p) => p.src === src)
    if (i >= 0) lightbox = i
  }
  function close() {
    lightbox = null
  }
  function step(delta: number) {
    if (lightbox === null) return
    lightbox = (lightbox + delta + ALL_PHOTOS.length) % ALL_PHOTOS.length
  }

  function onKey(e: KeyboardEvent) {
    if (lightbox === null) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
  }

  // Arriving at /photos#moray_eels — from a dive-site chip, a jump-to pill, or
  // the back button — opens that section and scrolls to it. Without this the
  // browser would jump to a collapsed heading and appear to do nothing.
  function reveal(key: string) {
    const section = GALLERY.find((s) => s.key === key)
    if (!section) return
    // Only mark a section open if it has something to open. An empty one stays
    // shut and stays `aria-expanded="false"`, which is what it is: a heading
    // saying "coming soon", not a container hiding anything.
    if (section.photos.length) open[key] = true
    scrollToId(key)
  }

  function openFromHash() {
    const key = hashId()
    if (key) reveal(key)
  }

  $effect(() => {
    openFromHash()
    // `hashchange` covers clicking a pill while already here. `app:navigate` is
    // the router's own event: it moves between pages with pushState, which does
    // not fire hashchange, so arriving from a dive-site chip needs this one.
    window.addEventListener('hashchange', openFromHash)
    window.addEventListener('app:navigate', openFromHash)
    return () => {
      window.removeEventListener('hashchange', openFromHash)
      window.removeEventListener('app:navigate', openFromHash)
    }
  })

  /** The caption rows to show for a photo, skipping anything not filled in. */
  function captionRows(meta: PhotoMeta): Array<{ label: string; value: string }> {
    const L = $t.photos.meta
    const rows: Array<{ label: string; value: string }> = []
    if (meta.species) rows.push({ label: L.species, value: meta.species })
    if (meta.commonName) rows.push({ label: L.commonName, value: meta.commonName })
    if (meta.site) rows.push({ label: L.site, value: meta.site })
    if (meta.taken) rows.push({ label: L.taken, value: meta.taken })
    if (meta.depth) rows.push({ label: L.depth, value: meta.depth })
    if (meta.camera) rows.push({ label: L.camera, value: meta.camera })
    if (meta.lens) rows.push({ label: L.lens, value: meta.lens })
    if (meta.settings) rows.push({ label: L.settings, value: meta.settings })
    if (meta.photographer) rows.push({ label: L.photographer, value: meta.photographer })
    return rows
  }
</script>

<svelte:window onkeydown={onKey} />

<PageHeader title={$t.photos.title} subtitle={$t.photos.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
  <!-- Shortcuts to every group, so the whole gallery is one click away rather
       than a scroll through sixty headings. Groups with no photos yet are here
       too, dimmed: seeing what is missing is half the point of the list. -->
  <!-- On a phone these sixty pills run to twenty rows and push every photo off
       the first screen, so the list gets its own height and scrolls inside it.
       On anything wider they fit in a handful of rows and are left alone. -->
  <nav
    aria-label={$t.photos.jumpTo}
    class="mb-8 flex max-h-44 flex-wrap gap-1.5 overflow-y-auto pr-1 sm:max-h-none sm:overflow-visible sm:pr-0"
  >
    {#each GALLERY as sect (sect.key)}
      <!-- The href keeps this a real link (copyable, middle-clickable). The
           handler is what makes a second click work: if the hash is already the
           one in the address bar the browser fires no event at all, so nothing
           would happen after you collapse a section and click its pill again. -->
      <a
        href={`#${sect.key}`}
        onclick={() => reveal(sect.key)}
        class="mono rounded-full border px-3 py-1 text-xs font-semibold transition-colors {sect
          .photos.length
          ? 'border-reef-400/40 bg-reef-400/10 text-reef-100 hover:border-reef-400 hover:bg-reef-400/20 hover:text-white'
          : 'border-white/10 text-brand-300 hover:border-white/30 hover:text-brand-100'}"
      >
        {sect.label}
      </a>
    {/each}
  </nav>

  <div class="mb-12 space-y-2">
    {#each GALLERY as sect (sect.key)}
      {@const filled = sect.photos.length > 0}
      <div id={sect.key} class="scroll-mt-24">
        <!-- An empty section is aria-disabled rather than disabled: `disabled`
             takes it out of the reading order, and "coming soon" is exactly
             the thing a screen-reader user needs to hear. It carries no
             aria-expanded, because it is not a container that could open. -->
        <button
          type="button"
          onclick={() => filled && (open[sect.key] = !open[sect.key])}
          aria-disabled={!filled}
          aria-expanded={filled ? open[sect.key] === true : undefined}
          class="glass flex w-full items-center gap-3 rounded-2xl px-5 py-3 text-left transition-colors {filled
            ? 'hover:border-reef-400/50'
            : 'cursor-default opacity-55'}"
        >
          <span class="mono text-reef-400" aria-hidden="true">
            {filled ? (open[sect.key] ? '▿' : '▹') : '·'}
          </span>
          <span class="flex-1 text-lg font-bold text-white">{sect.label}</span>
          <span class="mono text-xs text-brand-300">
            {filled ? `${sect.photos.length} ${$t.photos.photoCount}` : $t.photos.comingSoon}
          </span>
        </button>

        {#if filled && open[sect.key]}
          <!-- Masonry via CSS columns so each landscape shot keeps its aspect. -->
          <div class="[column-fill:_balance] mt-3 gap-3 sm:columns-2 lg:columns-3">
            {#each sect.photos as photo, i (photo.src)}
              <button
                type="button"
                onclick={() => show(photo.src)}
                class="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 shadow-sm transition-all duration-300 hover:border-reef-400/60 hover:shadow-[0_0_26px_-8px_rgba(44,208,197,0.6)]"
              >
                <!-- Most photos have no caption yet, so fall back to the section
                     name and a number. An alt of "" on a button leaves the
                     control with no name at all. -->
                <img
                  src={photo.src}
                  alt={photo.meta.commonName ?? photo.meta.species ?? `${sect.label} ${i + 1}`}
                  loading="lazy"
                  class="block w-full transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="glass rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.photos.seeMore}</h2>
    <p class="mt-2 text-brand-100">{$t.photos.follow}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a
        href={SOCIAL.instagram}
        target="_blank"
        rel="noopener"
        class="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Instagram
      </a>
      <a
        href={SOCIAL.youtube}
        target="_blank"
        rel="noopener"
        class="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
      >
        YouTube
      </a>
    </div>
  </div>
</section>

{#if shown}
  <!-- Lightbox overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    onclick={(e) => {
      if (e.target === e.currentTarget) close()
    }}
    role="presentation"
  >
    <div class="flex max-h-full w-full max-w-6xl flex-col items-center gap-4 lg:flex-row">
      <!-- min-w-0: a flex item defaults to min-width:auto, so without it the
           photo refuses to shrink below its natural width and shoves the
           caption panel off the right of the screen. -->
      <img
        src={shown.src}
        alt={shown.meta.commonName ?? shown.meta.species ?? ''}
        class="min-h-0 min-w-0 flex-1 rounded-xl object-contain shadow-2xl"
      />

      <!-- What the picture is, where and how it was taken. Only appears when
           the folder's photos.yaml has something to say about this file. -->
      {#if captionRows(shown.meta).length || shown.meta.notes}
        <aside
          class="glass max-h-full w-full shrink-0 overflow-y-auto rounded-xl p-5 lg:w-72"
          onclick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <dl class="space-y-2 text-sm">
            {#each captionRows(shown.meta) as row (row.label)}
              <div>
                <dt class="mono text-[11px] uppercase tracking-wide text-brand-300">{row.label}</dt>
                <dd class="text-white {row.label === $t.photos.meta.species ? 'italic' : ''}">
                  {row.value}
                </dd>
              </div>
            {/each}
          </dl>
          {#if shown.meta.notes}
            <p class="mt-4 border-t border-white/10 pt-3 text-sm leading-relaxed text-brand-100">
              {shown.meta.notes}
            </p>
          {/if}
        </aside>
      {/if}
    </div>

    <button
      type="button"
      onclick={close}
      aria-label={$t.photos.close}
      class="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
    >
      ✕
    </button>
    <button
      type="button"
      onclick={(e) => {
        e.stopPropagation()
        step(-1)
      }}
      aria-label={$t.photos.prev}
      class="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:left-6"
    >
      ‹
    </button>
    <button
      type="button"
      onclick={(e) => {
        e.stopPropagation()
        step(1)
      }}
      aria-label={$t.photos.next}
      class="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:right-6"
    >
      ›
    </button>
    <span
      class="mono absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80"
    >
      {(lightbox ?? 0) + 1} / {ALL_PHOTOS.length}
    </span>
  </div>
{/if}
