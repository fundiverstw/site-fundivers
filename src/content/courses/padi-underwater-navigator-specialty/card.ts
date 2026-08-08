import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 170,
  title: 'PADI Underwater Navigator',
  image: mediaIdLocal('b37fef_489bc4720a724dbb9d596ee856249869~mv2.jpg'),
  desc: 'Find your way with compass and natural navigation, never lose the boat again.',
  ja: {
    title: 'PADI水中ナビゲーター',
    desc: 'コンパスと自然物ナビで自在に。もうボートを見失いません。',
  },
  'zh-TW': {
    title: 'PADI 水底導航專長',
    desc: '善用指北針與自然導航找到方向，再也不會找不到船。',
  },
}
