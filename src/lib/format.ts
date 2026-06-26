// Display helpers shared across pages.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Parse a 'YYYY-MM-DD' key into a local Date (no timezone drift). */
function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 'Sat, May 1' style, optionally a range and time. */
export function formatSpan(startKey: string, endKey: string | null, time: string | null): string {
  const start = fromKey(startKey)
  const head = `${WEEKDAYS[start.getDay()]}, ${MONTHS[start.getMonth()]} ${start.getDate()}`
  const timeSuffix = time ? ` · ${time}` : ''
  if (!endKey || endKey === startKey) return head + timeSuffix
  const end = fromKey(endKey)
  return `${head}${timeSuffix} → ${MONTHS[end.getMonth()]} ${end.getDate()}`
}

/** Short month-day badge parts for a date key. */
export function badge(key: string): { month: string; day: number } {
  const d = fromKey(key)
  return { month: MONTHS[d.getMonth()].toUpperCase(), day: d.getDate() }
}

/** TWD price, e.g. 15400 → 'NT$15,400'. */
export function twd(amount: number | null): string | null {
  if (amount == null) return null
  return `NT$${amount.toLocaleString('en-US')}`
}
