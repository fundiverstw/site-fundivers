import { describe, it, expect } from 'vitest'
import {
  createWorld,
  hits,
  MAX_STEP,
  rng,
  spawnWave,
  splitDiver,
  step,
  wrap,
  type Diver,
  type Input,
  type World,
} from './arcade'

// The game at /arcade. None of this needs a browser: the page draws the world,
// and the world is arithmetic.

const IDLE: Input = { left: false, right: false, thrust: false, fire: false }
const input = (over: Partial<Input>): Input => ({ ...IDLE, ...over })

/** A world with the opening wave cleared away, so a test can put exactly the
 *  divers it cares about on the screen. */
function empty(w = 900, h = 560): World {
  const world = createWorld(w, h)
  world.divers = []
  world.events = []
  return world
}

/** A diver of a given size, parked away from the middle where Davey is. */
function diver(world: World, size: 1 | 2 | 3, at = { x: 100, y: 100 }): Diver {
  const radius = { 1: 15, 2: 26, 3: 42 }[size]
  const d: Diver = {
    pos: { ...at },
    vel: { x: 0, y: 0 },
    size,
    radius,
    angle: 0,
    spin: 0,
  }
  world.divers.push(d)
  return d
}

/** Ink sitting exactly on a diver, about to be resolved. */
function pelletOn(world: World, d: Diver) {
  world.pellets.push({ pos: { ...d.pos }, vel: { x: 0, y: 0 }, life: 1 })
}

describe('the random stream', () => {
  it('is the same run twice from the same seed', () => {
    const a = [rng(7), rng(rng(7).seed)]
    const b = [rng(7), rng(rng(7).seed)]
    expect(a.map((r) => r.value)).toEqual(b.map((r) => r.value))
  })

  it('stays in [0, 1) and moves on', () => {
    let seed = 12345
    for (let i = 0; i < 200; i++) {
      const r = rng(seed)
      expect(r.value).toBeGreaterThanOrEqual(0)
      expect(r.value).toBeLessThan(1)
      expect(r.seed).not.toBe(seed)
      seed = r.seed
    }
  })

  // Two worlds with the same seed have to play out identically — that is the
  // whole reason the engine does not call Math.random, and a test that only
  // checked the range would not notice a stray one creeping back in.
  it('makes two worlds with the same seed identical', () => {
    const a = createWorld(900, 560, 42)
    const b = createWorld(900, 560, 42)
    for (let i = 0; i < 50; i++) {
      step(a, 0.016, input({ thrust: true, fire: true }))
      step(b, 0.016, input({ thrust: true, fire: true }))
    }
    expect(a.divers).toEqual(b.divers)
    expect(a.pellets).toEqual(b.pellets)
    expect(a.score).toBe(b.score)
  })
})

describe('the edges of the screen', () => {
  it('brings anything that leaves back on the far side', () => {
    const p = { x: -1, y: -1 }
    wrap(p, 100, 50)
    expect(p).toEqual({ x: 99, y: 49 })

    const q = { x: 100, y: 50 }
    wrap(q, 100, 50)
    expect(q).toEqual({ x: 0, y: 0 })
  })

  it('leaves anything already on screen alone', () => {
    const p = { x: 10, y: 20 }
    wrap(p, 100, 50)
    expect(p).toEqual({ x: 10, y: 20 })
  })
})

describe('two circles', () => {
  it('touch when they overlap, and when they just graze', () => {
    expect(hits({ x: 0, y: 0 }, 5, { x: 3, y: 0 }, 5)).toBe(true)
    expect(hits({ x: 0, y: 0 }, 5, { x: 10, y: 0 }, 5)).toBe(true)
  })

  it('miss when they are apart', () => {
    expect(hits({ x: 0, y: 0 }, 5, { x: 11, y: 0 }, 5)).toBe(false)
  })
})

describe('a new game', () => {
  it('starts with three lives, no score, and a screen of divers', () => {
    const world = createWorld(900, 560)
    expect(world.lives).toBe(3)
    expect(world.score).toBe(0)
    expect(world.wave).toBe(1)
    expect(world.over).toBe(false)
    expect(world.divers).toHaveLength(3)
    expect(world.events).toContain('wave')
  })

  it('puts Davey in the middle, still, and briefly untouchable', () => {
    const world = createWorld(900, 560)
    expect(world.davey.pos).toEqual({ x: 450, y: 280 })
    expect(world.davey.vel).toEqual({ x: 0, y: 0 })
    expect(world.davey.shielded).toBeGreaterThan(0)
  })

  // Divers arriving on top of Davey would take a life before the reader's hand
  // was on the keys.
  it('spawns nobody on top of Davey', () => {
    for (let seed = 1; seed < 40; seed++) {
      const world = createWorld(900, 560, seed)
      for (const v of world.divers) {
        expect(hits(world.davey.pos, 16, v.pos, v.radius), `seed ${seed}`).toBe(false)
      }
    }
  })

  it('spawns everyone on the screen', () => {
    const world = createWorld(900, 560, 9)
    for (const v of world.divers) {
      expect(v.pos.x).toBeGreaterThanOrEqual(0)
      expect(v.pos.x).toBeLessThan(900)
      expect(v.pos.y).toBeGreaterThanOrEqual(0)
      expect(v.pos.y).toBeLessThan(560)
    }
  })

  it('sends a bigger crowd every wave', () => {
    const world = empty()
    world.wave = 5
    spawnWave(world)
    expect(world.divers).toHaveLength(7)
  })
})

