import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 180,
  title: 'PADI Boat Diver Specialty',
  image: mediaIdLocal('b37fef_5936cf4b991e488fb1e6fe468d68efd9~mv2.jpg'),
  desc: 'Get comfortable diving from boats of every kind, from RIBs to liveaboards.',
  ja: {
    title: 'PADIボート・ダイバー・スペシャルティ',
    desc: 'RIBからリブアボードまで、あらゆるボートからのダイビングに慣れましょう。',
  },
  'zh-TW': {
    title: 'PADI 船潛專長',
    desc: '熟悉各種船隻的船潛，從快艇到船宿都難不倒你。',
  },
}
