// Re-runnable: pull every Wix-hosted photo the site uses off the Wix CDN,
// optimize to WebP, and save under public/imgs/media/<slug>.webp so the site
// serves its own images (no Wix dependency).
//
//   node scripts/fetch-wix-images.mjs
//
// Sources:
//   • EO_dives.featured_image, EO_courses.featured_image  (event cards)
//   • TravelDestinations.location_picture                  (travel/sites)
//   • SERVICE_MEDIA                                         (homepage service cards,
//                                                            harvested by alt text)
// Filenames are derived from the Wix media id, matching src/lib/images.ts.

import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(root, 'public', 'imgs', 'media')
const MAX_WIDTH = 1000
const QUALITY = 80

const env = Object.fromEntries(
  readFileSync(join(root, '.env'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)
const SUPABASE_URL = env.VITE_SUPABASE_URL
const KEY = env.VITE_SUPABASE_ANON_KEY

// Homepage "Explore our Services" photos — Wix media ids harvested from the
// live site by their alt text (Mathias mask clear.JPG → PADI Courses, etc.).
const SERVICE_MEDIA = [
  'b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg', // PADI Courses
  'b37fef_7621a533ac1946a8b342bc5085cb1d28~mv2.jpg', // Dive sites
  'b37fef_58237e6a633f472b8d419bd830abb854~mv2.jpg', // Gear Sales/Service/Rental
  'b37fef_80f90894e75f47f8809d14663dd8e8bd~mv2.jpg', // International Dive Tours
  'b37fef_c3c0324de5bb47b49843a8f63551b4e7~mv2.jpg', // Domestic Dive tours
  'b37fef_49df7d482eb44585a605a489e2b1d653~mv2.jpg', // EFR Courses
]

const slug = (seg) => seg.replace(/[^a-zA-Z0-9]/g, '_')
const segFromRef = (ref) =>
  ref && ref.startsWith('wix:image://')
    ? ref.replace('wix:image://v1/', '').split('#')[0].split('/')[0]
    : null

async function col(table, column) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${column}&${column}=not.is.null`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  if (!res.ok) throw new Error(`${table}.${column}: HTTP ${res.status}`)
  return (await res.json()).map((r) => r[column])
}

const refs = [
  ...(await col('EO_dives', 'featured_image')),
  ...(await col('EO_courses', 'featured_image')),
  ...(await col('TravelDestinations', 'location_picture')),
]
const segs = [...refs.map(segFromRef).filter(Boolean), ...SERVICE_MEDIA]
const distinct = [...new Set(segs)]

mkdirSync(OUT_DIR, { recursive: true })
console.log(`${distinct.length} distinct images → ${OUT_DIR}`)

let done = 0, skipped = 0, failed = 0
for (const seg of distinct) {
  const out = join(OUT_DIR, `${slug(seg)}.webp`)
  if (existsSync(out)) { skipped++; continue }
  try {
    const r = await fetch(`https://static.wixstatic.com/media/${seg}`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const buf = Buffer.from(await r.arrayBuffer())
    await sharp(buf).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out)
    done++
    process.stdout.write(`  ✓ ${slug(seg)}.webp\n`)
  } catch (e) {
    failed++
    process.stdout.write(`  ✗ ${seg} — ${e.message}\n`)
  }
}
console.log(`done: ${done} written, ${skipped} skipped, ${failed} failed`)
