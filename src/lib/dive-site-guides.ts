// Per-dive-site editorial guides for the /sites/<id> detail pages.
//
// Content is a blend of the shop's own catalog copy (from the Supabase
// travel_destinations table, fetched at runtime) and researched reference data
// (marine life, depth, season, water temperature, visibility) compiled from
// public diving sources. Keyed by dive-site id (see dive-sites.data.ts). Static
// so the detail pages render instantly with no extra round-trip; edit + redeploy
// to revise. Not every site is guaranteed to have an entry — the detail page
// degrades gracefully when one is missing.
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
      "Iron House and Iron Reef are twin artificial-reef sites in the sheltered waters off Badouzi Bay, a short boat hop from Badouzi fishing harbour on Taiwan's Northeast Coast. The steel frameworks were sunk in the shape of house skeletons to give juvenile and reef fish somewhere to shelter from roaming predators such as amberjacks. Over time the metal has become encrusted with growth and colonised by dense fish life.\n\nSitting at reef-diving depths and often swept by current, the site suits Advanced Open Water divers with Nitrox, who use the extra bottom time to work the structures slowly and watch predators sweep through the schooling baitfish.",
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
      "Scattered across Badouzi Bay, a loose cluster of sunken fishing vessels has been reclaimed by the sea to form a chain of artificial-reef wrecks. Reached on a short boat run from Badouzi harbour, the boats are spread sparsely rather than stacked together, so a dive often means crossing open sand to move from one hull to the next as marine life builds around each structure.\n\nThe wrecks bottom out at classic wreck depths on the Northeast Coast, so Advanced Open Water certification and Nitrox are recommended to stay comfortable and extend time exploring the corroding hulls, encrusting growth and the fish that shelter in and around them.",
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
      "Crystal Temple Wall is a roughly 100-metre run of reef wall in Badouzi Bay, dropping from about 15 metres at its crown down to 30 metres at its base. Divers follow the face along its length, scanning the ledges, cracks and overhangs that so often shelter Northeast Taiwan's cryptic reef life.\n\nBecause the profile keeps you in the deeper half of the recreational range, the site is best suited to Advanced Open Water divers, with Nitrox helping stretch the dive along the full length of the wall. Visibility peaks in the warm summer months, when the reef life along the face is at its most active.",
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
      "Iron House 2 is a deeper artificial-reef site in Badouzi Bay, where two metal frame structures sit side by side like a pair of squared-off building blocks. The open steelwork has become thoroughly colonised and now teems with fish that pack into the shelter it provides, drawing predators along the Northeast Coast's productive waters.\n\nBecause the structures rest toward the bottom of the recreational range, it is an Advanced Open Water dive with Nitrox, and a Deep specialty is recommended to make the most of the time and to manage the profile safely while working around both blocks.",
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
      "Rainbow Reef lies alongside Keelung Islet, the volcanic islet off the Northeast Coast, about a 20-minute boat ride out. The site is built around two pinnacles draped in colourful whip corals, gorgonians and sea fans that thrive in the current-swept waters around the islet.\n\nAs the boats reach into deeper, more exposed water than the inner bay, expect big fans, schooling fish and the vivid soft growth that gives the reef its name. It is an Advanced Open Water dive with Nitrox, with current and depth around the pinnacles rewarding divers comfortable in more open conditions.",
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
      "Secret Garden is one of Long Dong's signature reef sites, a garden of gorgonian sea fans, whip corals and soft corals draping the rock along Taiwan's Northeast Coast. The profusion of filter-feeding corals here is greater than almost anywhere else on the coastline, making it a must-see for photographers and experienced divers.\n\nExpect classic Long Dong conditions: dramatic volcanic rock, healthy invertebrate life and macro hunting among the fans. Because entry and terrain suit those comfortable with shore diving, it is best reserved for advanced divers with shore experience, ideally in the calmer summer and autumn months.",
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
      'Bat Cave is an excellent site suitable for all experience levels!\n\nThis dive site is best known for its maze of crevices in the rocks. You can swim between many of them, and they can be as much as 10 m tall and 2 m wide. The entrance is relatively easy and starts shallow with a gradual descent. That makes it an ideal site for divers of all levels.',
    belowSurface:
      "You'll find all kinds of nudibranchs, schools of several species of damselfish, trumpetfish, lionfish, and often octopus or cuttlefish. Spring and early summer are good times to spot schools of juvenile fish, including barracuda and squid.",
    aboveSurface:
      'Bat Cave has hundreds of miniature bats living in the mountains. They will come out to feed at dusk.',
    gettingThere:
      'Driving is the easiest way to get there, but there are also buses from Keelung, as well as a nearby train station at Badouzi Bay.',
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
      "Canyons is a scenic Long Dong shore site defined by beautiful slopes, walls and scattered boulders that create a dramatic underwater landscape. The volcanic geology of the Northeast Coast is on full display here, with rock formations divers can explore at varying depths.\n\nThe walls and slopes are cloaked in soft corals and sea fans and shelter the region's rich macro life. Entry and terrain call for advanced divers with shore-diving experience, and conditions are at their best in the calmer summer and autumn window before the winter monsoon returns.",
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
      'Named for the roadside kilometre marker that flags its entry, 82.5 is a classic Long Dong wall dive where interesting creatures and sculpted rock formations reward a slow, careful look. It is one of Taiwan’s best-known macro and nudibranch sites, famed among photographers for the variety of critters found along the wall.\n\nThe reef here carries soft corals and sea fans and hides morays, scorpionfish and countless nudibranchs. Shore entry and wall terrain make it best for advanced divers with shore experience, diving in the calmer summer-to-autumn season.',
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
      'Long Dong Bay is the heart of diving on Taiwan’s Northeast Coast and the largest bay on the coastline. A convenient walk-in ramp makes entry and exit easy in calm conditions, and the sheltered terrain of coral-covered rock and sandy patches suits beginners and advanced divers alike.\n\nHome to hundreds of coral species and a lively mix of reef fish, nudibranchs and macro critters, the bay is one of the region’s most protected and most divable sites. As with all of Long Dong, summer and autumn bring the warmest water and best visibility, while the winter monsoon can make the sea rough.',
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
      'Cauliflower Garden is a boat-accessed wall dive off Yilan, named for the clusters of colourful soft corals that bloom across the reef face like heads of cauliflower. The steep contours give divers a vertical canvas of coral, sponges and crevices to drift along, with the wall dropping into deeper blue water.\n\nCooler, nutrient-rich currents off Northeast Taiwan feed dense soft-coral growth and a busy reef community. The depth and profile make this a site best enjoyed with Advanced Open Water and Nitrox, giving longer, safer time to explore the wall’s colourful terraces and the small critters tucked into them.',
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
      'Turtle Island (Guishan Island) sits about 10 km off Yilan and is the peak of Taiwan’s only active volcano. Its signature dive, the “Milky Way”, lets you descend beside shallow hydrothermal vents that billow sulfur-rich plumes, turning the water a milky turquoise and warming it as bubbles stream up through cracks in the seabed, between roughly 5 and 30 m.\n\nIt is a genuinely rare experience: diving inside a natural undersea hot spring. The vents host the endemic Xenograpsus vent crabs that feed on plankton stunned by the acidic plumes, while the warm Kuroshio-fed waters draw pelagic fish, and sharks are reported near the vents. Visibility in the plume itself can be very low.',
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
      'Cathedral is a boat dive off the Yilan / Northeast Taiwan coast that welcomes divers of every level. Its easygoing profile and sheltered reef make it a comfortable site to explore, yet it has a reputation for always throwing up surprises, from unexpected critters to passing schools riding the current.\n\nSet in the nutrient-rich waters of Northeast Taiwan, the reef supports healthy corals, sea fans and a shifting cast of reef and pelagic visitors. That mix of accessibility and unpredictability makes Cathedral a favourite for relaxed exploration, macro photography and divers building experience across a variety of conditions.',
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
      'The Wan An Jian wreck is the decommissioned ROC Navy vessel ROCS Wan An, sunk off Yilan on Taiwan’s northeast coast as one of the country’s first navy ships turned into an artificial reef. It now lies on its side, the hull thickly encrusted with life and surrounded by dense schools of fish.\n\nThe port side is carpeted in whip corals and black coral, while the deck teems with amberjacks, grunts, fusiliers and damselfish. Newer divers can enjoy the exterior, and experienced divers can explore open sections of the deck. Its depth means this is an Advanced Open Water and Nitrox dive, with Deep certification recommended.',
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
      "Ringed by the warm Kuroshio Current off Taitung, Green Island (Ludao) delivers some of Taiwan's clearest water, with visibility often reaching 30–40 m over dense hard-coral gardens. It's a photographer's dream, home to more than twenty boat and shore sites teeming with reef life.\n\nThe island's signature attraction is the “Big Mushroom”, a Porites coral head roughly 10 m tall and over a thousand years old, ranked among the largest living corals on Earth. Divers also seek out seahorses, sea turtles and even the occasional hammerhead in the cooler winter months, then unwind at the rare Zhaori saltwater hot spring.",
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
      'Remote and rugged, Orchid Island (Lanyu) sits in the open Pacific off Taiwan’s southeast and rewards experienced divers with year-round visibility of 30–50 m and abundant pelagic action along fast drift walls. Bathed by the Kuroshio, it is home to the Tao (Yami) indigenous people, whose flying-fish season and traditional culture give the trip a distinct sense of place.\n\nThe standout dive is the Badai Wreck, a Korean lumber freighter that sank in 1983 and now lies in pieces from about 26 m down to 40 m, its loading mast rising to around 20 m. This is advanced, current-swept diving best suited to confident, deep-certified divers.',
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
      'Lambai Island — better known as Xiaoliuqiu (Liuqiu) off Pingtung — is Taiwan’s only inhabited coral island and its undisputed turtle capital, with a resident population of close to a thousand green sea turtles. Encounters are all but guaranteed, and the gentle reef slopes make it perfect for snorkelers and divers of every level.\n\nWarm tropical water stays above roughly 23 °C even in winter, making Xiaoliuqiu the go-to spot for easy diving all year round. Currents are manageable when timed with the slack tide, and the relaxed drift over coral gardens keeps company with turtles feeding unbothered by visitors.',
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
      "At Taiwan's warm southern tip, Kenting National Park has been a premier dive destination for decades, centred on the sheltered bay of Nanwan and the harbour of Houbihu. Coral cliffs, reefs and pinnacles are plastered with hard and soft corals, leather-coral fields and sun coral, hosting everything from pygmy seahorses on gorgonians to schooling reef fish.\n\nDiving runs year-round, with the best visibility in autumn and winter. A local curiosity is the No. 3 power-plant outflow at Chushuikou, a warm, shallow site popular for training and beloved for its surprisingly rich marine life.",
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
      "The Penghu archipelago in the Taiwan Strait is, quite simply, Taiwan's fish factory — offering the greatest numbers, size and diversity of marine life anywhere in the country. The South Penghu Marine National Park alone counts over 250 recorded fish species, and sites like Wolf East deliver walls of surgeonfish, snapper and sweetlips alongside giant schools of barracuda.\n\nDiving is a summer affair: the northeast monsoon shuts the season down in winter, while July through September brings warm, clear water. Currents run strong and steady, making Penghu a drift-diving mecca best suited to advanced divers (around 50 dives) comfortable deploying a DSMB.",
    highlights: ['Taiwan’s richest fish life', 'South Penghu Marine National Park (250+ fish species)', 'World-class drift diving', 'Barracuda and surgeonfish schools', 'Clear summer visibility'],
    marineLife: ['Yellowtail barracuda', 'Surgeonfish schools', 'Snapper', 'Sweetlips', 'Clownfish', 'Butterflyfish', 'Parrotfish', 'Reef sharks', 'Rays', 'Sea turtles'],
    depthRange: '10–30 m',
    difficulty: 'Advanced (drift, DSMB, ~50 dives)',
    bestSeason: 'April–October (peak July–September)',
    waterTemp: '23–31 °C',
    visibility: '15–30 m',
  },
}
