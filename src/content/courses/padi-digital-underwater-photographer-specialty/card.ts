import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 200,
  title: 'PADI Digital UW Imaging',
  image: mediaIdLocal('b37fef_10c43bcdd7344ea197cb5431bc9bd71f~mv2.jpg'),
  desc: 'Capture the underwater world, shoot great photos and video on your dives.',
  ja: {
    title: 'PADIデジタル水中フォトグラファー',
    desc: '水中世界を切り取ろう。ダイビングで素晴らしい写真や動画を撮影します。',
  },
  'zh-TW': {
    title: 'PADI 數位水底攝影專長',
    desc: '捕捉水中世界，在潛水時拍出精采的照片與影片。',
  },
}
