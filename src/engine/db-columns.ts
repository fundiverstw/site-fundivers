// Everything this site asks the booking app's database for, in one place.
//
// The database belongs to `app-fundivers`. A migration there that renames or
// drops one of these columns breaks a page here, and nothing in this repository
// would notice: the browser tests answer every query from a fake database, so
// they stay green while the real calendar goes blank.
//
// The contract test (contract/live-database.test.ts, `npm run test:contract`)
// runs each of these selects against the real database and fails if any column
// has gone. Keep the constants here and import them — a select typed inline is
// a select nothing checks.

/** Columns the month calendar needs for a dive. */
export const EVENT_DIVE_COLS =
  'id, admin_title, display_title, calendar_title, start_date, start_time, end_date, featured, fully_booked, capacity, price, is_trip, is_boat_dive'

/** Columns the month calendar needs for a course. */
export const EVENT_COURSE_COLS =
  'id, admin_title, display_title, calendar_title, start_time, price, course_days, fully_booked, capacity'

/** Columns the homepage's "upcoming" cards need for a dive. */
export const EVENT_UPCOMING_DIVE_COLS =
  'id, display_title, admin_title, start_date, end_date, start_time, price, fully_booked, featured, notes, is_trip'

/** Columns the homepage's "upcoming" cards need for a course. */
export const EVENT_UPCOMING_COURSE_COLS =
  'id, display_title, admin_title, start_time, price, course_days, fully_booked, schedule'

/** Columns the event modal fetches when you open an event. */
export const EVENT_DETAIL_COLS = 'notes, included, schedule, prereqs, req_dives, prereq_cert_id'

/** Columns used to list the titles of upcoming trips. */
export const EVENT_TRIP_TITLE_COLS = 'display_title, admin_title'

/** Starting prices, referenced from `events.price` by uuid. */
export const PRICE_COLS = 'id, starting_at'

/** Certification names, referenced from `events.prereq_cert_id`. */
export const CERT_LEVEL_COLS = 'name'

/** Everything the Travel page shows. */
export const DESTINATION_COLS =
  'id, admin_title, slug, tagline, country, international, divetype, diver_requirements, location_picture, background_picture, sort_order'

/** Columns the site filters, sorts or matches on. A column can exist and still
 *  stop being queryable — dropped from the anon role's grant, say. */
export const FILTERED_COLUMNS = {
  events: ['kind', 'cancelled_at', 'is_private', 'start_date', 'course_days', 'is_trip', 'id'],
  prices: ['id'],
  cert_levels: ['id'],
  travel_destinations: ['sort_order'],
} as const
