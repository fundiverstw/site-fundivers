import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 100,
  title: 'PADI Enriched Air (Nitrox)',
  image: mediaIdLocal('b37fef_6bb10d67326442318a8a597b14c807c5~mv2.jpg'),
  desc: 'Dive longer with Nitrox, safely use enriched air and extend your no-stop times.',
  ja: {
    title: 'PADIエンリッチド・エア（ナイトロックス）',
    desc: 'ナイトロックスでより長く。高濃度酸素を安全に使い、無減圧潜水時間を延ばします。',
  },
  'zh-TW': {
    title: 'PADI 高氧空氣（Nitrox）',
    desc: '用高氧空氣潛得更久，安全使用 Nitrox，延長免減壓時間。',
  },
}
