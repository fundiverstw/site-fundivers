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

// PADI course card photos — harvested from the live /courses page (kept in
// sync with src/lib/courses.ts).
const COURSE_MEDIA = [
  'b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg',
  'b37fef_357153d63c3245819d71d68d9d2f1790~mv2.jpg',
  'b37fef_2900ee49212d439c92922559b79ca105~mv2.jpg',
  'b37fef_be75746689c74bf28fdd76aeed8451f6~mv2.jpg',
  'b37fef_3fe5fa0d4b464f5c89a9300f2e818dc5~mv2.jpg',
  'b37fef_46289275ed4042b19c10217d10672fc3~mv2.jpg',
  'b37fef_d0c09f0b314d48608051723dc42edbda~mv2.jpg',
  'b37fef_aa0190ec4359404db3362a851c7663bd~mv2.jpg',
  'cfd7bffa5c38490ca6d89a820ee52d51.jpg',
  'b37fef_6bb10d67326442318a8a597b14c807c5~mv2.jpg',
  'b37fef_6f2950e52002422bbd2486a8d3bb41bb~mv2_d_2000_1333_s_2.jpg',
  'b37fef_c011dec9802b4c93a9f9310fff82388d~mv2.jpg',
  'b37fef_55d806ff58324fb9a99b60c738618e2c~mv2.jpg',
  'b37fef_24b9e725e16b437e901ad76152f12c2c~mv2.jpg',
  'b37fef_7b7bc72b68544b72b206b7da80db3eb9~mv2.jpg',
  'b37fef_489bc4720a724dbb9d596ee856249869~mv2.jpg',
  'b37fef_5936cf4b991e488fb1e6fe468d68efd9~mv2.jpg',
  'b37fef_7d174a18b3704e05b5ef7da1d23e0b94~mv2.jpg',
  'b37fef_10c43bcdd7344ea197cb5431bc9bd71f~mv2.jpg',
  'b37fef_83fa06a85c954b23aa6ddda94c79786d~mv2.jpg',
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
const segs = [...refs.map(segFromRef).filter(Boolean), ...SERVICE_MEDIA, ...COURSE_MEDIA]
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
