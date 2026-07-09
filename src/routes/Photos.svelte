<script lang="ts">
  import { SOCIAL } from '../lib/config'
  import { t } from '../lib/i18n'
  import { GALLERY, ALL_PHOTOS } from '../lib/gallery'
  import PageHeader from '../components/PageHeader.svelte'

  // Lightbox: index into ALL_PHOTOS, or null when closed.
  let lightbox = $state<number | null>(null)

  function open(src: string) {
    lightbox = ALL_PHOTOS.indexOf(src)
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
</script>

<svelte:window onkeydown={onKey} />

<PageHeader title={$t.photos.title} subtitle={$t.photos.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
  <!-- Jump-to-section pills -->
  <div class="mb-8 flex flex-wrap gap-3">
    {#each GALLERY as sect (sect.key)}
      <a
        href={`#${sect.key}`}
        class="waybar mono rounded-full px-5 py-2 text-sm font-semibold text-brand-50 transition-colors hover:text-reef-300"
      >
        {$t.photos.sections[sect.key as keyof typeof $t.photos.sections]}
      </a>
    {/each}
  </div>

  {#each GALLERY as sect (sect.key)}
    <div id={sect.key} class="mb-12 scroll-mt-24">
      <h2 class="mb-5 flex items-center gap-2 text-2xl font-bold text-white">
        <span class="mono text-reef-400">▹</span>{$t.photos.sections[sect.key as keyof typeof $t.photos.sections]}
      </h2>
      <!-- Masonry via CSS columns so each landscape shot keeps its aspect. -->
      <div class="[column-fill:_balance] gap-3 sm:columns-2 lg:columns-3">
        {#each sect.images as src (src)}
          <button
            type="button"
            onclick={() => open(src)}
            class="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 shadow-sm transition-all duration-300 hover:border-reef-400/60 hover:shadow-[0_0_26px_-8px_rgba(44,208,197,0.6)]"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              class="block w-full transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        {/each}
      </div>
    </div>
  {/each}

  <div class="glass rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.photos.seeMore}</h2>
    <p class="mt-2 text-brand-100">{$t.photos.follow}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href={SOCIAL.instagram} target="_blank" rel="noopener" class="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Instagram
      </a>
      <a href={SOCIAL.youtube} target="_blank" rel="noopener" class="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">
        YouTube
      </a>
    </div>
  </div>
</section>

{#if lightbox !== null}
  <!-- Lightbox overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    onclick={(e) => { if (e.target === e.currentTarget) close() }}
    role="presentation"
  >
    <img
      src={ALL_PHOTOS[lightbox]}
      alt=""
      class="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
    />

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
      onclick={(e) => { e.stopPropagation(); step(-1) }}
      aria-label={$t.photos.prev}
      class="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:left-6"
    >
      ‹
    </button>
    <button
      type="button"
      onclick={(e) => { e.stopPropagation(); step(1) }}
      aria-label={$t.photos.next}
      class="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:right-6"
    >
      ›
    </button>
    <span class="mono absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
      {lightbox + 1} / {ALL_PHOTOS.length}
    </span>
  </div>
{/if}
