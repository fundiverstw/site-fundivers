// Editorial guides for the /courses/<id> detail pages. These are original
// descriptions of the standard PADI curricula (not PADI's own copy), plus quick
// facts and the DB category codes (matchCodes) used to surface this course's
// upcoming sessions. Keyed by the course route id (courses.ts courseId()).
export type CoursePhase = { name: string; text: string }

// The content blocks the detail page can lay out. The intro always leads
// (beside the first image); everything else is grouped into staggered
// subsections via `CourseGuide.subsections` (or a sensible default).
export type BlockKey =
  | 'overview'
  | 'topics' // the `youWillLearn` bullet list
  | 'reasons' // the numbered `reasons` list
  | 'prerequisites'
  | 'timeFrame' // the time-frame prose plus its `phases`
  | 'materials'
  | 'equipment'
  | 'notes'

export type CourseGuide = {
  // Short lead-in shown beside the first staggered image (falls back to the
  // course card's `desc` when absent).
  intro?: string
  overview: string
  // Optional "why take this" list shown as a numbered list, with its own title.
  reasonsTitle?: string
  reasons?: string[]
  // The "topics"/"what you'll learn" bullet list. `topicsTitle` overrides its
  // heading (some courses call it "Topics include" rather than the default).
  topicsTitle?: string
  youWillLearn: string[]
  prerequisites: string
  // Richer, itemised prerequisites for the staggered layout. When present these
  // replace the single-line `prerequisites` string in the page body.
  prereqList?: string[]
  minAge: string
  duration: string
  depth: string | null
  certifies: string
  timeFrame?: string
  phases?: CoursePhase[]
  materials?: string[]
  equipment?: string[]
  notes?: string[]
  // How to group the blocks above into staggered subsections (each inner array
  // is one subsection, rendered against its own image). Omit to use the default
  // grouping (see CourseDetail). Blocks with no data are dropped automatically.
  subsections?: BlockKey[][]
  matchCodes: string[] // event admin_title codes (lowercased) for upcoming sessions
  next: string[] // suggested next-course route ids
}

