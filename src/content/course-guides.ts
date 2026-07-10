// Editorial guides for the /courses/<id> detail pages. These are original
// descriptions of the standard PADI curricula (not PADI's own copy), plus quick
// facts and the DB category codes (matchCodes) used to surface this course's
// upcoming sessions. Keyed by the course route id (courses.ts courseId()).
export type CourseGuide = {
  overview: string
  youWillLearn: string[]
  prerequisites: string
  minAge: string
  duration: string
  depth: string | null
  certifies: string
  matchCodes: string[] // event admin_title codes (lowercased) for upcoming sessions
  next: string[] // suggested next-course route ids
}

export const COURSE_GUIDES: Record<string, CourseGuide> = {
  'padi-open-water-course': {
    overview:
      'The PADI Open Water Diver course is your first full scuba certification and the most popular dive course in the world. Across knowledge sessions, confined-water practice and four open-water dives, you learn everything you need to dive independently with a buddy — anywhere on Earth.',
    youWillLearn: [
      'Setting up, using and caring for scuba gear',
      'Essential underwater skills and safety procedures',
      'Mask clearing, regulator recovery and buoyancy control',
      'Planning dives with tables and a dive computer',
      'Four training dives in open water',
    ],
    prerequisites: 'None — able to swim and in good health',
    minAge: '10+ (Junior 10–14)',
    duration: '3–4 days',
    depth: '18 m',
    certifies: 'Dive independently with a buddy to 18 m worldwide',
    matchCodes: ['ow'],
    next: ['padi-advanced-course', 'padi-enriched-air-specialty-course'],
  },
  'padi-advanced-course': {
    overview:
      "Ready for more? Advanced Open Water builds your skills over five “adventure” dives — a Deep dive and an Underwater Navigation dive plus three of your choice. It's the fastest way to gain experience under instructor guidance and extends your depth limit to 30 metres.",
    youWillLearn: [
      'Deep-diving technique and planning to 30 m',
      'Underwater navigation by compass and natural reference',
      'Three adventure dives of your choice (night, wreck, buoyancy and more)',
      'Greater confidence and in-water control',
    ],
    prerequisites: 'PADI (Junior) Open Water Diver or qualifying certification',
    minAge: '12+',
    duration: '2–3 days',
    depth: '30 m',
    certifies: 'Dive to 30 m; counts toward Master Scuba Diver',
    matchCodes: ['aow'],
    next: ['padi-rescue-diver-course', 'padi-deep-diver-specialty'],
  },
  'padi-rescue-diver-course': {
    overview:
      "Often called the most challenging — and most rewarding — PADI course, Rescue Diver teaches you to prevent and manage dive emergencies for yourself and others. You'll finish a far more confident, aware and capable diver.",
    youWillLearn: [
      'Self-rescue and spotting diver stress',
      'Managing tired, panicked and unresponsive divers',
      'In-water rescues, tows and exits',
      'Emergency management and equipment use',
      'Putting it together in realistic scenarios',
    ],
    prerequisites:
      'PADI Adventure Diver (with Navigation) or higher, plus EFR training within 24 months',
    minAge: '12+',
    duration: '3–4 days',
    depth: null,
    certifies: 'PADI Rescue Diver',
    matchCodes: ['resc', 'rescue ready'],
    next: ['padi-divemaster-course', 'padi-master-scuba-diver'],
  },
  'padi-divemaster-course': {
    overview:
      'The Divemaster course is your first step into professional diving. Working closely with our instructors you develop dive-leadership skills, supervise activities and assist with student divers — the start of a career in the water.',
    youWillLearn: [
      'Dive leadership and supervision',
      'Guiding certified divers safely',
      'Assisting instructors with students',
      'Dive theory and dive-site management',
      'Refining demonstration-quality skills',
    ],
    prerequisites: 'PADI Rescue Diver, EFR within 24 months, and 40 logged dives (60 to certify)',
    minAge: '18+',
    duration: 'Several weeks (flexible)',
    depth: null,
    certifies: 'PADI Divemaster — a professional rating',
    matchCodes: ['dm', 'divemaster'],
    next: [],
  },
  'padi-master-scuba-diver': {
    overview:
      'PADI Master Scuba Diver is the highest non-professional rating — a mark of experience and versatility that fewer than two percent of divers reach. It recognises those who have earned a breadth of certifications and logged real experience.',
    youWillLearn: [
      'A well-rounded range of specialty skills',
      'Confidence across many diving environments',
      'Recognition as an elite recreational diver',
    ],
    prerequisites: 'Advanced Open Water, Rescue Diver, five PADI Specialties and 50 logged dives',
    minAge: '12+',
    duration: 'Earned over time',
    depth: null,
    certifies: 'PADI Master Scuba Diver rating',
    matchCodes: ['msd'],
    next: ['padi-divemaster-course'],
  },
  'padi-discover-scuba-diving-program': {
    overview:
      "Never dived before? Discover Scuba Diving lets you try scuba under the direct supervision of a PADI Professional — no certification required. It's the perfect first taste, and your dives can later count toward your Open Water certification.",
    youWillLearn: [
      'Basic scuba equipment and how it works',
      'A few essential underwater skills',
      'Breathing underwater for the very first time',
      'A guided dive in confined or shallow water',
    ],
    prerequisites: 'None — 10+ and in good health',
    minAge: '10+',
    duration: 'Half a day',
    depth: '12 m',
    certifies: 'Experience program (not a certification)',
    matchCodes: ['dsd', 'discover'],
    next: ['padi-open-water-course'],
  },
  'padi-refresher-course': {
    overview:
      "Been out of the water for a while? A refresher rebuilds your skills and confidence so you can get back to diving safely — ideal if it's been a year or more since your last dive.",
    youWillLearn: [
      'Refreshing core safety skills',
      'Reviewing dive planning and equipment',
      'Rebuilding comfort and buoyancy',
      'Updating on current best practice',
    ],
    prerequisites: 'Certified diver returning after a break',
    minAge: '10+',
    duration: 'Half a day',
    depth: null,
    certifies: 'Skills refresh (PADI ReActivate)',
    matchCodes: ['refresher'],
    next: ['padi-advanced-course'],
  },
  'padi-efr-course': {
    overview:
      "Emergency First Response teaches the same CPR and first-aid skills the professionals use, in an approachable way for anyone. It's the prerequisite for Rescue Diver — and valuable far beyond diving.",
    youWillLearn: [
      'Primary care (CPR)',
      'Secondary care (first aid)',
      'Using barriers to reduce disease risk',
      'Managing serious bleeding and shock',
      'AED awareness',
    ],
    prerequisites: 'None — open to everyone',
    minAge: 'No minimum',
    duration: '1 day',
    depth: null,
    certifies: 'EFR Primary & Secondary Care (valid 24 months)',
    matchCodes: ['efr'],
    next: ['padi-rescue-diver-course', 'padi-o2-provider-course'],
  },
  'padi-o2-provider-course': {
    overview:
      'Emergency oxygen is a key part of caring for an injured diver. This course teaches you to recognise the dive injuries where oxygen helps and to administer emergency O2 safely and effectively.',
    youWillLearn: [
      'Recognising illnesses oxygen can help',
      'Assembling and using an emergency oxygen kit',
      'Delivering emergency oxygen safely',
      'Caring for a diver until help arrives',
    ],
    prerequisites: 'None',
    minAge: '12+',
    duration: '1 day',
    depth: null,
    certifies: 'Emergency Oxygen Provider',
    matchCodes: ['o2 provider', 'o2'],
    next: ['padi-rescue-diver-course'],
  },
  'padi-enriched-air-specialty-course': {
    overview:
      'Enriched Air (Nitrox) is the most popular PADI specialty. Breathing more oxygen and less nitrogen lets you extend your no-stop bottom times — more time exploring, and shorter surface intervals between dives.',
    youWillLearn: [
      'How enriched air extends no-stop limits',
      "Analysing your cylinder's oxygen content",
      'Setting a dive computer for Nitrox',
      'Managing oxygen exposure and depth limits',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '12+',
    duration: '1 day (dry, optional dives)',
    depth: null,
    certifies: 'Dive with enriched air up to 40% oxygen',
    matchCodes: ['eanx', 'nitrox'],
    next: ['padi-deep-diver-specialty'],
  },
  'padi-deep-diver-specialty': {
    overview:
      'Some of the most exciting dives — wrecks, walls and big animals — lie beyond 18 metres. The Deep Diver specialty teaches you to plan and safely enjoy dives down to 40 metres, the recreational limit.',
    youWillLearn: [
      'Planning and executing deep dives',
      'Managing gas, time and no-stop limits',
      'Handling the effects of pressure and narcosis',
      'Four training dives to a maximum of 40 m',
    ],
    prerequisites: 'PADI Adventure Diver or higher',
    minAge: '15+',
    duration: '2 days (4 dives)',
    depth: '40 m',
    certifies: 'Dive to the 40 m recreational limit',
    matchCodes: ['deep'],
    next: ['padi-enriched-air-specialty-course'],
  },
  'padi-night-diver-specialty': {
    overview:
      'The reef transforms after dark. The Night Diver specialty builds the skills and confidence to explore the underwater world at night, when nocturnal creatures emerge and familiar sites feel brand new.',
    youWillLearn: [
      'Dive-light use and night signalling',
      'Navigating and staying oriented in the dark',
      'Entering, exiting and communicating at night',
      'Spotting nocturnal marine life',
      'Three night training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '12+',
    duration: '2–3 evenings (3 dives)',
    depth: null,
    certifies: 'PADI Night Diver',
    matchCodes: [],
    next: [],
  },
  'padi-search-recovery-specialty': {
    overview:
      'Lost something underwater, or want the skills to find and recover objects safely? The Search & Recovery specialty teaches proven search patterns and lifting techniques to locate and raise lost items.',
    youWillLearn: [
      'Planning and running search patterns',
      'Navigating a search with a compass',
      'Using lift bags to raise objects',
      'Knots and rigging for recovery',
      'Four training dives',
    ],
    prerequisites: 'PADI Adventure Diver or higher',
    minAge: '12+',
    duration: '2 days (4 dives)',
    depth: null,
    certifies: 'PADI Search & Recovery Diver',
    matchCodes: [],
    next: [],
  },
  'padi-drift-diver-specialty': {
    overview:
      'Drift diving feels like flying — letting the current carry you effortlessly over reefs and walls. This specialty teaches the technique and awareness to make current your friend.',
    youWillLearn: [
      'Drift-diving technique and body position',
      'Buoyancy control in current',
      'Staying with your buddy and the group',
      'Using floats and surface signalling',
      'Two training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '12+',
    duration: '1–2 days (2 dives)',
    depth: null,
    certifies: 'PADI Drift Diver',
    matchCodes: [],
    next: [],
  },
  'padi-peak-performance-buoyancy-specialty': {
    overview:
      'Great divers make it look effortless — hovering motionless, gliding past delicate corals, using less air. Peak Performance Buoyancy fine-tunes your weighting and control so you dive like a pro.',
    youWillLearn: [
      'Perfecting your weighting and trim',
      'Streamlining to save energy and air',
      'Hovering effortlessly in any position',
      'Gliding close without contact',
      'Two training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '10+',
    duration: '1 day (2 dives)',
    depth: null,
    certifies: 'PADI Peak Performance Buoyancy',
    matchCodes: [],
    next: [],
  },
  'padi-underwater-navigator-specialty': {
    overview:
      'Never lose your way — or the boat — again. The Underwater Navigator specialty sharpens your natural and compass navigation so you can explore with confidence and always find your way back.',
    youWillLearn: [
      'Natural navigation using the environment',
      'Compass navigation and patterns',
      'Estimating distance underwater',
      'Marking and relocating a spot',
      'Three training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '10+',
    duration: '1–2 days (3 dives)',
    depth: null,
    certifies: 'PADI Underwater Navigator',
    matchCodes: [],
    next: ['padi-advanced-course'],
  },
  'padi-boat-diver-specialty': {
    overview:
      'From small RIBs to liveaboards, boats open up the best dive sites. The Boat Diver specialty makes you comfortable and competent diving from boats of every kind.',
    youWillLearn: [
      'Boat terminology and etiquette',
      'Entries and exits from different boats',
      'Stowing and handling gear aboard',
      'Planning a safe dive from a boat',
      'Two training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '10+',
    duration: '1 day (2 dives)',
    depth: null,
    certifies: 'PADI Boat Diver',
    matchCodes: [],
    next: [],
  },
  'padi-equipment-specialist': {
    overview:
      'Understand the gear that keeps you alive underwater. The Equipment Specialist course — no dives required — teaches routine care, maintenance and simple field adjustments so a minor problem never ends your dive day.',
    youWillLearn: [
      'How your dive gear works',
      'Routine maintenance and storage',
      'Simple field repairs and adjustments',
      'Recognising when gear needs a service',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '10+',
    duration: '1 day (dry, no dives)',
    depth: null,
    certifies: 'PADI Equipment Specialist',
    matchCodes: ['equip'],
    next: [],
  },
  'padi-digital-underwater-photographer-specialty': {
    overview:
      'Bring home the underwater world. This specialty gets you shooting great photos and video fast, using the PADI approach to composition, camera settings and getting close to your subject.',
    youWillLearn: [
      'Choosing and setting up a camera',
      'The shoot-examine-adjust method',
      'Composition and getting close',
      'Working with available light and strobes',
      'Two training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '10+',
    duration: '1–2 days (2 dives)',
    depth: null,
    certifies: 'PADI Digital Underwater Photographer',
    matchCodes: [],
    next: [],
  },
  'padi-fish-identification-specialty': {
    overview:
      'Turn “what was that fish?” into instant recognition. The Fish Identification specialty teaches you the major fish families and how to identify the species you meet on every dive.',
    youWillLearn: [
      'Recognising common fish families',
      'Identification techniques and features',
      "Local species you'll see in Taiwan",
      'Surveying and recording what you see',
      'Two training dives',
    ],
    prerequisites: '(Junior) Open Water Diver',
    minAge: '10+',
    duration: '1–2 days (2 dives)',
    depth: null,
    certifies: 'PADI Fish Identification',
    matchCodes: [],
    next: [],
  },
}

/** Does an upcoming course event (by its category code) belong to this course? */
export function sessionMatchesCourse(
  guide: CourseGuide | undefined,
  category: string | null,
): boolean {
  if (!guide || !category) return false
  const c = category.trim().toLowerCase()
  return guide.matchCodes.includes(c)
}
