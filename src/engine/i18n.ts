import { writable, derived } from 'svelte/store'
import { en, type Dict } from '$content/text/en'
import { zhTW } from '$content/text/zh-TW'
import { ja } from '$content/text/ja'

// The language switcher's machinery: which language is currently picked
// (remembered in the browser), and a `t` store holding that language's words.
//
// You almost never need to edit this file. To change what a word says, or to
// translate a new one, open src/content/text/ instead.

export type Locale = 'en' | 'zh-TW' | 'ja'

export const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'zh-TW', label: '中文' },
  { code: 'ja', label: '日本語' },
]

function initial(): Locale {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('locale')
    if (saved === 'en' || saved === 'zh-TW' || saved === 'ja') return saved
  }
  return 'en'
}

export const locale = writable<Locale>(initial())

export function setLocale(l: Locale) {
  locale.set(l)
  if (typeof localStorage !== 'undefined') localStorage.setItem('locale', l)
  if (typeof document !== 'undefined') document.documentElement.lang = l
}

const messages: Record<Locale, Dict> = { en, 'zh-TW': zhTW, ja }

export const t = derived(locale, ($l) => messages[$l])
