import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 40,
  title: 'PADI Divemaster',
  image: mediaIdLocal('b37fef_be75746689c74bf28fdd76aeed8451f6~mv2.jpg'),
  desc: 'Your first professional rating, lead certified divers and assist on courses.',
  ja: {
    title: 'PADIダイブマスター',
    desc: '最初のプロ資格。認定ダイバーを引率し、コースをアシストします。',
  },
  'zh-TW': {
    title: 'PADI 潛水長',
    desc: '你的第一個專業級別，帶領持證潛水員並在課程中協助教學。',
  },
}
