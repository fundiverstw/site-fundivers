// Question bank for Wreck Maze, the dive-trivia dungeon crawler.
//
// In the spirit of Encarta's MindMaze: every question teaches something, so
// each carries a short explanation shown after you answer, right or wrong.
//
// `answers[0]` is always the correct one; the game shuffles them when asking.
// Keep the answer set plausible, a giveaway wrong option is a wasted question.

export type Category = 'Physics' | 'Physiology' | 'Equipment' | 'Safety' | 'Marine Life' | 'Taiwan'

export type Question = {
  category: Category
  q: string
  answers: [string, string, string, string]
  explain: string
}

export const QUESTIONS: Question[] = [
  // ── Physics ───────────────────────────────────────────────────────────────
  {
    category: 'Physics',
    q: 'At what depth in seawater is the ambient pressure twice what it is at the surface?',
    answers: ['10 metres', '5 metres', '20 metres', '33 metres'],
    explain:
      'Every 10 m of seawater adds 1 bar. At 10 m you are at 2 bar absolute, double the surface pressure.',
  },
  {
    category: 'Physics',
    q: 'A flexible 4-litre bag of air is taken from the surface down to 30 m. What is its volume?',
    answers: ['1 litre', '2 litres', '3 litres', '4 litres, it does not change'],
    explain:
      '30 m is 4 bar absolute. Boyle’s law: volume is inversely proportional to pressure, so 4 L ÷ 4 = 1 L.',
  },
  {
    category: 'Physics',
    q: 'Which colour disappears first as you descend?',
    answers: ['Red', 'Blue', 'Green', 'Violet'],
    explain:
      'Red has the longest wavelength and is absorbed within the first few metres. That is why blood looks green at depth.',
  },
  {
    category: 'Physics',
    q: 'Looking through your mask, objects underwater appear roughly…',
    answers: [
      '33% larger and 25% closer',
      '33% smaller and 25% further',
      'Exactly as they are',
      'Twice as large',
    ],
    explain:
      'Light bends as it passes from water to the air in your mask, magnifying everything by about a third.',
  },
  {
    category: 'Physics',
    q: 'Compared with air, sound travels through water…',
    answers: [
      'About four times faster',
      'About four times slower',
      'At the same speed',
      'It does not travel at all',
    ],
    explain:
      'Roughly 1,500 m/s versus 340 m/s. It arrives at both ears almost at once, which is why sound underwater seems to come from everywhere.',
  },
  {
    category: 'Physics',
    q: 'What is the absolute pressure at 40 metres in seawater?',
    answers: ['5 bar', '4 bar', '6 bar', '40 bar'],
    explain: '1 bar of atmosphere plus 1 bar for every 10 m of water: 1 + 4 = 5 bar.',
  },
  {
    category: 'Physics',
    q: 'Air in your cylinder is approximately…',
    answers: [
      '21% oxygen, 79% nitrogen',
      '50% oxygen, 50% nitrogen',
      '100% oxygen',
      '79% oxygen, 21% nitrogen',
    ],
    explain:
      'Ordinary air. The nitrogen does nothing for you metabolically, but it is the gas that drives decompression theory.',
  },
  {
    category: 'Physics',
    q: 'Why does a given breath from your regulator empty the tank faster at depth?',
    answers: [
      'The air you breathe is denser, so each breath contains more gas',
      'The regulator leaks more under pressure',
      'You breathe faster automatically',
      'Cold water shrinks the tank',
    ],
    explain:
      'At 20 m each lungful holds three times as many molecules as at the surface, so your cylinder drains about three times as fast.',
  },

  // ── Physiology ────────────────────────────────────────────────────────────
  {
    category: 'Physiology',
    q: 'What is the single most important rule in scuba diving?',
    answers: [
      'Never hold your breath',
      'Never dive below 30 metres',
      'Never dive without a computer',
      'Never dive at night',
    ],
    explain:
      'Breathe continuously. Holding your breath while ascending lets expanding air rupture your lung tissue.',
  },
  {
    category: 'Physiology',
    q: 'Nitrogen narcosis typically becomes noticeable below about…',
    answers: ['30 metres', '5 metres', '10 metres', '60 metres'],
    explain:
      'Sometimes called "the martini effect". It clears completely and immediately as you ascend.',
  },
  {
    category: 'Physiology',
    q: 'Decompression sickness is caused by…',
    answers: [
      'Nitrogen coming out of solution and forming bubbles in the body',
      'Too much oxygen in the blood',
      'Carbon dioxide build-up in the lungs',
      'Cold water slowing the circulation',
    ],
    explain:
      'Ascend slowly and the nitrogen leaves your tissues through your lungs. Ascend fast and it fizzes out like an opened bottle.',
  },
  {
    category: 'Physiology',
    q: 'Where is the risk of lung overexpansion injury greatest?',
    answers: [
      'In the last few metres before the surface',
      'At maximum depth',
      'At the safety stop',
      'On the bottom, at the start of the dive',
    ],
    explain:
      'The proportional pressure change is greatest near the surface, air doubles in volume between 10 m and 0 m.',
  },
  {
    category: 'Physiology',
    q: 'What is the standard recommended safety stop?',
    answers: [
      '3 minutes at 5 metres',
      '1 minute at 3 metres',
      '5 minutes at 10 metres',
      '10 minutes at 3 metres',
    ],
    explain:
      'Optional on a no-stop dive, but always a good idea. It gives dissolved nitrogen extra time to leave your tissues.',
  },
  {
    category: 'Physiology',
    q: 'The maximum ascent rate recommended by PADI is…',
    answers: [
      '18 metres per minute',
      '30 metres per minute',
      '10 metres per minute',
      'As slow as your air allows',
    ],
    explain:
      'About the speed of your smallest bubbles rising. Slower is always fine; faster is not.',
  },
  {
    category: 'Physiology',
    q: 'When should you equalise your ears?',
    answers: [
      'Early and often, before you feel any discomfort',
      'Only once you feel pain',
      'Only at the deepest point of the dive',
      'On ascent, not descent',
    ],
    explain:
      'Once it hurts, the tissue is already swelling and equalising gets harder. Stay ahead of it.',
  },
  {
    category: 'Physiology',
    q: 'What is a "reverse block"?',
    answers: [
      'Air trapped in an ear or sinus that cannot escape on ascent',
      'A regulator that free-flows on descent',
      'A BCD that will not deflate',
      'Nitrogen narcosis that persists after surfacing',
    ],
    explain:
      'The fix is the same as the cause: descend a little, let it clear, and come up slowly.',
  },
  {
    category: 'Physiology',
    q: 'The recommended maximum oxygen partial pressure for the working part of a dive is…',
    answers: ['1.4 bar', '1.0 bar', '2.2 bar', '0.21 bar'],
    explain:
      '1.6 bar is treated as a contingency ceiling. Beyond it, central-nervous-system oxygen toxicity becomes a real risk.',
  },
  {
    category: 'Physiology',
    q: 'After several dives across several days, how long should you wait before flying?',
    answers: ['At least 18 hours', 'At least 2 hours', 'At least 6 hours', 'No wait is needed'],
    explain:
      'A single no-stop dive calls for 12 hours. Repetitive or multi-day diving calls for 18.',
  },
  {
    category: 'Physiology',
    q: 'Breathing enriched air (nitrox) instead of air…',
    answers: [
      'Reduces nitrogen loading but imposes a shallower depth limit',
      'Lets you dive deeper than air',
      'Removes the need for a safety stop',
      'Makes you neutrally buoyant automatically',
    ],
    explain:
      'More oxygen means less nitrogen, but oxygen becomes toxic under pressure, so nitrox has a maximum operating depth.',
  },

  // ── Equipment ─────────────────────────────────────────────────────────────
  {
    category: 'Equipment',
    q: 'What does the "octopus" on your regulator do?',
    answers: [
      'It is a spare second stage for sharing air with a buddy',
      'It measures how much air is left',
      'It inflates the BCD',
      'It is a backup for your dive computer',
    ],
    explain:
      'Usually on a bright yellow hose so a diver in trouble can find it without being told.',
  },
  {
    category: 'Equipment',
    q: 'A regulator’s first stage does what?',
    answers: [
      'Reduces high tank pressure to an intermediate pressure',
      'Delivers air at ambient pressure to your mouth',
      'Measures the pressure in the tank',
      'Prevents water entering the tank',
    ],
    explain:
      'The second stage, the bit in your mouth, then drops that intermediate pressure to ambient, on demand.',
  },
  {
    category: 'Equipment',
    q: 'How does a wetsuit keep you warm?',
    answers: [
      'Neoprene insulates, and the thin layer of trapped water warms to body temperature',
      'It keeps you completely dry',
      'It generates heat chemically',
      'It reflects your body heat back like a foil blanket',
    ],
    explain:
      'This is why fit matters. A loose suit flushes cold water through and you lose the layer you just warmed.',
  },
  {
    category: 'Equipment',
    q: 'A cylinder marked with green and yellow bands usually contains…',
    answers: ['Enriched air (nitrox)', 'Pure oxygen', 'Trimix', 'Ordinary air'],
    explain:
      'Always analyse a nitrox cylinder yourself and sign for it. The band tells you to check; it does not tell you the mix.',
  },
  {
    category: 'Equipment',
    q: 'What is a DSMB used for?',
    answers: [
      'Marking your position for the boat before you surface',
      'Carrying spare weights',
      'Measuring your depth',
      'Storing your dive log underwater',
    ],
    explain:
      'Delayed Surface Marker Buoy. Sent up from depth so the boat knows where you will pop up, especially on a drift.',
  },
  {
    category: 'Equipment',
    q: 'Your dive computer’s "no-stop time" tells you…',
    answers: [
      'How long you can stay before a decompression stop becomes mandatory',
      'How much air is left in your tank',
      'How long until you must surface for cold',
      'How long you have been underwater',
    ],
    explain: 'It shrinks fast as you go deeper, and grows back as you ascend and offgas.',
  },
  {
    category: 'Equipment',
    q: 'When rinsing a regulator after a dive, you should…',
    answers: [
      'Keep the dust cap firmly in place and avoid pressing the purge button',
      'Press the purge button repeatedly to flush it out',
      'Remove the dust cap so water can flow through',
      'Soak it in hot water above 60 °C',
    ],
    explain:
      'Water pushed past the second-stage valve travels up the hose into the first stage, where it will corrode things quietly.',
  },
  {
    category: 'Equipment',
    q: 'What does a BCD do?',
    answers: [
      'Lets you control buoyancy by adding or venting air',
      'Filters carbon dioxide out of your breath',
      'Warms the air you breathe',
      'Reduces nitrogen absorption',
    ],
    explain:
      'Buoyancy Control Device. Good divers use their lungs for fine adjustments and the BCD for coarse ones.',
  },

  // ── Safety ────────────────────────────────────────────────────────────────
  {
    category: 'Safety',
    q: 'What does the pre-dive buddy check "BWRAF" cover?',
    answers: [
      'BCD, Weights, Releases, Air, Final check',
      'Buoyancy, Water, Regulator, Ascent, Fins',
      'Boat, Wetsuit, Rope, Anchor, Flag',
      'Breathe, Wait, Relax, Ascend, Float',
    ],
    explain:
      'Begin With Review And Friend, Burger With Relish And Fries, whatever you need to remember it.',
  },
  {
    category: 'Safety',
    q: 'You lose your buddy underwater. What do you do?',
    answers: [
      'Search for about a minute, then surface to reunite',
      'Continue the dive alone and meet at the boat',
      'Stay exactly where you are until they find you',
      'Descend deeper to get a better view',
    ],
    explain:
      'A minute, then up. Two divers surfacing separately is a nuisance; two divers searching for each other at depth is a problem.',
  },
  {
    category: 'Safety',
    q: 'Which hand signal means "I am out of air"?',
    answers: [
      'A flat hand drawn across the throat',
      'A closed fist against the chest',
      'A thumb pointed upward',
      'A flat hand rocked side to side',
    ],
    explain:
      'A fist to the chest means low on air. A hand across the throat means it is already gone, the difference matters.',
  },
  {
    category: 'Safety',
    q: 'In diving, a thumbs-up signal means…',
    answers: [
      'Let’s ascend / end the dive',
      'Everything is fine',
      'I am low on air',
      'Look over there',
    ],
    explain:
      '"OK" is thumb and forefinger in a circle. Never use a thumbs-up to mean "good" underwater.',
  },
  {
    category: 'Safety',
    q: 'The "rule of thirds" applies to overhead environments. It means…',
    answers: [
      'A third of your air in, a third out, a third in reserve',
      'A third of the dive at depth, a third mid-water, a third shallow',
      'Never exceed a third of your no-stop time',
      'Dive with at least three people',
    ],
    explain: 'In a wreck or cave you cannot simply ascend, so the reserve is not optional.',
  },
  {
    category: 'Safety',
    q: 'Your regulator starts free-flowing at depth. You should…',
    answers: [
      'Sip air from the flowing mouthpiece and ascend with your buddy',
      'Hold your breath and ascend as fast as possible',
      'Shut the tank valve and switch to the octopus',
      'Remove the regulator and wait for it to stop',
    ],
    explain:
      'A free-flowing reg is still giving you air. Let it spill from the corner of your mouth, breathe from the flow, and end the dive.',
  },
  {
    category: 'Safety',
    q: 'Which flag internationally signals "I have a diver down, keep well clear"?',
    answers: [
      'The blue-and-white Alpha flag',
      'The red flag with a white diagonal stripe',
      'A plain yellow flag',
      'A black-and-white chequered flag',
    ],
    explain:
      'The red flag with the white diagonal is the North American "diver down" flag. Alpha is the international one.',
  },

  // ── Marine Life ───────────────────────────────────────────────────────────
  {
    category: 'Marine Life',
    q: 'A nudibranch is…',
    answers: [
      'A sea slug that has lost its shell',
      'A juvenile sea turtle',
      'A kind of soft coral',
      'A shrimp that lives in anemones',
    ],
    explain: 'The name means "naked gills", the frilly plume on its back is exactly that.',
  },
  {
    category: 'Marine Life',
    q: 'A moray eel opens and closes its mouth constantly because…',
    answers: [
      'It is pumping water over its gills to breathe',
      'It is warning you to keep away',
      'It is hunting',
      'It is trying to dislodge a parasite',
    ],
    explain:
      'It looks menacing and it is simply breathing. Morays only bite when a hand goes where it should not.',
  },
  {
    category: 'Marine Life',
    q: 'A titan triggerfish defends a territory shaped like…',
    answers: [
      'A cone widening upward, so swim away horizontally',
      'A sphere, so swim straight up',
      'A flat disc, so swim straight down',
      'It has no territory at all',
    ],
    explain:
      'Swimming up to escape keeps you inside the cone. Swim flat and away, and keep your fins between you and the fish.',
  },
  {
    category: 'Marine Life',
    q: 'How does a clownfish live unharmed among an anemone’s stinging tentacles?',
    answers: [
      'A mucus coating stops the anemone from firing its stingers',
      'It is immune to all venom',
      'It removes the stingers with its teeth',
      'It only touches the tentacle tips, which have no stingers',
    ],
    explain:
      'The anemone gets cleaned and defended in return. Neither party could thrive as well alone.',
  },
  {
    category: 'Marine Life',
    q: 'Which of these has eight arms plus two longer feeding tentacles?',
    answers: ['Cuttlefish', 'Octopus', 'Nudibranch', 'Sea star'],
    explain:
      'The octopus has eight arms and nothing else. The cuttlefish shoots those two extra tentacles out to snatch prey.',
  },
  {
    category: 'Marine Life',
    q: 'Reef-building corals get most of their energy from…',
    answers: [
      'Zooxanthellae, the algae living inside their tissue',
      'Plankton they catch at night',
      'Absorbing minerals from seawater',
      'Small fish they trap in their polyps',
    ],
    explain:
      'When stressed coral expels those algae it loses both its colour and its food supply. That is bleaching.',
  },
  {
    category: 'Marine Life',
    q: 'An adult green sea turtle eats mainly…',
    answers: ['Seagrass and algae', 'Jellyfish', 'Small fish', 'Coral polyps'],
    explain:
      'They are the only largely herbivorous sea turtle as adults, and the green refers to their body fat, not their shell.',
  },
  {
    category: 'Marine Life',
    q: 'A lionfish’s spines are…',
    answers: [
      'Venomous, and used purely for defence',
      'Poisonous only if eaten',
      'Harmless display structures',
      'Used to spear prey',
    ],
    explain: 'It hunts with its mouth, not its spines. The spines exist so nothing hunts it back.',
  },

  // ── Taiwan & FunDivers ────────────────────────────────────────────────────
  {
    category: 'Taiwan',
    q: 'Which Taiwanese dive site lets you descend beside volcanic vents into milky turquoise water?',
    answers: ['Turtle Island', 'Long Dong Bay', 'Green Island', 'Bat Cave'],
    explain:
      'Guishan Island is the tip of Taiwan’s only active volcano. Its sulfur plumes turn the sea a milky turquoise.',
  },
  {
    category: 'Taiwan',
    q: 'Xiaoliuqiu, Lambai Island, is famous for near-guaranteed encounters with…',
    answers: ['Green sea turtles', 'Hammerhead sharks', 'Manta rays', 'Whale sharks'],
    explain: 'Close to a thousand green turtles live around Taiwan’s only inhabited coral island.',
  },
  {
    category: 'Taiwan',
    q: 'Green Island’s most famous coral, the "Big Mushroom", is roughly how old?',
    answers: [
      'Over a thousand years',
      'About fifty years',
      'About two hundred years',
      'Over ten thousand years',
    ],
    explain:
      'A Porites coral head some 10 m tall, and among the largest living corals anywhere on Earth.',
  },
  {
    category: 'Taiwan',
    q: 'The dive site "82.5" takes its name from…',
    answers: [
      'The roadside kilometre marker at its entry point',
      'Its maximum depth in metres',
      'The year it was discovered',
      'The number of coral species recorded there',
    ],
    explain:
      'You park at the marker and walk in. It is also one of the few places in Taiwan to find the "Pikachu" nudibranch.',
  },
  {
    category: 'Taiwan',
    q: 'The Taiwanese dive site called "Cathedral" is actually…',
    answers: [
      'The outlet chamber of a never-commissioned nuclear power plant',
      'A limestone cave system',
      'A sunken church',
      'A natural rock arch',
    ],
    explain:
      'The Longmen plant was finished in 2014 but never switched on. Divers call it the most expensive dive site in the world.',
  },
  {
    category: 'Taiwan',
    q: 'What does "Long Dong", the name of Taiwan’s best-known shore-diving bay, mean?',
    answers: ['Dragon Cave', 'Deep Water', 'Long Bay', 'Old Harbour'],
    explain: 'The largest bay on the Northeast Coast, and the heart of Taiwanese shore diving.',
  },
  {
    category: 'Taiwan',
    q: 'Penghu is best known among divers for…',
    answers: [
      'World-class drift diving and enormous fish schools',
      'Wreck diving',
      'Cave diving',
      'Cold-water diving',
    ],
    explain:
      'Taiwan’s fish factory. Strong steady currents, barracuda walls, and a season that closes when the monsoon arrives.',
  },
  {
    category: 'Taiwan',
    q: 'At Bat Cave, where do the bats actually live?',
    answers: [
      'In the mountains above the site, they emerge at dusk',
      'In an air pocket inside the underwater cave',
      'Under the boat dock',
      'There are no bats; it is named for its shape',
    ],
    explain:
      'Underwater, the site is a maze of rock crevices wide enough to swim through. The bats are strictly an above-the-surface attraction.',
  },
  {
    category: 'Taiwan',
    q: 'Divers travel to Malapascua in the Philippines above all to see…',
    answers: ['Thresher sharks at dawn', 'Manta rays', 'Whale sharks', 'Hammerhead schools'],
    explain:
      'They rise to Monad Shoal at first light to be cleaned by wrasse, nearly every morning of the year.',
  },
  {
    category: 'Taiwan',
    q: 'Blue Corner, regularly called one of the best dive sites on Earth, is in…',
    answers: ['Palau', 'Bohol', 'Anilao', 'Puerto Galera'],
    explain:
      'A dramatic drop-off swept by current, where divers hook in and watch the pelagics stream past.',
  },
]
