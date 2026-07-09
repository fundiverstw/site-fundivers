// Per-dive-site editorial guides for the /sites/<id> detail pages.
//
// The prose (overview, below/above the surface, how to get there, diver
// requirements) is the shop's own copy, harvested once from the
// fundiverstw.com/traveldestinations/<slug> pages and frozen here. The
// reference data (marine life, depth, season, water temperature, visibility)
// is researched from public diving sources. Keyed by dive-site id (see
// dive-sites.data.ts). Static so the detail pages render instantly with no
// extra round-trip; edit + redeploy to revise. Not every site is guaranteed to
// have an entry — the detail page degrades gracefully when one is missing.
export type DiveSiteGuide = {
  overview: string
  highlights: string[]
  marineLife: string[]
  depthRange: string
  difficulty: string
  bestSeason: string
  waterTemp: string
  visibility: string
  // The shop's own "above / below the surface" copy. Optional: a site without
  // them falls back to the overview + marine-life chips alone.
  /** What you'll see underwater, in prose. Rendered above the marine-life chips. */
  belowSurface?: string
  /** The site's setting on land — scenery, wildlife, what makes the trip worth it. */
  aboveSurface?: string
  /** Getting to the entry point: driving, bus, train. */
  gettingThere?: string
  /** Certification / experience needed, in the shop's words. Shown in Quick facts,
   *  in preference to the travel_destinations copy. */
  requirements?: string
}

