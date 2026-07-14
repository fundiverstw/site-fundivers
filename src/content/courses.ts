import { mediaIdLocal } from '$engine/images'

// PADI course catalog, mirroring the live fundiverstw.com/courses cards.
// Titles + photos were harvested from the live page (in order); the cover
// photos are self-hosted under /imgs/media/. Short
// descriptions are authored here. `slug` is the course's page slug on the
// marketing site, each card links to fundiverstw.com/courses-1/<slug>
// (slugs scraped from the live page; note they don't always match the title,
// e.g. Discover Scuba → padi-discover-scuba-diving-program).

export type CourseCard = {
  title: string
  slug: string
  image: string
  desc: string
  // The detail page staggers four images down the main content. When a course
  // supplies its own set here they're used verbatim; otherwise the page falls
  // back to [cover, …three from the course photo pool] (see CourseDetail).
  images?: [string, string, string, string]
}

const img = (seg: string) => mediaIdLocal(seg)

// Clean route id for a course's /courses/<id> detail page. The Wix `slug` can
// contain percent-encoding (e.g. %26 for '&'); collapse those to hyphens so the
// internal URL stays tidy. The original slug is still used for the outbound
// fundiverstw.com/courses-1/<slug> link.
export function courseId(slug: string): string {
  return slug
    .replace(/%[0-9a-f]{2}/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function coursePath(c: CourseCard): string {
  return `/courses/${courseId(c.slug)}`
}

/** The course whose route id matches the /courses/<id> param, or null. */
export function courseByRouteId(id: string): CourseCard | null {
  return COURSES.find((c) => courseId(c.slug) === id) ?? null
}

export const COURSES: CourseCard[] = [
  {
    title: 'PADI Open Water Course',
    slug: 'padi-open-water-course',
    image: img('b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg'),
    images: [
      img('b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg'),
      img('b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg'),
      img('b37fef_37847cf1b32a413990cb7b558835954f~mv2.jpg'),
      img('b37fef_594f84e342954c95b442c5b67f5fb454~mv2.jpg'),
    ],
    desc: 'Your scuba adventure starts here, your first full certification, diving to 18m anywhere in the world.',
  },
  {
    title: 'PADI Advanced Open Water',
    slug: 'padi-advanced-course',
    image: img('b37fef_357153d63c3245819d71d68d9d2f1790~mv2.jpg'),
    desc: 'Five adventure dives including deep and navigation. Build skills and confidence down to 30m.',
  },
  {
    title: 'PADI Rescue Diver',
    slug: 'padi-rescue-diver-course',
    image: img('b37fef_2900ee49212d439c92922559b79ca105~mv2.jpg'),
    desc: 'Learn to prevent and manage problems in the water. The most rewarding course you’ll take.',
  },
  {
    title: 'PADI Divemaster',
    slug: 'padi-divemaster-course',
    image: img('b37fef_be75746689c74bf28fdd76aeed8451f6~mv2.jpg'),
    desc: 'Your first professional rating, lead certified divers and assist on courses.',
  },
  {
    title: 'PADI Master Scuba Diver',
    slug: 'padi-master-scuba-diver',
    image: img('b37fef_3fe5fa0d4b464f5c89a9300f2e818dc5~mv2.jpg'),
    desc: 'The highest recreational rating, your place among the most experienced divers.',
  },
  {
    title: 'PADI Discover Scuba Diving',
    slug: 'padi-discover-scuba-diving-program',
    image: img('b37fef_46289275ed4042b19c10217d10672fc3~mv2.jpg'),
    desc: 'Try scuba in a single session, no certification required. The perfect first taste of diving.',
  },
  {
    title: 'Refresher Course',
    slug: 'padi-refresher-course',
    image: img('b37fef_d0c09f0b314d48608051723dc42edbda~mv2.jpg'),
    desc: 'Back after a break? Refresh your skills and confidence before getting back in the water.',
  },
  {
    title: 'PADI EFR Course',
    slug: 'padi-efr-course',
    image: img('b37fef_aa0190ec4359404db3362a851c7663bd~mv2.jpg'),
    desc: 'Emergency First Response, CPR and primary/secondary care for divers and non-divers alike.',
  },
  {
    title: 'PADI O2 Provider',
    slug: 'padi-o2-provider-course',
    image: img('cfd7bffa5c38490ca6d89a820ee52d51.jpg'),
    desc: 'Learn to provide emergency oxygen to a diver in a diving emergency.',
  },
  {
    title: 'PADI Enriched Air (Nitrox)',
    slug: 'padi-enriched-air-specialty-course',
    image: img('b37fef_6bb10d67326442318a8a597b14c807c5~mv2.jpg'),
    desc: 'Dive longer with Nitrox, safely use enriched air and extend your no-stop times.',
  },
  {
    title: 'PADI Deep Diver Specialty',
    slug: 'padi-deep-diver-specialty',
    image: img('b37fef_6f2950e52002422bbd2486a8d3bb41bb~mv2_d_2000_1333_s_2.jpg'),
    desc: 'Extend your limits and learn to safely plan and enjoy dives down to 40m.',
  },
  {
    title: 'PADI Night Diver Specialty',
    slug: 'padi-night-diver-specialty',
    image: img('b37fef_c011dec9802b4c93a9f9310fff82388d~mv2.jpg'),
    desc: 'Discover a whole new world after dark, lights, navigation, and nocturnal marine life.',
  },
  {
    title: 'PADI Wreck & Search Specialty',
    slug: 'padi-search-%26-recovery-specialty',
    image: img('b37fef_55d806ff58324fb9a99b60c738618e2c~mv2.jpg'),
    desc: 'Search-and-recovery skills, patterns and lift techniques to find and recover lost objects.',
  },
  {
    title: 'PADI Drift Diver Specialty',
    slug: 'padi-drift-diver-specialty',
    image: img('b37fef_24b9e725e16b437e901ad76152f12c2c~mv2.jpg'),
    desc: 'Go with the flow, effortless diving in currents with the right technique and awareness.',
  },
  {
    title: 'PADI Peak Performance Buoyancy',
    slug: 'padi-peak-performance-buoyancy-specialty',
    image: img('b37fef_7b7bc72b68544b72b206b7da80db3eb9~mv2.jpg'),
    desc: 'Master your buoyancy for effortless, graceful, air-saving diving.',
  },
  {
    title: 'PADI Underwater Navigator',
    slug: 'padi-underwater-navigator-specialty',
    image: img('b37fef_489bc4720a724dbb9d596ee856249869~mv2.jpg'),
    desc: 'Find your way with compass and natural navigation, never lose the boat again.',
  },
  {
    title: 'PADI Boat Diver Specialty',
    slug: 'padi-boat-diver-specialty',
    image: img('b37fef_5936cf4b991e488fb1e6fe468d68efd9~mv2.jpg'),
    desc: 'Get comfortable diving from boats of every kind, from RIBs to liveaboards.',
  },
  {
    title: 'PADI Equipment Specialist',
    slug: 'padi-equipment-specialist',
    image: img('b37fef_7d174a18b3704e05b5ef7da1d23e0b94~mv2.jpg'),
    desc: 'Understand, maintain, and make minor adjustments to your own dive gear.',
  },
  {
    title: 'PADI Digital UW Imaging',
    slug: 'padi-digital-underwater-photographer-specialty',
    image: img('b37fef_10c43bcdd7344ea197cb5431bc9bd71f~mv2.jpg'),
    desc: 'Capture the underwater world, shoot great photos and video on your dives.',
  },
  {
    title: 'PADI Fish Identification',
    slug: 'padi-fish-identification-specialty',
    image: img('b37fef_83fa06a85c954b23aa6ddda94c79786d~mv2.jpg'),
    desc: 'Learn to recognize the fish families and species you meet on every dive.',
  },
]
