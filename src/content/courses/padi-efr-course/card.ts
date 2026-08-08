import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 80,
  title: 'PADI EFR Course',
  image: mediaIdLocal('b37fef_aa0190ec4359404db3362a851c7663bd~mv2.jpg'),
  desc: 'Emergency First Response, CPR and primary/secondary care for divers and non-divers alike.',
  ja: {
    title: 'PADI EFRコース',
    desc: 'エマージェンシー・ファースト・レスポンス。CPRと一次・二次ケアを、ダイバーもそうでない方も学べます。',
  },
  'zh-TW': {
    title: 'PADI EFR 課程',
    desc: '緊急第一反應，CPR 與初級／次級救護，潛水員與一般人都適用。',
  },
}