export const DIVE_SITE_GUIDES: Record<string, DiveSiteGuide> = {
  // ── Keelung / Badouzi Bay (boat) ──────────────────────────────────────────
  'iron-house-iron-reef': {
    overview:
      'Within Badouzi Bay hides several intriguing dive sites. Iron House and Iron Reef are 2 separate sites, but house very similar marine life. They were built for the protection of the local fish species. Iron House has 3 of these structures placed about 50m apart, connected by a thin rope. Iron Reef is identical but only has 2.',
    belowSurface:
      'You\'ll often see large schools of batfish, chickenfish, fusiliers, glassfish, and damsels at these sites. If you\'re lucky, you may also see a goliath grouper or a school of 30cm long amberjacks. On occasion, we\'ve also seen a flash of a larger specimen as big as 1m long.',
    aboveSurface:
      'The views of the shore from Badouzi Bay are lovely.',
    gettingThere:
      'The dive boat will depart from Badouzi Harbor. The easiest way to get there is by driving, and plenty of parking is available. There are busses from Keelung that stop nearby as well.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox.',
    highlights: [
      'House-shaped steel artificial reef',
      'Baitfish sheltering from amberjack raids',
      'Encrusted metalwork rich in growth',
      'Short boat ride from Badouzi harbour',
      'Nitrox-friendly reef depths',
    ],
    marineLife: ['Amberjacks', 'Trevally', 'Schooling snappers and grunts', 'Groupers', 'Moray eels', 'Scorpionfish', 'Lionfish', 'Nudibranchs', 'Soft corals'],
    depthRange: '18–30 m',
    difficulty: 'Advanced (AOW + Nitrox)',
    bestSeason: 'May–October',
    waterTemp: '17–30 °C',
    visibility: '5–20 m',
  },
  shipwrecks: {
    overview:
      'Dozens of old fishing vessels, now decommissioned, have been sunk in Badouzi Harbor. Some are larger than others, with the larger ones, you can swim into the cabins and pose for some pictures. If the conditions warrant, and you feel adventurous, we can try to explore the Wreck Museum. This site has 5-6 vessels located within a short distance from each other.',
    belowSurface:
      'Many of the shipwrecks we\'ve encountered in the area are inhabited by goliath grouper and often schools of glass fish.',
    aboveSurface:
      'Located in Badouzi Bay, the views of the shore and ocean are lovely.',
    gettingThere:
      'The dive boat will depart from Badouzi Harbor. The easiest way to get there is by driving, and plenty of parking is available. There are busses from Keelung that stop nearby as well.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox.',
    highlights: [
      'Sunken fishing boats turned artificial reef',
      'Several wrecks spread across the bay',
      'Encrusting growth and resident fish life',
      'Sand-flat crossings between hulls',
      'Nitrox for longer bottom time',
    ],
    marineLife: ['Groupers', 'Moray eels', 'Scorpionfish', 'Lionfish', 'Schooling snappers and grunts', 'Trevally', 'Nudibranchs', 'Cuttlefish', 'Soft corals'],
    depthRange: '20–30 m',
    difficulty: 'Advanced (AOW + Nitrox)',
    bestSeason: 'May–October',
    waterTemp: '17–30 °C',
    visibility: '5–20 m',
  },
  'crystal-temple-wall': {
    overview:
      'Within Badouzi Bay hides several intriguing dive sites. Crystal Temple has a nice easy entry alongside a wall you can use as a reference. There’s also a rope you can hold onto in the case of a strong current. Visibility can be low at times so make sure to stay close to your group and wall.',
    belowSurface:
      'Upon descending, you\'ll run into a school of chickenfish, damselfish, and fusiliers. Following the wall, you\'ll see large Gorgonian sea fans of different colors. You\'ll also find a variety of nudibranchs. Keep your eyes peeled for the occasional goliath grouper.',
    aboveSurface:
      'Views of the coast in Badouzi Bay as well as Elephant Rock from the boat are great!',
    gettingThere:
      'The dive boat will depart from Badouzi Harbor. The easiest way to get there is by driving, and plenty of parking is available. There are busses from Keelung that stop nearby as well.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox.',
    highlights: [
      '100 m wall running 15 m to 30 m',
      'Ledges and overhangs full of life',
      'Wall profile with easy depth control',
      'Best explored on Nitrox',
      'Cryptic critters in the cracks',
    ],
    marineLife: ['Moray eels', 'Scorpionfish', 'Lionfish', 'Nudibranchs', 'Butterflyfish', 'Groupers', 'Schooling snappers', 'Soft corals', 'Whip corals'],
    depthRange: '15–30 m',
    difficulty: 'Advanced (AOW + Nitrox)',
    bestSeason: 'May–October',
    waterTemp: '17–30 °C',
    visibility: '5–20 m',
  },
  'iron-house-2': {
    overview:
      'A collection of artificial reefs, these structures are always full of life. Covered in both hard and soft corals and surrounded by schools of fish, there is always something to see. Photographers especially love this site due to the variety of things to be seen, from nudibranchs to goliath groupers!',
    belowSurface:
      'The structures are covered with whip corals. There are boxfish, chickenfish, and fusiliers. Lobsters and goliath groupers have been found here.',
    aboveSurface:
      'Since it is located between the main Taiwan island and Turtle Island, the views of both are beautiful.',
    gettingThere:
      'We will board the dive boat at Aodi Fishing Harbor. Driving is the easiest way to get there and parking is available. There are busses that get there from both Keelung and Taipei, but the distance and time required makes it not worth it.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox (Deep Certification Recommended).',
    highlights: [
      'Twin block-shaped metal reef structures',
      'Dense fish aggregations',
      'Deeper artificial-reef profile',
      'Deep specialty recommended',
      'Predator action on schooling fish',
    ],
    marineLife: ['Amberjacks', 'Trevally', 'Groupers', 'Moray eels', 'Scorpionfish', 'Lionfish', 'Schooling snappers and grunts', 'Nudibranchs', 'Soft corals'],
    depthRange: '24–35 m',
    difficulty: 'Advanced (AOW + Nitrox, Deep recommended)',
    bestSeason: 'May–October',
    waterTemp: '17–30 °C',
    visibility: '5–20 m',
  },
  'rainbow-reef': {
    overview:
      'The mooring line takes you down to the highest point of the southern pinnacle. You can explore one loop around the southern pinnacle on the first dive, and explore one loop around the northern pinnacle on the second dive. Keep an eye out for goliath groupers, they are often looming in the shadows.',
    belowSurface:
      'Whip corals here come in yellow, white, and purple. They are long and plentiful! Following down the line, there are often baby filefish camouflaging to the rope color. At the bottom of the rope there is often a large amount of chickenfish surrounding you, creating a mesmerizing wall. There are several types of nudibranchs, boxfish, pufferfish and much more to keep you entertained.',
    aboveSurface:
      'The views of Keelung Island are beautiful as well as the view of the northeast coast of Taiwan from the sea.',
    gettingThere:
      'The dive boat will depart from Badouzi Harbor. The easiest way to get there is by driving, and plenty of parking is available. There are busses from Keelung that stop nearby as well.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox.',
    highlights: [
      'Twin pinnacles off Keelung Islet',
      'Colourful whip corals and sea fans',
      'Big gorgonian fans in the current',
      'Schooling fish over the pinnacles',
      '20-minute boat ride from shore',
    ],
    marineLife: ['Gorgonian sea fans', 'Whip corals', 'Soft corals', 'Trevally', 'Schooling snappers and grunts', 'Frogfish', 'Moray eels', 'Nudibranchs', 'Scorpionfish'],
    depthRange: '18–32 m',
    difficulty: 'Advanced (AOW + Nitrox)',
    bestSeason: 'May–October',
    waterTemp: '17–30 °C',
    visibility: '5–20 m',
  },

  // ── Northeast Coast / Long Dong (shore) ───────────────────────────────────
  'secret-garden': {
    overview:
      'Secret Garden is a favorite among local divers. With its garden of sea fans and whip corals, among other soft corals. Giant groupers, batfish, trumpetfish, lionfish, and porcupine fish resting in barrel sponges are common sightings. It is truly a must-see site on the Northeast Coast of Taiwan.',
    belowSurface:
      'Goliath groupers, batfish, frogfish, pygmy seahorses, and sea turtles can be spotted on rare occasions! Lionfish, porcupine pufferfish, and burrfish are a more common sighting resting in barrel sponges.',
    aboveSurface:
      'A lovely park with several art installations and beautiful views of the coastline and mountains.',
    gettingThere:
      'Driving is the easiest way to get there but there are also busses from Keelung, as well as a nearby train station at Badouzi Bay.',
    requirements: 'Advanced Certified with shore diving experience.',
    highlights: ['Dense gorgonian sea fans and whip corals', 'Vibrant soft-coral gardens', 'Excellent macro photography', 'Dramatic Northeast Coast rock terrain'],
    marineLife: ['Sea fans (gorgonians)', 'Soft corals', 'Nudibranchs', 'Moray eels', 'Lionfish', 'Scorpionfish', 'Wrasses', 'Shrimp and crabs'],
    depthRange: '8–20 m',
    difficulty: 'Advanced (shore-diving experience)',
    bestSeason: 'April–November',
    waterTemp: '18–29 °C',
    visibility: '8–20 m',
  },
  'bat-cave': {
    overview:
      'This dive site is best known for its maze of crevices in the rocks. You can swim between many of them and can be as much as 10m tall and 2m wide. The entrance is relatively easy and starts shallow with a gradual descent. That makes it an ideal site for divers of all levels.',
    belowSurface:
      'You\'ll find all kinds of nudibranchs, schools of several species of damselfish, trumpetfish, lionfish, and often octopus or cuttlefish. Spring and early summer are good times to spot schools of juvenile fish, including Barracuda and Squid.',
    aboveSurface:
      'Bat Cave has hundreds of miniature bats living in the mountains. They will come out to feed at dusk.',
    gettingThere:
      'Driving is the easiest way to get there but there are also busses from Keelung, as well as a nearby train station at Badouzi Bay.',
    requirements: 'All levels of divers.',
    highlights: ['Suitable for all levels', 'A maze of swim-through rock crevices', 'Easy, shallow entry with a gradual descent', 'Great for training and fun dives', 'Reliable macro life'],
    marineLife: ['Nudibranchs', 'Damselfish', 'Trumpetfish', 'Lionfish', 'Octopus', 'Cuttlefish', 'Juvenile barracuda (spring–early summer)', 'Squid'],
    depthRange: '5–16 m',
    difficulty: 'All levels',
    bestSeason: 'April–November',
    waterTemp: '18–29 °C',
    visibility: '8–20 m',
  },
  canyons: {
    overview:
      'Canyons is a lovely site with two sides to explore. On the one side, a shear wall and boulder field, with lots of soft coral and schools of fish. On the other side, a gentle slope covered in ribbon coral and whip coral.',
    belowSurface:
      'Cuttlefish, Octopus, and Juvenile Amberjacks are all commonly seen, as well as a large variety of Nudibranchs.',
    aboveSurface:
      'Beautiful views of the coastline and Bitou Cape are the highlights at this site.',
    gettingThere:
      'Driving is pretty much the only way to get there. There are about 6-8 spots available at the site but cars can also be parked along the road a bit further down from the site.',
    requirements: 'Advanced Open Water Divers with shore diving experience.',
    highlights: ['Dramatic slopes and walls', 'Boulder swim-throughs', 'Soft coral and sea fan growth', 'Sculpted volcanic rock formations'],
    marineLife: ['Sea fans (gorgonians)', 'Soft corals', 'Nudibranchs', 'Moray eels', 'Lionfish', 'Scorpionfish', 'Wrasses', 'Shrimp and crabs'],
    depthRange: '8–22 m',
    difficulty: 'Advanced (shore-diving experience)',
    bestSeason: 'April–November',
    waterTemp: '18–29 °C',
    visibility: '8–20 m',
  },
  '82-5': {
    overview:
      'Found at its kilometer marker, 82.5 is a wall with lots of nooks and crannies to explore. It is also one of the few sites in Taiwan where the "Pikachu" nudibranch is often spotted!',
    belowSurface:
      'You\'ll find all sorts of nudibranchs, schools of damselfish, and white and purple colored branch coral. There\'s often a chance of seeing amberjacks, flying gurnards, and schools of squid.',
    aboveSurface:
      'Beautiful views of the cliffs and ocean are highlights at this site.',
    gettingThere:
      'Driving is pretty much the only way to get there since there aren\'t any busses that stop nearby. Parking is available but is limited on busy days.',
    requirements: 'Advanced Open Water Divers with shore diving experience.',
    highlights: ['Roadside marker entry point', 'Renowned nudibranch and macro wall', 'Interesting rock formations', 'Photographer favourite'],
    marineLife: ['Nudibranchs', 'Moray eels', 'Scorpionfish', 'Lionfish', 'Sea fans (gorgonians)', 'Soft corals', 'Shrimp and crabs', 'Wrasses'],
    depthRange: '5–20 m',
    difficulty: 'Advanced (shore-diving experience)',
    bestSeason: 'April–November',
    waterTemp: '18–29 °C',
    visibility: '8–20 m',
  },
  'long-dong-bay': {
    overview:
      'Long Dong Bay is divided into 4 separate sites. Number 4, located next to Hemei Elementary School, is the most popular and has the most variety of features to explore. The Dragon\'s Ridge has an assortment of fish schools. Its crevices always hide sea creatures of all kinds. It\'s handy to carry a flashlight to illuminate the creatures within.',
    belowSurface:
      'Search for moray eels, banded shrimp, clownfish, and schools of yellow-striped snappers and pufferfish. In the shallows, you\'ll find schools of sergeant majors, barracudas, and bigeyes. Just 5m deep, you can spot a large colony of brain coral at the entrance to the gully. Early in the season, squid farms (large bundles of bamboo) can be seen and large squid often visit.',
    aboveSurface:
      'There are hiking trails and nice viewpoints in the area. It is also a popular area for rock climbers, snorkelers, and picnickers.',
    gettingThere:
      'Driving is the easiest way to get there. Parking is available but is limited on busy days. Buses from Keelung also stop along the main road.',
    requirements: 'All levels.',
    highlights: ['Easy walk-in ramp entry', 'Sheltered, protected bay', 'Suitable for all levels', 'Abundant coral and reef fish'],
    marineLife: ['Nudibranchs', 'Moray eels', 'Lionfish', 'Scorpionfish', 'Wrasses', 'Shrimp and crabs', 'Soft corals', 'Sea fans (gorgonians)', 'Occasional sea turtles'],
    depthRange: '5–18 m',
    difficulty: 'All levels',
    bestSeason: 'April–November',
    waterTemp: '18–29 °C',
    visibility: '8–20 m',
  },

  // ── Yilan (boat) ──────────────────────────────────────────────────────────
  'cauliflower-garden': {
    overview:
      'The bottom landscape of this site is layered like terraces along the wall. Attached to these terraces are thousands of white, yellow, purple, and pink soft corals like a garden. The contrasting colors and lighting conditions make it great for photography and videography. The final portion of the dive is along a shear wall with a variety of sea life.',
    belowSurface:
      'We have seen sea snakes there on several occasions. If you see a flurry of butterflyfish nibbling at the bottom, it is often microscopic eggs they\'re feasting on. There are often a variety of nudibranchs species to scout for.',
    aboveSurface:
      'The view of the coastline and rock formations are great from the boat',
    gettingThere:
      'We will board the dive boat at Aodi Fishing Harbor. Driving is the easiest way to get there and parking is available. There are busses that get there from both Keelung and Taipei, but the distance and time required makes it not worth it.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox.',
    highlights: ['Vertical wall draped in cauliflower-shaped soft corals', 'Vivid coral colours and reef textures', 'Nitrox extends bottom time on the wall', 'Nudibranch and macro hunting in the crevices'],
    marineLife: ['Colourful soft corals', 'Sea fans and whip corals', 'Nudibranchs', 'Moray eels', 'Reef fish and damselfish', 'Wrasse', 'Schooling fusiliers', 'Crustaceans'],
    depthRange: '18–35 m',
    difficulty: 'Advanced (AOW + Nitrox)',
    bestSeason: 'April–October',
    waterTemp: '18–29 °C',
    visibility: '10–20 m',
  },
  'turtle-island': {
    overview:
      'Located at the head of the turtle shaped island is the Milky Way, an exciting dive among sulfurous vents spewing out hot bubbles from the ocean bottom. You can feel the warmth as you swim near. It feels like you\'re in an alien environment where only a specific crab and polyp species have evolved to survive in this harsh habitat. After the Milky Sea, we will dive at the Turtle\'s Tail. It\'s a stunning reef with all types of fish, coral, and nudibranchs. It\'s also a great place to treasure hunt, as people doing water sports at the surface tend to drop things often!',
    belowSurface:
      'The Jorunna rubescens nudibranch is often spotted at the Tail. We\'ve only seen them at Turtle Island. There\'s an enormous patch of anemones and clownfish. Along the rocky slope, there are an abundance of sergeant majors swimming among the rose coral. Also, keep an eye out for dolphins while on the boat, which are often spotted in the area.',
    aboveSurface:
      'Viewing the Milky Way hot spring, with it\'s cloudy white color, is a highlight of the trip. The views of the island as well as the views back towards the Taiwan mainland are beautiful as well.',
    gettingThere:
      'We will board the dive boat at Aodi Fishing Harbor. Driving is the easiest way to get there and parking is available. There are busses that get there from both Keelung and Taipei, but the distance and time required makes it not worth it.',
    requirements: 'Open Water Divers.',
    highlights: ['Diving inside an active underwater hot spring', 'Milky turquoise “Milk Sea” sulfur plumes', 'Endemic Xenograpsus vent crabs', 'Warm volcanic bubbles rising from the seabed', 'Sharks reported near the vents'],
    marineLife: ['Xenograpsus vent crabs', 'Reef sharks (reported near vents)', 'Schooling reef fish', 'Jacks and trevally', 'Moray eels', 'Pelagic fish drawn by the Kuroshio', 'Damselfish', 'Crustaceans'],
    depthRange: '5–30 m',
    difficulty: 'Open Water (surge near the vents)',
    bestSeason: 'May–October',
    waterTemp: '18–29 °C (warmer near vents)',
    visibility: 'Variable; often low in the sulfur plume',
  },
  cathedral: {
    overview:
      'The Longmen Nuclear Power Plant was completed in 2014 but was halted due to political, legal, and regulatory delays. Currently used purely as an artificial reef, it draws scuba Divers and freedivers alike who want to explore the roughly 15m wide, 8m tall outlet chamber at the end of the pipeline. Taiwanese call this the most expensive dive site in the world.',
    belowSurface:
      'On the inside, there are whip corals hanging off the walls, soft corals sticking to the bottom, lobsters hiding in the walls, and a school of ax fish looming in the entrances. On the exterior, you\'ll be guaranteed to see nudibranchs, porcupine pufferfish, and hermit crabs. Plus, wonderful surprises such as batfish, octopi, and cuttlefish.',
    aboveSurface:
      'The views of the coastline and ocean from the boat are lovely.',
    gettingThere:
      'We will board the dive boat at Aodi Fishing Harbor. Driving is the easiest way to get there and parking is available. There are busses that get there from both Keelung and Taipei, but the distance and time required makes it not worth it.',
    requirements: 'All levels.',
    highlights: ['Suitable for all certification levels', 'Reef full of surprises and passing schools', 'Sea fans and soft corals', 'Great for relaxed exploration and macro'],
    marineLife: ['Schooling reef fish', 'Jacks and trevally', 'Moray eels', 'Nudibranchs', 'Soft corals', 'Sea fans and whip corals', 'Wrasse', 'Damselfish'],
    depthRange: '10–25 m',
    difficulty: 'All levels',
    bestSeason: 'April–October',
    waterTemp: '18–29 °C',
    visibility: '10–20 m',
  },
  'wan-an-jian-navy-wreck': {
    overview:
      'For those who are less experienced, there is plenty to take in on the exterior of the wreck. But for those who are more experienced, you can explore several open portions of the deck! It can be a challenging dive, but it\'s well worth the effort!',
    belowSurface:
      'Laying on its side, the port side is covered in whip corals. On the deck side is a multitude of fish varieties. There have been schools of amberjacks, chickenfish, fusiliers, damselfish, and much more! It has become a haven for life for Divers to marvel!',
    aboveSurface:
      'The view of the northeast coast of Taiwan as well as the view of Turtle Island from the boat are beautiful.',
    gettingThere:
      'We will board the dive boat at Aodi Fishing Harbor. Driving is the easiest way to get there and parking is available. There are busses that get there from both Keelung and Taipei, but the distance and time required makes it not worth it.',
    requirements: 'Advanced Open Water Divers with Enriched Air Nitrox (Deep Certification Recommended).',
    highlights: ['A navy ship sunk as an artificial reef', 'Huge wreck teeming with schooling fish', 'Port side blanketed in whip and black corals', 'Open deck sections for experienced divers', 'Deep + Nitrox recommended for bottom time'],
    marineLife: ['Amberjacks', 'Chicken grunts', 'Fusiliers', 'Damselfish', 'Whip corals', 'Black coral', 'Moray eels', 'Schooling jacks and trevally', 'Nudibranchs'],
    depthRange: '25–40 m',
    difficulty: 'Advanced (AOW + Nitrox, Deep recommended)',
    bestSeason: 'April–October',
    waterTemp: '18–29 °C',
    visibility: '10–20 m',
  },

  // ── Outlying islands & south ──────────────────────────────────────────────
  'green-island': {
    overview:
      'Green Island is a volcanic island with stunning rock formations both above and below the water. Surrounded by coral reefs and pinnacles, there is no shortage of amazing divesites teaming with a rich variety of marine species. Touring the island by motorbike is a must-do for all who visit. See if you can spot any deer on your drive!',
    belowSurface:
      'The best feature of Green Island is its crystal-clear visibility! The soft coral cover here is spectacular to watch as a variety of polyps swaying back and forth as the surge goes in and out. Titan triggerfish is a common sighting, so keep your distance, especially during mating season. Some common species to look out for include clownfish, butterflyfish, parrotfish, cuttlefish, turtles, and rays.\n\nSpecial Dive Sites:\n\nShi Lang – An underwater post office has a mailbox shaped like a seahorse at 12m. You can use it to send mail to someone.\n\nShi Lang also has three 4-story tall cubed steel frames at 30m, often with batfish swimming around the top of the structures at approximately 15m. You can find all kinds of creatures within the structures, big and small.',
    aboveSurface:
      'White Terror Memorial Park - After the prison was built in 1951, many political dissidents were imprisoned on Green Island\n\nLittle Great Wall - A short hike along a ridge brings you to a pagoda on a beautiful view of the ocean and Sleeping Beauty Rock\n\nZhaori Hot Springs - The springs are fed by seawater and underground water heated by the volcanic lava of Green Island. This is one of only three saltwater hot springs in the world.\n\nLüdao Lighthouse - The lighthouse was built and went into operation in 1939 after the SS President Hoover hit the island\'s reef on 11 of December 1937 en route from Japan to the Philippines.\n\nSleeping Beauty Rock - The rock is a residual volcanic wall. The rock was formed slowly after different parts of the crater eroded by sea and wind over time. The rock was named due to its shape resembling a Sleeping Beauty.\n\nChaikou Snorkeling Area - Chaikou is famous for its magnificent stony coral landscape. It is suitable for anyone who wants to try snorkeling.',
    gettingThere:
      'Green Island can be accessed by ferry from Taitung port on the east coast. You must pre-book your ticket. You can do that online. To get to Taitung, you can take the train from Taipei to Taitung. Try to take the express train if possible; it’ll only take about 4 hours. Flights to Taitung are also available from Songshan Airport in Taipei City. Two domestic carriers are available to you, Mandarin Airlines and Uni Air. You can also purchase a separate flight from Taitung to Green Island. From Taitung, you need to take a short 50-minute ferry or an even shorter flight. Both of these flights must be bought well in advance to confirm a seat as seats are limited. CAUTION: Ferries and Flights can be canceled due to weather and wave conditions. Keep an eye on the forecast and be prepared for cancelations!',
    requirements: 'Open water diver (Advanced certification and SMB are recommended for all boat diving).',
    highlights: ['The 1,000-year-old “Big Mushroom” coral', 'Exceptional 30–40 m visibility', 'Zhaori seawater hot spring', 'Winter hammerhead chances', '20+ Kuroshio-fed dive sites'],
    marineLife: ['Green sea turtles', 'Seahorses', 'Hard corals (Porites, tube coral)', 'Scalloped hammerhead sharks (winter)', 'Damselfish', 'Butterflyfish', 'Moray eels', 'Nudibranchs'],
    depthRange: '5–35 m',
    difficulty: 'Intermediate',
    bestSeason: 'April–September',
    waterTemp: '20–27 °C',
    visibility: '20–40 m',
  },
  'orchid-island': {
    overview:
      'Orchid Island is located east of Kenting. It is a lush green island dominated by mountains. The island is run by the local indigenous tribe called the Tao people. They are known for their uniquely painted canoes and their traditional attire. Its crystal-clear water resembles glass, perfect for photography.',
    belowSurface:
      'A tradition of the locals is to catch flying fish from February to May. Therefore, certain dive sites will be accessible only to the locals. Unfortunately, Badai Wreck is within that area. If you’re aiming to check out the wreck, you’d better go in June or dive with Blue Ocean House, owned by a local. The hard coral here is stunning and its underwater landscapes are intriguing.\n\nSpecial Dive Site:\n\nBadai Wreck – Has a massive dual mast that is awesome for photo taking.',
    aboveSurface:
      'When you’re not diving, you can scooter around exploring the island’s intriguing landscape. Watch out for goats as they aimlessly wander onto the roads. There are a few shallow caves you can walk into, and a lighthouse at the top of the middle road that has a nice view of the ocean.\n\nJikarahem – There, you can find a large rock on the side of the road. A portion of the rock resembles a dragon’s head if you look at it from the right angle.\n\nDongqing Secret Realm – A circular rock formation resembling Stargate.',
    gettingThere:
      'Orchid can be accessed by ferry from either the Houbihu Dock in Kenting, or the Taitung port on the east coast. You must pre-book your ticket. You can do that online. To get to Kenting, you can take the HSR and coach bus from Zuoying HSR Station or a coach bus from Taipei to Kenting. To get to Taitung, you can take the train from Taipei to Taitung. Try to take the express train if possible; it’ll only take about 4 hours. Flights to Taitung are also available from Songshan Airport in Taipei City. Two domestic carriers are available to you, Mandarin Airlines and Uni Air. You can also purchase a separate flight from Taitung to Green Island. From Taitung, you need to take a short 50-minute ferry or an even shorter flight. Both of these flights must be bought well in advance to confirm a seat as seats are limited. CAUTION: Ferries and Flights can be canceled due to weather and wave conditions. Keep an eye on the forecast and be prepared for cancelations!',
    requirements: 'Open water diver (Advanced and Deep certification and SMB are recommended for all boat diving).',
    highlights: ['The deep Badai Wreck (26–40 m)', '30–50 m year-round visibility', 'Pelagics and drift walls', 'Tao/Yami indigenous culture', 'Uncrowded, advanced diving'],
    marineLife: ['Trevally and jacks', 'Barracuda', 'Tuna', 'Sea turtles', 'Reef sharks', 'Napoleon wrasse', 'Hard and soft corals', 'Anthias', 'Groupers', 'Fusiliers'],
    depthRange: '10–40 m',
    difficulty: 'Advanced (deep / current)',
    bestSeason: 'March–September',
    waterTemp: '22–29 °C',
    visibility: '30–50 m',
  },
  'lambai-island': {
    overview:
      'Lambai Island is located off the southwestern coast of Taiwan, near Kaohsiung. Being guaranteed to be able to see turtles is a huge draw to Lambai Island, also known as Xiao Liu Qiu in Chinese. With amazing coral reefs and several shipwrecks to explore around the island, it’s a great choice for local and international Divers alike.',
    belowSurface:
      'Besides the countless sea turtles, wrecks are also plentiful. With its 10-20m visibility, it’s fascinating to survey every nook and cranny. It’s common to see blue-spotted sting rays, octopus, and a wide array of nudibranchs. Look out for barracuda schools, cuttlefish, mantis shrimp, pufferfish, and the usual coral reef fish.\n\nSpecial Dive Sites:\n\nBroken Wreck – A shallow 20m deep wreck that is broken in half. This site has a wide variety of marine life every time we go.\n\nShipai / Ah Ji Bai Wrecks – Both are fully intact, 30m deep wrecks standing perfectly vertical.',
    aboveSurface:
      'Lambai Island is known for its all-you-can-eat barbecue restaurants. Best to book ahead of time to avoid waiting in line.\n\nVase Rock – This is the symbol of the island. It’s a limestone rock that has been eroded over time by the waves to resemble a vase with a bouquet of flowers coming out\n\nBeauty Cave – This is a labyrinth of paths that bring you between the limestone coral as it has cracked and separated over time.\n\nBuddhist temples – One of the highest per-capita concentration of temples in all of Taiwan.\n\nBeauty Beach – A fantastic place to soak up the sun, snorkel or freedive\n\nBlack Devil Cave – A shallow cave with an intriguing piece of history behind it',
    gettingThere:
      'The quickest way to get to Lambai Island would be to take the HSR (High-Speed Rail) to Kaohsiung(Zuoying HSR Station), the express is approximately 1.5 hours. Then, transfer to a coach bus, about 45 minutes, or taxi, about 30 minutes, to Donggang Ferry Terminal. There are a few ferry companies to choose from. We’ve always used DongLiu, the blue one on the right side. As of 2025, tickets are $450TWD for adults, and $225TWD for 3 to 12-year-old children, for a 2-way ticket. They’ll give you your return ticket, so make sure not to lose it or you’ll need to purchase a new ticket back.',
    requirements: 'Open water diver (Advanced certification and SMB are recommended for all boat diving).',
    highlights: ['Near-guaranteed green turtle encounters', 'Warm water and easy year-round diving', 'Taiwan’s only inhabited coral island', 'Gentle reef slopes for all levels', 'Great snorkelling too'],
    marineLife: ['Green sea turtles', 'Hawksbill sea turtles', 'Hard corals', 'Parrotfish', 'Butterflyfish', 'Moray eels', 'Sea urchins', 'Reef fish schools', 'Nudibranchs'],
    depthRange: '5–25 m',
    difficulty: 'Beginner',
    bestSeason: 'Year-round (best spring & autumn)',
    waterTemp: '23–29 °C',
    visibility: '15–30 m',
  },
  kenting: {
    overview:
      'Popular among locals as the top vacation spot where they can enjoy the many white sand beaches, plentiful food options, and partying. For Divers, the sites offer interesting features such as pinnacles, walls, ravines, and reefs, with something to see for everyone!',
    belowSurface:
      'Kenting is home to some beautiful coral reefs, walls, and undersea pinnacles.\n\nHiding inside the vibrant coral are smaller fish of all kinds. You’re bound to see blue-spotted sting rays, green sea turtles, silver sweetlips, cuttlefish, and octopus. Keep an eye out for giant trevally; they’ll swoop in for a second and disappear just as quickly.',
    aboveSurface:
      'On Land Attractions:\n\nKenting Night Market – About a 1km stretch of road for tourists to enjoy a wide array of food vendors, restaurants, and shopping every night\n\nNanwan Beach – About a 1km stretch of beach to soak up the sun along with a variety of Fun beach activities for your entertainment.\n\nEluanbi Lighthouse – Located right near the southernmost tip of Taiwan, you can explore the lighthouse and take a short stroll to the point to see the view as well.',
    gettingThere:
      'The quickest way to get to Kenting would be to take the HSR (High-Speed Rail) to Kaohsiung(Zuoying HSR Station), express is approximately 1.5 hours and transfer to a coach bus(follow signs in the station). Look at the schedule and make sure to take the express, approximately 1.5 hours, as the other bus will make many stops and extend your time up to 1 hour longer. Make sure to know where your hotel stop is, as Kenting is about a 20-minute drive from the dock in Hengchun. Taxis or Shared Taxis are another option but the price will be much higher.',
    requirements: 'Open water diver (Advanced certification and SMB are recommended for all boat diving).',
    highlights: ['Coral-plastered reefs and pinnacles at Nanwan', 'Shallow Houbihu shore diving', 'The warm Chushuikou outflow site', 'Year-round diving, best autumn/winter', 'Pygmy seahorses on gorgonian fans'],
    marineLife: ['Hard and soft corals', 'Gorgonian sea fans', 'Pygmy seahorses', 'Leather corals', 'Sun coral (Tubastraea)', 'Butterflyfish', 'Anemonefish', 'Parrotfish', 'Moray eels', 'Nudibranchs'],
    depthRange: '5–30 m',
    difficulty: 'Beginner to Intermediate',
    bestSeason: 'Year-round (best autumn–winter)',
    waterTemp: '22–30 °C',
    visibility: '5–25 m',
  },
  penghu: {
    overview:
      'You can do day tours from Magong if you’re in the area, but they will only go to the nearby sites. If you have the time, you can do the 3-day package tour with 8 boat dives. You’ll stay at Jiang Jun Dao and do day trips to the national park for 3 days. These protected, remote islands inhabit a wide range of species of fish seen nowhere else in Taiwan.',
    belowSurface:
      'The highlight is the school of Giant, Yellow-Fin Barracuda and a massive patch of purple staghorn coral at Lavender Forest. You can also see schools of fusiliers, snappers, batfish, and bannerfish or Moorish idols. If you’re lucky, you’ll also get visits from parrotfish, a guitar shark, and giant trevally.',
    aboveSurface:
      'Twin Hearts of Stacked Stones – One of the hundreds of well-preserved tidal zone stone fish weirs constructed by the Indigenous Taokas people form a trap that resembles a flying heart.\n\nLittle Taiwan – It is a wave-cut platform in Cimei Township. Visible at low tide, the platform is shaped like the island of Taiwan.\n\nBasalt Rock Formations – Penghu is known for its basalt rock formations resulting from volcanic activity. They are some of the most spectacular in the world.',
    gettingThere:
      'You can fly using the local airlines Uni Air and Mandarin Airlines from Songshan Airport in Taipei City or take a ferry from Chiayi to Magong. For the 3-day package tour, you‘ll be picked up from the Magong Harbor in a speedboat and everything else will be taken care of for you by the shop staff.',
    requirements: 'Advanced diver with 50 dives experience and able to use a DSMB.',
    highlights: ['Taiwan’s richest fish life', 'South Penghu Marine National Park (250+ fish species)', 'World-class drift diving', 'Barracuda and surgeonfish schools', 'Clear summer visibility'],
    marineLife: ['Yellowtail barracuda', 'Surgeonfish schools', 'Snapper', 'Sweetlips', 'Clownfish', 'Butterflyfish', 'Parrotfish', 'Reef sharks', 'Rays', 'Sea turtles'],
    depthRange: '10–30 m',
    difficulty: 'Advanced (drift, DSMB, ~50 dives)',
    bestSeason: 'April–October (peak July–September)',
    waterTemp: '23–31 °C',
    visibility: '15–30 m',
  },

  // ── International ─────────────────────────────────────────────────────────
  // Malapascua has no travel_destinations page on the marketing site, so unlike
  // every entry above, this copy is ours, not the shop's. Worth a rewrite.
  malapascua: {
    overview:
      'Malapascua is a small island off the northern tip of Cebu in the Philippines, and one of the only places in the world where thresher sharks are seen almost every morning of the year. They rise from the deep to Monad Shoal, a sunken island plateau, to be cleaned by wrasse — a ritual worth getting up before dawn for.\n\nThe island itself is barely 2.5 km long, with white sand beaches and no cars. Beyond the sharks, the surrounding reefs, walls and wrecks hold some of the best macro diving in the region.',
    belowSurface:
      'Thresher sharks patrol the cleaning stations at Monad Shoal at first light, joined by devil rays and eagle rays. Kimud Shoal draws schooling hammerheads in season, and Gato Island offers a shark-filled tunnel, whitetip reef sharks and banded sea kraits.\n\nThe macro life is exceptional: mandarinfish, pygmy seahorses, frogfish, blue-ringed octopus, flamboyant cuttlefish, and dozens of nudibranch species.',
    aboveSurface:
      'Malapascua is a slow, walkable island of white sand and palm trees, with no cars and a single main beach. Bounty Beach is the place to end the day, and the fishing villages around it are an easy stroll from the dive shops.',
    gettingThere:
      'Fly to Cebu, then travel roughly four hours north by road to Maya Port, where a short banca boat ride crosses to the island. Transfers are arranged as part of our tour package.',
    requirements: 'Advanced Open Water with Nitrox certification.',
    highlights: [
      'Daily thresher shark encounters at Monad Shoal',
      'Hammerheads in season at Kimud Shoal',
      'Gato Island shark tunnel and sea snakes',
      'World-class macro and muck diving',
      'Car-free white sand island',
    ],
    marineLife: ['Thresher sharks', 'Whitetip reef sharks', 'Scalloped hammerheads (seasonal)', 'Devil and eagle rays', 'Mandarinfish', 'Pygmy seahorses', 'Frogfish', 'Blue-ringed octopus', 'Flamboyant cuttlefish', 'Nudibranchs'],
    depthRange: '5–30 m',
    difficulty: 'Advanced (AOW + Nitrox)',
    bestSeason: 'Year-round (best October–May)',
    waterTemp: '26–30 °C',
    visibility: '15–30 m',
  },
}
