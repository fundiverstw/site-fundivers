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
  | 'covers' // a "the course will cover" block: lead line, named cards, note
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
  // Optional prose that brackets the prerequisites list, a lead-in before it
  // and/or a note after it (e.g. "qualifying certifications may apply").
  prereqLead?: string
  prereqNote?: string
  minAge: string
  duration: string
  depth: string | null
  certifies: string
  timeFrame?: string
  phases?: CoursePhase[]
  // A "the course will cover" block: an optional lead line, named cards (like
  // phases), and an optional closing note. Rendered as its own subsection.
  coversLead?: string
  covers?: CoursePhase[]
  coversNote?: string
  materials?: string[]
  // Optional "Recommended" extras shown under the materials list.
  materialsRecommended?: string[]
  equipment?: string[]
  // Prose equipment, used instead of the `equipment` list when present.
  equipmentText?: string
  notes?: string[]
  // How to group the blocks above into staggered subsections (each inner array
  // is one subsection, rendered against its own image). The FIRST subsection
  // shares its row with the course title + intro, give it [] for just the
  // title/intro, or blocks to sit alongside them. Omit the whole field to use
  // the default grouping (see CourseDetail). Later empty subsections are
  // dropped, and blocks with no data are removed automatically.
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
    prerequisites: 'None, able to swim and in good health',
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
      [],
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
    equipment: [
      "Equipment isn't included in the course price, but we can provide rental gear as needed.",
    ],
    notes: [
      'Dates and schedule may vary depending on conditions and chosen specialties.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
    ],
    subsections: [
      [],
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
    equipment: [
      "Equipment isn't included in the course price, but we can provide rental gear as needed.",
    ],
    notes: [
      'EFR Certification can be done during the Rescue course.',
      'Dates are subject to change due to weather or wave conditions.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
    ],
    subsections: [
      ['overview'],
      ['topics', 'prerequisites'],
      ['timeFrame'],
      ['materials', 'equipment', 'notes'],
    ],
    matchCodes: ['resc', 'rescue ready'],
    next: ['padi-divemaster-course', 'padi-master-scuba-diver'],
  },
  'padi-divemaster-course': {
    intro:
      'Learn how to be a leader who mentors and motivates others. You will gain the knowledge and supervision abilities necessary to be a dive professional and become a role model to divers around the world.',
    overview:
      "Love scuba diving? Want to share it with others on a whole new level? Take the PADI Divemaster course and do what you love as a career. Scuba divers always look up to divemasters because they are leaders who mentor and motivate others. As a divemaster, you not only get to dive a lot, but also experience the joy of seeing others having fun diving, too. The PADI Divemaster course is your first level of professional training. You'll work closely with your instructor and fine tune your dive skills. You'll gain knowledge, management and supervision abilities so you become a role model. You'll lead divers as you supervise activities and assist with diver training courses. Whether you want to work close to home or at a faraway dive destination, the adventure of a lifetime awaits you!",
    youWillLearn: [
      'Dive leadership and supervision',
      'Guiding certified divers safely',
      'Assisting instructors with students',
      'Dive theory and dive-site management',
      'Refining demonstration-quality skills',
    ],
    prerequisites: 'PADI Rescue Diver, EFR within 24 months, and 40 logged dives (60 to certify)',
    prereqLead:
      'PADI Rescue Divers who are at least 18 years old may enroll in the PADI Divemaster course. You also need to have:',
    prereqList: [
      'Emergency First Response Primary and Secondary Care (CPR and First Aid) training within the past 24 months.',
      'A medical statement signed by a physician within the last 12 months.',
      'At least 40 logged dives to begin the course and 60 dives to earn certification.',
    ],
    prereqNote:
      'Note that qualifying certifications from other diver training organizations may apply, ask your PADI Instructor.',
    minAge: '18+',
    duration: 'Several weeks (flexible)',
    depth: null,
    certifies: 'PADI Divemaster, a professional rating',
    timeFrame:
      'The PADI Divemaster Course is both a knowledge- and performance-based course, so course duration will vary for each student. Contact Fun Divers TW to discuss a schedule that works for you!',
    materials: [
      'PADI Divemaster Course E-learning',
      'PADI Instructor Manual',
      'The Encyclopedia of Recreational Diving',
      'eRDPML with instructional booklet',
      'PADI Divemaster slates',
      'Fun Divers Log Book',
      'Fun Divers Sticker',
      'Fun Divers Pen',
    ],
    materialsRecommended: [
      'PADI Guide to Teaching',
      'Diving Knowledge Workbook',
      'PADI Skill Practice and Dive Planning slate',
    ],
    equipmentText:
      "As a dive professional, you need to have all your basic scuba equipment, including a dive computer, a dive knife, and at least two surface signalling devices. During practical skills exercises, like underwater mapping and search and recovery, you'll use a compass, floats, marker buoys, lift bags and slates. Contact Fun Divers TW for all your equipment needs!",
    subsections: [[], ['overview'], ['prerequisites', 'timeFrame'], ['materials', 'equipment']],
    matchCodes: ['dm', 'divemaster'],
    next: ['padi-enriched-air-specialty-course', 'padi-deep-diver-specialty'],
  },
  'padi-master-scuba-diver': {
    intro:
      'Reach the summit of recreational diving. PADI Master Scuba Diver is the highest rating a recreational diver can earn, held by fewer than two percent of divers worldwide, and it marks you as someone who has truly mastered the underwater world.',
    overview:
      "Wearing the PADI Master Scuba Diver rating tells the world you've done it all: a broad range of dive experiences, real hours logged beneath the surface, and the versatility to feel at home almost anywhere you dive. You earn it not from a single weekend course but over a diving journey, completing the core certifications, adding at least five specialty ratings in the diving you love most, and logging 50 dives or more along the way. Every specialty sharpens a new skill and opens up a new kind of diving, from deep and wreck to photography and drift. Arrive at the rating and you join an elite circle of divers others look up to, the ones who've seen the most, done the most, and keep coming back for more.",
    youWillLearn: [
      'A well-rounded range of specialty skills',
      'Confidence across many diving environments',
      'Recognition as an elite recreational diver',
    ],
    prerequisites: 'Advanced Open Water, Rescue Diver, five PADI Specialties and 50 logged dives',
    prereqList: [
      '12 years old',
      'Be certified as a PADI Rescue Diver (or equivalent)',
      'Have at least 5 PADI Specialty Certifications (or equivalent)',
      'Have at least 50 logged dives',
    ],
    minAge: '12+',
    duration: 'Earned over time',
    depth: null,
    certifies: 'PADI Master Scuba Diver rating',
    timeFrame:
      "Because Master Scuba Diver is a rating you build rather than a single course, the timeline is entirely your own, set by the specialties you choose and the pace you dive. Once you've completed the prerequisite courses and logged your 50 dives, we'll submit your application and welcome you to the club. Talk to Fun Divers TW and we'll help you map out the specialties and dives that get you there.",
    materials: ['Nothing extra to buy, you already have everything from your previous courses.'],
    equipment: ['No new equipment needed, your own dive gear is all it takes.'],
    subsections: [[], ['overview'], ['prerequisites'], ['timeFrame', 'materials', 'equipment']],
    matchCodes: ['msd'],
    next: ['padi-divemaster-course', 'padi-deep-diver-specialty'],
  },
  'padi-discover-scuba-diving-program': {
    intro:
      "Curious about scuba diving but not ready to commit to a full course? Discover Scuba Diving with Fun Divers TW is the perfect first breath underwater, a relaxed, guided introduction to the world beneath the waves. There's no certification and no pressure: just you, a PADI Instructor by your side, and the unforgettable moment you first breathe underwater. Along the way you'll even pick up a few of the basic skills that lead toward becoming a certified diver.",
    overview:
      "During the PADI Discover Scuba Diving (DSD) program, you'll head into the water on a real dive alongside one of Fun Divers TW's experienced PADI Instructors, never more than an arm's reach away. First you'll learn a handful of simple safety guidelines and skills in shallow water, then glide out over the reef and see what has hooked divers the world over. It's the easiest, safest way to find out just how magical the underwater world can be.",
    topicsTitle: 'Get ready to',
    youWillLearn: [
      "Discover the scuba gear you'll wear, and how weightless and easy it feels to move around underwater.",
      'Take your very first breath beneath the surface, the moment every diver remembers.',
      "Pick up a few simple skills you'll use on every dive to come.",
      'Hover among the fish and soak up the quiet of the reef.',
      'See where it leads, a taste of the PADI Open Water Diver course that turns first-timers into certified divers.',
    ],
    prerequisites: 'None, 10+ and in good health',
    prereqList: [
      '12 years old.',
      'No prior experience with scuba diving is necessary, but you need to be in reasonable physical health.',
      'This is NOT a certification course. It is a chance to try scuba diving before committing to a certification course.',
    ],
    minAge: '10+',
    duration: 'Half a day',
    depth: '12 m',
    certifies: 'Experience program (not a certification)',
    timeFrame:
      "Discover Scuba Diving is a single open-water dive at Bat Cave, one of our favourite spots to fall in love with diving, with the option to add a second dive and make the most of your day. It's a half-day adventure with nothing to study beforehand; just show up ready to get wet.",
    materials: [
      "No coursework and no materials, this is a try-dive, not a certification course, so there's nothing to buy or study.",
    ],
    equipment: [
      'All the basic scuba gear you need is included in the price, just bring your swimsuit and a sense of adventure.',
    ],
    subsections: [
      [],
      ['overview', 'topics'],
      ['prerequisites', 'timeFrame'],
      ['materials', 'equipment'],
    ],
    matchCodes: ['dsd', 'discover'],
    next: ['padi-open-water-course', 'padi-advanced-course'],
  },
  'padi-refresher-course': {
    intro:
      "Been a while since your last dive? Shake off the rust and rebuild your confidence. In a relaxed refresher with a PADI Instructor at your side, you'll revisit the key knowledge and practise the skills that matter, so you can get back beneath the surface feeling sharp, safe, and ready to explore again.",
    overview:
      "If you haven't dived in a while, the Refresher Course is exactly what you need. Together with a PADI Instructor you'll review the important knowledge points and run through the essential skills, mask clearing, regulator recovery, buoyancy and more, until they feel second nature again. It's the easiest way to trade any nerves for confidence and make sure your return to diving is a safe and enjoyable one.",
    youWillLearn: [
      'Refreshing core safety skills',
      'Reviewing dive planning and equipment',
      'Rebuilding comfort and buoyancy',
      'Updating on current best practice',
    ],
    prerequisites: 'Certified diver returning after a break',
    prereqList: ["Recommended for any certified diver who hasn't dived in more than 6 months."],
    minAge: '10+',
    duration: 'Half a day',
    depth: null,
    certifies: 'Skills refresh (PADI ReActivate)',
    timeFrame:
      "The Refresher Course starts with a brief knowledge review, then heads out for 2 dives where you'll put the skills back into practice. Your PADI Instructor watches over each dive and gives you personal feedback and tips to sharpen your diving, so you finish more capable and comfortable than when you arrived.",
    materials: ["No materials needed, we've got you covered."],
    equipment: [
      "Equipment isn't included in the course price, but we can provide rental gear as needed.",
    ],
    subsections: [[], ['overview'], ['prerequisites', 'timeFrame'], ['materials', 'equipment']],
    matchCodes: ['refresher'],
    next: ['padi-advanced-course', 'padi-enriched-air-specialty-course'],
  },
  'padi-efr-course': {
    intro:
      "Discover simple to follow steps for emergency care. This course focuses on building confidence in lay rescuers and increasing their willingness to respond when faced with a medical emergency in a non-stressful learning environment. You don't have to be a diver to take this course.",
    overview:
      'The EFR course is based on internationally recognized medical guidelines for emergency care. EFR courses meet the CPR and first aid training requirements for the PADI Rescue Diver course and all professional-level ratings. It is equivalent to the American Red Cross course.',
    coversLead: 'The EFR course will cover:',
    covers: [
      {
        name: 'Primary Care',
        text: "This part of the course teaches you the steps and techniques for handling life-threatening emergency situations. You'll practice 8 skills for aiding patients who aren't breathing, have no heartbeat, may have a spinal injury, may be in shock or who may have serious bleeding. You'll learn how to perform CPR, so that you provide every possible chance of survival while waiting for emergency medical services to arrive.",
      },
      {
        name: 'Secondary Care',
        text: "Because many medical conditions are not life-threatening and emergency medical services are sometimes delayed or unavailable, this part of the course teaches you how to provide first aid that eases pain and reduces the risk of further harm. You'll learn to assess a variety of injuries and illnesses and practice bandaging and splinting. Some other skills you may learn are how to care for children and how to use an automated external defibrillator (AED).",
      },
    ],
    coversNote:
      "It's a good idea to refresh your CPR and first aid skills every 24 months so that you are ready to lend aid whenever needed.",
    youWillLearn: [
      'Primary care (CPR)',
      'Secondary care (first aid)',
      'Using barriers to reduce disease risk',
      'Managing serious bleeding and shock',
      'AED awareness',
    ],
    prerequisites: 'None, open to everyone',
    prereqList: [
      'No minimum age, but recommended for students 12 years old or older.',
      'This course is NOT a scuba diving course.',
    ],
    minAge: 'No minimum',
    duration: '1 day',
    depth: null,
    certifies: 'EFR Primary & Secondary Care (valid 24 months)',
    timeFrame:
      'The Emergency First Response (EFR) Course is a performance-based course, so classroom session length varies, but the average course is 4-5 hours. The course is taught at Fun Divers Dive Center.',
    materials: ['Emergency First Response Manual / E-learning', 'Emergency First Response Video'],
    equipment: ['All equipment is provided.'],
    notes: [
      'All PADI Instructors are also EFR Instructors and are qualified to teach this course.',
    ],
    subsections: [
      [],
      ['overview'],
      ['covers'],
      ['prerequisites', 'timeFrame', 'materials', 'equipment', 'notes'],
    ],
    matchCodes: ['efr'],
    next: ['padi-rescue-diver-course', 'padi-o2-provider-course'],
  },
  'padi-o2-provider-course': {
    intro:
      'Learn to provide emergency oxygen to an injured diver when it matters most. In just a few hours you gain a skill that can make a real difference in the outcome of a diving emergency.',
    overview:
      "One of the most important steps in any diving emergency is the prompt administration of oxygen to the injured diver. In the PADI O2 Provider Course, you will learn how to safely assemble emergency oxygen equipment, recognise the different types of emergency oxygen units, and administer oxygen safely and effectively. The skills you learn in this course can help make a real difference in an injured diver's recovery.",
    youWillLearn: [
      'Recognising the dive injuries oxygen can help',
      'Identifying different types of emergency oxygen equipment',
      'Safely assembling an emergency oxygen unit',
      'Administering emergency oxygen to an injured diver',
    ],
    prerequisites: 'None, open to everyone',
    prereqList: [
      'No minimum age, but recommended for students 12 years old or older.',
      'This course is NOT a scuba diving course.',
    ],
    minAge: 'No minimum',
    duration: '1 day',
    depth: null,
    certifies: 'Emergency Oxygen Provider',
    timeFrame:
      'The PADI O2 Provider Course is a performance-based course, so classroom session length varies, but the average course is 1-2 hours. The course is taught at Fun Divers Dive Center.',
    materials: ['PADI E-learning'],
    equipment: ['All equipment is provided.'],
    subsections: [[], ['overview'], ['prerequisites', 'timeFrame'], ['materials', 'equipment']],
    matchCodes: ['o2 provider', 'o2'],
    next: ['padi-rescue-diver-course', 'padi-efr-course'],
  },
  'padi-enriched-air-specialty-course': {
    intro:
      'The PADI Enriched Air Nitrox Course is the most popular PADI specialty course. Diving with EANx gives you extra no-decompression time, especially on repetitive dives, so you can stay down longer and get back in the water sooner.',
    overview:
      "The PADI Enriched Air Nitrox Diver course is PADI's most popular specialty scuba course for several reasons. Nitrox lets you dive at deeper depths for longer times, gives you more no-decompression time (especially on repetitive dives), and allows for a shorter surface interval between multi-dive days. It is especially popular with divers who plan to dive while traveling, as some resorts and liveaboards dive only with nitrox and require the certification. If staying down longer and getting back in the water sooner sounds appealing, then don't hesitate to become an Enriched Air Diver.",
    youWillLearn: [
      'How enriched air extends no-stop limits',
      "Analysing your cylinder's oxygen content",
      'Setting a dive computer for Nitrox',
      'Managing oxygen exposure and depth limits',
    ],
    prerequisites: '(Junior) Open Water Diver',
    prereqList: ['12 years old.', 'Certified as a PADI (Junior) Open Water Diver.'],
    minAge: '12+',
    duration: '1 day (dry, optional dives)',
    depth: null,
    certifies: 'Dive with enriched air up to 40% oxygen',
    timeFrame:
      'The PADI Enriched Air Nitrox Diver Course consists of 2 sections. The PADI E-learning is done on your own, and the in-person review is usually done on the same day as the dives.',
    phases: [
      {
        name: 'Course structure',
        text: 'Section 1 is the PADI E-learning and in-person review. Section 2 is 2 ocean dives using nitrox tanks.',
      },
    ],
    materials: ['PADI Enriched Air Nitrox E-learning'],
    equipmentText:
      'Equipment is not included in the course, but we provide rental gear as needed. Students must use a dive computer during the course, which can be purchased or rented from Fun Divers.',
    notes: [
      'Dates are subject to change due to weather or wave conditions.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
    ],
    subsections: [
      [],
      ['overview'],
      ['prerequisites', 'timeFrame'],
      ['materials', 'equipment', 'notes'],
    ],
    matchCodes: ['eanx', 'nitrox'],
    next: ['padi-deep-diver-specialty', 'padi-advanced-course'],
  },
  'padi-deep-diver-specialty': {
    intro:
      'Explore deeper dive sites with confidence at depths down to 40 metres / 130 ft. Learn to manage your gas supply, sharpen your buddy contact procedures, and refine your buoyancy control.',
    overview:
      "There is something about the deep that lures in all divers. It is exciting and mysterious. Sometimes it's descending to a shipwreck or down a sheer wall, or just to say that you've been to 40 meters. But you will need to follow some special safety measures to do it with confidence. You will need to know the importance of your personal limits. Proper planning, good buddy contact procedures, good buoyancy control, dealing with gas supply and knowing when you may be suffering from nitrogen narcosis are all essential.",
    youWillLearn: [
      'Planning and executing deep dives',
      'Managing gas, time and no-stop limits',
      'Handling the effects of pressure and narcosis',
      'Four training dives to a maximum of 40 m',
    ],
    prerequisites: 'PADI Advanced Open Water Diver',
    prereqList: ['PADI Advanced Open Water certification.'],
    minAge: '15+',
    duration: '2 days (4 dives)',
    depth: '40 m',
    certifies: 'Dive to the 40 m recreational limit',
    timeFrame: 'The Deep Diver Specialty includes 4 ocean dives, usually over 2 days.',
    materials: ['PADI E-learning'],
    equipmentText:
      'Equipment is not included in the course, but we provide rental gear as needed. Students must use a dive computer during the course, which can be purchased or rented from Fun Divers.',
    notes: [
      'Dates and schedule may vary depending on conditions and chosen specialties.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
      'After completing the course, divers will be certified to 40 m.',
    ],
    subsections: [
      [],
      ['overview'],
      ['prerequisites', 'timeFrame', 'materials'],
      ['equipment', 'notes'],
    ],
    matchCodes: ['deep'],
    next: ['padi-enriched-air-specialty-course', 'padi-advanced-course'],
  },
  'padi-night-diver-specialty': {
    intro:
      "The underwater world changes as day creatures retire and nocturnal organisms emerge. If you've wondered what happens underwater after the sun goes down, enroll in the PADI Night Diver Specialty course.",
    overview:
      "The thought of dipping below the surface at night seems mysterious, yet so alluring. Although you've been scuba diving at a site many times before, at night you drop into a whole new world and watch it come to life under the glow of your dive light. The scene changes as day creatures retire and nocturnal organisms emerge. Scuba diving at night teaches you to focus on what you can see in your light's beam, on controlling your buoyancy by feel, on staying with your buddy and on paying attention to details you may overlook during the day.",
    topicsTitle: "During three night dives, you'll practice:",
    youWillLearn: [
      'Light handling and communication techniques.',
      'Entering, exiting and navigating in the dark.',
      'Identifying how plants and animals differ or change behavior at night.',
    ],
    prerequisites: '(Junior) Open Water Diver',
    prereqList: ['12 years old.', 'Certified as a PADI (Junior) Open Water Diver.'],
    minAge: '12+',
    duration: '2–3 evenings (3 dives)',
    depth: null,
    certifies: 'PADI Night Diver',
    timeFrame:
      'The Night Diver Specialty includes 3 dives, so it is usually done over 2 or 3 days.',
    materials: ['PADI E-learning'],
    equipmentText:
      'Equipment is not included in the course, but we provide rental gear as needed. Divers need a dive light, which can be rented from Fun Divers.',
    notes: [
      'Dates and schedule may vary depending on conditions and chosen specialties.',
      'Return transport is included.',
      'For private 1-on-1 service, a surcharge may apply.',
      'If students wish to purchase their own dive light, contact Fun Divers TW for assistance!',
    ],
    subsections: [
      [],
      ['overview'],
      ['topics'],
      ['prerequisites', 'timeFrame', 'materials', 'equipment', 'notes'],
    ],
    matchCodes: [],
    next: ['padi-deep-diver-specialty', 'padi-advanced-course'],
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
      'Drift diving feels like flying, letting the current carry you effortlessly over reefs and walls. This specialty teaches the technique and awareness to make current your friend.',
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
      'Great divers make it look effortless, hovering motionless, gliding past delicate corals, using less air. Peak Performance Buoyancy fine-tunes your weighting and control so you dive like a pro.',
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
      'Never lose your way, or the boat, again. The Underwater Navigator specialty sharpens your natural and compass navigation so you can explore with confidence and always find your way back.',
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
      'Understand the gear that keeps you alive underwater. The Equipment Specialist course, no dives required, teaches routine care, maintenance and simple field adjustments so a minor problem never ends your dive day.',
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
