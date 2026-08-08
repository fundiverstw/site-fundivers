import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 30,
  title: 'PADI Rescue Diver',
  image: mediaIdLocal('b37fef_2900ee49212d439c92922559b79ca105~mv2.jpg'),
  desc: 'Learn to prevent and manage problems in the water. The most rewarding course you’ll take.',
  ja: {
    title: 'PADIレスキュー・ダイバー',
    desc: '水中でのトラブルを未然に防ぎ、対処する方法を学びます。もっともやりがいのあるコースです。',
  },
  'zh-TW': {
    title: 'PADI 救援潛水員',
    desc: '學習預防並處理水中狀況，這是你會上到最有成就感的一門課。',
  },
}
