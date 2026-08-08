// The marine-life vocabulary.
//
// A dive site's details.ts lists what you are likely to see as short chips ("Moray eels",
// "Soft corals"). Each chip links to its section on the /photos page, so the
// wording has to be consistent: if one site says "Wrasse" and another "Wrasses",
// they point at two different galleries and neither fills up.
//
// So the wording is fixed here, and `dive-sites/details.ts` may only use these
// exact strings — a test enforces it. To add a creature, add it to this list
// first; to add photos of one, create the folder named by its `slug` under
// src/content/photos/gallery/ and drop files in (see docs/adding-photos.md).

/**
 * Every creature and coral a dive site's details.ts may list.
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

// A translated display label for every creature, keyed by its English name.
// The English name stays the identifier everywhere (it makes the gallery slug,
// and a site's details list creatures by it); only the label a reader sees is
// translated. Resolved through $engine/i18n-content; a parity test keeps both
// lists complete.
//
// The labels live here rather than in files of their own because MARINE_LIFE is
// not just data — it is the type. Every label below is checked against it, so a
// creature renamed in the list above fails to compile here instead of quietly
// losing its translation.
export type MarineLifeText = Record<MarineLife, string>

export const marineLifeJa: MarineLifeText = {
  Nudibranchs: 'ウミウシ',
  Cowries: 'タカラガイ',
  'Moray eels': 'ウツボ',
  Scorpionfish: 'カサゴ',
  Lionfish: 'ミノカサゴ',
  Frogfish: 'カエルアンコウ',
  Seahorses: 'タツノオトシゴ',
  'Pygmy seahorses': 'ピグミーシーホース',
  Octopus: 'タコ',
  Cuttlefish: 'コウイカ',
  Squid: 'イカ',
  Clownfish: 'クマノミ',
  Anthias: 'ハナダイ',
  Damselfish: 'スズメダイ',
  Butterflyfish: 'チョウチョウウオ',
  Angelfish: 'キンチャクダイ',
  Wrasses: 'ベラ',
  'Napoleon wrasse': 'ナポレオンフィッシュ',
  Parrotfish: 'ブダイ',
  Surgeonfish: 'ニザダイ',
  Trumpetfish: 'ヘラヤガラ',
  Pufferfish: 'フグ',
  Boxfish: 'ハコフグ',
  'Flying gurnards': 'セミホウボウ',
  Groupers: 'ハタ',
  Snappers: 'フエダイ',
  Grunts: 'イサキ',
  Sweetlips: 'コショウダイ',
  Fusiliers: 'タカサゴ',
  Sardines: 'イワシ',
  'Reef fish': 'リーフフィッシュ',
  Barracuda: 'バラクーダ',
  Trevally: 'トレバリー',
  Jacks: 'アジ',
  Amberjacks: 'カンパチ',
  Tuna: 'マグロ',
  'Pelagic fish': '回遊魚',
  'Reef sharks': 'リーフシャーク',
  'Whale sharks': 'ジンベエザメ',
  'Hammerhead sharks': 'ハンマーヘッドシャーク',
  'Thresher sharks': 'ニタリ（オナガザメ）',
  'Tiger sharks': 'イタチザメ',
  'Manta rays': 'マンタ',
  'Eagle rays': 'マダラトビエイ',
  'Devil rays': 'イトマキエイ',
  Stingrays: 'アカエイ',
  Rays: 'エイ',
  'Sea turtles': 'ウミガメ',
  Dolphins: 'イルカ',
  'Sea snakes': 'ウミヘビ',
  'Shrimp and crabs': 'エビ・カニ',
  'Harlequin shrimp': 'フリソデエビ',
  'Mantis shrimp': 'シャコ',
  'Xenograpsus vent crabs': '温泉ガニ（ゼノグラプスス）',
  'Sea urchins': 'ウニ',
  'Hard corals': 'ハードコーラル',
  'Soft corals': 'ソフトコーラル',
  'Leather corals': 'レザーコーラル',
  'Black coral': 'ブラックコーラル',
  'Sun coral': 'サンコーラル（イボヤギ）',
  'Sea fans': 'ウミウチワ',
  'Whip corals': 'ムチヤギ',
}

export const marineLifeZhTW: MarineLifeText = {
  Nudibranchs: '海蛞蝓',
  Cowries: '寶螺',
  'Moray eels': '裸胸鯙',
  Scorpionfish: '石狗公',
  Lionfish: '獅子魚',
  Frogfish: '躄魚',
  Seahorses: '海馬',
  'Pygmy seahorses': '豆丁海馬',
  Octopus: '章魚',
  Cuttlefish: '烏賊',
  Squid: '魷魚',
  Clownfish: '小丑魚',
  Anthias: '金花鱸',
  Damselfish: '雀鯛',
  Butterflyfish: '蝴蝶魚',
  Angelfish: '神仙魚',
  Wrasses: '隆頭魚',
  'Napoleon wrasse': '拿破崙魚',
  Parrotfish: '鸚哥魚',
  Surgeonfish: '刺尾鯛',
  Trumpetfish: '喇叭魚',
  Pufferfish: '河魨',
  Boxfish: '箱魨',
  'Flying gurnards': '飛角魚',
  Groupers: '石斑魚',
  Snappers: '笛鯛',
  Grunts: '石鱸',
  Sweetlips: '胡椒鯛',
  Fusiliers: '烏尾鮗',
  Sardines: '沙丁魚',
  'Reef fish': '礁岩魚類',
  Barracuda: '梭魚',
  Trevally: '平鰺',
  Jacks: '鰺魚',
  Amberjacks: '紅甘鰺',
  Tuna: '鮪魚',
  'Pelagic fish': '洄游魚類',
  'Reef sharks': '礁鯊',
  'Whale sharks': '鯨鯊',
  'Hammerhead sharks': '雙髻鯊',
  'Thresher sharks': '長尾鯊',
  'Tiger sharks': '虎鯊',
  'Manta rays': '鬼蝠魟',
  'Eagle rays': '鷹魟',
  'Devil rays': '魔鬼魟',
  Stingrays: '魟魚',
  Rays: '魟',
  'Sea turtles': '海龜',
  Dolphins: '海豚',
  'Sea snakes': '海蛇',
  'Shrimp and crabs': '蝦與蟹',
  'Harlequin shrimp': '小丑蝦',
  'Mantis shrimp': '螳螂蝦',
  'Xenograpsus vent crabs': '硫磺怪方蟹',
  'Sea urchins': '海膽',
  'Hard corals': '硬珊瑚',
  'Soft corals': '軟珊瑚',
  'Leather corals': '皮革珊瑚',
  'Black coral': '黑珊瑚',
  'Sun coral': '太陽珊瑚',
  'Sea fans': '海扇',
  'Whip corals': '鞭珊瑚',
}

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
