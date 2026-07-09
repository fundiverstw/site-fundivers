<script lang="ts">
  // "Wreck Maze" — a scuba-themed homage to Encarta's MindMaze. You swim a
  // first-person maze of flooded compartments; a sea creature guards most
  // doorways and will not let you through until you answer its dive question.
  // Wrong answers cost air, artifacts are worth points, and the ascent line is
  // somewhere in the far corner.
  //
  // Everything is drawn procedurally onto a canvas — no image assets. The maze
  // is regenerated on every run, so the route is never the same twice.

  import { untrack } from 'svelte'
  import { QUESTIONS, type Question } from './questions'

  let { open = false, onClose }: { open?: boolean; onClose: () => void } = $props()

  const W = 720
  const H = 480
  const N = 5 // maze is N x N compartments

  // Facing / direction indices: 0 = north, 1 = east, 2 = south, 3 = west.
  const DX = [0, 1, 0, -1]
  const DY = [-1, 0, 1, 0]
  const COMPASS = ['N', 'E', 'S', 'W']

  // Tuned by playtesting: a maze you cannot see through needs a lot of
  // backtracking, so movement has to be cheap. Mistakes are what hurt.
  const AIR_START = 240
  const AIR_PER_MOVE = 3
  const AIR_PER_MISTAKE = 25

  type Species = 'moray' | 'octopus' | 'shark' | 'turtle'
  const SPECIES: Species[] = ['moray', 'octopus', 'shark', 'turtle']
  const SPECIES_NAME: Record<Species, string> = {
    moray: 'A moray eel blocks the way',
    octopus: 'An octopus coils in the hatchway',
    shark: 'A reef shark circles the opening',
    turtle: 'A sea turtle rests across the door',
  }

  type Cell = { walls: boolean[] } // [N, E, S, W] — true means "wall here"

  // ── Reactive game state ────────────────────────────────────────────────────
  let phase = $state<'idle' | 'explore' | 'question' | 'result' | 'won' | 'over'>('idle')
  let maze = $state<Cell[]>([])
  let guards = $state<(Species | null)[]>([])
  let treasures = $state<boolean[]>([])
  let visited = $state<boolean[]>([])
  let px = $state(0)
  let py = $state(N - 1)
  let facing = $state(0)
  let ex = $state(N - 1)
  let ey = $state(0)
  let air = $state(AIR_START)
  let score = $state(0)
  let found = $state(0)
  let best = $state(0)

  let pending = $state<{ q: Question; options: string[]; correct: number; tx: number; ty: number } | null>(null)
  let chosen = $state<number | null>(null)
  let toast = $state('')

  const idx = (x: number, y: number) => y * N + x
  const rnd = (a: number, b: number) => a + Math.random() * (b - a)

  // ── Non-reactive render state ──────────────────────────────────────────────
  let canvas = $state<HTMLCanvasElement | null>(null)
  let deco: { x: number; y: number; r: number; s: number }[] = []
  let anim: { kind: 'move' | 'turnL' | 'turnR' | 'bump'; t: number } | null = null
  let raf = 0
  let lastT = 0
  let toastT = 0
  let pool: Question[] = []

  // ── Maze generation (recursive backtracker, then a few loops punched in) ───
  function buildMaze() {
    const cells: Cell[] = Array.from({ length: N * N }, () => ({ walls: [true, true, true, true] }))
    const seen = new Set<number>()
    const stack = [idx(0, N - 1)]
    seen.add(stack[0])

    while (stack.length) {
      const cur = stack[stack.length - 1]
      const cx = cur % N
      const cy = Math.floor(cur / N)
      const options: number[] = []
      for (let d = 0; d < 4; d++) {
        const nx = cx + DX[d]
        const ny = cy + DY[d]
        if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue
        if (!seen.has(idx(nx, ny))) options.push(d)
      }
      if (!options.length) { stack.pop(); continue }
      const d = options[Math.floor(Math.random() * options.length)]
      const nx = cx + DX[d]
      const ny = cy + DY[d]
      cells[cur].walls[d] = false
      cells[idx(nx, ny)].walls[(d + 2) % 4] = false
      seen.add(idx(nx, ny))
      stack.push(idx(nx, ny))
    }

    // A perfect maze is a tree — every wrong turn is a dead end. Punching a few
    // extra holes gives it loops, which makes wandering feel less punishing.
    for (let k = 0; k < 4; k++) {
      const x = Math.floor(rnd(0, N))
      const y = Math.floor(rnd(0, N))
      const d = Math.floor(rnd(0, 4))
      const nx = x + DX[d]
      const ny = y + DY[d]
      if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue
      cells[idx(x, y)].walls[d] = false
      cells[idx(nx, ny)].walls[(d + 2) % 4] = false
    }
    return cells
  }

  function reset() {
    maze = buildMaze()
    px = 0; py = N - 1; facing = 0
    ex = N - 1; ey = 0
    air = AIR_START
    score = 0
    found = 0
    pending = null
    chosen = null
    toast = ''
    anim = null

    const start = idx(px, py)
    const exit = idx(ex, ey)

    // Most compartments have a guardian; the ascent line always does.
    guards = Array.from({ length: N * N }, (_, i) =>
      i === start ? null : i === exit || Math.random() < 0.62
        ? SPECIES[Math.floor(Math.random() * SPECIES.length)]
        : null,
    )

    // Three artifacts, never on the start or the exit.
    treasures = Array.from({ length: N * N }, () => false)
    const free = Array.from({ length: N * N }, (_, i) => i).filter((i) => i !== start && i !== exit)
    for (let k = 0; k < 3 && free.length; k++) {
      treasures[free.splice(Math.floor(Math.random() * free.length), 1)[0]] = true
    }

    visited = Array.from({ length: N * N }, (_, i) => i === start)
    pool = [...QUESTIONS].sort(() => Math.random() - 0.5)

    if (!deco.length) {
      deco = Array.from({ length: 30 }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(1, 3.4), s: rnd(0.15, 0.6) }))
    }
  }

  function start() { reset(); phase = 'explore' }

  function nextQuestion(): Question {
    if (!pool.length) pool = [...QUESTIONS].sort(() => Math.random() - 0.5)
    return pool.pop()!
  }

  // ── Movement ──────────────────────────────────────────────────────────────
  function turn(delta: number) {
    if (phase !== 'explore') return
    facing = (facing + delta + 4) % 4
    anim = { kind: delta === 1 ? 'turnR' : 'turnL', t: 1 }
  }

  function turnAround() {
    if (phase !== 'explore') return
    facing = (facing + 2) % 4
    anim = { kind: 'turnR', t: 1 }
  }

  function forward() {
    if (phase !== 'explore') return
    if (maze[idx(px, py)].walls[facing]) { anim = { kind: 'bump', t: 1 }; return }
    const nx = px + DX[facing]
    const ny = py + DY[facing]
    const guard = guards[idx(nx, ny)]
    if (guard) {
      const q = nextQuestion()
      const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
      pending = { q, options: order.map((i) => q.answers[i]), correct: order.indexOf(0), tx: nx, ty: ny }
      chosen = null
      phase = 'question'
      return
    }
    enter(nx, ny)
  }

  function enter(nx: number, ny: number) {
    px = nx; py = ny
    visited[idx(nx, ny)] = true
    air = Math.max(0, air - AIR_PER_MOVE)
    anim = { kind: 'move', t: 1 }

    if (treasures[idx(nx, ny)]) {
      treasures[idx(nx, ny)] = false
      score += 50
      found += 1
      toast = '✦ Artifact recovered — +50'
      toastT = performance.now()
    }
    if (nx === ex && ny === ey) return finish('won')
    if (air <= 0) return finish('over')
  }

  function answer(i: number) {
    if (phase !== 'question' || !pending) return
    chosen = i
    phase = 'result'
    if (i === pending.correct) score += 10
    else air = Math.max(0, air - AIR_PER_MISTAKE)
  }

  function proceed() {
    if (phase !== 'result' || !pending) return
    const correct = chosen === pending.correct
    const { tx, ty } = pending
    pending = null
    chosen = null
    if (correct) {
      guards[idx(tx, ty)] = null
      phase = 'explore'
      enter(tx, ty)
    } else if (air <= 0) {
      finish('over')
    } else {
      phase = 'explore' // the guardian stays; try again with a fresh question
    }
  }

  function finish(how: 'won' | 'over') {
    // Half the remaining air, so that surfacing early never beats detouring for
    // the three artifacts (50 each) — but efficiency is still worth something.
    if (how === 'won') score += Math.round(air / 2)
    phase = how
    if (score > best) {
      best = score
      try { localStorage.setItem('wreckmaze-best', String(best)) } catch { /* ignore */ }
    }
  }

  // ── Drawing ───────────────────────────────────────────────────────────────
  // The compartment is a box in one-point perspective: a back wall rectangle,
  // with ceiling / floor / side walls fanning out to the edges of the canvas.
  const BX1 = W * 0.3, BX2 = W * 0.7, BY1 = H * 0.24, BY2 = H * 0.78
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  /** A point on a side wall, `t` running 0 (back corner) → 1 (at the viewer). */
  function wallPt(side: -1 | 1, t: number, edge: 'top' | 'bot'): [number, number] {
    const x = lerp(side < 0 ? BX1 : BX2, side < 0 ? 0 : W, t)
    const yTop = lerp(BY1, 0, t)
    const yBot = lerp(BY2, H, t)
    const h = yBot - yTop
    return edge === 'top' ? [x, yTop + h * 0.1] : [x, yBot - h * 0.05]
  }

  function quad(ctx: CanvasRenderingContext2D, pts: [number, number][], fill: string) {
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }

  function drawScene(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#03080f'
    ctx.fillRect(0, 0, W, H)

    ctx.save()
    // Step / turn / bump feedback, applied to the whole compartment.
    if (anim) {
      const t = anim.t
      if (anim.kind === 'move') {
        const s = 1 + 0.3 * t
        ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2)
      } else if (anim.kind === 'turnL' || anim.kind === 'turnR') {
        ctx.translate((anim.kind === 'turnL' ? -1 : 1) * W * 0.45 * t, 0)
      } else {
        ctx.translate(Math.sin(t * 26) * 7 * t, 0)
      }
    }

    const cell = maze[idx(px, py)]
    const rel = (d: number) => (facing + d) % 4 // 0 ahead, 1 right, 2 behind, 3 left
    const openAhead = !cell.walls[rel(0)]
    const openRight = !cell.walls[rel(1)]
    const openLeft = !cell.walls[rel(3)]

    // Ceiling, floor, side walls, back wall.
    quad(ctx, [[0, 0], [W, 0], [BX2, BY1], [BX1, BY1]], '#071624')
    quad(ctx, [[0, H], [W, H], [BX2, BY2], [BX1, BY2]], '#0a2133')
    quad(ctx, [[0, 0], [BX1, BY1], [BX1, BY2], [0, H]], '#0b2537')
    quad(ctx, [[W, 0], [BX2, BY1], [BX2, BY2], [W, H]], '#092030')
    quad(ctx, [[BX1, BY1], [BX2, BY1], [BX2, BY2], [BX1, BY2]], '#0d2e43')

    // Rivet seams on the back wall, so it reads as a steel hull.
    ctx.strokeStyle = 'rgba(44,208,197,0.13)'
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      const y = lerp(BY1, BY2, i / 4)
      ctx.beginPath(); ctx.moveTo(BX1, y); ctx.lineTo(BX2, y); ctx.stroke()
    }

    // Openings.
    if (openLeft) quad(ctx, [wallPt(-1, 0.12, 'top'), wallPt(-1, 0.86, 'top'), wallPt(-1, 0.86, 'bot'), wallPt(-1, 0.12, 'bot')], '#02060c')
    if (openRight) quad(ctx, [wallPt(1, 0.12, 'top'), wallPt(1, 0.86, 'top'), wallPt(1, 0.86, 'bot'), wallPt(1, 0.12, 'bot')], '#02060c')

    let doorCx = W / 2
    let doorCy = (BY1 + BY2) / 2
    if (openAhead) {
      const dw = (BX2 - BX1) * 0.54
      const dx = W / 2 - dw / 2
      const dy = BY1 + (BY2 - BY1) * 0.14
      const g = ctx.createLinearGradient(0, dy, 0, BY2)
      g.addColorStop(0, '#02060c')
      g.addColorStop(1, '#061726')
      ctx.fillStyle = g
      ctx.fillRect(dx, dy, dw, BY2 - dy)
      ctx.strokeStyle = 'rgba(44,208,197,0.3)'
      ctx.lineWidth = 2
      ctx.strokeRect(dx, dy, dw, BY2 - dy)
      doorCx = W / 2
      doorCy = dy + (BY2 - dy) * 0.55

      const nx = px + DX[facing]
      const ny = py + DY[facing]
      if (nx >= 0 && ny >= 0 && nx < N && ny < N) {
        if (treasures[idx(nx, ny)]) drawGlint(ctx, doorCx + dw * 0.28, BY2 - 18)
        const g2 = guards[idx(nx, ny)]
        if (g2 && phase === 'explore') drawCreature(ctx, g2, doorCx, doorCy + 10, 0.62, 0.75)
      }
    }

    // The guardian you are being questioned by looms in the doorway.
    if ((phase === 'question' || phase === 'result') && pending) {
      const g = guards[idx(pending.tx, pending.ty)]
      if (g) drawCreature(ctx, g, W / 2, H * 0.4, 1.5, 1)
    }

    ctx.restore()

    // Drifting bubbles, over everything.
    ctx.fillStyle = 'rgba(153,246,234,0.14)'
    for (const d of deco) {
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill()
    }

    // Vignette.
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85)
    v.addColorStop(0, 'rgba(0,0,0,0)')
    v.addColorStop(1, 'rgba(0,0,0,0.72)')
    ctx.fillStyle = v
    ctx.fillRect(0, 0, W, H)
  }

  function drawGlint(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const pulse = 0.55 + 0.45 * Math.sin(lastT / 260)
    ctx.save()
    ctx.globalAlpha = pulse
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill()
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 14
    ctx.fill()
    ctx.restore()
  }

  // Guardians are drawn as glowing silhouettes — forgiving to render, and it
  // suits a dark flooded compartment better than detail would.
  function drawCreature(ctx: CanvasRenderingContext2D, kind: Species, cx: number, cy: number, s: number, alpha: number) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(cx, cy)
    ctx.scale(s, s)
    const body = '#04101c'
    const edge = 'rgba(44,208,197,0.85)'
    ctx.lineWidth = 2.5 / s
    ctx.strokeStyle = edge
    ctx.fillStyle = body
    const sway = Math.sin(lastT / 420) * 4

    // A thick stroke in the edge colour with a slightly thinner body-coloured
    // stroke on top of it gives an outlined tube. Stroking the body colour and
    // then re-stroking thin just draws a line down the middle.
    const tube = (draw: () => void, outer: number) => {
      ctx.lineCap = 'round'
      draw(); ctx.lineWidth = outer / s; ctx.strokeStyle = edge; ctx.stroke()
      draw(); ctx.lineWidth = (outer - 5) / s; ctx.strokeStyle = body; ctx.stroke()
    }

    if (kind === 'moray') {
      tube(() => {
        ctx.beginPath()
        ctx.moveTo(-6, 88)
        ctx.quadraticCurveTo(-48 + sway, 36, -10, 0)
        ctx.quadraticCurveTo(22, -26, 2, -48)
      }, 30)
      ctx.lineWidth = 2.5 / s
      ctx.strokeStyle = edge
      ctx.fillStyle = body
      ctx.beginPath(); ctx.ellipse(0, -58, 24, 18, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-20, -52); ctx.quadraticCurveTo(0, -40, 22, -56)
      ctx.lineWidth = 2 / s; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.stroke()
      eyes(ctx, -8, -66, 15, 3.4)
    } else if (kind === 'octopus') {
      for (let i = -3; i <= 3; i++) {
        if (!i) continue
        tube(() => {
          ctx.beginPath()
          ctx.moveTo(i * 9, 8)
          ctx.quadraticCurveTo(i * 22 + sway, 52, i * 30, 86)
        }, 15)
      }
      ctx.lineWidth = 2.5 / s
      ctx.beginPath(); ctx.ellipse(0, -14, 44, 40, 0, 0, Math.PI * 2); ctx.fillStyle = body; ctx.fill(); ctx.strokeStyle = edge; ctx.stroke()
      eyes(ctx, -16, -18, 32, 7)
    } else if (kind === 'shark') {
      // Torpedo body, snout to the left, drawn as a path so it tapers properly.
      ctx.beginPath()
      ctx.moveTo(-72, 1)
      ctx.quadraticCurveTo(-40, -23, 8, -20)
      ctx.quadraticCurveTo(44, -17, 58, -5)
      ctx.lineTo(58, 5)
      ctx.quadraticCurveTo(44, 17, 8, 21)
      ctx.quadraticCurveTo(-40, 24, -72, 1)
      ctx.closePath(); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(13, -44); ctx.lineTo(27, -15); ctx.closePath(); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(56, -4); ctx.lineTo(84, -32 + sway); ctx.lineTo(72, 0); ctx.lineTo(82, 24 - sway); ctx.closePath(); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-22, 15); ctx.lineTo(-36, 40); ctx.lineTo(-6, 21); ctx.closePath(); ctx.fill(); ctx.stroke()
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 1.6 / s
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(-38 + i * 7, -11); ctx.quadraticCurveTo(-41 + i * 7, 0, -38 + i * 7, 11); ctx.stroke()
      }
      eyes(ctx, -49, -8, 0, 3.6)
    } else {
      ctx.beginPath(); ctx.ellipse(0, 0, 52, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      for (const [fx, fy, r] of [[-42, -26, -0.6], [42, -26, 0.6], [-38, 28, 0.5], [38, 28, -0.5]] as const) {
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(r + sway * 0.01)
        ctx.beginPath(); ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.restore()
      }
      ctx.beginPath(); ctx.ellipse(0, -46, 20, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.ellipse(0, -2, 30, 22, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(44,208,197,0.35)'; ctx.stroke()
      eyes(ctx, -8, -50, 16, 3.4)
    }
    ctx.restore()
  }

  function eyes(ctx: CanvasRenderingContext2D, x: number, y: number, gap: number, r: number) {
    ctx.fillStyle = '#fbbf24'
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 12
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    if (gap) { ctx.beginPath(); ctx.arc(x + gap, y, r, 0, Math.PI * 2); ctx.fill() }
    ctx.shadowBlur = 0
  }

  // ── Loop ──────────────────────────────────────────────────────────────────
  let dpr = 1

  function loop(tms: number) {
    if (!open) return
    const dt = Math.min(2.5, (tms - lastT) / 16.67) || 1
    lastT = tms

    for (const d of deco) {
      d.y -= d.s * dt
      if (d.y < -5) { d.y = H + 5; d.x = rnd(0, W) }
    }
    if (anim) {
      anim.t -= 0.075 * dt
      if (anim.t <= 0) anim = null
    }
    if (toast && performance.now() - toastT > 2200) toast = ''

    const ctx = canvas?.getContext('2d')
    if (ctx && maze.length) drawScene(ctx)
    raf = requestAnimationFrame(loop)
  }

  function onKey(e: KeyboardEvent) {
    if (!open) return
    if (e.key === 'Escape') { onClose(); return }
    if (phase === 'idle') {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() }
      return
    }
    if (phase === 'won' || phase === 'over') {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() }
      return
    }
    if (phase === 'question') {
      const n = Number(e.key)
      if (n >= 1 && n <= 4) { e.preventDefault(); answer(n - 1) }
      return
    }
    if (phase === 'result') {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); proceed() }
      return
    }
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': e.preventDefault(); forward(); break
      case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); turn(-1); break
      case 'ArrowRight': case 'd': case 'D': e.preventDefault(); turn(1); break
      case 'ArrowDown': case 's': case 'S': e.preventDefault(); turnAround(); break
    }
  }

  $effect(() => {
    if (!open || !canvas) return
    const el = canvas
    // Setting up a run writes the very state it reads (maze, guards, treasures…),
    // which would make this effect retrigger itself forever. It depends only on
    // `open` and `canvas`; everything else is deliberately untracked.
    untrack(() => {
      try { best = Number(localStorage.getItem('wreckmaze-best') ?? 0) || 0 } catch { best = 0 }
      dpr = Math.min(2, window.devicePixelRatio || 1)
      el.width = W * dpr
      el.height = H * dpr
      reset()
      phase = 'idle'
      lastT = performance.now()
    })
    raf = requestAnimationFrame(loop)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    }
  })

  let airPct = $derived(Math.max(0, Math.min(100, (air / AIR_START) * 100)))
  let guardName = $derived(pending ? SPECIES_NAME[guards[idx(pending.tx, pending.ty)] ?? 'moray'] : '')
