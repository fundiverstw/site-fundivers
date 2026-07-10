// The dive-site catalog — the list behind the /sites and /map pages.
//
// This is plain data: to add, rename or move a dive site, edit it here and
// redeploy. Nothing else needs to change. The long write-up for each site (the
// "Below the Surface" prose and so on) lives next door in dive-site-guides.ts,
// keyed by the same `id`.
//
// It used to come from the shared Supabase `dive_sites` table, but the app team
// dropped that table, so the rows were recovered verbatim from app-fundivers'
// pre-drop migrations and bundled here.

// Regions that sit on the Taiwan map (Map.svelte draws exactly these)…
export type TaiwanRegion =
  | 'keelung'
  | 'longdong'
  | 'yilan'
  | 'greenisland'
  | 'lanyu'
  | 'xiaoliuqiu'
  | 'kenting'
  | 'penghu'

// …and the overseas trip destinations, which never appear on it.
export type InternationalRegion =
  | 'malapascua'
  | 'puerto-galera'
  | 'panglao-bohol'
  | 'anilao'
  | 'palau'

export type Region = TaiwanRegion | InternationalRegion

export type DiveSite = {
  id: string
  name: string
  tagline: string | null
  latitude: number
  longitude: number
  region: Region
  dive_type: 'shore' | 'boat' | null
  wix_slug: string | null
  international?: boolean // outside Taiwan (trip destination), grouped separately
}

export type Area = 'North' | 'South' | 'Outlying Islands' | 'International'

// Display metadata for each region: a human label and a broad area grouping
// mirroring how fundiverstw.com frames Taiwan diving (North / South / Islands).
export const REGION_META: Record<Region, { label: string; area: Area }> = {
  keelung: { label: 'Keelung', area: 'North' },
  longdong: { label: 'Long Dong (Dragon Cave)', area: 'North' },
  yilan: { label: 'Yilan', area: 'North' },
  kenting: { label: 'Kenting', area: 'South' },
  greenisland: { label: 'Green Island', area: 'Outlying Islands' },
  lanyu: { label: 'Orchid Island (Lanyu)', area: 'Outlying Islands' },
  xiaoliuqiu: { label: 'Xiaoliuqiu', area: 'Outlying Islands' },
  penghu: { label: 'Penghu', area: 'Outlying Islands' },
  malapascua: { label: 'Malapascua, Philippines', area: 'International' },
  'puerto-galera': { label: 'Puerto Galera, Philippines', area: 'International' },
  'panglao-bohol': { label: 'Panglao, Bohol, Philippines', area: 'International' },
  anilao: { label: 'Anilao, Philippines', area: 'International' },
  palau: { label: 'Palau', area: 'International' },
}

export const AREA_ORDER: Area[] = ['North', 'South', 'Outlying Islands', 'International']

