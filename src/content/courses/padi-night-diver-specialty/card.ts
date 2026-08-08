import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 120,
  title: 'PADI Night Diver Specialty',
  image: mediaIdLocal('b37fef_c011dec9802b4c93a9f9310fff82388d~mv2.jpg'),
  desc: 'Discover a whole new world after dark, lights, navigation, and nocturnal marine life.',
  ja: {
    title: 'PADIナイト・ダイバー・スペシャルティ',
    desc: '暗闇に広がるまったく新しい世界へ。ライト、ナビゲーション、夜行性の生き物を楽しみます。',
  },
  'zh-TW': {
    title: 'PADI 夜潛專長',
    desc: '探索入夜後截然不同的世界，燈光、導航與夜行海洋生物。',
  },
}
