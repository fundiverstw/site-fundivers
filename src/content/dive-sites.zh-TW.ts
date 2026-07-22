import type { DiveSitesText } from './dive-sites'

// 繁體中文（台灣）— dive-site, region and map-region text. Keyed by the same ids
// as dive-sites.ts; the English there stays the identifier (calendar matching,
// sorting) and this is merged over it for display by $engine/i18n-content.
// Same shape as DIVE_SITES_TEXT_EN — a parity test enforces it.

export const diveSitesZhTW: DiveSitesText = {
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
  sites: {
    'cauliflower-garden': {
      name: '花椰菜花園',
      tagline: '花椰菜花園是一處迷人的峭壁潛水，可愛的彩色小軟珊瑚形狀就像花椰菜。',
    },
    'iron-house-iron-reef': {
      name: '鐵屋／鐵礁',
      tagline:
        '這是以鋼材打造、形似房屋骨架的人工魚礁。礁體之間棲息著各種魚類，藉此躲避紅甘等掠食者。',
    },
    penghu: {
      name: '澎湖',
      tagline:
        '在台灣所有潛點中，澎湖的魚在數量、體型與多樣性上都名列第一！若你有經驗也有時間，絕對不容錯過！',
    },
    'secret-garden': {
      name: '秘密花園',
      tagline:
        '秘密花園是在地潛水員的最愛，海扇、鞭珊瑚與軟珊瑚交織成一片花園，是台灣東北角不可錯過的潛點。',
    },
    'turtle-island': {
      name: '龜山島',
      tagline:
        '龜山島因海底溫泉「銀河」而為潛水員所熟知。若能得到這難得的機會前往潛水，千萬別錯過！',
    },
    kenting: {
      name: '墾丁',
      tagline: '墾丁數十年來一直是台灣頂尖的潛水勝地，最著名的是覆滿礁頂的繁茂珊瑚。',
    },
    cathedral: {
      name: '大教堂',
      tagline: '大教堂是一處適合各級潛水員的獨特潛點，總是充滿驚喜！',
    },
    'green-island': {
      name: '綠島',
      tagline:
        '綠島位於台灣東南岸、台東外海，是許多在地人喜愛的潛水勝地。以能見度極佳聞名，可達 30–40 公尺，是水中攝影愛好者的理想去處。',
    },
    canyons: {
      name: '峽谷',
      tagline: '一處饒富趣味的潛點，擁有美麗的斜坡、峭壁與巨石等待你探索。',
    },
    shipwrecks: {
      name: '沉船群',
      tagline:
        '八斗子灣周邊零星散布著許多沉船，讓潛水員有絕佳機會探索這些如今已化為人工魚礁的漁船。',
    },
    'iron-house-2': {
      name: '鐵屋2號',
      tagline: '鐵屋2號有兩座並排、形似方塊積木的金屬框架結構，滿是生機。',
    },
    '82-5': {
      name: '82.5',
      tagline: '在 82.5 的峭壁上，總能觀察到有趣的生物與岩石地形。',
    },
    'crystal-temple-wall': {
      name: '水晶宮牆',
      tagline: '一段長約 100 公尺的峭壁，從 15 公尺延伸至 30 公尺深。',
    },
    'long-dong-bay': {
      name: '龍洞灣',
      tagline: '龍洞灣設有步入式斜坡，海況平穩時進出水都很輕鬆，無論初學者或進階潛水員都適合。',
    },
    'wan-an-jian-navy-wreck': {
      name: '萬安艦沉船',
      tagline: '萬安艦是一艘沉沒於台灣東海岸外的巨大海軍沉船，船體覆滿生物，四周環繞著魚群。',
    },
    'rainbow-reef': {
      name: '彩虹礁',
      tagline:
        '緊鄰基隆嶼，從碼頭搭船僅需 20 分鐘。彩虹礁是一處壯麗的潛點，兩座獨立礁覆滿色彩繽紛的鞭珊瑚。',
    },
    'lambai-island': {
      name: '拉美島（小琉球）',
      tagline:
        '小琉球／拉美是一座大型珊瑚島。因擁有海龜產卵的沙灘，島上棲息著數百隻綠蠵龜，浮潛與潛水都能盡情欣賞。',
    },
    'orchid-island': {
      name: '蘭嶼',
      tagline:
        '蘭嶼最著名的是巴代沉船（Badai Wreck），一艘載運木材的韓國貨輪，深度自 26 公尺延伸至 40 公尺。',
    },
    'bat-cave': {
      name: '蝙蝠洞',
      tagline: '蝙蝠洞是一處適合各種經驗程度的絕佳潛點！',
    },
    malapascua: {
      name: '馬拉帕斯瓜',
      tagline: '馬拉帕斯瓜是長尾鯊、鷹魟，偶爾還有虎鯊出沒的地方，是每位潛水員此生必訪的夢幻潛點！',
    },
    'puerto-galera': {
      name: '波多加萊拉',
      tagline:
        '波多加萊拉是菲律賓民都洛省首屈一指的潛水勝地，還有精彩的夜生活與供應西式或菲式料理的餐廳。',
    },
    'panglao-bohol': {
      name: '邦勞島・薄荷島',
      tagline:
        '邦勞島是潛水員的天堂，潛點多樣、海洋生物豐富！位於菲律賓薄荷省，是所有潛水員必訪的名單之一！',
    },
    anilao: {
      name: '阿尼洛',
      tagline:
        '距馬尼拉僅數小時、位於八打雁省的阿尼洛，長久以來被視為菲律賓最佳潛水地點之一，吸引著初學者與資深潛水員。',
    },
    palau: {
      name: '帛琉',
      tagline:
        '帛琉是位於西太平洋密克羅尼西亞的群島，提供世界級的潛水體驗，吸引全球各地的潛水員。它躋身世界前十大潛水勝地，是所有熱愛潛水者的必訪之地。',
    },
  },
}