export const DIVE_SITES: DiveSite[] = [
  {
    "id": "cauliflower-garden",
    "name": "Cauliflower Garden",
    "tagline": "Cauliflower Garden is a charming wall dive with lovely little, colorful, soft corals shaped like cauliflower.",
    "latitude": 24.9811625,
    "longitude": 121.9658281,
    "region": "yilan",
    "dive_type": "boat",
    "wix_slug": "cauliflower-garden"
  },
  {
    "id": "iron-house-iron-reef",
    "name": "Iron House / Iron Reef",
    "tagline": "These are artificial reefs made of steel shaped like the framework of houses. Within its confines, reside an array of fish using them as protection from predators such as the amberjacks.",
    "latitude": 25.1429625,
    "longitude": 121.8129844,
    "region": "keelung",
    "dive_type": "boat",
    "wix_slug": null
  },
  {
    "id": "penghu",
    "name": "Penghu",
    "tagline": "Of all the dive locations in Taiwan, Penghu has the most fish in numbers, size, and diversity! If you have the experience and time, it's a definite must-see!",
    "latitude": 23.5711899,
    "longitude": 119.5793157,
    "region": "penghu",
    "dive_type": null,
    "wix_slug": null
  },
  {
    "id": "secret-garden",
    "name": "Secret Garden",
    "tagline": "Secret Garden is a favorite among local divers. With its garden of sea fans, whip, and soft coral. It is truly a must-see site on the Northeast Coast of Taiwan.",
    "latitude": 25.1434517,
    "longitude": 121.8034149,
    "region": "keelung",
    "dive_type": "shore",
    "wix_slug": "secret-garden"
  },
  {
    "id": "turtle-island",
    "name": "Turtle Island",
    "tagline": "Turtle Island is known to Divers for the site called Milky Way, an underwater hot spring. If you get this rare opportunity to dive there, you must try it!",
    "latitude": 24.8423735,
    "longitude": 121.9501551,
    "region": "yilan",
    "dive_type": "boat",
    "wix_slug": "turtle-island"
  },
  {
    "id": "kenting",
    "name": "Kenting",
    "tagline": "Kenting has been a top dive destination in Taiwan for decades. It is best known for its myriad of corals that are plastered atop the reef.",
    "latitude": 21.9483307,
    "longitude": 120.7797516,
    "region": "kenting",
    "dive_type": null,
    "wix_slug": null
  },
  {
    "id": "cathedral",
    "name": "Cathedral",
    "tagline": "The Cathedral is a unique dive site suitable for all levels of Divers and is always full of surprises!",
    "latitude": 25.0328125,
    "longitude": 121.9425625,
    "region": "yilan",
    "dive_type": "boat",
    "wix_slug": "cathedral"
  },
  {
    "id": "green-island",
    "name": "Green Island",
    "tagline": "Green Island is located off the coast of Taitung, on the southeast coast of Taiwan. It is a favorite dive destination for many locals. Renowned for its impressive visibility, which can reach up to 30-40m, it is ideal for photography enthusiasts.",
    "latitude": 22.6620886,
    "longitude": 121.4901443,
    "region": "greenisland",
    "dive_type": null,
    "wix_slug": null
  },
  {
    "id": "canyons",
    "name": "Canyons",
    "tagline": "An interesting site with beatiful slopes, walls, and boulders to explore.",
    "latitude": 25.1226015,
    "longitude": 121.9040652,
    "region": "longdong",
    "dive_type": "shore",
    "wix_slug": "canyons"
  },
  {
    "id": "shipwrecks",
    "name": "Shipwrecks",
    "tagline": "With many shipwrecks sparsely placed in the vicinity of Badouzi Bay, scuba divers have a fantastic opportunity to explore these fishing vessels that have now become artificial reefs.",
    "latitude": 25.1399625,
    "longitude": 121.8099844,
    "region": "keelung",
    "dive_type": "boat",
    "wix_slug": null
  },
  {
    "id": "iron-house-2",
    "name": "Iron House 2",
    "tagline": "Iron House 2 has 2 metal frame structures side by side shaped like square building blocks teeming with life.",
    "latitude": 25.1459625,
    "longitude": 121.8159844,
    "region": "keelung",
    "dive_type": "boat",
    "wix_slug": null
  },
  {
    "id": "82-5",
    "name": "82.5",
    "tagline": "The wall here at 82.5 always has interesting creatures and rock formations to observe.",
    "latitude": 25.1201875,
    "longitude": 121.8996875,
    "region": "longdong",
    "dive_type": "shore",
    "wix_slug": "82.5"
  },
  {
    "id": "crystal-temple-wall",
    "name": "Crystal Temple Wall",
    "tagline": "A 100m stretch of wall starting at 15m down to 30m.",
    "latitude": 25.1358875,
    "longitude": 121.8182969,
    "region": "keelung",
    "dive_type": "boat",
    "wix_slug": null
  },
  {
    "id": "long-dong-bay",
    "name": "Long Dong Bay",
    "tagline": "Long Dong Bay has a walk-in ramp that makes it easy for entering and exiting when the conditions are calm. Perfect for beginners and advanced Divers alike.",
    "latitude": 25.1133125,
    "longitude": 121.9200625,
    "region": "longdong",
    "dive_type": "shore",
    "wix_slug": "long-dong-bay"
  },
  {
    "id": "wan-an-jian-navy-wreck",
    "name": "Wan An Jian Navy Wreck",
    "tagline": "Wan An Jian is a massive navy wreck covered in life and surrounded by schools of fish located off the east coast of Taiwan.",
    "latitude": 24.9618125,
    "longitude": 121.9458125,
    "region": "yilan",
    "dive_type": "boat",
    "wix_slug": "wan-an-jian-navy-wreck"
  },
  {
    "id": "rainbow-reef",
    "name": "Rainbow Reef",
    "tagline": "Located next to Keelung Island, it's just a 20-minute boat ride from the dock. Rainbow Reef is a spectacular site with 2 pinnacles covered in colorful whip corals.",
    "latitude": 25.1910875,
    "longitude": 121.7888594,
    "region": "keelung",
    "dive_type": "boat",
    "wix_slug": "rainbow-reef"
  },
  {
    "id": "lambai-island",
    "name": "Lambai Island",
    "tagline": "Xiao Liuqiu/Lambai is a large Coral Island. Due to its nesting beach, it is home to hundreds of green sea turtles that both snorkelers and Divers can enjoy.",
    "latitude": 22.3404158,
    "longitude": 120.3715149,
    "region": "xiaoliuqiu",
    "dive_type": null,
    "wix_slug": null
  },
  {
    "id": "orchid-island",
    "name": "Orchid Island",
    "tagline": "Orchid Island is best known for the Badai Wreck, a Korean lumber-carrying vessel that starts at 26m and descends to 40m deep.",
    "latitude": 22.0435616,
    "longitude": 121.548418,
    "region": "lanyu",
    "dive_type": null,
    "wix_slug": null
  },
  {
    "id": "bat-cave",
    "name": "Bat Cave",
    "tagline": "Bat Cave is an excellent site suitable for all experience levels!",
    "latitude": 25.126318,
    "longitude": 121.8321152,
    "region": "keelung",
    "dive_type": "shore",
    "wix_slug": "bat-cave"
  },
  {
    "id": "malapascua",
    "name": "Malapascua",
    "tagline": "Malapascua is home to thresher sharks, eagle rays, and the occasional tiger shark. It is a destination on every diver's bucket list!",
    "latitude": 11.3208,
    "longitude": 124.1156,
    "region": "malapascua",
    "dive_type": "boat",
    "wix_slug": "malapascua",
    "international": true
  },
  {
    "id": "puerto-galera",
    "name": "Puerto Galera",
    "tagline": "Puerto Galera is a top dive destination in the Mindoro Province of the Philippines. It offers exciting nightlife and restaurants serving Western or Filipino cuisine.",
    "latitude": 13.5127,
    "longitude": 120.9647,
    "region": "puerto-galera",
    "dive_type": "boat",
    "wix_slug": "puerto-galera",
    "international": true
  },
  {
    "id": "panglao-bohol",
    "name": "Panglao, Bohol",
    "tagline": "Panglao is a diver’s paradise with a variety of dive sites and an abundance of sea life! Located in the Bohol Province of the Philippines, it is on the list of must-see places for all divers!",
    "latitude": 9.5787,
    "longitude": 123.75,
    "region": "panglao-bohol",
    "dive_type": "boat",
    "wix_slug": "panglao%2C-bohol",
    "international": true
  },
  {
    "id": "anilao",
    "name": "Anilao",
    "tagline": "Just a few hours from Manila, in the Batangas Province, lies Anilao. Anilao has long been considered one of the best diving spots in the Philippines, attracting both beginners and experienced divers.",
    "latitude": 13.7561,
    "longitude": 120.8567,
    "region": "anilao",
    "dive_type": "boat",
    "wix_slug": "anilao",
    "international": true
  },
  {
    "id": "palau",
    "name": "Palau",
    "tagline": "Palau is an archipelago located in Micronesia, in the western Pacific Ocean. It is a world-class diving experience that draws divers from all over the globe. It is a top ten destination and a must-see for all avid divers.",
    "latitude": 7.3436,
    "longitude": 134.479,
    "region": "palau",
    "dive_type": "boat",
    "wix_slug": "palau",
    "international": true
  }
]

