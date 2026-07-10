// Single source of truth for outward-facing links and contact details.
// Booking/login live in the existing app — this marketing site only links to it.

export const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.fundiverstw.com'

/** Deep-link into the booking app's login / registration. */
export const bookUrl = `${APP_URL}/calendar`
export const loginUrl = `${APP_URL}/login`

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

// Rotating promo messages shown on the nav mascot's banner. Edit freely.
export const ADS: Array<{ text: string; href: string }> = [
  { text: '🤿 20% off wetsuits!', href: '#get-in-touch' },
  { text: '🐢 Green Island — spots open!', href: '/calendar' },
  { text: '🎓 Try Discover Scuba', href: '/courses' },
]

export const SOCIAL = {
  // LINE + WhatsApp match app-fundivers' fundive.config.ts; Instagram + YouTube
  // handles confirmed by the owner.
  line: 'https://line.me/R/ti/p/%40lga0216c',
  whatsapp: 'https://wa.me/886909083683',
  instagram: 'https://www.instagram.com/fundiverstaiwan',
  facebook: 'https://www.facebook.com/FunDiversTw/',
  youtube: 'https://www.youtube.com/@fundiverstaiwan651',
} as const

// FunDivers Radio show (top-right icon) — same destination as the app's nav.
export const RADIO_URL = 'https://radio.fundiverstw.com'

// Gear shop (top-left icon). Placeholder until a store/destination is decided —
// repoint here when ready (e.g. an online store or the shop's Google Maps page).
export const SHOP_URL = '#'