describe('flying Davey', () => {
  it('turns the way it is asked', () => {
    const world = empty()
    const facing = world.davey.angle
    step(world, 0.1, input({ left: true }))
    expect(world.davey.angle).toBeLessThan(facing)

    const back = world.davey.angle
    step(world, 0.1, input({ right: true }))
    expect(world.davey.angle).toBeGreaterThan(back)
  })

  it('goes the way it is pointing when it thrusts', () => {
    const world = empty()
    world.davey.angle = 0 // due right
    step(world, 0.1, input({ thrust: true }))
    expect(world.davey.vel.x).toBeGreaterThan(0)
    expect(world.davey.pos.x).toBeGreaterThan(450)
    expect(Math.abs(world.davey.vel.y)).toBeLessThan(1e-9)
  })

  it('coasts to a stop rather than drifting forever', () => {
    const world = empty()
    world.davey.vel = { x: 200, y: 0 }
    for (let i = 0; i < 200; i++) step(world, MAX_STEP, IDLE)
    expect(Math.abs(world.davey.vel.x)).toBeLessThan(1)
  })

  it('has a top speed', () => {
    const world = empty()
    world.davey.angle = 0
    for (let i = 0; i < 400; i++) step(world, MAX_STEP, input({ thrust: true }))
    expect(Math.hypot(world.davey.vel.x, world.davey.vel.y)).toBeLessThanOrEqual(340 + 1e-6)
  })

  it('comes back on the other side of the screen', () => {
    const world = empty()
    world.davey.pos = { x: 899, y: 280 }
    world.davey.vel = { x: 300, y: 0 }
    step(world, MAX_STEP, IDLE)
    expect(world.davey.pos.x).toBeLessThan(100)
  })
})

describe('the ink', () => {
  it('comes out in front of him, moving the way he faces', () => {
    const world = empty()
    world.davey.angle = 0
    step(world, 0.016, input({ fire: true }))
    expect(world.pellets).toHaveLength(1)
    expect(world.pellets[0].vel.x).toBeGreaterThan(0)
    expect(world.pellets[0].pos.x).toBeGreaterThan(world.davey.pos.x)
  })

  // Fired at a run, a pellet without his velocity in it gets left behind and
  // overtaken by the octopus who fired it.
  it('carries his own speed with it', () => {
    const world = empty()
    world.davey.angle = 0
    world.davey.vel = { x: 200, y: 0 }
    step(world, 0.001, input({ fire: true }))
    expect(world.pellets[0].vel.x).toBeGreaterThan(430)
  })

  it('will not fire again until it has reloaded', () => {
    const world = empty()
    step(world, 0.016, input({ fire: true }))
    step(world, 0.016, input({ fire: true }))
    expect(world.pellets).toHaveLength(1)

    // Long enough for the cooldown to run out.
    for (let i = 0; i < 20; i++) step(world, MAX_STEP, IDLE)
    step(world, 0.016, input({ fire: true }))
    expect(world.pellets).toHaveLength(2)
  })

  it('runs out rather than circling the screen forever', () => {
    const world = empty()
    step(world, 0.016, input({ fire: true }))
    expect(world.pellets).toHaveLength(1)
    for (let i = 0; i < 40; i++) step(world, MAX_STEP, IDLE)
    expect(world.pellets).toHaveLength(0)
  })
})

