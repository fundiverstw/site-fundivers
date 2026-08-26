// Davey's arcade: the rules of the little Asteroids game hidden at /arcade.
//
// Everything here is arithmetic — no canvas, no DOM, no clock. The page owns
// the frame loop and the drawing; this owns what is where and what just
// happened. That split is what makes the game testable at all: a browser test
// can prove the canvas exists, but only a unit test can prove that shooting the
// middle of a group of divers splits it in two and scores fifty points.
//
// The world is mutated in place rather than rebuilt each frame. A game loop at
// 60fps that allocated a fresh object graph every step would spend its time in
// the garbage collector, and there is exactly one world.
//
// Nothing in here calls Math.random. Randomness comes from `world.seed`, which
// the caller sets and every draw advances, so a game replays identically from
// the same seed and a test can say precisely where the divers will be.

/** A point, or a velocity — the same two numbers either way. */
export type Vec = { x: number; y: number }

/** How big a knot of divers is. 3 is a whole group, and shooting one splits it
 *  into two 2s; a 1 is a single diver and simply gets an ink bath. */
export type DiverSize = 1 | 2 | 3

export type Diver = {
  pos: Vec
  vel: Vec
  size: DiverSize
  radius: number
  /** Which way up they are drawn, and how fast that tumbles. Cosmetic. */
  angle: number
  spin: number
}

export type Pellet = {
  pos: Vec
  vel: Vec
  /** Seconds of flight left. Ink does not travel forever. */
  life: number
}

export type Davey = {
  pos: Vec
  vel: Vec
  /** Radians, 0 = facing right. */
  angle: number
  /** Seconds until he can fire again. */
  cooldown: number
  /** Seconds of "just got back up, cannot be hit" left. Without it a diver
   *  sitting on the middle of the screen takes every life in three frames. */
  shielded: number
}

/** What the player is asking for this frame. */
export type Input = {
  left: boolean
  right: boolean
  thrust: boolean
  fire: boolean
}

/** Something worth saying out loud. The page turns these into Davey's lines;
 *  the engine deliberately knows no words, so the game is translated where
 *  everything else on the site is. */
export type ArcadeEvent = 'wave' | 'hit' | 'over'

export type World = {
  w: number
  h: number
  davey: Davey
  pellets: Pellet[]
  divers: Diver[]
  score: number
  lives: number
  wave: number
  over: boolean
  /** What happened during the last `step`, cleared at the start of the next. */
  events: ArcadeEvent[]
  seed: number
}

// ── Handling ────────────────────────────────────────────────────────────────
// Tuned by playing, not derived from anything. An octopus is not a spaceship:
// he turns quickly and drifts to a stop rather than sliding forever, because
// asteroid-style frictionless drift on a 900px screen is miserable to aim with.

/** Radians per second of turn. */
const TURN = 3.4
/** Pixels per second per second, along whichever way he is facing. */
const THRUST = 300
/** Fraction of speed shed per second when coasting. */
const DRAG = 0.7
const MAX_SPEED = 340
const DAVEY_RADIUS = 16

const PELLET_SPEED = 430
const PELLET_LIFE = 1.1
const FIRE_COOLDOWN = 0.22
/** Ink is thin; a pellet only has to graze. */
const PELLET_RADIUS = 3

const SHIELD_TIME = 2
const START_LIVES = 3

/** Radius per size, and what shooting one is worth. Smaller is worth more —
 *  it is a smaller target and it is the one still coming at you. */
const DIVER_RADIUS: Record<DiverSize, number> = { 3: 42, 2: 26, 1: 15 }
const DIVER_POINTS: Record<DiverSize, number> = { 3: 20, 2: 50, 1: 100 }

/**
 * The longest step the world will take at once, in seconds.
 *
 * A backgrounded tab hands back a `dt` of however long the reader was away, and
 * a single step of four seconds moves every diver clean through Davey without
 * ever overlapping him — no collision, no life lost, and the divers reappear
 * somewhere impossible. Clamping means a long gap runs slow for one frame
 * instead of teleporting, which nobody notices and nothing breaks.
 */
export const MAX_STEP = 0.05

// ── Randomness ──────────────────────────────────────────────────────────────

/**
 * One number in [0, 1), and the seed to ask next time.
 *
 * mulberry32. It is four lines, it has no state of its own, and it is the
 * reason a test can assert where a wave of divers ends up.
 */
export function rng(seed: number): { value: number; seed: number } {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, seed: t }
}

