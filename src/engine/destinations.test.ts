import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { FakeDb, FakeOptions } from './__fixtures__/fake-supabase'

// The Travel page's destinations. Short module, but it is the only read on the
// site that throws on a database error rather than degrading to an empty list —
// worth pinning, because "throws" and "returns []" look the same in a component
// that renders nothing either way, and only one of them shows an error state.

const { state } = vi.hoisted(() => ({
  state: { db: {} as FakeDb, options: {} as FakeOptions },
}))

vi.mock('./supabase', async () => {
  const { createFakeSupabase } = await import('./__fixtures__/fake-supabase')
  return {
    supabase: createFakeSupabase(
      () => state.db,
      () => state.options,
    ),
  }
})

const { fetchDestinations } = await import('./destinations')
const { DESTINATION_COLS } = await import('./db-columns')

const row = (over: Record<string, unknown> = {}) => ({
  id: 'green-island',
  admin_title: 'Green Island',
  slug: 'green-island',
  tagline: 'Warm water and big walls',
  country: 'Taiwan',
  international: false,
  divetype: 'Boat',
  diver_requirements: 'Open Water',
  sort_order: 1,
  ...over,
})

beforeEach(() => {
  state.db = {}
  state.options = {}
})

describe('fetchDestinations', () => {
  it('maps the database columns onto the shape the page reads', async () => {
    state.db = { travel_destinations: [row()] }

    expect(await fetchDestinations()).toEqual([
      {
        id: 'green-island',
        title: 'Green Island',
        slug: 'green-island',
        tagline: 'Warm water and big walls',
        country: 'Taiwan',
        international: false,
        diveType: 'Boat',
        requirements: 'Open Water',
      },
    ])
  })

  it('returns an empty list when there are no destinations', async () => {
    state.db = { travel_destinations: [] }

    expect(await fetchDestinations()).toEqual([])
  })

  it('names an untitled destination rather than rendering a blank card', async () => {
    state.db = { travel_destinations: [row({ admin_title: null })] }

    expect((await fetchDestinations())[0].title).toBe('Destination')
  })

  it('treats international as a strict boolean', async () => {
    // The column has been null and has been a string in this table's history,
    // and `international` drives which list a destination appears in — so
    // anything other than a real `true` has to read as false.
    state.db = {
      travel_destinations: [
        row({ id: 'a', international: true, sort_order: 1 }),
        row({ id: 'b', international: false, sort_order: 2 }),
        row({ id: 'c', international: null, sort_order: 3 }),
      ],
    }

    expect((await fetchDestinations()).map((d) => [d.id, d.international])).toEqual([
      ['a', true],
      ['b', false],
      ['c', false],
    ])
  })

  it('orders by sort_order', async () => {
    state.db = {
      travel_destinations: [
        row({ id: 'third', sort_order: 3 }),
        row({ id: 'first', sort_order: 1 }),
        row({ id: 'second', sort_order: 2 }),
      ],
    }

    expect((await fetchDestinations()).map((d) => d.id)).toEqual(['first', 'second', 'third'])
  })

  it('throws when the database errors, rather than pretending there are none', async () => {
    state.options = { errors: { travel_destinations: { message: 'permission denied' } } }

    await expect(fetchDestinations()).rejects.toMatchObject({ message: 'permission denied' })
  })

  it("ignores the old site's picture columns, which it no longer selects", async () => {
    // The rows still have them; nothing local resolves a wix: ref any more, so a
    // destination must come back with no photo field for a page to trust.
    state.db = {
      travel_destinations: [row({ location_picture: 'wix:image://v1/anything~mv2.jpg/x.jpg' })],
    }

    const [dest] = await fetchDestinations()
    expect(dest).not.toHaveProperty('image')
    expect(DESTINATION_COLS).not.toContain('picture')
  })
})
