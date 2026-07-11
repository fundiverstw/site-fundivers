<script lang="ts">
  import { t } from '$engine/i18n'
  import { radioState, toggleRadio } from '$engine/radio'
  import RadioIcon from './RadioIcon.svelte'
</script>

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
