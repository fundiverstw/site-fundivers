<script lang="ts">
  import { t } from '$engine/i18n'

  // A fill-the-parent cover image with a graceful "pending image" placeholder.
  // Drop into any `relative` box (cards, heroes). The site serves only its own
  // bundled photos, so if `src` is empty — or points at an image we don't have
  // locally (onerror) — we show the placeholder instead of a broken image.
  //
  // `priority` is for the one image a page is *about* — a detail page's hero.
  // Those are almost always the largest thing on screen, so lazy-loading them
  // means the browser waits for layout before it even asks for the photo the
  // visitor came to see. Cards below the fold want the opposite; they stay lazy.
  let {
    src = null,
    alt = '',
    priority = false,
    imgClass = 'absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
  }: { src?: string | null; alt?: string; priority?: boolean; imgClass?: string } = $props()

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
    {src}
    {alt}
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
