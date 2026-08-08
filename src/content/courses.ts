import { mediaIdLocal } from '$engine/images'
import type { ResponsiveImage } from '$engine/responsive-image'

// PADI course catalog, mirroring the live fundiverstw.com/courses cards.
// Titles + photos were harvested from the live page (in order); the cover
// photos are self-hosted under src/content/photos/media/. Short descriptions
// are authored here.
//
// `id` is the whole identity of a course. It is the /courses/<id> URL, the key
// into course-guides.ts, the key into the courses.ja.ts / courses.zh-TW.ts
// overlays, and the folder name under photos/courses/<id>/. Change one and you
// must change all four — the tests in courses.test.ts and course-guides.test.ts
// will tell you which you forgot. Ids came from the old site's page slugs and
// do not always match the title (Discover Scuba is
// padi-discover-scuba-diving-program).

export type CourseCard = {
  title: string
  id: string
  image: ResponsiveImage | null
  desc: string
  // The detail page staggers four images down the main content. When a course
  // supplies its own set here they're used verbatim; otherwise the page falls
  // back to [cover, …three from the course photo pool] (see CourseDetail).
  images?: [
    ResponsiveImage | null,
    ResponsiveImage | null,
    ResponsiveImage | null,
    ResponsiveImage | null,
  ]
}

const img = (seg: string) => mediaIdLocal(seg)

export function coursePath(c: CourseCard): string {
  return `/courses/${c.id}`
}

/** The course whose route id matches the /courses/<id> param, or null. */
export function courseByRouteId(id: string): CourseCard | null {
  return COURSES.find((c) => c.id === id) ?? null
}

// The translatable half of a course card: its title and short description. (The
// id and the images stay put — the id is the identity, not display text.)
// Overlays live in courses.ja.ts / courses.zh-TW.ts, keyed by the same id;
// $engine/i18n-content merges them.
export type CourseText = { title: string; desc: string }