// Async to preserve the call sites (Map/Sites await it) even though the data is
// now local and needs no round-trip.
export async function fetchDiveSites(): Promise<DiveSite[]> {
  return [...DIVE_SITES].sort((a, b) => a.name.localeCompare(b.name))
}

/** A single dive site by its id (the /sites/<id> route param), or null. */
export function diveSiteById(id: string): DiveSite | null {
  return DIVE_SITES.find((s) => s.id === id) ?? null
}

/** Path to a dive site's dedicated detail page. */
export function diveSitePath(site: Pick<DiveSite, 'id'>): string {
  return `/sites/${site.id}`
}

// Which dive site is a calendar event about?
//
// A trip on the calendar is just a title like "Fun Dive — Bat Cave". To give its
// card the right photo we match that title against the patterns below and use the
// matching site's photos. Ordered most-specific first, so "Iron House 2" wins over
// the general "Iron House / Iron Reef". A title that matches nothing (Yehliu,
// Milky Sea…) just gets a general dive photo, which is fine.
//
// `/bat\s*cave/i` means "bat, then any spaces, then cave; upper or lower case".
export const EVENT_TITLE_MATCHERS: Array<{ id: string; re: RegExp }> = [
  { id: 'malapascua', re: /malapascua/i },
  { id: 'puerto-galera', re: /puerto\s*galera/i },
  { id: 'panglao-bohol', re: /panglao|bohol/i },
  { id: 'anilao', re: /anilao/i },
  { id: 'palau', re: /palau/i },
  { id: 'iron-house-2', re: /iron\s*(house|reef)\s*2/i },
  { id: 'rainbow-reef', re: /rainbow\s*reef/i },
  { id: 'crystal-temple-wall', re: /crystal\s*(temple|palace|wall)/i },
  { id: 'bat-cave', re: /bat\s*cave/i },
  { id: 'cauliflower-garden', re: /cauliflower/i },
  { id: 'secret-garden', re: /secret\s*garden/i },
  { id: 'turtle-island', re: /turtle\s*island/i },
  { id: 'cathedral', re: /cathedral/i },
  { id: 'canyons', re: /canyon/i },
  { id: 'long-dong-bay', re: /long\s*dong/i },
  { id: 'wan-an-jian-navy-wreck', re: /wan\s*an\s*jian|navy\s*wreck/i },
  { id: 'shipwrecks', re: /shipwreck|\bwrecks?\b/i },
  { id: 'iron-house-iron-reef', re: /iron\s*house|iron\s*reef/i },
  { id: '82-5', re: /\b82\.?5\b/i },
  { id: 'green-island', re: /green\s*island/i },
  { id: 'kenting', re: /kenting|seven\s*star/i },
  { id: 'penghu', re: /penghu/i },
  { id: 'lambai-island', re: /lambai|xiao\s*liuqiu|liuqiu/i },
  { id: 'orchid-island', re: /orchid\s*island|lanyu/i },
]
