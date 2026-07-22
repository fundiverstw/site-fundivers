import { mediaIdLocal } from '$engine/images'
import type { ResponsiveImage } from '$engine/responsive-image'

// The people on the /team page.
//
// `image` is a self-hosted headshot; `monkey` swaps in a placeholder avatar
// when there's no photo yet. `role` is an i18n key (translated in
// content/text/). A member's `name` stays as written in every language (it's a
// personal name, and it keys the bio translations); the `bio` is translated in
// team.ja.ts / team.zh-TW.ts, merged for display by $engine/i18n-content.

export type MemberRole = 'idc' | 'instructor' | 'divemaster'

export type Member = {
  name: string
  role: MemberRole
  bio: string
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
  },
  {
    name: 'Billy Evalt',
    role: 'instructor',
    image: mediaIdLocal('b37fef_e2a651d4c1144d2286c2dbd0b9dc8018~mv2.jpg'),
    bio: 'Billy is a PADI dive instructor from Seattle, Washington. He has been diving since 2008 and has been an instructor since 2012. He first started diving in Vietnam after a friend recommended it and once underwater, he was hooked! He has been diving in many countries, including: Thailand, Turkey, Italy and New Zealand. He became a dive instructor because he loves watching the students’ eyes light up, as his did, when the underwater world is revealed to them. He believes the more divers we have in the world, the better our chances of making a positive change for our oceans!',
    link: 'https://www.thecookiejartaipei.com/',
  },
  {
    name: 'Mike Lee 李邁先',
    role: 'idc',
    image: mediaIdLocal('b37fef_37847cf1b32a413990cb7b558835954f~mv2.jpg'),
    bio: 'Mike is a PADI scuba instructor from Taiwan. He’s been teaching diving since 2017. Ever since his first dive, he’s been captivated by the peaceful and mysterious world beneath the surface. That passion led him to share the beauty of the ocean with others. He focuses on safety, patience, and building confidence underwater. He takes pride in creating a relaxed and supportive learning environment. Come dive with Mike and the Fun Divers Taiwan team, let’s explore the blue together and make unforgettable underwater memories!',
  },
  {
    name: 'Eric Odle',
    role: 'divemaster',
    monkey: true,
    bio: `Hi, I’m Eric, and I like to dive,
Mess with computers, and keep things alive.
I like learning new stuff and having some fun,
Whether underwater or building something on the run.`,
    link: 'https://www.ouairei.com',
  },
]

// The translatable part of a member — just the bio. Overlays live in team.ja.ts
// / team.zh-TW.ts, keyed by name; the parity test keeps them complete.
export type MemberText = { bio: string }

export const TEAM_TEXT_EN: Record<string, MemberText> = Object.fromEntries(
  TEAM.map((m) => [m.name, { bio: m.bio }]),
)