export const COURSES: CourseCard[] = [
  {
    title: 'PADI Open Water Course',
    id: 'padi-open-water-course',
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
    id: 'padi-advanced-course',
    image: img('b37fef_357153d63c3245819d71d68d9d2f1790~mv2.jpg'),
    desc: 'Five adventure dives including deep and navigation. Build skills and confidence down to 30m.',
  },
  {
    title: 'PADI Rescue Diver',
    id: 'padi-rescue-diver-course',
    image: img('b37fef_2900ee49212d439c92922559b79ca105~mv2.jpg'),
    desc: 'Learn to prevent and manage problems in the water. The most rewarding course you’ll take.',
  },
  {
    title: 'PADI Divemaster',
    id: 'padi-divemaster-course',
    image: img('b37fef_be75746689c74bf28fdd76aeed8451f6~mv2.jpg'),
    desc: 'Your first professional rating, lead certified divers and assist on courses.',
  },
  {
    title: 'PADI Master Scuba Diver',
    id: 'padi-master-scuba-diver',
    image: img('b37fef_3fe5fa0d4b464f5c89a9300f2e818dc5~mv2.jpg'),
    desc: 'The highest recreational rating, your place among the most experienced divers.',
  },
  {
    title: 'PADI Discover Scuba Diving',
    id: 'padi-discover-scuba-diving-program',
    image: img('b37fef_46289275ed4042b19c10217d10672fc3~mv2.jpg'),
    desc: 'Try scuba in a single session, no certification required. The perfect first taste of diving.',
  },
  {
    title: 'Refresher Course',
    id: 'padi-refresher-course',
    image: img('b37fef_d0c09f0b314d48608051723dc42edbda~mv2.jpg'),
    desc: 'Back after a break? Refresh your skills and confidence before getting back in the water.',
  },
  {
    title: 'PADI EFR Course',
    id: 'padi-efr-course',
    image: img('b37fef_aa0190ec4359404db3362a851c7663bd~mv2.jpg'),
    desc: 'Emergency First Response, CPR and primary/secondary care for divers and non-divers alike.',
  },
  {
    title: 'PADI O2 Provider',
    id: 'padi-o2-provider-course',
    image: img('cfd7bffa5c38490ca6d89a820ee52d51.jpg'),
    desc: 'Learn to provide emergency oxygen to a diver in a diving emergency.',
  },
  {
    title: 'PADI Enriched Air (Nitrox)',
    id: 'padi-enriched-air-specialty-course',
    image: img('b37fef_6bb10d67326442318a8a597b14c807c5~mv2.jpg'),
    desc: 'Dive longer with Nitrox, safely use enriched air and extend your no-stop times.',
  },
  {
    title: 'PADI Deep Diver Specialty',
    id: 'padi-deep-diver-specialty',
    image: img('b37fef_6f2950e52002422bbd2486a8d3bb41bb~mv2_d_2000_1333_s_2.jpg'),
    desc: 'Extend your limits and learn to safely plan and enjoy dives down to 40m.',
  },
  {
    title: 'PADI Night Diver Specialty',
    id: 'padi-night-diver-specialty',
    image: img('b37fef_c011dec9802b4c93a9f9310fff82388d~mv2.jpg'),
    desc: 'Discover a whole new world after dark, lights, navigation, and nocturnal marine life.',
  },
  {
    title: 'PADI Search & Recovery Specialty',
    id: 'padi-search-recovery-specialty',
    image: img('b37fef_55d806ff58324fb9a99b60c738618e2c~mv2.jpg'),
    desc: 'Search-and-recovery skills, patterns and lift techniques to find and recover lost objects.',
  },
  {
    // Cover photo: a shot of the Wan An Jian wreck, which is also in the
    // dive-site pool under photos/dive-sites/wan-an-jian-navy-wreck/. Card
    // covers are read from photos/media/ by filename, so it lives there too.
    // Note the underscore: mediaIdLocal slugifies its argument by replacing
    // every non-alphanumeric character with '_', so a media file named with a
    // hyphen can never be looked up and the card silently loses its photo.
    title: 'PADI Wreck Specialty',
    id: 'padi-wreck-specialty',
    image: img('wreck_specialty'),
    desc: 'Explore sunken ships and structures safely, survey a wreck, map it, and dive it with a plan.',
  },
  {
    title: 'PADI Drift Diver Specialty',
    id: 'padi-drift-diver-specialty',
    image: img('b37fef_24b9e725e16b437e901ad76152f12c2c~mv2.jpg'),
    desc: 'Go with the flow, effortless diving in currents with the right technique and awareness.',
  },
  {
    title: 'PADI Peak Performance Buoyancy',
    id: 'padi-peak-performance-buoyancy-specialty',
    image: img('b37fef_7b7bc72b68544b72b206b7da80db3eb9~mv2.jpg'),
    desc: 'Master your buoyancy for effortless, graceful, air-saving diving.',
  },
  {
    title: 'PADI Underwater Navigator',
    id: 'padi-underwater-navigator-specialty',
    image: img('b37fef_489bc4720a724dbb9d596ee856249869~mv2.jpg'),
    desc: 'Find your way with compass and natural navigation, never lose the boat again.',
  },
  {
    title: 'PADI Boat Diver Specialty',
    id: 'padi-boat-diver-specialty',
    image: img('b37fef_5936cf4b991e488fb1e6fe468d68efd9~mv2.jpg'),
    desc: 'Get comfortable diving from boats of every kind, from RIBs to liveaboards.',
  },
  {
    title: 'PADI Equipment Specialist',
    id: 'padi-equipment-specialist',
    image: img('b37fef_7d174a18b3704e05b5ef7da1d23e0b94~mv2.jpg'),
    desc: 'Understand, maintain, and make minor adjustments to your own dive gear.',
  },
  {
    title: 'PADI Digital UW Imaging',
    id: 'padi-digital-underwater-photographer-specialty',
    image: img('b37fef_10c43bcdd7344ea197cb5431bc9bd71f~mv2.jpg'),
    desc: 'Capture the underwater world, shoot great photos and video on your dives.',
  },
  {
    title: 'PADI Fish Identification',
    id: 'padi-fish-identification-specialty',
    image: img('b37fef_83fa06a85c954b23aa6ddda94c79786d~mv2.jpg'),
    desc: 'Learn to recognize the fish families and species you meet on every dive.',
  },
]

// English title + desc keyed by course id — the fallback, and what the overlay
// parity test measures against. Built from COURSES so a new course can never be
// missed here.
export const COURSES_TEXT_EN: Record<string, CourseText> = Object.fromEntries(
  COURSES.map((c) => [c.id, { title: c.title, desc: c.desc }]),
)
