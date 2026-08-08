// The regions the dive sites are grouped into: the short label the /sites page
// uses as a heading, and the fuller name plus blurb the /map page shows when you
// click one. Regions are not per-site data, so they live here rather than in the
// site folders — and unlike a site's name, none of this text is an identifier,
// so all three languages sit side by side.
//
// The map's geometry — centres, bounding boxes — stays in Map.svelte. Only the
// words are here, because only the words get translated.

import type { Region, TaiwanRegion, MapRegionText } from './types'

export const REGION_META: Record<Region, { label: string }> = {
  keelung: { label: 'Keelung' },
  longdong: { label: 'Long Dong (Dragon Cave)' },
  yilan: { label: 'Yilan' },
  kenting: { label: 'Kenting' },
  greenisland: { label: 'Green Island' },
  lanyu: { label: 'Orchid Island (Lanyu)' },
  xiaoliuqiu: { label: 'Xiaoliuqiu' },
  penghu: { label: 'Penghu' },
  malapascua: { label: 'Malapascua, Philippines' },
  'puerto-galera': { label: 'Puerto Galera, Philippines' },
  'panglao-bohol': { label: 'Panglao, Bohol, Philippines' },
  anilao: { label: 'Anilao, Philippines' },
  palau: { label: 'Palau' },
}

export const MAP_REGION_TEXT: Record<TaiwanRegion, MapRegionText> = {
  keelung: {
    name: 'Keelung / Badouzi',
    description:
      'Northern port-area diving, Badouzi Bay reefs and shipwrecks, with Keelung Islet just offshore.',
  },
  longdong: {
    name: 'Long Dong Bay',
    description:
      'The classic northeast wall and reef dives, sheer basalt cliffs, deep gullies, dramatic rock formations.',
  },
  yilan: {
    name: 'Yilan / Turtle Island',
    description:
      "East-coast diving, Toucheng / Wai'ao reefs, the Cathedral and Cauliflower Garden walls, the Wan An Jian wreck, and Turtle Island offshore (Guishan Dao).",
  },
  greenisland: {
    name: 'Green Island (Lyudao)',
    description:
      'Green Island is located off the coast of Taitung, on the southeast coast of Taiwan. It is a favorite dive destination for many locals. Renowned for its impressive visibility, which can reach up to 30–40 m, it is ideal for photography enthusiasts.',
  },
  lanyu: {
    name: 'Lanyu (Orchid Island)',
    description:
      'Orchid Island is best known for the Badai Wreck, a Korean lumber-carrying vessel that starts at 26 m and descends to 40 m deep.',
  },
  xiaoliuqiu: {
    name: 'Xiao Liuqiu (Lambai Island)',
    description:
      'Xiao Liuqiu / Lambai is a large coral island. Due to its nesting beach, it is home to hundreds of green sea turtles that both snorkelers and divers can enjoy.',
  },
  kenting: {
    name: 'Kenting',
    description:
      'Kenting has been a top dive destination in Taiwan for decades. It is best known for its myriad of corals that are plastered atop the reef.',
  },
  penghu: {
    name: 'Penghu Islands',
    description:
      "Of all the dive locations in Taiwan, Penghu has the most fish in numbers, size, and diversity! If you have the experience and time, it's a definite must-see!",
  },
}

