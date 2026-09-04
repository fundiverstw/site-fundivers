<script lang="ts">
  import { t } from '$engine/i18n'
  import { radioState, toggleRadio } from '$engine/radio'
  import { SOCIAL } from '$content/settings'
  import PageHeader from '$components/PageHeader.svelte'
  import RadioIcon from '$components/RadioIcon.svelte'
  import SocialIcons from '$components/SocialIcons.svelte'

  // The show's own page. It drives the same stream as the button in the bar —
  // one <audio> element in $engine/radio, one piece of state — so starting it
  // here and navigating away keeps it playing, and the bar's button stops it.
  //
  // Nothing connects on load: the stream is only reached when someone presses
  // play, which is why arriving here while the show is off air is silent rather
  // than a failed request.

  let playing = $derived($radioState === 'playing')
  let busy = $derived($radioState === 'loading')

  let status = $derived(
    playing
      ? $t.radio.live
      : busy
        ? $t.radio.connecting
        : $radioState === 'error'
          ? $t.radio.offAir
          : '',
  )
</script>

<PageHeader title={$t.radio.title} subtitle={$t.radio.subtitle} />

<section class="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
  <div class="glass rounded-3xl border border-white/10 p-8 text-center shadow-sm sm:p-10">
    <div
      class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/15 text-reef-300"
      class:border-reef-400={playing}
    >
      <RadioIcon size={44} />
    </div>

    {#if status}
      <p
        class="mono mt-5 flex items-center justify-center gap-2 text-t3 font-semibold uppercase tracking-widest"
        class:text-reef-200={playing || busy}
        class:text-peach={$radioState === 'error'}
      >
        {#if playing}<span class="dot" aria-hidden="true"></span>{/if}
        {status}
      </p>
    {/if}

    <button
      type="button"
      onclick={toggleRadio}
      aria-pressed={playing}
      class="mono mt-6 rounded-full bg-reef-400 px-8 py-3 font-semibold text-brand-950 shadow-[0_0_24px_-6px_rgba(44,208,197,0.8)] transition-colors hover:bg-reef-300"
    >
      {playing || busy ? $t.radio.stop : $t.radio.listen}
    </button>

    <p class="mt-5 text-t3 text-brand-100">
      {$radioState === 'error' ? $t.radio.offAirText : $t.radio.idleText}
    </p>
  </div>

  <div class="mt-8 space-y-5 leading-relaxed text-brand-100">
    {#each $t.radio.intro as para (para)}
      <p>{para}</p>
    {/each}
  </div>

  <p class="mono mt-8 text-t3 text-brand-300">{$t.radio.barHint}</p>

  <div class="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-8">
    <p class="text-t3 text-brand-100">{$t.photos.follow}</p>
    <SocialIcons size={26} />
    <!-- The mount the player connects to, spelled out for anyone who would
         rather point their own player at it than use ours. -->
    <a
      href={SOCIAL.radioStream}
      target="_blank"
      rel="noopener"
      class="mono break-all text-t4 text-brand-300 hover:text-brand-100"
    >
      {SOCIAL.radioStream}
    </a>
  </div>
</section>

<style>
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-peach);
    box-shadow: 0 0 8px var(--color-peach);
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
