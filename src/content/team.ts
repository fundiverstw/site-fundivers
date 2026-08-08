import { mediaIdLocal } from '$engine/images'
import type { ResponsiveImage } from '$engine/responsive-image'

// The people on the /team page.
//
// `image` is a self-hosted headshot; `monkey` swaps in a placeholder avatar
// when there's no photo yet. `role` is an i18n key (translated in
// content/text/). A member's `name` stays as written in every language — it is a
// personal name, and it keys the bio translations.
//
// The bios in all three languages sit in the same entry, so one person is one
// block to read and edit. $engine/i18n-content picks the right one and falls
// back to the English. Team members have no page of their own, so unlike dive
// sites and courses this stays a single file rather than a folder each.

export type MemberRole = 'idc' | 'instructor' | 'divemaster'

/** The translatable part of a member — just the bio. */
export type MemberText = { bio: string }

export type Member = {
  name: string
  role: MemberRole
  bio: string
  ja: MemberText
  'zh-TW': MemberText
  image?: ResponsiveImage | null
  monkey?: boolean
  link?: string
}

export const TEAM: Member[] = [
  {
    name: 'Dennis Wong',
    role: 'idc',
    image: mediaIdLocal('b37fef_594f84e342954c95b442c5b67f5fb454~mv2.jpg'),
    bio: 'Dennis Wong has been scuba diving since 1998. Upon seeing fish big or small in large schools swimming in unison, he wanted to share this mesmerizing underwater world with everyone. He decided to become a PADI Instructor in 2013, and is now IDC Staff since 2018. PADI has awarded him Elite Instructor status for his vigilance and attention to detail from 2020-2023.',
    ja: {
      bio: 'Dennis Wong は1998年からスキューバダイビングを続けています。大小さまざまな魚が群れをなして一斉に泳ぐ姿を見て、この魅惑的な水中世界を多くの人と分かち合いたいと思うようになりました。2013年にPADIインストラクターになることを決意し、2018年からはIDCスタッフを務めています。その細やかな注意力と入念さが評価され、2020〜2023年にはPADIエリート・インストラクターに認定されました。',
    },
    'zh-TW': {
      bio: 'Dennis Wong 自 1998 年開始從事水肺潛水。當他看見大大小小的魚群整齊劃一地悠游時，便希望將這片迷人的水中世界分享給每一個人。他在 2013 年決心成為 PADI 教練，並自 2018 年起擔任 IDC 教練團隊成員。憑藉著警覺與對細節的專注，PADI 於 2020 至 2023 年連續授予他菁英教練（Elite Instructor）的殊榮。',
    },
  },
  {
    name: 'Billy Evalt',
    role: 'instructor',
    image: mediaIdLocal('b37fef_e2a651d4c1144d2286c2dbd0b9dc8018~mv2.jpg'),
    bio: 'Billy is a PADI dive instructor from Seattle, Washington. He has been diving since 2008 and has been an instructor since 2012. He first started diving in Vietnam after a friend recommended it and once underwater, he was hooked! He has been diving in many countries, including: Thailand, Turkey, Italy and New Zealand. He became a dive instructor because he loves watching the students’ eyes light up, as his did, when the underwater world is revealed to them. He believes the more divers we have in the world, the better our chances of making a positive change for our oceans!',
    link: 'https://www.thecookiejartaipei.com/',
    ja: {
      bio: 'Billy はアメリカ・ワシントン州シアトル出身のPADIダイビングインストラクターです。2008年からダイビングを始め、2012年よりインストラクターを務めています。友人に勧められてベトナムで初めて潜り、水中の世界にすっかり夢中になりました。これまでにタイ、トルコ、イタリア、ニュージーランドなど数多くの国で潜ってきました。水中世界が目の前に広がったときに輝く生徒の瞳を見るのが大好きで、それが自分自身の体験と重なることから、インストラクターになりました。世界にダイバーが増えるほど、海に良い変化をもたらせる可能性も高まると信じています。',
    },
    'zh-TW': {
      bio: 'Billy 是來自美國華盛頓州西雅圖的 PADI 潛水教練。他自 2008 年開始潛水，並於 2012 年成為教練。經朋友推薦，他在越南初次潛水，一下水便深深著迷！他曾在泰國、土耳其、義大利與紐西蘭等許多國家潛水。他之所以成為潛水教練，是因為熱愛看著學員在水中世界展現眼前時、雙眼發亮的那一刻——就如同當年的自己。他相信世界上的潛水員愈多，我們為海洋帶來正面改變的機會就愈大！',
    },
  },
  {
    name: 'Mike Lee 李邁先',
    role: 'idc',
    image: mediaIdLocal('b37fef_37847cf1b32a413990cb7b558835954f~mv2.jpg'),
    bio: 'Mike is a PADI scuba instructor from Taiwan. He’s been teaching diving since 2017. Ever since his first dive, he’s been captivated by the peaceful and mysterious world beneath the surface. That passion led him to share the beauty of the ocean with others. He focuses on safety, patience, and building confidence underwater. He takes pride in creating a relaxed and supportive learning environment. Come dive with Mike and the Fun Divers Taiwan team, let’s explore the blue together and make unforgettable underwater memories!',
    ja: {
      bio: 'Mike は台湾出身のPADIスキューバインストラクターです。2017年からダイビングを教えています。初めてのダイビング以来、水面下に広がる静かで神秘的な世界に魅了され続け、その情熱が海の美しさを人々と分かち合うことへとつながりました。安全、忍耐、そして水中での自信づくりを大切にし、リラックスできる温かな学びの場をつくることに誇りを持っています。ぜひMikeとFun Divers Taiwanのチームと一緒に潜って、青い海を探検し、忘れられない水中の思い出をつくりましょう！',
    },
    'zh-TW': {
      bio: 'Mike 是來自台灣的 PADI 水肺潛水教練，自 2017 年開始教授潛水。自從第一次下潛以來，他便深深著迷於水面下那片寧靜而神秘的世界，這份熱情驅使他將海洋之美分享給更多人。他重視安全、耐心，以及在水中建立信心，並以營造輕鬆而友善的學習環境為榮。快來和 Mike 以及 Fun Divers Taiwan 團隊一起潛水，讓我們一同探索湛藍海洋，留下難忘的水中回憶！',
    },
  },
  {
    name: 'Eric Odle',
    role: 'divemaster',
    image: mediaIdLocal('fabio'),
    bio: `Hi, I’m Eric, and I like to dive,
Mess with computers, and keep things alive.
I like learning new stuff and having some fun,
Whether underwater or building something on the run.`,
    link: 'https://www.ouairei.com',
    ja: {
      bio: 'こんにちは、Ericです。ダイビングが大好き、\nコンピューターをいじって、いろいろなものを動かし続けています。\n新しいことを学んで、楽しむのが好き、\n水の中でも、駆け足で何かを作るときでも。',
    },
    'zh-TW': {
      bio: '嗨，我是 Eric，我喜歡潛水，\n擺弄電腦，讓各種東西保持運轉。\n我喜歡學習新事物、找點樂子，\n無論是在水下，還是隨手打造些什麼。',
    },
  },
]

export const TEAM_TEXT_EN: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, { bio: m.bio }]),
)

export const teamJa: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, m.ja]),
)

export const teamZhTW: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, m['zh-TW']]),
)
