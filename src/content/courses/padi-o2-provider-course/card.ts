import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 90,
  title: 'PADI O2 Provider',
  image: mediaIdLocal('cfd7bffa5c38490ca6d89a820ee52d51.jpg'),
  desc: 'Learn to provide emergency oxygen to a diver in a diving emergency.',
  ja: {
    title: 'PADI酸素プロバイダー',
    desc: 'ダイビング事故の際に、ダイバーへ応急的に酸素を供給する方法を学びます。',
  },
  'zh-TW': {
    title: 'PADI 氧氣提供者',
    desc: '學習在潛水緊急狀況中，為潛水員提供緊急氧氣。',
  },
}
