import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 10,
  title: 'PADI Open Water Course',
  image: mediaIdLocal('b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg'),
  images: [
    mediaIdLocal('b37fef_9c73f7e0bb244570a119812991ef0ab9~mv2.jpg'),
    mediaIdLocal('b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg'),
    mediaIdLocal('b37fef_37847cf1b32a413990cb7b558835954f~mv2.jpg'),
    mediaIdLocal('b37fef_594f84e342954c95b442c5b67f5fb454~mv2.jpg'),
  ],
  desc: 'Your scuba adventure starts here, your first full certification, diving to 18m anywhere in the world.',
  ja: {
    title: 'PADIオープン・ウォーター・コース',
    desc: 'スクーバの冒険はここから。世界中どこでも水深18mまで潜れる、あなたにとって最初の本格的な認定です。',
  },
  'zh-TW': {
    title: 'PADI 開放水域潛水員課程',
    desc: '你的水肺冒險由此展開，人生第一張正式潛水證照，能在全世界潛至 18 公尺。',
  },
}
