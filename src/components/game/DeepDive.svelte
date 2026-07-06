<script lang="ts">
  // "Deep Dive" — a one-button endless descender easter egg. Kick to rise,
  // gravity sinks you, thread the gaps in the rock columns, dodge jellyfish,
  // and grab air bubbles before your gauge empties. Pure canvas + rAF, no image
  // assets, so it stays tiny and smooth. Rendered as a full-screen overlay.

  let { open = false, onClose }: { open?: boolean; onClose: () => void } = $props()

  // Logical play-field size (canvas is scaled to fit; physics use these units).
  const W = 720
  const H = 480
  const DIVER_X = 150
  const DIVER_R = 13
  const GRAVITY = 0.42
  const KICK = -6.8

  let canvas = $state<HTMLCanvasElement | null>(null)

  // Reactive HUD state (read by the Svelte overlay).
  let phase = $state<'idle' | 'playing' | 'over'>('idle')
  let score = $state(0)
  let depth = $state(0)
  let air = $state(100)
  let best = $state(0)
  let cause = $state<'air' | 'crash'>('crash')

  // Mutable world (not reactive — driven straight onto the canvas each frame).
  type Rock = { kind: 'rock'; x: number; w: number; gapY: number; gapH: number; scored: boolean }
  type Jelly = { kind: 'jelly'; x: number; y: number; r: number; t: number }
  type Obstacle = Rock | Jelly
  type Bubble = { x: number; y: number; r: number }

  let diverY = H / 2
  let diverVY = 0
  let obstacles: Obstacle[] = []
  let bubbles: Bubble[] = []
  let deco: { x: number; y: number; r: number; s: number }[] = []
  let scroll = 3.0
  let spawnT = 40
  let raf = 0
  let lastT = 0
  let overAt = 0

  const rnd = (a: number, b: number) => a + Math.random() * (b - a)

  function reset() {
    diverY = H / 2
    diverVY = 0
    obstacles = []
    bubbles = []
    scroll = 3.0
    spawnT = 40
    score = 0
    depth = 0
    air = 100
    if (!deco.length) {
      deco = Array.from({ length: 26 }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(1, 4), s: rnd(0.2, 0.8) }))
    }
  }

  function start() {
    reset()
    phase = 'playing'
    diverVY = KICK
  }

  function kick() {
    if (phase === 'idle') return start()
    if (phase === 'over') {
      if (performance.now() - overAt < 450) return // debounce the death tap
      return start()
    }
    diverVY = KICK
  }

  function die(why: 'air' | 'crash') {
    cause = why
    phase = 'over'
    overAt = performance.now()
    if (score > best) {
      best = score
      try { localStorage.setItem('deepdive-best', String(best)) } catch { /* ignore */ }
    }
  }

  function spawn() {
    const gapH = Math.max(132, 176 - score * 1.5)
    const gapY = rnd(60, H - 60 - gapH)
    obstacles.push({ kind: 'rock', x: W + 40, w: 46, gapY, gapH, scored: false })
    bubbles.push({ x: W + 40 + 23, y: gapY + gapH / 2, r: 9 })
    if (score > 4 && Math.random() < 0.5) {
      obstacles.push({ kind: 'jelly', x: W + rnd(150, 260), y: rnd(50, H - 50), r: rnd(16, 22), t: Math.random() * 6 })
    }
  }

  function update(dt: number) {
    // Rising background bubbles drift on every screen (idle too) for life.
    for (const d of deco) {
      d.y -= d.s * dt
      if (d.y < -6) { d.y = H + 6; d.x = rnd(0, W) }
    }

    if (phase !== 'playing') {
      diverY = H / 2 + Math.sin(lastT / 500) * 10 // gentle bob on menus
      return
    }

    diverVY += GRAVITY * dt
    diverY += diverVY * dt
    depth += scroll * dt * 0.03
    air -= 0.13 * dt
    scroll = 3.0 + Math.min(2.4, score * 0.05)

    spawnT -= dt
    if (spawnT <= 0) {
      spawnT = 92
      spawn()
    }

    for (const o of obstacles) {
      o.x -= scroll * dt
      if (o.kind === 'jelly') { o.t += dt * 0.05; o.y += Math.sin(o.t) * 0.6 * dt }
    }
    for (const b of bubbles) b.x -= scroll * dt
    obstacles = obstacles.filter((o) => o.x > -80)
    bubbles = bubbles.filter((b) => b.x > -20)

    // Collisions + scoring.
    for (const o of obstacles) {
      if (o.kind === 'rock') {
        if (DIVER_X + DIVER_R > o.x && DIVER_X - DIVER_R < o.x + o.w) {
          if (diverY - DIVER_R < o.gapY || diverY + DIVER_R > o.gapY + o.gapH) return die('crash')
        }
        if (!o.scored && o.x + o.w < DIVER_X) { o.scored = true; score += 1 }
      } else {
        const dx = DIVER_X - o.x
        const dy = diverY - o.y
        if (dx * dx + dy * dy < (o.r + DIVER_R) * (o.r + DIVER_R) * 0.7) return die('crash')
      }
    }
    for (const b of bubbles) {
      const dx = DIVER_X - b.x
      const dy = diverY - b.y
      if (dx * dx + dy * dy < (b.r + DIVER_R) * (b.r + DIVER_R)) {
        b.x = -999
        air = Math.min(100, air + 22)
        score += 1
      }
    }
    bubbles = bubbles.filter((b) => b.x > -20)

    if (diverY - DIVER_R < 0 || diverY + DIVER_R > H) return die('crash')
    if (air <= 0) { air = 0; return die('air') }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    // Deep-water gradient.
    const g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#0b2740')
    g.addColorStop(0.55, '#08203a')
    g.addColorStop(1, '#050f22')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    // Background bubbles.
    ctx.fillStyle = 'rgba(153,246,234,0.16)'
    for (const d of deco) {
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Obstacles.
    for (const o of obstacles) {
      if (o.kind === 'rock') {
        ctx.fillStyle = '#0c3350'
        ctx.strokeStyle = 'rgba(44,208,197,0.55)'
        ctx.lineWidth = 2
        roundRect(ctx, o.x, -10, o.w, o.gapY + 10, 8)
        ctx.fill(); ctx.stroke()
        roundRect(ctx, o.x, o.gapY + o.gapH, o.w, H - (o.gapY + o.gapH) + 10, 8)
        ctx.fill(); ctx.stroke()
      } else {
        drawJelly(ctx, o.x, o.y, o.r, o.t)
      }
    }

    // Collectible air bubbles.
    for (const b of bubbles) {
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(153,246,234,0.95)'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.28, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fill()
    }

    drawDiver(ctx)
  }

  function drawDiver(ctx: CanvasRenderingContext2D) {
    const angle = Math.max(-0.5, Math.min(0.7, diverVY * 0.05))
    ctx.save()
    ctx.translate(DIVER_X, diverY)
    ctx.rotate(angle)
    // tank
    ctx.fillStyle = '#0d908b'
    roundRect(ctx, -DIVER_R - 6, -6, 8, 12, 3); ctx.fill()
    // body
    ctx.beginPath()
    ctx.ellipse(0, 0, DIVER_R + 3, DIVER_R, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#123a54'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#2cd0c5'
    ctx.stroke()
    // mask
    ctx.beginPath()
    ctx.arc(DIVER_R * 0.5, -2, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#a5f3ea'
    ctx.fill()
    // fin
    ctx.beginPath()
    ctx.moveTo(-DIVER_R - 2, -2)
    ctx.lineTo(-DIVER_R - 12, -8)
    ctx.lineTo(-DIVER_R - 12, 6)
    ctx.closePath()
    ctx.fillStyle = '#0d908b'
    ctx.fill()
    ctx.restore()
  }

  function drawJelly(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tt: number) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = 'rgba(203,166,247,0.45)'
    ctx.strokeStyle = 'rgba(203,166,247,0.9)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 0, r, Math.PI, 0)
    ctx.fill(); ctx.stroke()
    ctx.strokeStyle = 'rgba(203,166,247,0.7)'
    ctx.lineWidth = 1.5
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(i * (r / 3), 0)
      ctx.quadraticCurveTo(i * (r / 3) + Math.sin(tt + i) * 4, r * 0.9, i * (r / 3), r * 1.5)
      ctx.stroke()
    }
    ctx.restore()
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
  }

  function loop(tms: number) {
    if (!open) return
    const dt = Math.min(2.4, (tms - lastT) / 16.67) || 1
    lastT = tms
    update(dt)
    const ctx = canvas?.getContext('2d')
    if (ctx) draw(ctx)
    raf = requestAnimationFrame(loop)
  }

  function onKey(e: KeyboardEvent) {
    if (!open) return
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); kick() }
  }

  $effect(() => {
    if (!open || !canvas) return
    try { best = Number(localStorage.getItem('deepdive-best') ?? 0) || 0 } catch { best = 0 }
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    reset()
    phase = 'idle'
    lastT = performance.now()
    raf = requestAnimationFrame(loop)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    }
  })
