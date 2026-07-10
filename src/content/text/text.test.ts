import { describe, it, expect } from 'vitest'
import { en } from './en'
import { zhTW } from './zh-TW'
import { ja } from './ja'

// TypeScript already refuses to build when a language file is missing a word.
// These tests cover what it cannot see: a word left empty, an extra word in one
// language only, or a list that is a different length in Japanese than English.

type Node = Record<string, unknown>

/** Every leaf, as a dotted path: 'nav.courses', 'gear.salesItems.0'. */
function paths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => paths(v, `${prefix}.${i}`))
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Node).flatMap(([k, v]) =>
      paths(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return [prefix]
}

/** Every string in the dictionary, with the path that led to it. */
function leaves(value: unknown, prefix = ''): Array<[string, unknown]> {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${prefix}.${i}`))
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Node).flatMap(([k, v]) =>
      leaves(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return [[prefix, value]]
}

const locales = { 'zh-TW': zhTW, ja } as const

describe.each(Object.entries(locales))('%s', (name, dict) => {
  it('has exactly the same words as English — no more, no fewer', () => {
    const missing = paths(en).filter((p) => !paths(dict).includes(p))
    const extra = paths(dict).filter((p) => !paths(en).includes(p))
    expect({ missing, extra }, `${name} does not match en.ts`).toEqual({ missing: [], extra: [] })
  })

  it('leaves no word blank', () => {
    for (const [path, value] of leaves(dict)) {
      expect(typeof value, `${name}: ${path}`).toBe('string')
      expect(String(value).trim(), `${name}: ${path} is empty`).not.toBe('')
    }
  })
})

describe('en', () => {
  it('leaves no word blank', () => {
    for (const [path, value] of leaves(en)) {
      expect(String(value).trim(), `en: ${path} is empty`).not.toBe('')
    }
  })

  // Gear.svelte renders these with `{#each p.items as item (item)}` — the item
  // itself is the key, and Svelte throws on a duplicate key.
  it('does not repeat an item inside one gear list', () => {
    for (const key of ['salesItems', 'serviceItems', 'rentalItems'] as const) {
      const items = en.gear[key]
      expect(items, `en.gear.${key} repeats an item`).toHaveLength(new Set(items).size)
    }
  })
})

describe.each(Object.entries(locales))('%s gear lists', (name, dict) => {
  it('do not repeat an item', () => {
    for (const key of ['salesItems', 'serviceItems', 'rentalItems'] as const) {
      const items = dict.gear[key]
      expect(items, `${name}.gear.${key} repeats an item`).toHaveLength(new Set(items).size)
    }
  })
})