export const COURSE_GUIDES: Record<string, CourseGuide> = {
  'padi-open-water-course': {
    intro:
      'Your Scuba Diving Adventure starts here. Take your PADI Open Water Course and see why so many people have gotten hooked on the aquatic world. No prior experience necessary!',
    overview:
      'If you want to learn scuba diving, the PADI Open Water course is your first step. Become a scuba diver by taking this course and start exploring the underwater world. Your PADI Open Water Certification is recognized around the world, has no expiry date and certifies you to dive to 18 meters.',
    youWillLearn: [
      'Setting up, using and caring for scuba gear',
      'Essential underwater skills and safety procedures',
      'Mask clearing, regulator recovery and buoyancy control',
      'Planning dives with tables and a dive computer',
      'Four training dives in open water',
    ],
    prerequisites: 'None — able to swim and in good health',
    prereqList: [
      'No prior Scuba Diving Experience Required! If you have never dived before, this is the Certification Course for you!',
      '12 years old (12–14 year old students can earn Junior Open Water).',
      'Students should have adequate swimming skills and should be in good physical health.',
    ],
    minAge: '10+ (Junior 10–14)',
    duration: '3–4 days',
    depth: '18 m',
    certifies: 'Dive independently with a buddy to 18 m worldwide',
    timeFrame:
      'The PADI Open Water course takes place over 3 days. Courses are usually scheduled for weekends, so the 3-day course will take 2 weekends. This course consists of 3 phases:',
    phases: [
      {
        name: 'E-Learning & Classroom Session',
        text: 'We will begin in the classroom and develop your understanding of general scuba diving knowledge and how water pressure affects your body and how to deal with it. Most of this phase is done on your own at home via PADI E-learning.',
      },
      {
        name: 'Pool Session',
        text: 'In the pool you will learn how to use the scuba gear as well as basic skills necessary for scuba diving in a safe, controlled and step-by-step manner.',
      },
      {
        name: 'Open Water Session',
        text: 'During the 4 open water dives, you will practice and refine the skills already learned in the pool and begin to explore the underwater realm.',
      },
    ],
    materials: [
      'PADI Open Water Course Manual / E-Learning',
      'PADI Open Water Course Videos / E-Learning',
      'PIC Envelope',
      'Fun Divers Log Book',
      'Fun Divers Sticker',
      'Fun Divers Pen',
    ],
    equipment: [
      'Basic equipment rental is included in the course price.',
      'Students need to buy their own Mask and Snorkel.',
      'Purchase of Soft Gear (boots, fins, wetsuit) is also recommended.',
    ],
    notes: [
      'Dates are subject to change due to weather or wave conditions.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
    ],
    subsections: [
      ['overview', 'prerequisites'],
      ['timeFrame'],
      ['materials', 'equipment', 'notes'],
    ],
    matchCodes: ['ow'],
    next: ['padi-advanced-course', 'padi-enriched-air-specialty-course'],
  },
  'padi-advanced-course': {
    intro:
      "The PADI Advanced Open Water Diver Course is a great way to improve your diving skills, get additional diving experience under the supervision of an instructor and increase your knowledge about diving. This course can be taken immediately after completing the PADI Open Water Diver certification. It's titled PADI Advanced Open Water Diver because it advances your diving skills and knowledge.",
    overview:
      'By taking the PADI Advanced Course, you will learn more about the underwater world while expanding your diving skills. You will practice your navigation and go deeper. After the course, you will be certified to 30 meters, which will open up more dive sites to you around the world. There is a Deep dive, a Navigation dive, and you will also be able to choose 3 specialty dives based on your interests!',
    reasonsTitle: 'Top 10 reasons to take the PADI Advanced Course',
    reasons: [
      'Increase your knowledge of diving',
      "Expand the skills you've learned while supervised",
      'Dive as deep as 30 m and see more',
      'Gain confidence in yourself',
      'Be more comfortable in the water',
      'Be more comfortable with the equipment',
      'Try 5 different kinds of adventure dives',
      'Have more chances to explore different dive sites locally and worldwide',
      'Higher credentials mean less hassle when traveling',
      'Meet new dive buddies',
    ],
    youWillLearn: [
      'Deep-diving technique and planning to 30 m',
      'Underwater navigation by compass and natural reference',
      'Three adventure dives of your choice (night, wreck, buoyancy and more)',
      'Greater confidence and in-water control',
    ],
    prerequisites: 'PADI (Junior) Open Water Diver or qualifying certification',
    prereqList: [
      '12 years old (12–14 year old students can earn Junior Advanced Open Water).',
      'Certified as a PADI (Junior) Open Water Diver.',
    ],
    minAge: '12+',
    duration: '2–3 days',
    depth: '30 m',
    certifies: 'Dive to 30 m; counts toward Master Scuba Diver',
    timeFrame: 'The PADI Advanced Course consists of PADI E-learning and 5 specialty dives.',
    phases: [
      { name: 'Day 1', text: 'Open water dives 1 & 2.' },
      { name: 'Day 2', text: 'Open water dives 3, 4 & 5.' },
    ],
    materials: [
      'PADI Advanced Open Water E-learning',
      'Continuing Education Administrative Document',
      'Fun Divers Log Book',
      'Fun Divers Sticker',
      'Fun Divers Pen',
    ],
    equipment: ['Equipment rental is NOT included.'],
    notes: [
      'Dates and schedule may vary depending on conditions and chosen specialties.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
    ],
    subsections: [
      ['overview', 'reasons'],
      ['prerequisites', 'timeFrame'],
      ['materials', 'equipment', 'notes'],
    ],
    matchCodes: ['aow'],
    next: ['padi-rescue-diver-course', 'padi-deep-diver-specialty'],
  },
  'padi-rescue-diver-course': {
    intro:
      'Learn to manage or prevent problems in or out of the water. Be the dive buddy others can rely on! The PADI Rescue Diver course is a challenging, yet rewarding course that will make you a better diver who is more confident in their abilities!',
    overview:
      'The PADI Rescue Diver course prepares you to deal with dive emergencies, minor and major, using a variety of techniques. Through knowledge development and rescue exercises, you learn what to look for and how to respond. During rescue scenarios, you put into practice your knowledge and skills.',
    topicsTitle: 'Topics include',
    youWillLearn: [
      'Self-rescue',
      'Recognizing and managing stress in yourself and other divers',
      'Emergency management and equipment use',
      'Rescuing panicked divers on the surface and underwater',
      'Rescuing unresponsive divers on the surface and underwater',
      'Missing diver procedures',
    ],
    prerequisites:
      'PADI Adventure Diver (with Navigation) or higher, plus EFR training within 24 months',
    prereqList: [
      '12 years old (12–14 year old divers earn the Junior Rescue Diver Certification).',
      'Certified as a PADI (Junior) Adventure Diver.',
      'Must have completed the Underwater Navigation Adventure Dive.',
      'EFR Primary & Secondary Care training within 24 months (can be done during the rescue course).',
    ],
    minAge: '12+',
    duration: '3–4 days',
    depth: null,
    certifies: 'PADI Rescue Diver',
    timeFrame: 'The PADI Rescue Diver Course consists of 3 sections and takes 2 days.',
    phases: [
      { name: 'Section 1', text: 'At-home E-learning & classroom review.' },
      { name: 'Section 2', text: 'Pool session to practice skills.' },
      { name: 'Section 3', text: '2 ocean dives to put skills into practice.' },
    ],
    materials: [
      'PADI Rescue Course E-learning',
      'Continuing Education Administrative Document',
      'Fun Divers Sticker',
      'Fun Divers Pen',
    ],
    equipment: ['Equipment rental is NOT included.'],
    notes: [
      'EFR Certification can be done during the Rescue course.',
      'Dates are subject to change due to weather or wave conditions.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
    ],
    subsections: [
      ['overview', 'topics', 'prerequisites'],
      ['timeFrame', 'materials'],
      ['equipment', 'notes'],
    ],
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
