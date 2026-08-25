import fabio from './photos/team/fabio.jpg?responsive'
import type { ResponsiveImage } from '$engine/responsive-image'

// The people on the staff roster, rendered inside /about.
//
// `above` is the above-water photo and `under` the underwater one; the About
// page shows both side by side. Either can be null — CoverPhoto draws a
// "coming soon" frame in its place, which is what most of the roster is using
// until the real photos are taken. Drop a file in ./photos/team/ and import it
// the way fabio.jpg is imported below.
//
// `role` is an i18n key (translated in content/text/). A member's `name` stays
// as written in every language — it is a personal name, and it keys the
// translations. The bios in all three languages sit in the same entry, so one
// person is one block to read and edit; $engine/i18n-content picks the right one
// and falls back to the English. Team members have no page of their own, so
// unlike dive sites and courses this stays a single file rather than a folder
// each.
//
// ── Still to fill in ────────────────────────────────────────────────────────
//
// `since` is the year that person started diving, and it is deliberately
// optional: the row is simply left off the card rather than guessed at. Dennis
// and Billy state theirs in their own bios; **Mike's and Eric's are unknown and
// need asking.**
//
// The `interests` and `why` lines for Mike and Eric are placeholder copy drawn
// from their existing bios rather than their own words. Ask them and replace.

export type MemberRole = 'idc' | 'instructor' | 'divemaster'

/** The translatable part of a member: the bio, plus the two profile lines the
 *  About page shows beside it. */
export type MemberText = {
  bio: string
  /** What they get up to when they are not in the water. */
  interests: string
  /** In their own words, ideally. */
  why: string
}

export type Member = MemberText & {
  name: string
  role: MemberRole
  /** The year they started diving. Left off when we have not asked. */
  since?: number
  ja: MemberText
  'zh-TW': MemberText
  /** Above-water photo. Null shows a placeholder frame. */
  above?: ResponsiveImage | null
  /** Underwater photo. Null shows a placeholder frame. */
  under?: ResponsiveImage | null
  link?: string
}

