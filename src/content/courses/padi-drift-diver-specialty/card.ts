import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 150,
  title: 'PADI Drift Diver Specialty',
  image: mediaIdLocal('b37fef_24b9e725e16b437e901ad76152f12c2c~mv2.jpg'),
  desc: 'Go with the flow, effortless diving in currents with the right technique and awareness.',
  ja: {
    title: 'PADIドリフト・ダイバー・スペシャルティ',
    desc: '流れに身をまかせて。正しいテクニックと意識で、カレントのなかを楽に潜ります。',
  },
  'zh-TW': {
    title: 'PADI 放流潛水專長',
    desc: '順流而行，以正確的技巧與意識，在海流中輕鬆潛水。',
  },
}
