// Single source of truth for outward-facing links and contact details.
// Booking/login live in the existing app — this marketing site only links to it.

const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.fundiverstw.com'

/** Deep-link into the booking app's calendar, where booking happens. */
export const bookUrl = `${APP_URL}/calendar`

/** Deep-link to the app's registration form pre-filled with a specific event.
 *  Mirrors app-fundivers' /register/:type/:id route (type = 'dive' | 'course'). */
export function registerUrl(type: 'dive' | 'course', id: string): string {
  return `${APP_URL}/register/${type}/${id}`
}

export const CONTACT = {
  email: 'fundiverstw@gmail.com',
  phone: '+886 909-083-683',
  phoneHref: 'tel:+886909083683',
  address: 'No. 8, Heping St, Yonghe District, New Taipei City',
} as const

export const SOCIAL = {
  // LINE + WhatsApp match app-fundivers' fundive.config.ts; Instagram + YouTube
  // handles confirmed by the owner.
  line: 'https://line.me/R/ti/p/%40lga0216c',
  whatsapp: 'https://wa.me/886909083683',
  instagram: 'https://www.instagram.com/fundiverstaiwan',
  facebook: 'https://www.facebook.com/FunDiversTw/',
  youtube: 'https://www.youtube.com/@fundiverstaiwan651',
  // The Icecast mount the nav player streams — a separate subdomain from the
  // radio site (see radio-fundivers/RADIO_SETUP.md). The show only broadcasts
  // live during a session; the rest of the time this 404s and the player shows
  // "off air".
  radioStream: 'https://stream.fundiverstw.com/stream',
} as const