describe('shooting a group of divers', () => {
  it('splits a three into two twos and scores it', () => {
    const world = empty()
    const target = diver(world, 3)
    pelletOn(world, target)
    step(world, 0.001, IDLE)

    expect(world.score).toBe(20)
    expect(world.divers).toHaveLength(2)
    expect(world.divers.every((d) => d.size === 2)).toBe(true)
    // The halves start where the group was and go opposite ways — opposite in
    // direction, not in speed: each is given its own kick, so a split looks
    // like a group coming apart rather than a mirror trick.
    const [a, b] = world.divers
    expect(a.pos).toEqual(b.pos)
    expect(a.vel.x * b.vel.x + a.vel.y * b.vel.y).toBeLessThan(0)
  })

  it('splits a two into two ones', () => {
    const world = empty()
    pelletOn(world, diver(world, 2))
    step(world, 0.001, IDLE)
    expect(world.score).toBe(50)
    expect(world.divers.every((d) => d.size === 1)).toBe(true)
  })

  it('clears a single diver away, and is worth the most', () => {
    const world = empty()
    pelletOn(world, diver(world, 1))
    // Two on screen, so clearing one does not also start the next wave.
    diver(world, 1, { x: 700, y: 400 })
    step(world, 0.001, IDLE)
    expect(world.score).toBe(100)
    expect(world.divers).toHaveLength(1)
  })

  it('spends the pellet', () => {
    const world = empty()
    pelletOn(world, diver(world, 3))
    step(world, 0.001, IDLE)
    expect(world.pellets).toHaveLength(0)
  })

  // One pellet, one diver. Without this, a pellet crossing two overlapping
  // groups in the same frame splits both — twice the score for one shot.
  it('is one pellet per diver, however they are stacked', () => {
    const world = empty()
    const a = diver(world, 3)
    diver(world, 3, { ...a.pos })
    pelletOn(world, a)
    step(world, 0.001, IDLE)
    expect(world.score).toBe(20)
    // The one that was hit became two 2s; the other is untouched.
    expect(world.divers.filter((d) => d.size === 3)).toHaveLength(1)
    expect(world.divers.filter((d) => d.size === 2)).toHaveLength(2)
  })

  it('leaves the divers it misses alone', () => {
    const world = empty()
    diver(world, 3)
    world.pellets.push({ pos: { x: 800, y: 500 }, vel: { x: 0, y: 0 }, life: 1 })
    step(world, 0.001, IDLE)
    expect(world.score).toBe(0)
    expect(world.divers).toHaveLength(1)
    expect(world.pellets).toHaveLength(1)
  })

  it('has nothing left to split when the diver is a single', () => {
    const world = empty()
    expect(splitDiver(world, diver(world, 1))).toEqual([])
  })
})

describe('divers running into Davey', () => {
  it('costs a life and puts him back in the middle, untouchable for a moment', () => {
    const world = empty()
    world.davey.shielded = 0
    world.davey.pos = { x: 100, y: 100 }
    diver(world, 3, { x: 100, y: 100 })

    step(world, 0.001, IDLE)

    expect(world.lives).toBe(2)
    expect(world.events).toContain('hit')
    expect(world.davey.pos).toEqual({ x: 450, y: 280 })
    expect(world.davey.shielded).toBeGreaterThan(0)
  })

  // The failure this rules out: a diver sitting still on top of Davey taking
  // all three lives in three consecutive frames.
  it('cannot take a second life while he is still shielded', () => {
    const world = empty()
    world.davey.shielded = 0
    world.davey.pos = { x: 450, y: 280 }
    diver(world, 3, { x: 450, y: 280 })

    step(world, 0.001, IDLE)
    expect(world.lives).toBe(2)
    step(world, 0.001, IDLE)
    step(world, 0.001, IDLE)
    expect(world.lives).toBe(2)
  })

  it('does nothing at all while he is shielded', () => {
    const world = empty()
    diver(world, 3, { x: 450, y: 280 })
    step(world, 0.001, IDLE)
    expect(world.lives).toBe(3)
    expect(world.events).not.toContain('hit')
  })

  it('ends the game on the last one', () => {
    const world = empty()
    world.lives = 1
    world.davey.shielded = 0
    diver(world, 3, { x: 450, y: 280 })

    step(world, 0.001, IDLE)

    expect(world.over).toBe(true)
    expect(world.lives).toBe(0)
    expect(world.events).toContain('over')
  })

  it('stops running once it is over', () => {
    const world = empty()
    world.over = true
    const before = { ...world.davey.pos }
    step(world, MAX_STEP, input({ thrust: true, fire: true }))
    expect(world.davey.pos).toEqual(before)
    expect(world.pellets).toHaveLength(0)
  })
})

describe('clearing the screen', () => {
  it('starts the next wave, bigger, with a moment of grace', () => {
    const world = empty()
    pelletOn(world, diver(world, 1))
    step(world, 0.001, IDLE)

    expect(world.wave).toBe(2)
    expect(world.divers).toHaveLength(4)
    expect(world.davey.shielded).toBeGreaterThan(0)
    expect(world.events).toContain('wave')
  })
})

describe('a long step', () => {
  // A backgrounded tab hands back however long the reader was away. Without the
  // clamp, one step moves every diver clean through Davey and out the far side:
  // no overlap, no collision, no life lost.
  it('is clamped, so nothing tunnels through anything', () => {
    const slow = empty()
    slow.davey.angle = 0
    step(slow, MAX_STEP, input({ thrust: true }))

    const huge = empty()
    huge.davey.angle = 0
    step(huge, 30, input({ thrust: true }))

    expect(huge.davey.pos).toEqual(slow.davey.pos)
  })

  it('ignores a step that runs backwards', () => {
    const world = empty()
    world.davey.vel = { x: 100, y: 0 }
    const before = { ...world.davey.pos }
    step(world, -5, IDLE)
    expect(world.davey.pos).toEqual(before)
  })
})

describe('what just happened', () => {
  it('is cleared each step, so a line is said once', () => {
    const world = createWorld(900, 560)
    expect(world.events).toContain('wave')
    step(world, 0.016, IDLE)
    expect(world.events).toEqual([])
  })
})
