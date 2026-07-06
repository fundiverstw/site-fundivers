<script lang="ts">
  import { fade } from 'svelte/transition'
  import { ADS } from '../lib/config'
  import MascotChar from './MascotChar.svelte'

  // The character lives hidden behind the logo. Every so often he slides out
  // from the logo's right edge, wiggles around a little, then ducks back home.
  // tx/ty: hidden position in % of his own width/height. HIDDEN tucks him far
  // enough LEFT and UP that his dangling arms clear the logo PNG's transparent
  // bottom padding (the mask graphic narrows there, so without the lift a leg
  // peeked out below the logo). Peeked = translate(-12%, 0). `wiggle` is the
  // small random nudge while he's out.
  const HIDDEN_X = -135
  const HIDDEN_Y = -34
  let i = $state(0)
  let tx = $state(HIDDEN_X)
  let ty = $state(HIDDEN_Y)
  let wiggle = $state('')

  let ad = $derived(ADS[i])

  $effect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const after = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
    const rnd = (a: number) => (Math.random() * 2 - 1) * a

    // Rotate the banner text while he's out.
    const adTimer = ADS.length > 1 ? setInterval(() => (i = (i + 1) % ADS.length), 5000) : undefined

    const reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      tx = -14; ty = 0 // just sit out, no motion
      return () => { if (adTimer) clearInterval(adTimer) }
    }

    let wigs = 0
    function retreat() {
      wiggle = ''
      tx = HIDDEN_X; ty = HIDDEN_Y
      after(9000 + Math.random() * 9000, peek) // next peek after 9–18s
    }
    function doWiggle() {
      if (wigs++ >= 5) {
        after(600, retreat)
        return
      }
      wiggle = `translate(${rnd(9)}px, ${rnd(6)}px) rotate(${rnd(7)}deg)`
      after(360, doWiggle)
    }
    function peek() {
      tx = -12; ty = 0
      wigs = 0
      after(550, doWiggle)
    }

    after(3000, peek) // first appearance 3s after load

    return () => {
      timers.forEach(clearTimeout)
      if (adTimer) clearInterval(adTimer)
    }
  })
</script>

{#if ADS.length}
  <div
    class="pointer-events-none absolute bottom-0 left-full z-10 hidden w-44 xl:block"
    style={`transform: translate(${tx}%, ${ty}%); transition: transform 0.55s cubic-bezier(0.34, 1.3, 0.4, 1);`}
  >
    <div class="flex flex-col items-center" style={`transform: ${wiggle}; transition: transform 0.25s ease;`}>
      <a
        href={ad.href}
        class="pointer-events-auto block w-full rounded-2xl border-2 border-amber-300 bg-amber-400 px-3 py-1.5 text-center text-xs font-bold leading-tight text-brand-950 shadow-lg"
      >
        {#key i}
          <span in:fade={{ duration: 250 }} class="block">{ad.text}</span>
        {/key}
      </a>
      <div class="-mt-1">
        <MascotChar size={54} />
      </div>
    </div>
  </div>
{/if}
