<script lang="ts">
  import { SOCIAL } from '$content/settings'
  import { t } from '$engine/i18n'
  import { radioState, toggleRadio } from '$engine/radio'
  import RadioIcon from './RadioIcon.svelte'

  // Idle shows only the radio icon, so the nav stays as narrow as it was (the
  // 'whole navigation fits' test). The LIVE badge and the full-site link appear
  // once a visitor actually starts it, or if the stream can't be reached.
  let active = $derived($radioState !== 'idle')
</script>

<div class="flex items-center gap-1">
  <button
    type="button"
    onclick={toggleRadio}
    aria-label={$t.nav.radio}
    aria-pressed={$radioState === 'playing'}
    title={$t.nav.radio}
    class="module flex items-center gap-1.5 rounded-xl px-2 py-2 text-brand-50"
    class:module-active={$radioState === 'playing' || $radioState === 'loading'}
  >
    <RadioIcon size={28} />
    {#if $radioState === 'loading'}
      <span class="mono text-xs font-semibold text-reef-200">···</span>
    {:else if $radioState === 'playing'}
      <span class="live mono"><span class="dot"></span>LIVE</span>
    {:else if $radioState === 'error'}
      <span class="mono text-xs font-semibold text-peach">off air</span>
    {/if}
  </button>

  {#if active}
    <a
      href={SOCIAL.radio}
      target="_blank"
      rel="noopener"
      aria-label={$t.nav.radioSite}
      title={$t.nav.radioSite}
      class="module rounded-xl px-2 py-2 text-brand-200 hover:text-brand-50"
    >
      <!-- Lucide "external-link" (arrow) -->
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    </a>
  {/if}
</div>

<style>
  .live {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-reef-200);
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-peach);
    box-shadow: 0 0 6px var(--color-peach);
    animation: pulse 1.4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .dot {
      animation: none;
    }
  }
</style>
