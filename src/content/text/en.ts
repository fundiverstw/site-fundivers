// English, the master copy.
//
// Every other language file mirrors this shape exactly. Add a key here first,
// then add the same key to zh-TW.ts and ja.ts; TypeScript will refuse to build
// until they match, which is how a half-translated site never ships.
//
// Only static UI and marketing copy lives here. Text that comes from the
// database (event titles, schedules) is not translated.

export const en = {
  nav: {
    // The bar is four sections. Each one is a hub page of its own *and* the
    // label on a dropdown listing what sits under it — see Nav.svelte.
    education: 'Education',
    community: 'Community',
    about: 'About Us',
    goDiving: 'Go Diving',

    // Under Education
    courses: 'Courses',
    life: 'Sea Life',
    quiz: 'Quiz',

    // Under Community. `news` is the internal name for the posts in
    // src/content/news/; readers only ever see "The Logbook".
    news: 'The Logbook',
    reputation: 'Reputation',
    fundive: 'FunDive App',

    // Under About Us
    origins: 'Origins',
    team: 'Team',

    // Under Go Diving
    calendar: 'Calendar',
    sites: 'Dive Sites',
    map: 'Map',
    travel: 'Travel',
    buildTrip: 'Build a Trip',

    // Not in the bar — these label the footer's link map, which is now the
    // way in to the pages the four sections do not cover.
    services: 'Services',
    gear: 'Gear',
    cycling: 'Cycling Tours',
    hiking: 'Hiking Tours',
    websites: 'Websites',

    // Sits under the logo, in every layout — see Nav.svelte.
    slogan: 'Breathe the Adventure. Explore with Confidence.',
    signIn: 'Sign in',
    radio: 'Radio show',
    menu: 'Toggle menu',
    language: 'Language',
  },
  gear: {
    title: 'Gear Sales, Service & Rental',
    subtitle:
      'Everything you need to dive, quality scuba and freediving equipment for sale or rent, plus expert servicing to keep your kit safe and dive-ready.',
    salesTitle: 'Sales',
    salesText:
      'From your first mask and fins to a full technical setup, we help you choose gear that fits you and the way you dive. Try before you buy in-store and get honest advice from working instructors, not a sales script.',
    salesItems: [
      'Masks, snorkels, fins & booties',
      'Wetsuits, hoods, gloves & rash guards',
      'BCDs, regulators & dive computers',
      'Freediving gear & accessories',
      'Tanks, weights & save-a-dive spares',
    ],
    serviceTitle: 'Service',
    serviceText:
      'Keep your life-support gear working the way it should. Our technicians service regulators and BCDs, swap batteries and O-rings, and pressure-check tanks so small problems never become in-water ones.',
    serviceItems: [
      'Annual regulator service & rebuilds',
      'BCD inspection & repair',
      'Dive-computer battery replacement',
      'Tank visual inspection & fills',
      'Wetsuit & drysuit minor repairs',
    ],
    rentalTitle: 'Rental',
    rentalText:
      'Travelling light or trying something before you buy? Rent well-maintained gear by the day or the trip, full sets or single pieces, sized and checked before you leave the shop.',
    rentalItems: [
      'Full scuba sets & individual pieces',
      'Wetsuits in a full range of sizes',
      'Dive computers & torches',
      'Daily, weekend & trip rates',
      'Included with many courses & guided dives',
    ],
    ctaTitle: 'Not sure what you need?',
    ctaText: 'Drop by the shop or message us, we’ll help you find, fit, or fix the right gear.',
  },
  map: {
    title: 'Dive Sites of Taiwan',
    hint: 'Tap a marker or a region below to zoom in.',
    back: '← Back to overview',
    shore: 'Shore',
    boat: 'Boat',
    diveSites: 'Dive sites',
    close: 'Close',
  },
  common: {
    readMore: 'Read more',
    viewOnMap: 'View on map',
    details: 'Details',
    book: 'Book',
    bookNow: 'Book Now',
    register: 'Register',
    joinWaitlist: 'Join waitlist',
    waitlist: 'Waitlist',
    viewAll: 'View all',
    contactUs: 'Contact us',
    // "From NT$15,400" — a whole phrase rather than a loose word, because the
    // price does not go in the same place in every language. English puts it
    // after, Japanese and Chinese put it before, so the {price} hole is what
    // makes the ordering translatable at all.
    fromPrice: 'From {price}',
    nothingScheduled: 'Nothing scheduled yet.',
    featured: 'Featured',
    dive: 'Dive',
    course: 'Course',
    adventure: 'Adventure',
    loadingDetails: 'Loading details…',
    pendingImage: 'Image coming soon',
  },
  // The landing page is the event board and nothing else. What used to sit
  // beneath it — the services tiles and the Diving-in-Taiwan essay — now lives
  // on About Us, under `about` below.
  // The landing page is three bands, one per kind of visitor, sized 25 / 50 / 25
  // of the screen so all three are there before anyone scrolls:
  //
  //   A  someone who has never dived      -> the course ladder, and where to look
  //   B  a certified diver                -> what is actually on the schedule
  //   C  a diver who plans their own      -> the calendar, the sites, the map
  //
  // The headings say what is in each band rather than who it is for. Nobody has
  // to decide whether they count as "advanced" before they can read the page.
  home: {
    // ── A · Start diving ──
    startTitle: 'Start diving',
    startText: 'Never breathed underwater? This is where you start!',
    // One per rung, in order, matched to the courses by position — see the
    // LADDER list in Home.svelte. The note is what that rung is actually for.
    startLadder: [
      { label: 'Open Water', note: 'Your first breath underwater' },
      { label: 'Advanced', note: 'Deeper, and after dark' },
      { label: 'Rescue', note: 'When something goes wrong' },
      { label: 'Divemaster', note: 'Guide, and turn pro' },
    ],
    seeLife: 'What you’ll see',
    whereWeDive: 'Where we dive',
    whoWeAre: 'Who we are',

    // ── B · What's coming up ──
    comingTitle: 'What’s coming up',
    comingText: 'Fun dives, boat trips, and adventures on the schedule.',
    seeCalendar: 'Full calendar →',
    communityTitle: 'From the shop',
    noteSurfaceInterval: 'Where we’ve been lately',
    noteRadio: 'Live from the shop',
    noteReputation: 'What divers say about us',

    // ── C · Resources for experienced divers ──
    planTitle: 'Resources for experienced divers',
    planText: 'To-the-point information on when and where we are diving next.',

    taglineMain: 'Breathe the Adventure',
    taglineSub: 'Explore with Confidence',
  },
  // The four section hubs. Each is a real page and the label on a nav dropdown.
  education: {
    title: 'Education',
    subtitle: 'Learn to dive, dive better, and get to know what lives down there.',
    coursesTitle: 'PADI Courses',
    coursesDesc:
      'The full PADI ladder, from a first breath underwater to going pro — taught in English, Mandarin and Japanese.',
    lifeTitle: 'Sea Life',
    lifeDesc:
      'The creatures we meet on Taiwan’s reefs and wrecks, photographed by our own divers and sorted by what they are.',
    quizTitle: 'Name that critter',
    quizDesc: 'Flashcards over the whole gallery. See how many you can name before we tell you.',
  },

  community: {
    title: 'Community',
    subtitle: 'The people around the shop — what we get up to, and what they make of it.',
    newsTitle: 'The Logbook',
    newsDesc:
      'Conferences, volunteer days, outreach and teaching — what the team has been up to between dives.',
    reputationTitle: 'Reputation',
    reputationDesc:
      'What our divers say in their own words, and the reviews we cannot edit — Google, Facebook and TripAdvisor.',
    radioTitle: 'Radio Show',
    radioDesc: 'We broadcast live from the shop. Listen in here, or from the button in the bar.',
    fundiveTitle: 'The FunDive App',
    fundiveDesc:
      'Book dives, follow your course progress and manage your bookings in our open-source dive-shop app.',
  },

  goDiving: {
    title: 'Go Diving',
    subtitle: 'Pick a date, pick a site, or draw your own line on the map.',
    calendarTitle: 'Calendar',
    calendarDesc: 'Every dive, course and trip on the schedule, with a place to reserve.',
    sitesTitle: 'Dive Sites',
    sitesDesc: 'Shore dives an hour from Taipei, through to world-class island walls.',
    mapTitle: 'Map',
    mapDesc: 'Taiwan’s dive sites, region by region, on a map you can zoom into.',
    travelTitle: 'Dive Travel',
    travelDesc: 'Planned group tours around Taiwan and across Asia, arranged end to end.',
    buildTripTitle: 'Build a Trip',
    buildTripDesc: 'Nothing on the calendar suits? Draft your own itinerary and we’ll price it.',
  },

  // About Us: the founders, the shop, the staff — then the services overview and
  // the Diving-in-Taiwan essay, both moved here off the landing page.
  about: {
    title: 'About Us',
    subtitle: 'Two instructors, a shop in Yonghe, and a lot of hours in the water.',
    originsTitle: 'Origins',
    originsDesc:
      'From one instructor working out of his apartment in 2013 to two equal owners and a shop in Yonghe.',
    teamTitle: 'The Team',
    teamDesc:
      'The instructors and divemasters you will actually be in the water with — and why each of them dives.',
    storyTitle: 'How FunDivers came to be',
    // The shop's own account, confirmed by the owners — dates, the order things
    // happened in, and what each of them did before. Not filler: if you rewrite
    // it, check the facts with Dennis and Billy rather than tidying the prose.
    storyParas: [
      'FunDivers TW started in about 2013, in Dennis Wong’s apartment. There was no shop yet — there were tanks, a phone, and a PADI Instructor certification he had earned that same year.',
      'Dennis had taught before, though not diving. He spent seasons as a snowboarding and ski instructor in Niseko, in Hokkaido, and dabbled in event planning after that. Diving was the constant: he had been at it since 1998, caught from the start by the schooling fish — hundreds of them turning at once, as though something had told them all at the same moment — and in 2013 he decided to make it the job.',
      'Billy Evalt arrived from a different direction entirely. He had been a linguist in the military, learned to dive in Vietnam in 2008 on a friend’s recommendation, and was hooked before the first dive was over; he qualified as an instructor in 2012. By the time he was in Taipei he was teaching English, had the certification sitting there, and wanted to branch out — so he got in touch with Dennis.',
      'They ran it together from there. Around 2015 or 2016 they made it official: equal co-owners, on paper.',
      'Today the shop teaches the full PADI range in three languages, guides Taiwan’s coast and islands year-round, runs group trips across Asia, and builds its own dive-shop software in the open. Dennis has been IDC Staff since 2018 and was named a PADI Elite Instructor four years running. The list has grown. The reason has not: we still just want to take you down there and show you.',
    ],
    staffTitle: 'The people you dive with',
    staffIntro:
      'Instructors and divemasters who teach here week in, week out. Ask any of them why they dive and you get a different answer, which is rather the point.',
    since: 'Diving since',
    interests: 'Away from the water',
    why: 'Why I dive',
    aboveWater: 'Above the water',
    underwater: 'Under the water',
    exploreServices: 'Explore our Services',
    exploreServicesIntro:
      'Discover the unique and valuable aspects that make Fun Divers TW the top choice for diving enthusiasts. With our extensive experience and dedication to customer satisfaction, we provide exceptional guided trips and convenient booking services as well as all PADI Recreational Dive Courses.',
    services: [
      {
        title: 'PADI Courses',
        desc: 'Fun Divers Tw offers the full range of PADI Certification Courses, from beginner to professional level! See the courses available here!',
      },
      {
        title: 'Dive Sites',
        desc: 'Fun Divers Tw offers local shore and boat diving trips. There are many beautiful dive sites to visit here on the northeast coast of Taiwan.',
      },
      {
        title: 'Gear Sales, Service, & Rental',
        desc: 'Fun Divers Tw offers a range of Scuba diving and Free diving gear for Sale or Rental. We can also service regulators and BCDs! Contact us to find out more!',
      },
      {
        title: 'International Dive Tours',
        desc: 'Fun Divers Tw plans group tours to a variety of thrilling destinations! Join one of our planned dive trips or let us help you book your customized trip!',
      },
      {
        title: 'Domestic Dive Tours',
        desc: 'Explore the amazing dive destinations around Taiwan with Fun Divers Tw! Join a planned trip or let us help you book a customized trip.',
      },
      {
        title: 'EFR Courses',
        desc: 'Fun Divers Tw offers the full range of EFR courses. Learn how to help yourself and others in an emergency.',
      },
    ],
    divingTitle: 'Diving in Taiwan: Exploring a World Beneath the Waves',
    divingParas: [
      'Taiwan, a treasure trove of cultural heritage and natural beauty, offers diving enthusiasts an unparalleled opportunity to delve into the depths of its azure waters. Taiwan caters to divers year round with dive seasons that vary across the regions. Taiwan is generally divided into three dive regions: The North (including Taipei, Keelung, and Yilan), The South (Lambai and Kenting), and the Outlying Islands (Penghu, Green Island, and Orchid Island).',
      'The season in the north stretches from April until Early October, with the warmest months being July and August. Diving is possible during the winter months, but water temperatures drop to 16-18C and wave conditions can be very unpredictable, which make it very difficult to plan ahead of time.',
      'The dive season in the south, however, is all year, since both Kenting and Lambai (Xiao Liuqiu) are sheltered from all but the worst of the winter winds and storms. The water temperature is warmer than the north, only dropping below 22C from January through March.',
      'The outlying islands, with Penghu situated off the west coast, and Green Island and Orchid Island, nestled off the southeastern coast, beckon adventurers with their own dive seasons. The high season spans from April to November with the low season being December through March. During the high season, water temperatures are warmer (25-30C) and conditions are much calmer while the low season sees cooler waters (18-24C) and more unpredictable wave conditions.',
      "Beyond Taiwan's shores, neighboring paradises like the Philippines and Indonesia offer complementary dive seasons, ensuring that the allure of underwater exploration knows no bounds.",
      "Embark on a journey through Taiwan's dive seasons and beyond, where every descent promises a glimpse into a world of wonder beneath the waves.",
    ],
  },

  origins: {
    title: 'Origins',
    subtitle: 'Where the shop came from, and the two people it came from.',
  },

  // The live show, at /radio under Community. The bar's radio button and this
  // page drive the same stream — see $engine/radio.
  radio: {
    title: 'The FunDivers Radio Show',
    subtitle: 'Diving talk, music, and whatever comes up — live from the shop.',
    intro: [
      'We broadcast live from the dive shop: what we saw last weekend, where we are going next, the odd argument about equipment, and music in between.',
      'The stream only runs while a show is on. The rest of the time this page and the radio button in the bar both sit quietly and say so — nothing is buffering in the background.',
    ],
    listen: 'Listen live',
    stop: 'Stop listening',
    connecting: 'Connecting…',
    live: 'On air now',
    offAir: 'Off air',
    offAirText:
      'Nothing is broadcasting at the moment. Try again during a show, or follow along on social for a heads-up before we go on.',
    idleText: 'Press play. If we are on air, you will hear us; if not, it will say so.',
    barHint: 'The radio button in the bar does the same thing, from any page on the site.',
  },

  // /reputation is one page in two halves: the quotes we hold, and the reviews
  // we do not. `testimonials` and `reviews` below are its two sections — their
  // titles are the headings inside it, which is why neither has a subtitle of
  // its own any more.
  reputation: {
    title: 'Reputation',
    subtitle:
      'What divers say about us — in their own words here, and in public where we cannot edit a syllable of it.',
  },

  testimonials: {
    title: 'Testimonials',
    none: 'No testimonials yet.',
    ctaTitle: 'Dived with us?',
    ctaText: 'We would love to hear how it went — write to us, or leave a public review.',
    leaveReview: 'Leave a review',
    contact: 'Email us',
  },

  reviews: {
    title: 'Reviews',
    intro:
      'Every review below sits on somebody else’s site, where we cannot edit or hide a word of it. Have a read — and if you have dived with us, adding yours genuinely helps a small shop get found.',
    readReviews: 'Read reviews',
    writeReview: 'Write a review',
    platforms: {
      google: 'The busiest of the three, and the one most people find first.',
      facebook: 'Recommendations from divers who follow the shop day to day.',
      tripadvisor: 'Where visiting divers planning a trip to Taiwan tend to look.',
    },
  },

  getInTouch: {
    title: 'Get In Touch',
    seeCalendar: 'See Full Calendar',
    tryDive: 'Schedule a Try-Dive',
    requestCourse: 'Request a Course',
    name: 'Name',
    email: 'Email',
    request: 'Your Request',
    requestPlaceholder:
      "Dates you're interested in, experience level, anything else we should know...",
    cancel: 'Cancel',
    send: 'Send Request',
    sent: 'Your email app should have opened with your request ready to send. If it didn’t, email {email} directly.',
    orMessage: 'Or message us directly:',
  },
  courses: {
    title: 'PADI Courses',
    subtitle:
      'Learn to dive, level up, or go pro, the full range of PADI recreational courses in Taiwan.',
    upcomingDates: 'Upcoming course dates',
    noDates: 'No scheduled course dates right now, courses also run on request.',
    getInTouch: 'Get in touch',
    enroll: 'Enroll',
  },
  courseDetail: {
    back: '← All courses',
    overview: 'About this course',
    youWillLearn: "What you'll learn",
    quickFacts: 'Course facts',
    prerequisites: 'Prerequisites',
    minAge: 'Minimum age',
    duration: 'Duration',
    depth: 'Max depth',
    certifies: 'You earn',
    timeFrame: 'Time frame',
    materials: 'Learning materials',
    recommended: 'Recommended',
    equipment: 'Equipment',
    notes: 'Notes',
    upcoming: 'Upcoming dates',
    noDates: 'No scheduled dates right now, this course also runs on request.',
    next: 'Where to next',
    fullPage: 'Full course page',
    cta: 'Ready to start?',
    ctaText: 'Book a date or ask us anything about this course.',
    contact: 'Get in touch',
    notFound: 'That course couldn’t be found.',
  },
  sites: {
    title: 'Dive Sites',
    subtitle:
      'From convenient shore dives in the north to world-class island diving, Taiwan’s underwater highlights.',
    none: 'No dive sites listed yet.',
    loadError: 'Couldn’t load dive sites',
    areas: { Domestic: 'Domestic', International: 'International' },
  },
  siteDetail: {
    back: '← All dive sites',
    overview: 'About this site',
    highlights: 'Highlights',
    marineLife: 'Marine life',
    belowSurface: 'Below the Surface',
    aboveSurface: 'Above the Surface',
    gettingThere: 'How to Get There',
    quickFacts: 'Quick facts',
    depth: 'Depth',
    difficulty: 'Level',
    season: 'Best season',
    waterTemp: 'Water temp',
    visibility: 'Visibility',
    requirements: 'Diver requirements',
    diveType: 'Dive type',
    region: 'Region',
    directions: 'Open in Google Maps',
    cta: 'Dive this site',
    ctaText: 'See it on our calendar or ask us about a trip.',
    seeCalendar: 'See the calendar',
    contact: 'Get in touch',
    notFound: 'That dive site couldn’t be found.',
  },
  travel: {
    title: 'Dive Travel',
    subtitle: 'Planned group tours and fully customized trips, around Taiwan and beyond.',
    aroundTaiwan: 'Around Taiwan',
    international: 'International Dive Tours',
    loadError: 'Couldn’t load destinations',
    ctaTitle: 'Ready to plan your next trip?',
    ctaText:
      'Check upcoming departures on the calendar, or reach out and we’ll help arrange a custom trip.',
    seeCalendar: 'See the Calendar',
    planCustom: 'Plan a custom trip',
  },
  calendar: {
    title: 'Calendar',
    subtitle:
      'Dives, courses, and adventures on the schedule. Tap any event for details and to reserve your spot.',
    all: 'All',
    dives: 'Dives',
    courses: 'Courses',
    thisMonth: 'This month',
    noEvents: 'No events scheduled.',
    noCoursesInRange: 'No courses in this range.',
    loadError: 'Couldn’t load the calendar',
    full: 'This event is full, join the waitlist.',
    toggleDives: 'Toggle dives',
    toggleAdventures: 'Toggle adventures',
    filterCourses: 'Filter courses',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    details: {
      about: 'About this event',
      included: "What's included",
      notIncluded: 'Not included',
      schedule: 'Schedule / itinerary',
      transportation: 'Transportation',
      prerequisites: 'Prerequisites',
      minCert: 'Minimum certification:',
      loggedDives: 'Logged dives:',
    },
  },
  // The gallery, served at /sealife. `photos` is the internal name: the files
  // live in src/content/photos/ and the page is still a wall of photographs.
  photos: {
    title: 'Sea Life',
    subtitle: 'What lives down there — photographed on our own dives, creature by creature.',
    seeMore: 'See more on social',
    follow: 'Follow along for trip recaps, marine life, and behind-the-scenes.',
    comingSoon: 'Photos coming soon',
    jumpTo: 'Jump to a group',
    photoCount: 'photos',
    meta: {
      species: 'Species',
      commonName: 'Also called',
      site: 'Dive site',
      taken: 'Taken',
      depth: 'Depth',
      camera: 'Camera',
      lens: 'Lens',
      settings: 'Settings',
      photographer: 'Photo by',
    },
    close: 'Close',
    prev: 'Previous',
    next: 'Next',
  },
  quiz: {
    title: 'Name that critter',
    subtitle:
      'A photo, a guess, an answer. Every picture in our gallery, shuffled — see how many you can name before we tell you.',
    linkFromPhotos: 'Test yourself →',
    tapToReveal: 'Tap the photo when you have a guess',
    reveal: 'Show me',
    hideAgain: 'Hide',
    next: 'Next photo',
    prev: 'Previous',
    shuffle: 'Shuffle the deck',
    progress: '{n} of {total}',
    seeInGallery: 'See more of these →',
    empty: 'There are no gallery photos to quiz on yet.',
    backToPhotos: 'Back to the gallery',
  },
  // The staff roster, at /team under About Us.
  team: {
    title: 'The Team',
    subtitle: 'Dedication. Expertise. Passion.',
    visitWebsite: 'Visit website →',
    diveWithUs: 'Dive with us',
    diveWithUsText: 'Questions about a course or trip? We’re happy to help.',
    roles: { idc: 'IDC Staff Instructor', instructor: 'Instructor', divemaster: 'Divemaster' },
  },
  // Presented as "The Logbook" at /logbook. `news` is the internal
  // name — the posts live in src/content/news/, one folder each.
  news: {
    title: 'The Logbook',
    subtitle:
      'Conferences, volunteer days, outreach and teaching — what the FunDivers team gets up to between dives.',
    none: 'No news yet. Check back soon.',
    notFound: 'That story couldn’t be found.',
    backToAll: 'All posts',
    // The chip on each card. Keys must match NEWS_KINDS in content/news.ts.
    kinds: {
      conference: 'Conference',
      volunteering: 'Volunteering',
      outreach: 'Outreach',
      education: 'Education',
    },
  },
  footer: {
    blurb: 'Guided dive trips, PADI courses, and the best dive sites across Taiwan and beyond.',
    contact: 'Contact',
    follow: 'Follow',
    more: 'More',
    rights: 'Fun Divers Taiwan. All rights reserved.',
    // {team} is replaced by a link to the staff roster on /about.
    proudly: 'Proudly created by the FunDivers {team} in Taipei, Taiwan',
    team: 'Team',
    openSource: 'Open source',
    openSourceBlurb: 'We proudly develop FunDive, our open-source dive-shop management software.',
    openSourceAria: 'FunDive: our open-source dive-shop software on GitHub',
    fundiveAlt: 'FunDive dive shop management software',
  },
  fundive: {
    title: 'Managed FunDive for dive shops',
    subtitle: 'We build it. You own it.',
    intro: [
      'FunDive is a free and open-source dive shop management platform, built by divers, for divers.',
      'Unlike traditional software platforms, FunDive does not lock your business into a proprietary system. The software is open source, so you have complete transparency and freedom.',
      'If your shop has the technical skills, you can download FunDive, set it up yourself, and manage it independently.',
      'If you would rather focus on running your dive business than on managing cloud infrastructure, we run it for you.',
    ],
    readTheCode: 'FunDive is open source. Read the code.',

    pricingTitle: 'Simple, transparent pricing',
    setupTitle: 'One-time setup',
    setupBlurb: 'We build and configure your complete FunDive environment.',
    monthlyTitle: 'Managed service',
    monthlyBlurb: 'A flat monthly fee for ongoing maintenance, updates and technical support.',
    perMonth: '/month',
    plainPricing: ['No complicated pricing.', 'No hidden fees.', 'No long-term commitment.'],
    guarantees: ['Cancel anytime', 'Restart anytime', 'No cancellation fees', 'No obligation'],
    guaranteeNote:
      'You keep using the service because it is worth it, not because you are locked in.',

    setupIncludesTitle: 'What we set up for you',
    setupIncludesBlurb:
      'For the one-time setup fee we configure your complete production environment:',
    setupIncludes: [
      'GitHub repository',
      'Supabase project and database',
      'Cloudflare account and DNS',
      'Bitwarden password vault',
      'FunDive deployment',
      'Domain and SSL certificate',
      'Environment settings',
      'Initial system configuration',
    ],
    setupIncludesNote:
      'We take care of the technical details, so your shop starts with a properly configured and secure installation.',

    domainTitle: 'Domain setup',
    domain: [
      'A custom domain gives your FunDive installation a professional web address.',
      'If your shop already owns a domain, we will configure it for FunDive.',
      'If you do not own one yet, we are happy to help you buy and set one up. Registration fees are separate, and depend on the name and the registrar.',
      'Your domain stays owned and controlled by your dive shop.',
    ],

    ongoingTitle: 'Ongoing managed service',
    ongoingBlurb: 'For a flat monthly fee we keep your FunDive installation running smoothly.',
    updatesTitle: 'Updates and maintenance',
    updates: [
      'Installing new FunDive releases',
      'Applying security updates',
      'Updating software dependencies',
      'Keeping the services compatible with each other',
      'Helping with configuration changes',
    ],
    supportTitle: 'Technical support',
    supportBlurb: 'When you need help, you talk directly to the team behind FunDive.',
    support: [
      'Technical troubleshooting',
      'Infrastructure questions',
      'Configuration changes',
      'Deployment problems',
      'General FunDive support',
    ],

    ownershipTitle: 'Your infrastructure. Your data. Your control.',
    ownership: [
      'We believe open-source software should give a business freedom, not a new kind of lock-in.',
      'We build your environment for you, but you own it.',
    ],
    ownsTitle: 'Your dive shop keeps control of',
    owns: [
      'Your FunDive application',
      'Your customer and business data',
      'Your GitHub repository',
      'Your Supabase database',
      'Your Cloudflare account',
      'Your Bitwarden vault and secrets',
      'Your domain and SSL certificate',
    ],
    accessNote:
      'During setup we configure everything for you. Afterwards your shop owns and controls these accounts, and simply grants us the access we need to keep them updated.',
    leavingTitle: 'If you ever stop using our managed service',
    leaving: [
      'Your data remains yours',
      'Your infrastructure remains yours',
      'Your accounts remain yours',
      'You can keep running FunDive yourself',
      'You can hand it to another technical provider',
    ],
    leavingSlogans: ['No proprietary platform.', 'No forced migration.', 'No vendor lock-in.'],

    closingTitle: 'Software you actually own',
    closingBlurb:
      'Whether your shop runs FunDive itself or has us manage it, you keep full ownership of your software, your data, and the infrastructure it runs on.',
    closing: [
      'Open-source software',
      'Infrastructure owned by you',
      'Set up properly, by people who dive',
      'Support for the long run',
    ],
    slogan: 'We build it. You own it.',
    ctaTitle: 'Talk to us',
    ctaBlurb: 'Tell us about your shop, and we will work out together what you actually need.',
    emailUs: 'Email us',
  },

  // The dive-shop website service, its own offering separate from running FunDive.
  websites: {
    title: 'Full-service dive shop websites',
    subtitle: 'Fast, modern sites that bring you more divers.',
    intro: [
      'Already have a website that needs improving? We also build and maintain websites for dive shops that want a better presence online.',
      'A dive shop website is often the first impression a customer has, before they book a course, a trip, or a set of gear. We build fast, modern, search-engine-friendly sites designed to bring you more divers.',
    ],
    serviceTitle: 'Website development',
    service: [
      'Design built around search engines',
      'Working with your team on structure, content and branding',
      'Modern layouts that work on any screen',
      'Cloudflare hosting',
      'Fast, secure, low-maintenance deployments',
      'Ongoing improvements and updates',
    ],
    serviceNote:
      'We build them on the same principles as FunDive: reliable infrastructure, modern technology, and full ownership for you.',
    pricingTitle: 'Website pricing',
    fromLabel: 'From',
    perMonth: '/month',
    setupTitle: 'Website setup',
    setupIncludes: [
      'Planning and design, together with you',
      'Development and deployment',
      'Cloud infrastructure setup',
      'Domain and SSL certificate',
      'A structure search engines understand',
    ],
    maintenanceTitle: 'Website maintenance',
    maintenanceIncludes: [
      'Content updates',
      'Technical maintenance',
      'Security updates',
      'Infrastructure management',
      'Ongoing improvements',
      'Support requests',
    ],
    pricingNote:
      'A website needs more back-and-forth and more work specific to your shop, so website projects are priced separately from running FunDive.',
    slogan: 'We build it. You own it.',
    ctaTitle: 'Talk to us',
    ctaBlurb: 'Tell us about your shop and the site you want, and we will map it out together.',
    emailUs: 'Email us',
  },

  // The /services hub: one card per offering, linking to each service's page.
  services: {
    title: 'Our Services',
    subtitle: 'Diving, gear, tours, and the software behind the scenes.',
    gearTitle: 'Gear Sales, Service & Rental',
    gearDesc: 'Buy, rent, or have us service your scuba and freediving gear.',
    cyclingTitle: 'Taipei Cycling Tours',
    cyclingDesc: 'Six hours of fun, sun, exercise, and history on two wheels through Taipei.',
    hikingTitle: 'Taipei Hiking Tours',
    hikingDesc: 'Guided walks up Taipei’s hills to forest trails and unbeatable skyline views.',
    fundiveTitle: 'FunDive for dive shops',
    fundiveDesc: 'Open-source dive-shop management software. We build it, you own it.',
    websitesTitle: 'Website Development',
    websitesDesc: 'Fast, modern, search-friendly websites built for dive shops.',
    learnMore: 'Learn more',
  },

  cycling: {
    title: 'Taipei Cycling Tours',
    subtitle: '6 hours of fun, sun, exercise, and history.',
    intro: [
      'See Taipei the way it is meant to be seen — from the saddle. Our guided tour rolls through the city over a full six hours, mixing easy riding with the stories behind the streets.',
      'It is a relaxed day out: good company, fresh air, a bit of a workout, and a real feel for the city and its history along the way.',
    ],
    highlightsTitle: 'What the day is made of',
    highlights: [
      { label: 'Fun', text: 'A laid-back ride with a friendly guide and good company.' },
      { label: 'Sun', text: 'A full day outdoors, taking in the city in the open air.' },
      { label: 'Exercise', text: 'Six gentle hours on two wheels — moving, not racing.' },
      { label: 'History', text: 'The stories behind Taipei’s streets, temples, and landmarks.' },
    ],
    ctaTitle: 'Ready to ride?',
    ctaText: 'Email us to book your Taipei cycling tour, or to ask about dates and group sizes.',
    emailUs: 'Email us',
  },

  hiking: {
    title: 'Taipei Hiking Tours',
    subtitle: 'Guided walks to Taipei’s best views and trails.',
    intro: [
      'Get out of the city and up into the hills with us. Taipei is ringed by green, and a short climb is often all it takes to swap the streets for birdsong, forest, and a skyline view you won’t forget.',
      'Our guided hikes suit every comfort level — an easy morning out with good company, fresh air, and the stories of the trail along the way.',
    ],
    hikesTitle: 'Where we hike',
    ctaTitle: 'Ready to hit the trail?',
    ctaText: 'Email us to book a guided hike, or to ask about dates and group sizes.',
    emailUs: 'Email us',
  },

  octopus: {
    dismiss: 'Dismiss',
    // What he works through, in this order, four seconds apart. The event line
    // is skipped when nothing is flagged featured — see OctopusPeek.svelte.
    trip: { prompt: 'Don’t see what you want?', cta: 'Build your own trip!' },
    news: { prompt: 'We’ve been out and about.', cta: 'See what we’ve been up to' },
    event: { prompt: 'Coming up next:' },
    fundive: { prompt: 'We build dive-shop software, in the open.', cta: 'Meet FunDive' },
  },

  // Davey's arcade — the easter egg at /arcade, reached by finding him hiding in
  // the footer. He is the shop's mascot; the game is him fending off divers who
  // are not looking where they are going.
  //
  // `taunts` is a rotation, not a random draw: the page walks the list in order
  // so the same line never lands twice running, and the list can be any length
  // in any language as long as it is the same length in all three (text.test.ts).
  arcade: {
    title: 'Davey’s Deep Trouble',
    subtitle:
      'You found Davey, the fun-diving octopus. He is having a day. Ink the drifting divers before they drift into him.',
    hidden: 'Davey the octopus — play his game',
    start: 'Start',
    resume: 'Resume',
    again: 'Play again',
    paused: 'Paused',
    over: 'Out of ink',
    score: 'Score',
    best: 'Best',
    wave: 'Wave',
    lives: 'Lives',
    keys: 'Arrow keys or A/D to turn · W or ↑ to swim · Space to ink · P to pause',
    touch: 'Use the buttons below to turn, swim and ink.',
    left: 'Turn left',
    right: 'Turn right',
    thrust: 'Swim',
    fire: 'Ink',
    pause: 'Pause',
    backHome: 'Back to the surface',
    taunts: [
      'Too many divers around me who can’t control their buoyancy!',
      'Watch out! A group of clueless divers not looking where they are headed!',
      'Fins in my face again. Every single weekend.',
      'Buoyancy check, anyone? Anyone at all?',
      'That is my house you are kicking, thank you.',
      'Eight arms, and not one of them is a safety sausage.',
      'Please. I was here first. By about 300 million years.',
      'Ink is expensive, you know.',
    ],
  },

  buildTrip: {
    title: 'Build Your Own Trip',
    subtitle:
      'Don’t see the trip you’re after? Design your own dive itinerary from any of our sites and we’ll help make it happen.',
    intro:
      'Add dive sites into a day-by-day plan, set how many dives at each, then send it over. We’ll come back with dates, logistics and a price.',
    sitesTitle: 'Pick from our dive sites',
    taiwan: 'South Taiwan',
    international: 'International',
    add: 'Add',
    yourTrip: 'Your itinerary',
    day: 'Day {n}',
    addDay: 'Add a day',
    removeDay: 'Remove day',
    activeDayHint: 'sites you add land here',
    emptyDay: 'No sites yet — add some from the list.',
    emptyTrip: 'Your itinerary is empty. Add a dive site from the list to start planning.',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    yourDetails: 'Your details (optional)',
    name: 'Name',
    email: 'Email',
    dates: 'Preferred dates',
    groupSize: 'Group size',
    notes: 'Anything else we should know?',
    send: 'Send my trip request',
    needSites: 'Add at least one dive site first.',
    unitDays: 'days',
    unitDives: 'dives',
    unitSites: 'sites',
  },

  notFound: {
    code: '404',
    title: 'Page not found',
    text: 'That page has drifted off with the current.',
    back: 'Back to home',
  },
}

/** The shape every language file must have. */
export type Dict = typeof en
