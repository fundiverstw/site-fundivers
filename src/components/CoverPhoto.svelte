<script lang="ts">
  import { t } from '$engine/i18n'
  import { SIZES, type ResponsiveImage } from '$engine/responsive-image'

  // A fill-the-parent cover image with a graceful "pending image" placeholder.
  // Drop into any `relative` box (cards, heroes). The site serves only its own
  // bundled photos, so if `src` is empty — or points at an image we don't have
  // locally (onerror) — we show the placeholder instead of a broken image.
  //
  // `priority` is for the one image a page is *about* — a detail page's hero.
  // Those are almost always the largest thing on screen, so lazy-loading them
  // means the browser waits for layout before it even asks for the photo the
  // visitor came to see. Cards below the fold want the opposite; they stay lazy.
  //
  // `sizes` says how wide this will actually be painted, and it is not optional
  // in practice: `srcset` alone only tells the browser what sizes exist, and a
  // browser with no `sizes` assumes the picture fills the window and takes the
  // largest copy — which is the whole problem the sized copies exist to solve.
  // The default is the card case, because most of these are cards. Anything in
  // a different box passes its own from SIZES.
  let {
    src = null,
    alt = '',
    priority = false,
    sizes = SIZES.card,
    imgClass = 'absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
  }: {
    src?: ResponsiveImage | null
    alt?: string
    priority?: boolean
    sizes?: string
    imgClass?: string
  } = $props()

  let failed = $state(false)
  // Reset the failure flag when the source changes (components are reused in
  // {#each} blocks, so state can carry over between rows).
  $effect(() => {
    void src
    failed = false
  })
</script>

{#if src && !failed}
  <img
    src={src.src}
    srcset={src.srcset}
    {sizes}
    {alt}
    width={src.width}
    height={src.height}
    loading={priority ? 'eager' : 'lazy'}
    fetchpriority={priority ? 'high' : 'auto'}
    onerror={() => (failed = true)}
    class={imgClass}
  />
{:else}
  <div
    class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 text-brand-400/80"
  >
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.6" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
    <span class="mono text-[11px] uppercase tracking-widest">{$t.common.pendingImage}</span>
  </div>
{/if}
