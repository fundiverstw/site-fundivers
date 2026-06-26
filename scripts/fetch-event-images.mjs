// One-time / re-runnable: pull the events' Wix cover photos off the Wix CDN,
// optimize to WebP, and save them under public/imgs/events/ so the site serves
// its own images (no Wix dependency). Re-run after new events get photos.
//
//   node scripts/fetch-event-images.mjs
//
// Derives the output filename from the Wix media id embedded in
// EO_*.featured_image, matching eventImage() in src/lib/events.ts — so no
// mapping file or DB change is needed.

import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(root, 'public', 'imgs', 'events')
const MAX_WIDTH = 1000 // cards render ~500px wide; 2× for retina
const QUALITY = 80

const env = Object.fromEntries(
  readFileSync(join(root, '.env'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)
const SUPABASE_URL = env.VITE_SUPABASE_URL
const KEY = env.VITE_SUPABASE_ANON_KEY

/** Wix media id (segment before the original filename), as a safe slug. */
function imageId(raw) {
  if (!raw || !raw.startsWith('wix:image://')) return null
  const seg = raw.replace('wix:image://v1/', '').split('#')[0].split('/')[0]
  return seg.replace(/[^a-zA-Z0-9]/g, '_')
}
/** Wix CDN URL for the original. */
function cdnUrl(raw) {
  const s = raw.replace('wix:image://v1/', 'https://static.wixstatic.com/media/').split('#')[0]
  return s.split('/').slice(0, -1).join('/')
}

async function fetchRefs(table) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=featured_image&featured_image=not.is.null`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  )
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`)
  return (await res.json()).map((r) => r.featured_image)
}

const refs = [...(await fetchRefs('EO_dives')), ...(await fetchRefs('EO_courses'))]
const distinct = [...new Map(refs.map((r) => [imageId(r), r])).entries()].filter(([id]) => id)

mkdirSync(OUT_DIR, { recursive: true })
console.log(`${distinct.length} distinct images → ${OUT_DIR}`)

let done = 0, skipped = 0, failed = 0
for (const [id, raw] of distinct) {
  const out = join(OUT_DIR, `${id}.webp`)
  if (existsSync(out)) { skipped++; continue }
  try {
    const r = await fetch(cdnUrl(raw))
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const buf = Buffer.from(await r.arrayBuffer())
    await sharp(buf).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out)
    done++
    process.stdout.write(`  ✓ ${id}.webp\n`)
  } catch (e) {
    failed++
    process.stdout.write(`  ✗ ${id} — ${e.message}\n`)
  }
}
console.log(`done: ${done} written, ${skipped} skipped, ${failed} failed`)
