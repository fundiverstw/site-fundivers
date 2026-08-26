<script lang="ts">
  import { onMount } from 'svelte'
  import { t } from '$engine/i18n'
  import { createWorld, step, type Input, type World } from '$engine/arcade'

  // Davey's arcade — the easter egg you get to by finding him hiding in the
  // footer. The rules are in $engine/arcade.ts, which knows nothing about
  // drawing; this page owns the canvas, the keys and the frame clock, and
  // nothing else. Anything here that starts to look like a rule belongs there,
  // where it can be tested without a browser.

  type Phase = 'ready' | 'playing' | 'paused' | 'over'

  /** The world is a fixed size and the canvas is scaled to fit it. Play is the
   *  same on a laptop and a phone — a wider screen would otherwise mean more
   *  room to run away in. */
  const W = 900
  const H = 560

  let canvas: HTMLCanvasElement
  let phase = $state<Phase>('ready')
  let score = $state(0)
  let best = $state(0)
  let wave = $state(1)
  let lives = $state(3)
  let line = $state('')

  // Held rather than $state: the frame loop reads them sixty times a second and
  // nothing in the markup depends on them, so making them reactive would only
  // buy pointless work.
  let world: World | null = null
  const keys: Input = { left: false, right: false, thrust: false, fire: false }
  const touch: Input = { left: false, right: false, thrust: false, fire: false }
  let saidTimes = 0

  /** Davey's next line. A rotation rather than a random pick: the same taunt
   *  twice running reads like the game is stuck. */
  // The same way the dive-site and course pages do it — this site has no head
  // manager, just an effect per page that has a title of its own.
  $effect(() => {
    document.title = `${$t.arcade.title} · FunDivers TW`
  })

  function say() {
    const lines = $t.arcade.taunts
    line = lines[saidTimes % lines.length]
    saidTimes += 1
  }

  function begin() {
    // The seed is the one place the game is allowed to be unpredictable, and it
    // is drawn here rather than in the engine so that the engine stays replayable.
    world = createWorld(W, H, Math.floor(Math.random() * 1e9))
    score = 0
    wave = 1
    lives = 3
    saidTimes = 0
    say()
    phase = 'playing'
  }

  function pause() {
    if (phase === 'playing') phase = 'paused'
  }

  function toggle() {
    if (phase === 'playing') phase = 'paused'
    else if (phase === 'paused') phase = 'playing'
    else begin()
  }

  function rememberBest() {
    if (score <= best) return
    best = score
    try {
      localStorage.setItem('arcade-best', String(score))
    } catch {
      /* private window, or storage turned off — the score just does not stick */
    }
  }

  // ── Input ────────────────────────────────────────────────────────────────
  // Keys and on-screen buttons are two sources for one set of flags: a phone
  // has no arrow keys, and a laptop should not have to use the buttons.

  const CONTROLS: Record<string, keyof Input> = {
    ArrowLeft: 'left',
    a: 'left',
    A: 'left',
    ArrowRight: 'right',
    d: 'right',
    D: 'right',
    ArrowUp: 'thrust',
    w: 'thrust',
    W: 'thrust',
    ' ': 'fire',
  }

  function onKeyDown(e: KeyboardEvent) {
    const el = e.target as HTMLElement | null
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return

    if (e.key === 'p' || e.key === 'P') {
      toggle()
      return
    }
    if (e.key === 'Enter' && phase !== 'playing') {
      begin()
      return
    }

    const control = CONTROLS[e.key]
    if (!control) return
    // Space scrolls the page and the arrows scroll it further; while the game
    // is up they are the controls and nothing else.
    e.preventDefault()
    if (phase === 'ready' || phase === 'over') begin()
    keys[control] = true
  }

  function onKeyUp(e: KeyboardEvent) {
    const control = CONTROLS[e.key]
    if (control) keys[control] = false
  }

  /** A button on the touch pad. `pointerdown`/`up` rather than click: a control
   *  you hold down has no click. */
  function hold(control: keyof Input, down: boolean) {
    touch[control] = down
    if (down && (phase === 'ready' || phase === 'over')) begin()
  }

  // ── The loop ─────────────────────────────────────────────────────────────

  onMount(() => {
    try {
      best = Number(localStorage.getItem('arcade-best')) || 0
    } catch {
      /* ignore */
    }

    const ctx = canvas.getContext('2d')
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = (now - last) / 1000
      last = now

      if (world && phase === 'playing') {
        const input: Input = {
          left: keys.left || touch.left,
          right: keys.right || touch.right,
          thrust: keys.thrust || touch.thrust,
          fire: keys.fire || touch.fire,
        }
        step(world, dt, input)

        score = world.score
        wave = world.wave
        lives = world.lives
        // The engine reports what happened; the words are ours.
        for (const event of world.events) {
          if (event === 'wave' || event === 'hit') say()
        }
        if (world.over) {
          phase = 'over'
          rememberBest()
        }
      }

      if (ctx) draw(ctx)
    }
    frame = requestAnimationFrame(tick)

    // Leaving the tab pauses rather than piling up: the engine clamps a long
    // step so nothing tunnels, but coming back to a game that has been playing
    // itself in the dark is still a surprise nobody wants.
    const onHidden = () => document.hidden && pause()
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('blur', pause)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('blur', pause)
    }
  })

  // ── Drawing ──────────────────────────────────────────────────────────────
  // Davey is drawn here in canvas rather than reusing $components/Davey.svelte:
  // that file is SVG and this is a bitmap surface. He is the same octopus in
  // spirit — pink body, big eyes, eight arms — but they are two drawings, and
  // changing his face in one does not change it in the other.

  function drawDavey(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)

    // Arms trail behind whichever way he is swimming.
    ctx.strokeStyle = '#e2618f'
    ctx.lineCap = 'round'
    for (let i = 0; i < 8; i++) {
      const spread = ((i - 3.5) / 3.5) * 1.1
      ctx.beginPath()
      ctx.lineWidth = 4 - Math.abs(spread) * 1.2
      ctx.moveTo(-4, 0)
      ctx.quadraticCurveTo(-16, Math.sin(spread) * 12, -26, Math.sin(spread) * 20)
      ctx.stroke()
    }

    ctx.fillStyle = '#fb7fb0'
    ctx.beginPath()
    ctx.ellipse(0, 0, 17, 14, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.arc(6, side * 6, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#33314a'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.arc(8, side * 6, 2.4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  /** A diver, drawn side-on: tank, body, mask, and a pair of fins doing none of
   *  the work. Scaled from the 42px group down to the 15px single. */
  function drawDiver(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number) {
    const s = r / 42
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(a)
    ctx.scale(s, s)

    // Tank
    ctx.fillStyle = '#8fa3b8'
    ctx.fillRect(-34, -12, 16, 24)
    // Body
    ctx.fillStyle = '#1d3557'
    ctx.beginPath()
    ctx.ellipse(0, 0, 32, 16, 0, 0, Math.PI * 2)
    ctx.fill()
    // Mask
    ctx.fillStyle = '#2cd0c5'
    ctx.beginPath()
    ctx.ellipse(24, -4, 9, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    // Fins, splayed the wrong way, as ever
    ctx.fillStyle = '#f2a65a'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(-30, side * 8)
      ctx.lineTo(-52, side * 22)
      ctx.lineTo(-44, side * 4)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }

  function draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, W, H)
    const water = ctx.createLinearGradient(0, 0, 0, H)
    water.addColorStop(0, '#0e2a44')
    water.addColorStop(1, '#071b2e')
    ctx.fillStyle = water
    ctx.fillRect(0, 0, W, H)

    if (!world) return

    // Ink is nearly black and the water is nearly black, so each pellet gets a
    // violet halo. Without it they are invisible against the bottom of the
    // screen and the game looks like it is not firing.
    ctx.lineWidth = 1.5
    ctx.strokeStyle = 'rgba(168,148,255,0.65)'
    ctx.fillStyle = '#0b0f1a'
    for (const p of world.pellets) {
      ctx.beginPath()
      ctx.arc(p.pos.x, p.pos.y, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    for (const d of world.divers) drawDiver(ctx, d.pos.x, d.pos.y, d.radius, d.angle)

    // Blinking while he is untouchable, so the reader can see why nothing is
    // happening to them.
    const d = world.davey
    const blink = d.shielded > 0 && Math.floor(d.shielded * 8) % 2 === 0
    if (!blink) drawDavey(ctx, d.pos.x, d.pos.y, d.angle)
  }
</script>

<svelte:window onkeydown={onKeyDown} onkeyup={onKeyUp} />

<section class="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
  <h1 class="text-2xl font-bold text-white sm:text-3xl">{$t.arcade.title}</h1>
  <p class="mt-2 max-w-2xl text-sm text-brand-100">{$t.arcade.subtitle}</p>

  <!-- The score line is real text rather than something painted into the
       canvas: it is the part of the game a screen reader can follow, and it is
       the part a reader actually reads. -->
  <div class="mono mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-reef-200">
    <span>{$t.arcade.score}: <b class="text-white" data-testid="arcade-score">{score}</b></span>
    <span>{$t.arcade.best}: <b class="text-white">{best}</b></span>
    <span>{$t.arcade.wave}: <b class="text-white">{wave}</b></span>
    <span>{$t.arcade.lives}: <b class="text-white">{'●'.repeat(lives) || '—'}</b></span>
  </div>

  <div class="relative mt-3 overflow-hidden rounded-2xl border border-white/15 shadow-lg">
    <canvas
      bind:this={canvas}
      width={W}
      height={H}
      data-testid="arcade-canvas"
      aria-hidden="true"
      class="block h-auto w-full bg-brand-950"
    ></canvas>

    <!-- Davey talks over the top of his own game. Placed in the DOM rather than
         painted in, so the lines are translated with everything else and can be
         read out. -->
    {#if phase === 'playing' && line}
      <p
        data-testid="arcade-taunt"
        aria-live="polite"
        class="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-brand-950/80 px-3 py-2 text-center text-xs text-reef-100 sm:text-sm"
      >
        “{line}”
      </p>
    {/if}

    {#if phase !== 'playing'}
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-950/70">
        {#if phase === 'over'}
          <p class="text-xl font-bold text-white">{$t.arcade.over}</p>
          <p class="mono text-sm text-reef-200">{$t.arcade.score}: {score}</p>
        {:else if phase === 'paused'}
          <p class="text-xl font-bold text-white">{$t.arcade.paused}</p>
        {/if}
        <button
          type="button"
          onclick={() => (phase === 'paused' ? (phase = 'playing') : begin())}
          data-testid="arcade-start"
          class="module-active mono rounded-xl border border-reef-400/50 px-5 py-2 text-base font-bold"
        >
          {phase === 'paused'
            ? $t.arcade.resume
            : phase === 'over'
              ? $t.arcade.again
              : $t.arcade.start}
        </button>
        <p class="max-w-sm px-4 text-center text-xs text-brand-200">{$t.arcade.keys}</p>
      </div>
    {/if}
  </div>

  <!-- Touch controls. Shown to everyone: they are the only way to play on a
       phone, and on a laptop they are a hint about what the keys do. -->
  <div class="mt-3 flex items-center justify-between gap-2">
    <div class="flex gap-2">
      {#each [{ k: 'left' as const, label: $t.arcade.left, glyph: '◀' }, { k: 'right' as const, label: $t.arcade.right, glyph: '▶' }, { k: 'thrust' as const, label: $t.arcade.thrust, glyph: '▲' }] as c (c.k)}
        <button
          type="button"
          aria-label={c.label}
          class="module h-12 w-14 rounded-xl border border-white/15 text-lg text-white select-none"
          onpointerdown={() => hold(c.k, true)}
          onpointerup={() => hold(c.k, false)}
          onpointerleave={() => hold(c.k, false)}
          onpointercancel={() => hold(c.k, false)}
        >
          {c.glyph}
        </button>
      {/each}
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        aria-label={$t.arcade.fire}
        class="module mono h-12 rounded-xl border border-reef-400/50 px-5 font-bold text-reef-200 select-none"
        onpointerdown={() => hold('fire', true)}
        onpointerup={() => hold('fire', false)}
        onpointerleave={() => hold('fire', false)}
        onpointercancel={() => hold('fire', false)}
      >
        {$t.arcade.fire}
      </button>
      <button
        type="button"
        onclick={pause}
        class="module mono h-12 rounded-xl border border-white/15 px-4 text-brand-100"
      >
        {$t.arcade.pause}
      </button>
    </div>
  </div>

  <p class="mt-6 text-sm">
    <a href="/" class="mono font-semibold text-reef-300 hover:text-reef-200"
      >← {$t.arcade.backHome}</a
    >
  </p>
</section>
