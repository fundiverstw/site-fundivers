import { mediaIdLocal } from '$engine/images'
import type { CourseCardFile } from '../types'

export const card: CourseCardFile = {
  order: 140,
  // Cover photo: a shot of the Wan An Jian wreck, which is also in the
  // dive-site pool under photos/dive-sites/wan-an-jian-navy-wreck/. Card
  // covers are read from photos/media/ by filename, so it lives there too.
  // Note the underscore: mediaIdLocal slugifies its argument by replacing
  // every non-alphanumeric character with '_', so a media file named with a
  // hyphen can never be looked up and the card silently loses its photo.
  title: 'PADI Wreck Specialty',
  image: mediaIdLocal('wreck_specialty'),
  desc: 'Explore sunken ships and structures safely, survey a wreck, map it, and dive it with a plan.',
  ja: {
    title: 'PADIレック・スペシャルティ',
    desc: '沈船や水中構造物を安全に探検。レックをサーベイし、地図を描き、計画を立てて潜ります。',
  },
  'zh-TW': {
    title: 'PADI 沉船專長',
    desc: '安全探索沉船與水下構造物，學會勘查沉船、繪製地圖，並依計畫下潛。',
  },
}
