// The marine-life vocabulary.
//
// Dive-site guides list what you are likely to see as short chips ("Moray eels",
// "Soft corals"). Each chip links to its section on the /photos page, so the
// wording has to be consistent: if one site says "Wrasse" and another "Wrasses",
// they point at two different galleries and neither fills up.
//
// So the wording is fixed here, and `dive-site-guides.ts` may only use these
// exact strings — a test enforces it. To add a creature, add it to this list
// first; to add photos of one, create the folder named by its `slug` under
// src/content/photos/gallery/ and drop files in (see docs/adding-photos.md).

/**
 * Every creature and coral a dive-site guide may list.
 *
 * The order here is only how the list reads: roughly the things people come to
 * see, then the reef itself, then the rarities. The photos page sorts its
 * sections alphabetically, so adding an entry in the middle changes nothing on
 * the site — put it wherever it belongs among its relatives.
 */
export const MARINE_LIFE = [
  'Nudibranchs',
  'Cowries',
  'Moray eels',
  'Scorpionfish',
  'Lionfish',
  'Frogfish',
  'Seahorses',
  'Pygmy seahorses',
  'Octopus',
  'Cuttlefish',
  'Squid',
  'Clownfish',
  'Anthias',
  'Damselfish',
  'Butterflyfish',
  'Angelfish',
  'Wrasses',
  'Napoleon wrasse',
  'Parrotfish',
  'Surgeonfish',
  'Trumpetfish',
  'Pufferfish',
  'Boxfish',
  'Flying gurnards',
  'Groupers',
  'Snappers',
  'Grunts',
  'Sweetlips',
  'Fusiliers',
  'Sardines',
  'Reef fish',
  'Barracuda',
  'Trevally',
  'Jacks',
  'Amberjacks',
  'Tuna',
  'Pelagic fish',
  'Reef sharks',
  'Whale sharks',
  'Hammerhead sharks',
  'Thresher sharks',
  'Tiger sharks',
  'Manta rays',
  'Eagle rays',
  'Devil rays',
  'Stingrays',
  'Rays',
  'Sea turtles',
  'Dolphins',
  'Sea snakes',
  'Shrimp and crabs',
  'Harlequin shrimp',
  'Mantis shrimp',
  'Xenograpsus vent crabs',
  'Sea urchins',
  'Hard corals',
  'Soft corals',
  'Leather corals',
  'Black coral',
  'Sun coral',
  'Sea fans',
  'Whip corals',
] as const

export type MarineLife = (typeof MARINE_LIFE)[number]

/**
 * The anchor a chip links to, and the gallery folder that fills it.
 *
 * "Moray eels" -> "moray_eels", so /photos#moray_eels and
 * src/content/photos/gallery/moray_eels/ are the same name in both places.
 */
export function marineSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
