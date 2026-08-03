import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as columns from './db-columns'

// db-columns.ts is the list of everything this site asks the booking app's
// database for, and the contract test (npm run test:contract) checks that list
// against the real database. But the contract test can only check what the list
// *says* — it cannot notice that the list has stopped describing this code.
//
// That is the drift these tests catch. `FILTERED_COLUMNS` in particular is
// maintained by hand: someone adds a `.eq('is_boat_dive', true)` to a query,
// forgets to declare it, and the contract test happily verifies a column that
// nothing filters on while the one that matters goes unchecked. Nothing fails,
// and the day the anon role loses that grant the calendar empties out in
// production with a green test suite behind it.
//
// So: read the query code, and require the two to agree.

const here = path.dirname(fileURLToPath(import.meta.url))
const read = (file: string) => readFileSync(path.join(here, file), 'utf8')

/** The PostgREST filter/sort operators whose first argument is a column name. */
const OPERATORS = ['eq', 'neq', 'is', 'gte', 'lte', 'gt', 'lt', 'in', 'overlaps', 'order']

/**
 * Every `supabase.from('table')…` chain in a source file, with the columns it
 * filters or sorts on.
 *
 * Splitting on `.from('` is what bounds each chain: a chunk runs to just before
 * the next one starts, so an operator can only be attributed to the query it
 * belongs to.
 */
function queriesIn(source: string): Array<{ table: string; filtered: string[] }> {
  const pattern = new RegExp(`\\.(?:${OPERATORS.join('|')})\\(\\s*['"]([^'"]+)['"]`, 'g')
  return source
    .split(/\.from\(\s*['"]/)
    .slice(1)
    .map((chunk) => {
      const table = chunk.slice(0, chunk.search(/['"]/))
      const body = chunk.slice(table.length)
      return { table, filtered: [...body.matchAll(pattern)].map((m) => m[1]) }
    })
}

const QUERY_SOURCES = ['events.ts', 'destinations.ts']

const allQueries = QUERY_SOURCES.flatMap((file) => queriesIn(read(file)))

describe('the column lists themselves', () => {
  // Everything exported from db-columns except FILTERED_COLUMNS, which is the
  // one entry that is an object rather than a select string.
  const selectLists = Object.entries(columns).filter(
    ([, value]) => typeof value === 'string',
  ) as Array<[string, string]>

  it('found some to check', () => {
    expect(selectLists.length).toBeGreaterThan(0)
  })

  it.each(selectLists)('%s is a clean comma-separated list', (_name, value) => {
    const parts = value.split(',').map((c) => c.trim())
    expect(parts.every((c) => c.length > 0)).toBe(true)
    expect(parts.every((c) => /^[a-z_][a-z0-9_]*$/.test(c))).toBe(true)
  })

  it.each(selectLists)('%s names no column twice', (_name, value) => {
    const parts = value.split(',').map((c) => c.trim())
    expect([...new Set(parts)]).toEqual(parts)
  })
})

describe('FILTERED_COLUMNS against the queries that exist', () => {
  it('found the queries to check', () => {
    // If the parse ever silently stops matching, every assertion below becomes
    // vacuously true. Fail loudly instead.
    expect(allQueries.length).toBeGreaterThan(0)
    expect(allQueries.some((q) => q.filtered.length > 0)).toBe(true)
  })

  it('only queries tables it declares filters for', () => {
    const declared = Object.keys(columns.FILTERED_COLUMNS)
    for (const query of allQueries) {
      expect(declared, `no FILTERED_COLUMNS entry for '${query.table}'`).toContain(query.table)
    }
  })

  it('declares every column the code actually filters or sorts on', () => {
    for (const query of allQueries) {
      const declared: readonly string[] =
        columns.FILTERED_COLUMNS[query.table as keyof typeof columns.FILTERED_COLUMNS] ?? []
      for (const column of query.filtered) {
        expect(
          declared,
          `${query.table}.${column} is filtered on but not declared in FILTERED_COLUMNS — ` +
            `the contract test will not check it`,
        ).toContain(column)
      }
    }
  })

  it('declares nothing the code has stopped filtering on', () => {
    // The other direction: a stale entry makes the contract test verify a
    // column this site no longer cares about, which is noise that trains people
    // to ignore it.
    const used = new Map<string, Set<string>>()
    for (const query of allQueries) {
      const set = used.get(query.table) ?? new Set<string>()
      for (const column of query.filtered) set.add(column)
      used.set(query.table, set)
    }

    for (const [table, declared] of Object.entries(columns.FILTERED_COLUMNS)) {
      for (const column of declared) {
        expect(
          [...(used.get(table) ?? [])],
          `${table}.${column} is declared in FILTERED_COLUMNS but nothing filters on it`,
        ).toContain(column)
      }
    }
  })
})
