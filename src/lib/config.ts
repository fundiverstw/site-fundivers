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

export const SOCIAL = {
  line: 'https://line.me/R/ti/p/@fundiverstw',
  whatsapp: 'https://wa.me/886909083683',
  instagram: 'https://www.instagram.com/fundiverstw/',
  facebook: 'https://www.facebook.com/fundiverstw/',
  youtube: 'https://www.youtube.com/@fundiverstw',
} as const