</script>

{#if open}
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
    <div class="relative w-full max-w-3xl">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="mono text-lg font-bold text-reef-300">🤿 Wreck Maze</h2>
        <button type="button" onclick={onClose} aria-label="Close game" class="mono rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">✕ esc</button>
      </div>

      <div class="relative overflow-hidden rounded-2xl border border-reef-400/40 shadow-[0_0_40px_-10px_rgba(44,208,197,0.6)]">
        <canvas bind:this={canvas} style="width:100%; height:auto; display:block; aspect-ratio:{W}/{H};"></canvas>

        <!-- HUD: air, score, compass, and the map you fill in as you explore -->
        {#if phase !== 'idle'}
          <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <div class="rounded-lg bg-black/55 px-2.5 py-1.5">
              <div class="mono text-[10px] uppercase tracking-wide text-white/60">air</div>
              <div class="mt-1 h-2 w-28 overflow-hidden rounded-full bg-white/15">
                <div class="h-full rounded-full transition-[width] duration-200" style="width:{airPct}%; background:{airPct < 25 ? '#f87171' : 'linear-gradient(90deg,#cba6f7,#2cd0c5)'}"></div>
              </div>
              <div class="mono mt-1 text-[11px] font-bold text-white">{Math.round(air)} bar</div>
            </div>

            <div class="flex items-start gap-2">
              <div class="rounded-lg bg-black/55 px-2.5 py-1.5 text-right">
                <div class="mono text-[10px] uppercase tracking-wide text-white/60">score</div>
                <div class="mono text-sm font-bold text-white">{score}</div>
                <div class="mono text-[10px] text-amber-300">✦ {found}/3</div>
              </div>

              <!-- Minimap: only compartments you have entered are drawn. -->
              <svg viewBox="0 0 {N * 16 + 8} {N * 16 + 8}" class="h-[92px] w-[92px] rounded-lg bg-black/55 p-1">
                {#each maze as c, i (i)}
                  {@const cx = (i % N) * 16 + 4}
                  {@const cy = Math.floor(i / N) * 16 + 4}
                  {#if visited[i]}
                    <rect x={cx} y={cy} width="16" height="16" fill="rgba(44,208,197,0.14)" />
                    <g stroke="rgba(44,208,197,0.8)" stroke-width="1.4" stroke-linecap="round">
                      {#if c.walls[0]}<line x1={cx} y1={cy} x2={cx + 16} y2={cy} />{/if}
                      {#if c.walls[1]}<line x1={cx + 16} y1={cy} x2={cx + 16} y2={cy + 16} />{/if}
                      {#if c.walls[2]}<line x1={cx} y1={cy + 16} x2={cx + 16} y2={cy + 16} />{/if}
                      {#if c.walls[3]}<line x1={cx} y1={cy} x2={cx} y2={cy + 16} />{/if}
                    </g>
                  {/if}
                  {#if i === idx(ex, ey)}
                    <text x={cx + 8} y={cy + 12} text-anchor="middle" font-size="10" fill="#fbbf24">▲</text>
                  {/if}
                {/each}
                <g transform="translate({px * 16 + 12}, {py * 16 + 12}) rotate({facing * 90})">
                  <path d="M0 -5 L4 4 L0 2 L-4 4 Z" fill="#fff" />
                </g>
              </svg>
            </div>
          </div>

          <div class="pointer-events-none absolute bottom-3 left-3 mono rounded-md bg-black/55 px-2 py-1 text-xs font-bold text-sky-300">
            facing {COMPASS[facing]}
          </div>
        {/if}

        {#if toast}
          <div class="pointer-events-none absolute inset-x-0 top-1/3 text-center">
            <span class="mono rounded-full bg-amber-400/90 px-4 py-1.5 text-sm font-bold text-brand-950">{toast}</span>
          </div>
        {/if}

        <!-- Movement controls (also the touch interface) -->
        {#if phase === 'explore'}
          <div class="absolute bottom-3 right-3 grid grid-cols-3 gap-1.5">
            <div></div>
            <button type="button" onclick={forward} aria-label="Swim forward" class="mono h-11 w-11 rounded-lg border border-reef-400/50 bg-black/60 text-lg text-reef-200 transition hover:bg-reef-400/25">↑</button>
            <div></div>
            <button type="button" onclick={() => turn(-1)} aria-label="Turn left" class="mono h-11 w-11 rounded-lg border border-reef-400/50 bg-black/60 text-lg text-reef-200 transition hover:bg-reef-400/25">↰</button>
            <button type="button" onclick={turnAround} aria-label="Turn around" class="mono h-11 w-11 rounded-lg border border-reef-400/50 bg-black/60 text-lg text-reef-200 transition hover:bg-reef-400/25">↓</button>
            <button type="button" onclick={() => turn(1)} aria-label="Turn right" class="mono h-11 w-11 rounded-lg border border-reef-400/50 bg-black/60 text-lg text-reef-200 transition hover:bg-reef-400/25">↱</button>
          </div>
        {/if}

        <!-- The guardian's question -->
        {#if (phase === 'question' || phase === 'result') && pending}
          <div class="absolute inset-x-0 bottom-0 border-t border-reef-400/30 bg-brand-950/92 p-4 backdrop-blur-sm sm:p-5">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="mono rounded-full bg-reef-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reef-200">{pending.q.category}</span>
              <span class="mono text-[11px] italic text-white/55">{guardName}</span>
            </div>
            <p class="text-sm font-bold text-white sm:text-base">{pending.q.q}</p>

            <div class="mt-3 grid gap-1.5 sm:grid-cols-2">
              {#each pending.options as opt, i (i)}
                <button
                  type="button"
                  onclick={() => answer(i)}
                  disabled={phase === 'result'}
                  class="mono flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs transition
                    {phase === 'result' && i === pending.correct
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-100'
                      : phase === 'result' && i === chosen
                        ? 'border-red-400 bg-red-400/20 text-red-100'
                        : 'border-white/20 bg-white/5 text-brand-100 hover:border-reef-400/60 hover:bg-reef-400/10'}"
                >
                  <span class="shrink-0 font-bold opacity-60">{i + 1}</span>
                  <span>{opt}</span>
                </button>
              {/each}
            </div>

            {#if phase === 'result'}
              <div class="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-brand-100">
                  <span class="font-bold {chosen === pending.correct ? 'text-emerald-300' : 'text-red-300'}">
                    {chosen === pending.correct ? 'Correct. ' : `−${AIR_PER_MISTAKE} bar. `}
                  </span>{pending.q.explain}
                </p>
                <button type="button" onclick={proceed} class="mono shrink-0 rounded-full bg-reef-400 px-4 py-1.5 text-xs font-bold text-brand-950 hover:bg-reef-300">
                  {chosen === pending.correct ? 'Swim through →' : 'Back off ↩'}
                </button>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Title / end screens -->
        {#if phase === 'idle' || phase === 'won' || phase === 'over'}
          <button type="button" onclick={start} class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-950/75 px-6 text-center">
            {#if phase === 'idle'}
              <p class="mono text-3xl font-black text-white">WRECK MAZE</p>
              <p class="mono text-sm text-reef-200">arrows / WASD to swim · 1–4 to answer</p>
              <p class="mono max-w-md text-xs leading-relaxed text-white/70">
                Sea creatures guard the flooded compartments. Answer their dive questions to pass,
                recover three artifacts, and find the ascent line before your air runs out.
              </p>
              <span class="mono mt-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950">▶ Enter the wreck</span>
              {#if best > 0}<p class="mono mt-1 text-[11px] text-amber-300">best {best}</p>{/if}
            {:else if phase === 'won'}
              <p class="mono text-2xl font-black text-emerald-300">SURFACED</p>
              <p class="mono text-sm text-white/80">You found the ascent line with {Math.round(air)} bar to spare.</p>
              <p class="mono text-lg font-bold text-reef-200">{score} points · ✦ {found}/3 artifacts</p>
              {#if score >= best && score > 0}<p class="mono text-xs font-bold text-amber-300">★ new best!</p>{/if}
              <span class="mono mt-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950">↻ Dive again</span>
            {:else}
              <p class="mono text-2xl font-black text-red-400">OUT OF AIR</p>
              <p class="mono text-sm text-white/80">The wreck keeps its secrets.</p>
              <p class="mono text-lg font-bold text-reef-200">{score} points · ✦ {found}/3 artifacts</p>
              <span class="mono mt-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950">↻ Try again</span>
            {/if}
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
