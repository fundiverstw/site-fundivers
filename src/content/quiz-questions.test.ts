import { describe, it, expect } from 'vitest'
import { QUESTIONS, type Category } from './quiz-questions'

// The Wreck Maze asks these. The game's contract, from WreckMaze.svelte:
//
//   const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
//   pending = { options: order.map((i) => q.answers[i]), correct: order.indexOf(0) }
//
// answers[0] is always the right answer, and it is shuffled at ask time. Two
// identical answers would therefore make one of the wrong ones also correct,
// and the player would be marked wrong for picking it.

const CATEGORIES: Category[] = [
  'Physics',
  'Physiology',
  'Equipment',
  'Safety',
  'Marine Life',
  'Taiwan',
]

describe('the quiz questions', () => {
  it('has enough of them that a game does not repeat itself', () => {
    // A 6x6 maze guards about 26 compartments.
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(40)
  })

  it('asks each question only once', () => {
    const texts = QUESTIONS.map((q) => q.q)
    const seen = new Set<string>()
    const dupes = texts.filter((t) => seen.size === seen.add(t).size)
    expect(dupes, 'these questions are asked twice').toEqual([])
  })

  it('offers exactly four answers to every question', () => {
    for (const q of QUESTIONS) {
      expect(q.answers, q.q).toHaveLength(4)
    }
  })

  // The one that actually breaks the game.
  it('never repeats an answer within one question', () => {
    for (const q of QUESTIONS) {
      expect(new Set(q.answers).size, `"${q.q}" offers the same answer twice`).toBe(4)
    }
  })

  it('leaves nothing blank', () => {
    for (const q of QUESTIONS) {
      expect(q.q.trim(), 'blank question').not.toBe('')
      expect(q.explain.trim(), `"${q.q}" has no explanation`).not.toBe('')
      for (const a of q.answers) expect(a.trim(), `"${q.q}" has a blank answer`).not.toBe('')
    }
  })

  it('files every question under a category the game knows', () => {
    for (const q of QUESTIONS) {
      expect(CATEGORIES, `"${q.q}"`).toContain(q.category)
    }
  })

  it('uses every category at least once', () => {
    for (const c of CATEGORIES) {
      const n = QUESTIONS.filter((q) => q.category === c).length
      expect(n, `no questions in the '${c}' category`).toBeGreaterThan(0)
    }
  })

  it('keeps the answers short enough to read on the button', () => {
    for (const q of QUESTIONS) {
      for (const a of q.answers) {
        expect(a.length, `"${a}" is too long for an answer button`).toBeLessThanOrEqual(90)
      }
    }
  })
})