/** Draw from the world's own stream, advancing it. */
function draw(world: World): number {
  const { value, seed } = rng(world.seed)
  world.seed = seed
  return value
}

/** A number in [min, max) from the world's stream. */
function between(world: World, min: number, max: number): number {
  return min + draw(world) * (max - min)
}

// ── Geometry ────────────────────────────────────────────────────────────────

/**
 * Bring a point back onto the screen from whichever edge it left.
 *
 * Everything wraps — Davey, the divers, and the ink. A pellet that stopped at
 * the edge would make the corners safe places to hide, which is the one thing
 * an Asteroids screen must not have.
 */
export function wrap(pos: Vec, w: number, h: number): void {
  if (pos.x < 0) pos.x += w
  else if (pos.x >= w) pos.x -= w
  if (pos.y < 0) pos.y += h
  else if (pos.y >= h) pos.y -= h
}

/** Do two circles overlap? */
export function hits(a: Vec, ar: number, b: Vec, br: number): boolean {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const r = ar + br
  return dx * dx + dy * dy <= r * r
}

// ── Setting up ──────────────────────────────────────────────────────────────

function makeDavey(w: number, h: number): Davey {
  return {
    pos: { x: w / 2, y: h / 2 },
    vel: { x: 0, y: 0 },
    // Facing up, which is the way every arcade ship starts.
    angle: -Math.PI / 2,
    cooldown: 0,
    shielded: SHIELD_TIME,
  }
}

/**
 * A wave of divers, spawned around the edges.
 *
 * Never in the middle: that is where Davey is, and a diver that arrives on top
 * of him takes a life before the reader's hand is on the keys. They are placed
 * on a ring outside the screen's short side and drift inwards-ish, so the first
 * few seconds of a wave are a group swimming into view.
 */
export function spawnWave(world: World): void {
  const count = 2 + world.wave
  const ring = Math.max(world.w, world.h) * 0.55
  for (let i = 0; i < count; i++) {
    const bearing = between(world, 0, Math.PI * 2)
    const pos = {
      x: world.w / 2 + Math.cos(bearing) * ring,
      y: world.h / 2 + Math.sin(bearing) * ring,
    }
    wrap(pos, world.w, world.h)
    // A little faster every wave, but the step is small: these are divers who
    // cannot control their buoyancy, not torpedoes.
    const speed = between(world, 26, 62) + world.wave * 6
    const heading = between(world, 0, Math.PI * 2)
    world.divers.push({
      pos,
      vel: { x: Math.cos(heading) * speed, y: Math.sin(heading) * speed },
      size: 3,
      radius: DIVER_RADIUS[3],
      angle: between(world, 0, Math.PI * 2),
      spin: between(world, -1.2, 1.2),
    })
  }
  world.events.push('wave')
}

export function createWorld(w: number, h: number, seed = 1): World {
  const world: World = {
    w,
    h,
    davey: makeDavey(w, h),
    pellets: [],
    divers: [],
    score: 0,
    lives: START_LIVES,
    wave: 1,
    over: false,
    events: [],
    seed,
  }
  spawnWave(world)
  return world
}

// ── Playing ─────────────────────────────────────────────────────────────────

function moveDavey(world: World, dt: number, input: Input): void {
  const d = world.davey
  if (input.left) d.angle -= TURN * dt
  if (input.right) d.angle += TURN * dt
  if (input.thrust) {
    d.vel.x += Math.cos(d.angle) * THRUST * dt
    d.vel.y += Math.sin(d.angle) * THRUST * dt
  }

  // Drag, then the speed limit. Both are per-second quantities scaled by dt, so
  // the handling is the same however often the browser calls us.
  const shed = Math.max(0, 1 - DRAG * dt)
  d.vel.x *= shed
  d.vel.y *= shed
  const speed = Math.hypot(d.vel.x, d.vel.y)
  if (speed > MAX_SPEED) {
    d.vel.x = (d.vel.x / speed) * MAX_SPEED
    d.vel.y = (d.vel.y / speed) * MAX_SPEED
  }

  d.pos.x += d.vel.x * dt
  d.pos.y += d.vel.y * dt
  wrap(d.pos, world.w, world.h)

  d.cooldown = Math.max(0, d.cooldown - dt)
  d.shielded = Math.max(0, d.shielded - dt)
}

/**
 * A pellet of ink, if he is not still reloading.
 *
 * It carries his own velocity as well as its own: ink squirted from a moving
 * octopus goes where the octopus was heading, and without that term a pellet
 * fired at a run gets left behind and shot through by its own author.
 */
