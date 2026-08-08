import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 110,
  title: 'PADI Deep Diver Specialty',
  image: mediaIdLocal('b37fef_6f2950e52002422bbd2486a8d3bb41bb~mv2_d_2000_1333_s_2.jpg'),
  desc: 'Extend your limits and learn to safely plan and enjoy dives down to 40m.',
  ja: {
    title: 'PADIディープ・ダイバー・スペシャルティ',
    desc: '限界を広げ、水深40mまでのダイビングを安全に計画して楽しむ方法を学びます。',
  },
  'zh-TW': {
    title: 'PADI 深潛專長',
    desc: '拓展你的極限，學會安全規劃並享受深至 40 公尺的潛水。',
  },
}