export const REGIONS_JA = {
  regions: {
    keelung: '基隆',
    longdong: '龍洞',
    yilan: '宜蘭',
    kenting: '墾丁',
    greenisland: '緑島',
    lanyu: '蘭嶼（オーキッド島）',
    xiaoliuqiu: '小琉球',
    penghu: '澎湖',
    malapascua: 'マラパスクア（フィリピン）',
    'puerto-galera': 'プエルトガレラ（フィリピン）',
    'panglao-bohol': 'パングラオ島・ボホール（フィリピン）',
    anilao: 'アニラオ（フィリピン）',
    palau: 'パラオ',
  },
  mapRegions: {
    keelung: {
      name: '基隆／八斗子',
      description:
        '北部・港湾エリアのダイビング。八斗子湾のリーフや沈船、そしてすぐ沖に浮かぶ基隆嶼。',
    },
    longdong: {
      name: '龍洞湾',
      description:
        '北東海岸を代表する壁とリーフのダイビング。切り立った玄武岩の崖、深いガリー、迫力ある岩の地形。',
    },
    yilan: {
      name: '宜蘭／亀山島',
      description:
        '東海岸のダイビング。頭城・外澳のリーフ、カテドラルやカリフラワー・ガーデンのドロップオフ、萬安艦の沈船、そして沖に浮かぶ亀山島（グイシャン島）。',
    },
    greenisland: {
      name: '緑島（リュウダオ）',
      description:
        '緑島は台湾南東岸、台東の沖に位置します。地元ダイバーに人気の高いスポットで、30〜40 m にも達する抜群の透明度で知られ、水中写真を楽しむ人に最適です。',
    },
    lanyu: {
      name: '蘭嶼（オーキッド島）',
      description:
        '蘭嶼といえばバダイ沈船。韓国の木材運搬船で、水深 26 m から 40 m へと沈んでいます。',
    },
    xiaoliuqiu: {
      name: '小琉球（ランバイ島）',
      description:
        '小琉球（ランバイ）は大きなサンゴの島。産卵のための砂浜があり、何百頭ものアオウミガメが暮らしていて、スノーケラーもダイバーも楽しめます。',
    },
    kenting: {
      name: '墾丁',
      description:
        '墾丁は何十年にもわたり台湾屈指のダイビング地。リーフを覆い尽くす無数のサンゴで知られています。',
    },
    penghu: {
      name: '澎湖群島',
      description:
        '台湾のあらゆるダイビングスポットの中でも、澎湖は魚の数・大きさ・多様性で随一！　経験と時間があるなら、必見の場所です。',
    },
  },
}

export const REGIONS_ZH_TW = {
  regions: {
    keelung: '基隆',
    longdong: '龍洞',
    yilan: '宜蘭',
    kenting: '墾丁',
    greenisland: '綠島',
    lanyu: '蘭嶼',
    xiaoliuqiu: '小琉球',
    penghu: '澎湖',
    malapascua: '馬拉帕斯瓜島（菲律賓）',
    'puerto-galera': '波多加萊拉（菲律賓）',
    'panglao-bohol': '邦勞島・薄荷島（菲律賓）',
    anilao: '阿尼洛（菲律賓）',
    palau: '帛琉',
  },
  mapRegions: {
    keelung: {
      name: '基隆／八斗子',
      description: '北部港區潛水，八斗子灣的礁石與沉船，外海還有基隆嶼。',
    },
    longdong: {
      name: '龍洞灣',
      description: '東北角經典的峭壁與礁岩潛水，陡峭的玄武岩壁、深邃的溝谷與壯觀的岩石地形。',
    },
    yilan: {
      name: '宜蘭／龜山島',
      description:
        '東海岸潛水，頭城／外澳的礁岩、大教堂與花椰菜花園的峭壁、萬安艦沉船，以及外海的龜山島。',
    },
    greenisland: {
      name: '綠島',
      description:
        '綠島位於台灣東南岸、台東外海，是許多在地潛水員的最愛。以能見度極佳聞名，可達 30–40 公尺，是水中攝影愛好者的理想去處。',
    },
    lanyu: {
      name: '蘭嶼',
      description:
        '蘭嶼最著名的是巴代沉船（Badai Wreck），一艘載運木材的韓國貨輪，深度自 26 公尺延伸至 40 公尺。',
    },
    xiaoliuqiu: {
      name: '小琉球（拉美島）',
      description:
        '小琉球／拉美是一座大型珊瑚島。因擁有海龜產卵的沙灘，島上棲息著數百隻綠蠵龜，浮潛與潛水都能盡情欣賞。',
    },
    kenting: {
      name: '墾丁',
      description: '墾丁數十年來一直是台灣頂尖的潛水勝地，最著名的是覆滿礁頂的繁茂珊瑚。',
    },
    penghu: {
      name: '澎湖群島',
      description:
        '在台灣所有潛點中，澎湖的魚在數量、體型與多樣性上都名列第一！若你有經驗也有時間，絕對值得一訪。',
    },
  },
}
