import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 50,
  title: 'PADI Master Scuba Diver',
  image: mediaIdLocal('b37fef_3fe5fa0d4b464f5c89a9300f2e818dc5~mv2.jpg'),
  desc: 'The highest recreational rating, your place among the most experienced divers.',
  ja: {
    title: 'PADIマスター・スクーバ・ダイバー',
    desc: 'レクリエーション最高位の資格。もっとも経験豊富なダイバーの仲間入りです。',
  },
  'zh-TW': {
    title: 'PADI 名仕潛水員',
    desc: '休閒潛水的最高級別，躋身經驗最豐富的潛水員之列。',
  },
}