function tryFire(world: World, input: Input): void {
  const d = world.davey
  if (!input.fire || d.cooldown > 0) return
  d.cooldown = FIRE_COOLDOWN
  world.pellets.push({
    pos: {
      x: d.pos.x + Math.cos(d.angle) * (DAVEY_RADIUS + 2),
      y: d.pos.y + Math.sin(d.angle) * (DAVEY_RADIUS + 2),
    },
    vel: {
      x: Math.cos(d.angle) * PELLET_SPEED + d.vel.x,
      y: Math.sin(d.angle) * PELLET_SPEED + d.vel.y,
    },
    life: PELLET_LIFE,
  })
}

function moveRest(world: World, dt: number): void {
  for (const p of world.pellets) {
    p.pos.x += p.vel.x * dt
    p.pos.y += p.vel.y * dt
    p.life -= dt
    wrap(p.pos, world.w, world.h)
  }
  world.pellets = world.pellets.filter((p) => p.life > 0)

  for (const v of world.divers) {
    v.pos.x += v.vel.x * dt
    v.pos.y += v.vel.y * dt
    v.angle += v.spin * dt
    wrap(v.pos, world.w, world.h)
  }
}

/**
 * What is left of a group after a pellet goes through it.
 *
 * A 3 becomes two 2s, a 2 becomes two 1s, a 1 becomes nothing. The halves
 * inherit the original's drift and are pushed apart from it, so a group visibly
 * comes apart rather than two new divers appearing where one was.
 */
export function splitDiver(world: World, diver: Diver): Diver[] {
  if (diver.size === 1) return []
  const size = (diver.size - 1) as DiverSize
  const spread = between(world, 0, Math.PI * 2)
  return [0, 1].map((i) => {
    const heading = spread + i * Math.PI
    const speed = Math.hypot(diver.vel.x, diver.vel.y) + between(world, 18, 46)
    return {
      pos: { x: diver.pos.x, y: diver.pos.y },
      vel: { x: Math.cos(heading) * speed, y: Math.sin(heading) * speed },
      size,
      radius: DIVER_RADIUS[size],
      angle: diver.angle,
      spin: between(world, -1.6, 1.6),
    }
  })
}

function resolvePellets(world: World): void {
  const survivors: Diver[] = []
  const spawned: Diver[] = []
  const spent = new Set<Pellet>()

  for (const diver of world.divers) {
    // The first pellet to reach a diver is the one that gets the credit; a
    // second one passing through the same frame would otherwise split what is
    // no longer there.
    const pellet = world.pellets.find(
      (p) => !spent.has(p) && hits(p.pos, PELLET_RADIUS, diver.pos, diver.radius),
    )
    if (!pellet) {
      survivors.push(diver)
      continue
    }
    spent.add(pellet)
    world.score += DIVER_POINTS[diver.size]
    spawned.push(...splitDiver(world, diver))
  }

  world.divers = [...survivors, ...spawned]
  if (spent.size) world.pellets = world.pellets.filter((p) => !spent.has(p))
}

function resolveDavey(world: World): void {
  const d = world.davey
  if (d.shielded > 0) return
  const struck = world.divers.some((v) => hits(d.pos, DAVEY_RADIUS, v.pos, v.radius))
  if (!struck) return

  world.lives -= 1
  world.events.push('hit')
  if (world.lives <= 0) {
    world.lives = 0
    world.over = true
    world.events.push('over')
    return
  }
  // Back to the middle, still, facing up, and briefly untouchable — the same
  // deal every arcade cabinet has offered since 1979.
  world.davey = makeDavey(world.w, world.h)
}

/**
 * One step of the world.
 *
 * `dt` is seconds since the last step and is clamped (see MAX_STEP). Returns
 * the same world it was given, so a caller can read `world.events` for what
 * happened.
 */
export function step(world: World, dt: number, input: Input): World {
  world.events = []
  if (world.over) return world

  const t = Math.min(Math.max(dt, 0), MAX_STEP)
  moveDavey(world, t, input)
  tryFire(world, input)
  moveRest(world, t)
  resolvePellets(world)
  resolveDavey(world)

  // A cleared screen is the next wave, immediately. Waiting for an animation
  // would mean a state where nothing can be hit and nothing is happening, which
  // reads as the game having crashed.
  if (!world.over && world.divers.length === 0) {
    world.wave += 1
    world.davey.shielded = Math.max(world.davey.shielded, 1)
    spawnWave(world)
  }
  return world
}
