<script lang="ts">
  import { fade } from 'svelte/transition'
  import { ADS } from '../lib/config'
  import MascotChar from './MascotChar.svelte'

  // A little character that pops up from behind the logo holding a banner that
  // rotates through promo messages. Desktop-only (there's no room on mobile).
  let i = $state(0)
  $effect(() => {
    if (ADS.length < 2) return
    const id = setInterval(() => (i = (i + 1) % ADS.length), 5000)
    return () => clearInterval(id)
  })
  let ad = $derived(ADS[i])
</script>

{#if ADS.length}
  <div class="mascot pointer-events-none absolute bottom-0 left-[calc(100%-1.5rem)] z-10 hidden w-44 flex-col items-center xl:flex">
    <a
      href={ad.href}
      class="mascot-sign pointer-events-auto block w-full rounded-2xl border-2 border-amber-300 bg-amber-400 px-3 py-1.5 text-center text-xs font-bold leading-tight text-brand-950 shadow-lg"
    >
      {#key i}
        <span in:fade={{ duration: 250 }} class="block">{ad.text}</span>
      {/key}
    </a>
    <div class="mascot-char -mt-1">
      <MascotChar size={54} />
    </div>
  </div>
{/if}