</script>

{#if open}
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
    <div class="relative w-full max-w-3xl">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="mono text-lg font-bold text-reef-300">🤿 Deep Dive</h2>
        <button type="button" onclick={onClose} aria-label="Close game" class="mono rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">✕ esc</button>
      </div>

      <div class="relative overflow-hidden rounded-2xl border border-reef-400/40 shadow-[0_0_40px_-10px_rgba(44,208,197,0.6)]">
        <canvas
          bind:this={canvas}
          onpointerdown={(e) => { e.preventDefault(); kick() }}
          style="width:100%; height:auto; display:block; aspect-ratio:{W}/{H}; touch-action:none; cursor:pointer;"
        ></canvas>

        <!-- HUD -->
        <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span class="mono rounded-md bg-black/40 px-2 py-1 text-xs font-bold text-sky-300">▼ {Math.floor(depth)}m</span>
          <span class="mono rounded-md bg-black/40 px-2 py-1 text-xs font-bold text-white">{score} · best {best}</span>
        </div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 p-3">
          <div class="mx-auto h-2.5 max-w-[220px] overflow-hidden rounded-full bg-black/50">
            <div class="h-full rounded-full transition-[width] duration-100" style="width:{air}%; background:{air < 30 ? '#f87171' : 'linear-gradient(90deg,#cba6f7,#2cd0c5)'}"></div>
          </div>
          <p class="mono mt-1 text-center text-[10px] text-white/70">air</p>
        </div>

        <!-- Start / game-over overlays -->
        {#if phase !== 'playing'}
          <button
            type="button"
            onpointerdown={(e) => { e.preventDefault(); kick() }}
            class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-950/55 text-center"
          >
            {#if phase === 'idle'}
              <p class="mono text-3xl font-black text-white">DEEP DIVE</p>
              <p class="mono text-sm text-reef-200">tap / space to kick ↑</p>
              <p class="mono max-w-xs text-xs text-white/70">Thread the rocks, dodge the jellyfish, grab bubbles before your air runs out.</p>
              <span class="mono mt-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950">▶ Dive in</span>
            {:else}
              <p class="mono text-2xl font-black text-white">{cause === 'air' ? 'OUT OF AIR' : 'WIPEOUT'}</p>
              <p class="mono text-lg font-bold text-reef-200">{score} {score === 1 ? 'point' : 'points'}</p>
              {#if score >= best && score > 0}<p class="mono text-xs font-bold text-amber-300">★ new best!</p>{/if}
              <span class="mono mt-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950">↻ Retry</span>
            {/if}
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
