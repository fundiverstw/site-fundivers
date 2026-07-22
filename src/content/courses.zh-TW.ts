import type { CourseText } from './courses'

// 繁體中文（台灣）— course card title + description, keyed by course route id
// (courseId(slug)). Merged over the English by $engine/i18n-content. Same keys
// as COURSES_TEXT_EN — a parity test enforces it.

export const coursesZhTW: Record<string, CourseText> = {
  'padi-open-water-course': {
    title: 'PADI 開放水域潛水員課程',
    desc: '你的水肺冒險由此展開，人生第一張正式潛水證照，能在全世界潛至 18 公尺。',
  },
  'padi-advanced-course': {
    title: 'PADI 進階開放水域潛水員',
    desc: '包含深潛與導航在內的五趟冒險潛水，將技巧與信心提升到 30 公尺。',
  },
  'padi-rescue-diver-course': {
    title: 'PADI 救援潛水員',
    desc: '學習預防並處理水中狀況，這是你會上到最有成就感的一門課。',
  },
  'padi-divemaster-course': {
    title: 'PADI 潛水長',
    desc: '你的第一個專業級別，帶領持證潛水員並在課程中協助教學。',
  },
  'padi-master-scuba-diver': {
    title: 'PADI 名仕潛水員',
    desc: '休閒潛水的最高級別，躋身經驗最豐富的潛水員之列。',
  },
  'padi-discover-scuba-diving-program': {
    title: 'PADI 體驗水肺潛水',
    desc: '一堂課即可體驗水肺，無需證照，最完美的潛水初體驗。',
  },
  'padi-refresher-course': {
    title: '潛水複習課程',
    desc: '休息一陣子了嗎？下水前先喚回你的技巧與信心。',
  },
  'padi-efr-course': {
    title: 'PADI EFR 課程',
    desc: '緊急第一反應，CPR 與初級／次級救護，潛水員與一般人都適用。',
  },
  'padi-o2-provider-course': {
    title: 'PADI 氧氣提供者',
    desc: '學習在潛水緊急狀況中，為潛水員提供緊急氧氣。',
  },
  'padi-enriched-air-specialty-course': {
    title: 'PADI 高氧空氣（Nitrox）',
    desc: '用高氧空氣潛得更久，安全使用 Nitrox，延長免減壓時間。',
  },
  'padi-deep-diver-specialty': {
    title: 'PADI 深潛專長',
    desc: '拓展你的極限，學會安全規劃並享受深至 40 公尺的潛水。',
  },
  'padi-night-diver-specialty': {
    title: 'PADI 夜潛專長',
    desc: '探索入夜後截然不同的世界，燈光、導航與夜行海洋生物。',
  },
  'padi-search-recovery-specialty': {
    title: 'PADI 搜索與尋回專長',
    desc: '搜索與尋回技巧，運用搜索路徑與浮力起吊，找回失落的物品。',
  },
  'padi-drift-diver-specialty': {
    title: 'PADI 放流潛水專長',
    desc: '順流而行，以正確的技巧與意識，在海流中輕鬆潛水。',
  },
  'padi-peak-performance-buoyancy-specialty': {
    title: 'PADI 頂尖中性浮力專長',
    desc: '掌握中性浮力，讓潛水更輕鬆、優雅又省氣。',
  },
  'padi-underwater-navigator-specialty': {
    title: 'PADI 水底導航專長',
    desc: '善用指北針與自然導航找到方向，再也不會找不到船。',
  },
  'padi-boat-diver-specialty': {
    title: 'PADI 船潛專長',
    desc: '熟悉各種船隻的船潛，從快艇到船宿都難不倒你。',
  },
  'padi-equipment-specialist': {
    title: 'PADI 裝備專家',
    desc: '了解、保養並自行微調你的潛水裝備。',
  },
  'padi-digital-underwater-photographer-specialty': {
    title: 'PADI 數位水底攝影專長',
    desc: '捕捉水中世界，在潛水時拍出精采的照片與影片。',
  },
  'padi-fish-identification-specialty': {
    title: 'PADI 魚類辨識專長',
    desc: '學會辨識每趟潛水都會遇見的魚類科別與物種。',
  },
}
