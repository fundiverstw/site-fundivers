import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 20,
  title: 'PADI Advanced Open Water',
  image: mediaIdLocal('b37fef_357153d63c3245819d71d68d9d2f1790~mv2.jpg'),
  desc: 'Five adventure dives including deep and navigation. Build skills and confidence down to 30m.',
  ja: {
    title: 'PADIアドバンスド・オープン・ウォーター',
    desc: 'ディープとナビゲーションを含む5本のアドベンチャー・ダイブ。水深30mまでスキルと自信を高めます。',
  },
  'zh-TW': {
    title: 'PADI 進階開放水域潛水員',
    desc: '包含深潛與導航在內的五趟冒險潛水，將技巧與信心提升到 30 公尺。',
  },
}