export const TEAM: Member[] = [
  {
    name: 'Dennis Wong',
    role: 'idc',
    since: 1998,
    bio: 'Dennis Wong has been scuba diving since 1998. Upon seeing fish big or small in large schools swimming in unison, he wanted to share this mesmerizing underwater world with everyone. He decided to become a PADI Instructor in 2013, and is now IDC Staff since 2018. PADI has awarded him Elite Instructor status for his vigilance and attention to detail from 2020-2023.',
    interests:
      'Running the shop, and the kind of preparation that means nothing goes wrong on the day — kit checked twice, conditions read before anyone gets wet.',
    why: 'For the schooling fish. Hundreds of them turning at once, as though something told them all at the same moment. I have been trying to show other people that ever since.',
    ja: {
      bio: 'Dennis Wong は1998年からスキューバダイビングを続けています。大小さまざまな魚が群れをなして一斉に泳ぐ姿を見て、この魅惑的な水中世界を多くの人と分かち合いたいと思うようになりました。2013年にPADIインストラクターになることを決意し、2018年からはIDCスタッフを務めています。その細やかな注意力と入念さが評価され、2020〜2023年にはPADIエリート・インストラクターに認定されました。',
      interests:
        'ショップの運営と、当日に何も起こさないための準備。器材は二度確認し、誰かが水に入る前に海況を読みます。',
      why: '魚の群れを見せたいからです。何百尾もが同じ瞬間に合図を受け取ったかのように一斉に向きを変える — あの光景を、ずっと誰かに見せようとしてきました。',
    },
    'zh-TW': {
      bio: 'Dennis Wong 自 1998 年開始從事水肺潛水。當他看見大大小小的魚群整齊劃一地悠游時，便希望將這片迷人的水中世界分享給每一個人。他在 2013 年決心成為 PADI 教練，並自 2018 年起擔任 IDC 教練團隊成員。憑藉著警覺與對細節的專注，PADI 於 2020 至 2023 年連續授予他菁英教練（Elite Instructor）的殊榮。',
      interests: '經營潛店，以及那種讓當天不會出事的事前準備：裝備檢查兩次，下水前先讀懂海況。',
      why: '為了成群的魚。數百尾同時轉向，彷彿在同一瞬間收到了同一個訊息。從那之後，我就一直想把這一幕分享給別人。',
    },
  },
  {
    name: 'Billy Evalt',
    role: 'instructor',
    since: 2008,
    bio: 'Billy is a PADI dive instructor from Seattle, Washington. He has been diving since 2008 and has been an instructor since 2012. He first started diving in Vietnam after a friend recommended it and once underwater, he was hooked! He has been diving in many countries, including: Thailand, Turkey, Italy and New Zealand. He became a dive instructor because he loves watching the students’ eyes light up, as his did, when the underwater world is revealed to them. He believes the more divers we have in the world, the better our chances of making a positive change for our oceans!',
    interests:
      'Baking. He runs The Cookie Jar in Taipei, and is usually working out which country to get wet in next.',
    why: 'For the moment a student’s eyes go wide underwater — the way mine did in Vietnam. The more divers there are, the better our chances of doing right by the ocean.',
    link: 'https://www.thecookiejartaipei.com/',
    ja: {
      bio: 'Billy はアメリカ・ワシントン州シアトル出身のPADIダイビングインストラクターです。2008年からダイビングを始め、2012年よりインストラクターを務めています。友人に勧められてベトナムで初めて潜り、水中の世界にすっかり夢中になりました。これまでにタイ、トルコ、イタリア、ニュージーランドなど数多くの国で潜ってきました。水中世界が目の前に広がったときに輝く生徒の瞳を見るのが大好きで、それが自分自身の体験と重なることから、インストラクターになりました。世界にダイバーが増えるほど、海に良い変化をもたらせる可能性も高まると信じています。',
      interests:
        'お菓子作り。台北で The Cookie Jar を営みながら、次はどこの国で潜ろうかと考えています。',
      why: '水中で生徒の目が見開かれるあの瞬間のためです。ベトナムでの自分がそうでした。ダイバーが増えるほど、海のためにできることも増えるはずです。',
    },
    'zh-TW': {
      bio: 'Billy 是來自美國華盛頓州西雅圖的 PADI 潛水教練。他自 2008 年開始潛水，並於 2012 年成為教練。經朋友推薦，他在越南初次潛水，一下水便深深著迷！他曾在泰國、土耳其、義大利與紐西蘭等許多國家潛水。他之所以成為潛水教練，是因為熱愛看著學員在水中世界展現眼前時、雙眼發亮的那一刻——就如同當年的自己。他相信世界上的潛水員愈多，我們為海洋帶來正面改變的機會就愈大！',
      interests: '烘焙。他在台北經營 The Cookie Jar，平時則在盤算下一個要下水的國家。',
      why: '為了學員在水下睜大雙眼的那一刻 — 當年的我在越南就是那樣。世界上的潛水員愈多，我們為海洋做對的事的機會就愈大。',
    },
  },
  {
    name: 'Mike Lee 李邁先',
    role: 'idc',
    bio: 'Mike is a PADI scuba instructor from Taiwan. He’s been teaching diving since 2017. Ever since his first dive, he’s been captivated by the peaceful and mysterious world beneath the surface. That passion led him to share the beauty of the ocean with others. He focuses on safety, patience, and building confidence underwater. He takes pride in creating a relaxed and supportive learning environment. Come dive with Mike and the Fun Divers Taiwan team, let’s explore the blue together and make unforgettable underwater memories!',
    interests:
      'Teaching, mostly — and the slow business of getting a nervous student to the point where they forget to be nervous.',
    why: 'For the quiet. Nothing above the surface is calm and strange in quite the same way, and I want other people to feel it.',
    ja: {
      bio: 'Mike は台湾出身のPADIスキューバインストラクターです。2017年からダイビングを教えています。初めてのダイビング以来、水面下に広がる静かで神秘的な世界に魅了され続け、その情熱が海の美しさを人々と分かち合うことへとつながりました。安全、忍耐、そして水中での自信づくりを大切にし、リラックスできる温かな学びの場をつくることに誇りを持っています。ぜひMikeとFun Divers Taiwanのチームと一緒に潜って、青い海を探検し、忘れられない水中の思い出をつくりましょう！',
      interests:
        'ほとんど教えることです。緊張していた生徒が、いつのまにか緊張を忘れるまでの時間が好きです。',
      why: 'あの静けさのためです。水の上には、あんなに穏やかで不思議な場所はありません。それを他の人にも感じてほしいのです。',
    },
    'zh-TW': {
      bio: 'Mike 是來自台灣的 PADI 水肺潛水教練，自 2017 年開始教授潛水。自從第一次下潛以來，他便深深著迷於水面下那片寧靜而神秘的世界，這份熱情驅使他將海洋之美分享給更多人。他重視安全、耐心，以及在水中建立信心，並以營造輕鬆而友善的學習環境為榮。快來和 Mike 以及 Fun Divers Taiwan 團隊一起潛水，讓我們一同探索湛藍海洋，留下難忘的水中回憶！',
      interests: '大多是教學。我喜歡看著原本緊張的學員，慢慢緊張到忘了自己在緊張。',
      why: '為了那份安靜。水面之上沒有任何地方像那樣既平靜又奇異，我希望其他人也能感受到。',
    },
  },
  {
    name: 'Eric Odle',
    role: 'divemaster',
    above: fabio,
    bio: `Hi, I’m Eric, and I like to dive,
Mess with computers, and keep things alive.
I like learning new stuff and having some fun,
Whether underwater or building something on the run.`,
    interests: 'Computers, and keeping things running — including this website.',
    why: 'Because it is the one place where learning something new and having a good time are the same activity.',
    link: 'https://www.ouairei.com',
    ja: {
      bio: 'こんにちは、Ericです。ダイビングが大好き、\nコンピューターをいじって、いろいろなものを動かし続けています。\n新しいことを学んで、楽しむのが好き、\n水の中でも、駆け足で何かを作るときでも。',
      interests: 'コンピューターと、いろいろなものを動かし続けること。このサイトもそのひとつです。',
      why: '新しいことを学ぶのと楽しむのが、同じひとつの行為になる場所だからです。',
    },
    'zh-TW': {
      bio: '嗨，我是 Eric，我喜歡潛水，\n擺弄電腦，讓各種東西保持運轉。\n我喜歡學習新事物、找點樂子，\n無論是在水下，還是隨手打造些什麼。',
      interests: '電腦，以及讓各種東西保持運轉 — 包括這個網站。',
      why: '因為那是少數幾個「學新東西」和「玩得開心」是同一件事的地方。',
    },
  },
]

const FOUNDER_NAMES = ['Dennis Wong', 'Billy Evalt']

/** The two founders, in the order /origins tells their story. They are on /team
 *  as well, with their bios — there they are two of the people you dive with,
 *  here they are the reason there is anything to dive with. */
export const FOUNDERS: Member[] = TEAM.filter((m) => FOUNDER_NAMES.includes(m.name))

const text = (m: Member): MemberText => ({ bio: m.bio, interests: m.interests, why: m.why })

export const TEAM_TEXT_EN: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, text(m)]),
)

export const teamJa: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, m.ja]),
)

export const teamZhTW: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, m['zh-TW']]),
)
