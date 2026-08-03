// A stand-in for the Supabase client, for unit tests of the modules that read
// the shared catalog (events.ts, destinations.ts).
//
// Why this exists rather than a hand-written `vi.fn()` per test: those modules
// build real PostgREST queries — `.eq('kind','dive').is('cancelled_at',null)
// .gte('start_date',today)` — and a mock that ignores the filters would hand
// every row back to every query. A test written against that mock passes while
// asserting a fantasy: it would not notice a query that fetched courses into the
// dive list, which is exactly the kind of mistake worth catching. So the filters
// are actually applied here.
//
// This is deliberately the same idea as `applyFilters` in e2e/helpers.ts, which
// does the job over HTTP for the browser tests. The two are separate on purpose:
// that one intercepts a network route and must speak PostgREST's URL syntax,
// this one intercepts the client and speaks its method chain. Sharing code
// between them would mean one abstraction serving two different interfaces.
//
// Only the operators this site actually calls are implemented. An unknown one
// throws rather than passing rows through silently — a filter that quietly does
// nothing is how a green test hides a broken query.

export type Row = Record<string, unknown>
export type FakeDb = Record<string, Row[]>

/** Compared as strings, the way PostgREST compares them over the wire. */
const s = (v: unknown) => String(v)

export type FakeOptions = {
  /** Tables that should answer with an error instead of rows. */
  errors?: Record<string, { message: string }>
}

function createQuery(rows: Row[], error: { message: string } | null) {
  let current = [...rows]

  const result = () => ({ data: error ? null : current, error })

  const api = {
    // `select` takes the column list. We ignore which columns were asked for —
    // the shape of a row here is whatever the fixture says — but see the
    // db-columns test, which is what guards the column lists themselves.
    select: () => api,

    eq: (column: string, value: unknown) => {
      current = current.filter((r) => s(r[column]) === s(value))
      return api
    },
    neq: (column: string, value: unknown) => {
      current = current.filter((r) => s(r[column]) !== s(value))
      return api
    },
    // `.is(col, null)` is the null check, and it is not the same as `.eq`:
    // undefined and null both count as null, and nothing else does.
    is: (column: string, value: unknown) => {
      current = current.filter((r) => (value === null ? r[column] == null : r[column] === value))
      return api
    },
    gte: (column: string, value: unknown) => {
      current = current.filter((r) => s(r[column]) >= s(value))
      return api
    },
    lte: (column: string, value: unknown) => {
      current = current.filter((r) => s(r[column]) <= s(value))
      return api
    },
    in: (column: string, values: unknown[]) => {
      const list = values.map(s)
      current = current.filter((r) => list.includes(s(r[column])))
      return api
    },
    /** Array-column overlap, e.g. course_days ∩ the days of the month shown. */
    overlaps: (column: string, values: unknown[]) => {
      const list = values.map(s)
      current = current.filter((r) =>
        ((r[column] as unknown[]) ?? []).some((v) => list.includes(s(v))),
      )
      return api
    },
    order: (column: string) => {
      current = [...current].sort((a, b) => s(a[column] ?? '').localeCompare(s(b[column] ?? '')))
      return api
    },
    limit: (n: number) => {
      current = current.slice(0, n)
      return api
    },

    maybeSingle: async () => ({ data: error ? null : (current[0] ?? null), error }),

    // Thenable, so `await supabase.from(...).select(...)` resolves the way the
    // real client's PostgrestBuilder does.
    then: <T>(
      onfulfilled?: (value: { data: Row[] | null; error: unknown }) => T,
      onrejected?: (reason: unknown) => T,
    ) => Promise.resolve(result()).then(onfulfilled, onrejected),
  }

  return api
}

/**
 * A fake client reading from `getDb()`, re-read on every query so a test can
 * swap the rows between calls without rebuilding the mock.
 */
export function createFakeSupabase(
  getDb: () => FakeDb,
  getOptions: () => FakeOptions = () => ({}),
) {
  return {
    from(table: string) {
      const db = getDb()
      const error = getOptions().errors?.[table] ?? null
      return createQuery(db[table] ?? [], error)
    },
  }
}
