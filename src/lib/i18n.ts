import { writable, derived } from 'svelte/store'

// Lightweight i18n: a locale store (persisted) + a derived `t` dictionary.
// Machine-translated first pass for zh-TW and ja — refine the strings below.
// Only the static UI/marketing copy is translated; data-driven content
// (event titles, schedules, dive-site taglines) comes from the DB in English.

export type Locale = 'en' | 'zh-TW' | 'ja'

export const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'zh-TW', label: '中文' },
  { code: 'ja', label: '日本語' },
]

function initial(): Locale {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('locale')
    if (saved === 'en' || saved === 'zh-TW' || saved === 'ja') return saved
  }
  return 'en'
}

export const locale = writable<Locale>(initial())

export function setLocale(l: Locale) {
  locale.set(l)
  if (typeof localStorage !== 'undefined') localStorage.setItem('locale', l)
  if (typeof document !== 'undefined') document.documentElement.lang = l
}

const en = {
  nav: { courses: 'Courses', sites: 'Sites', map: 'Map', photos: 'Photos', travel: 'Travel', calendar: 'Calendar', team: 'Team', gear: 'Gear' },
  gear: {
    title: 'Gear Sales, Service & Rental',
    subtitle:
      'Everything you need to dive — quality scuba and freediving equipment for sale or rent, plus expert servicing to keep your kit safe and dive-ready.',
    salesTitle: 'Sales',
    salesText:
      'From your first mask and fins to a full technical setup, we help you choose gear that fits you and the way you dive. Try before you buy in-store and get honest advice from working instructors — not a sales script.',
    salesItems: ['Masks, snorkels, fins & booties', 'Wetsuits, hoods, gloves & rash guards', 'BCDs, regulators & dive computers', 'Freediving gear & accessories', 'Tanks, weights & save-a-dive spares'],
    serviceTitle: 'Service',
    serviceText:
      'Keep your life-support gear working the way it should. Our technicians service regulators and BCDs, swap batteries and O-rings, and pressure-check tanks so small problems never become in-water ones.',
    serviceItems: ['Annual regulator service & rebuilds', 'BCD inspection & repair', 'Dive-computer battery replacement', 'Tank visual inspection & fills', 'Wetsuit & drysuit minor repairs'],
    rentalTitle: 'Rental',
    rentalText:
      'Travelling light or trying something before you buy? Rent well-maintained gear by the day or the trip — full sets or single pieces, sized and checked before you leave the shop.',
    rentalItems: ['Full scuba sets & individual pieces', 'Wetsuits in a full range of sizes', 'Dive computers & torches', 'Daily, weekend & trip rates', 'Included with many courses & guided dives'],
    ctaTitle: 'Not sure what you need?',
    ctaText: 'Drop by the shop or message us — we’ll help you find, fit, or fix the right gear.',
  },
  map: {
    title: 'Dive Sites of Taiwan', hint: 'Tap a marker or a region below to zoom in.',
    back: '← Back to overview', shore: 'Shore', boat: 'Boat', diveSites: 'Dive sites', close: 'Close',
  },
  common: {
    readMore: 'Read more', viewOnMap: 'View on map', details: 'Details', book: 'Book', bookNow: 'Book Now',
    register: 'Register', joinWaitlist: 'Join waitlist', waitlist: 'Waitlist', viewAll: 'View all',
    contactUs: 'Contact us', from: 'From', nothingScheduled: 'Nothing scheduled yet.', featured: 'Featured',
    dive: 'Dive', course: 'Course', loadingDetails: 'Loading details…', pendingImage: 'Image coming soon',
  },
  home: {
    featured: 'Featured', upcomingDives: 'Upcoming Dives', upcomingCourses: 'Upcoming Courses',
    exploreServices: 'Explore our Services',
    exploreServicesIntro:
      'Discover the unique and valuable aspects that make Fun Divers TW the top choice for diving enthusiasts. With our extensive experience and dedication to customer satisfaction, we provide exceptional guided trips and convenient booking services as well as all PADI Recreational Dive Courses.',
    services: [
      { title: 'PADI Courses', desc: 'Fun Divers Tw offers the full range of PADI Certification Courses, from beginner to professional level! See the courses available here!' },
      { title: 'Dive Sites', desc: 'Fun Divers Tw offers local shore and boat diving trips. There are many beautiful dive sites to visit here on the northeast coast of Taiwan.' },
      { title: 'Gear Sales, Service, & Rental', desc: 'Fun Divers Tw offers a range of Scuba diving and Free diving gear for Sale or Rental. We can also service regulators and BCDs! Contact us to find out more!' },
      { title: 'International Dive Tours', desc: 'Fun Divers Tw plans group tours to a variety of thrilling destinations! Join one of our planned dive trips or let us help you book your customized trip!' },
      { title: 'Domestic Dive Tours', desc: 'Explore the amazing dive destinations around Taiwan with Fun Divers Tw! Join a planned trip or let us help you book a customized trip.' },
      { title: 'EFR Courses', desc: 'Fun Divers Tw offers the full range of EFR courses. Learn how to help yourself and others in an emergency.' },
    ],
    divingTitle: 'Diving in Taiwan: Exploring a World Beneath the Waves',
    divingParas: [
      'Taiwan, a treasure trove of cultural heritage and natural beauty, offers diving enthusiasts an unparalleled opportunity to delve into the depths of its azure waters. Taiwan caters to divers year round with dive seasons that vary across the regions. Taiwan is generally divided into three dive regions: The North (including Taipei, Keelung, and Yilan), The South (Lambai and Kenting), and the Outlying Islands (Penghu, Green Island, and Orchid Island).',
      'The season in the north stretches from April until Early October, with the warmest months being July and August. Diving is possible during the winter months, but water temperatures drop to 16-18C and wave conditions can be very unpredictable, which make it very difficult to plan ahead of time.',
      'The dive season in the south, however, is all year, since both Kenting and Lambai (Xiao Liuqiu) are sheltered from all but the worst of the winter winds and storms. The water temperature is warmer than the north, only dropping below 22C from January through March.',
      'The outlying islands, with Penghu situated off the west coast, and Green Island and Orchid Island, nestled off the southeastern coast, beckon adventurers with their own dive seasons. The high season spans from April to November with the low season being December through March. During the high season, water temperatures are warmer (25-30C) and conditions are much calmer while the low season sees cooler waters (18-24C) and more unpredictable wave conditions.',
      "Beyond Taiwan's shores, neighboring paradises like the Philippines and Indonesia offer complementary dive seasons, ensuring that the allure of underwater exploration knows no bounds.",
      "Embark on a journey through Taiwan's dive seasons and beyond, where every descent promises a glimpse into a world of wonder beneath the waves.",
    ],
    taglineMain: 'Breathe the Adventure', taglineSub: 'Explore with Confidence',
  },
  getInTouch: {
    title: 'Get In Touch', seeCalendar: 'See Full Calendar', tryDive: 'Schedule a Try-Dive', requestCourse: 'Request a Course',
    name: 'Name', email: 'Email', request: 'Your Request',
    requestPlaceholder: "Dates you're interested in, experience level, anything else we should know...",
    cancel: 'Cancel', send: 'Send Request',
    sent: 'Your email app should have opened with your request ready to send. If it didn’t, email {email} directly.',
    orMessage: 'Or message us directly:',
  },
  courses: {
    title: 'PADI Courses', subtitle: 'Learn to dive, level up, or go pro — the full range of PADI recreational courses in Taiwan.',
    upcomingDates: 'Upcoming course dates',
    noDates: 'No scheduled course dates right now — courses also run on request.', getInTouch: 'Get in touch', enroll: 'Enroll',
  },
  courseDetail: {
    back: '← All courses', overview: 'About this course', youWillLearn: "What you'll learn", quickFacts: 'Course facts',
    prerequisites: 'Prerequisites', minAge: 'Minimum age', duration: 'Duration', depth: 'Max depth', certifies: 'You earn',
    upcoming: 'Upcoming dates', noDates: 'No scheduled dates right now — this course also runs on request.',
    next: 'Where to next', fullPage: 'Full course page', cta: 'Ready to start?',
    ctaText: 'Book a date or ask us anything about this course.', contact: 'Get in touch', notFound: 'That course couldn’t be found.',
  },
  sites: {
    title: 'Dive Sites', subtitle: 'From convenient shore dives in the north to world-class island diving — Taiwan’s underwater highlights.',
    none: 'No dive sites listed yet.', loadError: 'Couldn’t load dive sites',
    areas: { Domestic: 'Domestic' },
  },
  siteDetail: {
    back: '← All dive sites', overview: 'About this site', highlights: 'Highlights', marineLife: 'Marine life',
    quickFacts: 'Quick facts', depth: 'Depth', difficulty: 'Level', season: 'Best season', waterTemp: 'Water temp',
    visibility: 'Visibility', requirements: 'Diver requirements', diveType: 'Dive type', region: 'Region',
    directions: 'Open in Google Maps', morePage: 'Full site page', cta: 'Dive this site',
    ctaText: 'See it on our calendar or ask us about a trip.', seeCalendar: 'See the calendar', contact: 'Get in touch',
    notFound: 'That dive site couldn’t be found.',
  },
  travel: {
    title: 'Dive Travel', subtitle: 'Planned group tours and fully customized trips — around Taiwan and beyond.',
    aroundTaiwan: 'Around Taiwan', international: 'International Dive Tours', loadError: 'Couldn’t load destinations',
    ctaTitle: 'Ready to plan your next trip?',
    ctaText: 'Check upcoming departures on the calendar, or reach out and we’ll help arrange a custom trip.',
    seeCalendar: 'See the Calendar', planCustom: 'Plan a custom trip',
  },
  calendar: {
    title: 'Calendar', subtitle: 'Dives and courses on the schedule. Tap any event for details and to reserve your spot.',
    all: 'All', dives: 'Dives', courses: 'Courses', thisMonth: 'This month', noEvents: 'No events scheduled.',
    loadError: 'Couldn’t load the calendar', full: 'This event is full — join the waitlist.',
    details: { about: 'About this event', included: "What's included", notIncluded: 'Not included', schedule: 'Schedule / itinerary', transportation: 'Transportation', prerequisites: 'Prerequisites', minCert: 'Minimum certification:', loggedDives: 'Logged dives:' },
  },
  photos: {
    title: 'Photos', subtitle: 'A glimpse of life beneath the waves with FunDivers TW.',
    seeMore: 'See more on social', follow: 'Follow along for trip recaps, marine life, and behind-the-scenes.',
    sections: { nudibranchs: 'Nudibranchs', reef: 'Reef Life' },
    close: 'Close', prev: 'Previous', next: 'Next',
  },
  team: {
    title: 'Fun Divers Team', subtitle: 'Dedication. Expertise. Passion.', visitWebsite: 'Visit website →',
    diveWithUs: 'Dive with us', diveWithUsText: 'Questions about a course or trip? We’re happy to help.',
    roles: { idc: 'IDC Staff Instructor', instructor: 'Instructor', divemaster: 'Divemaster' },
  },
  footer: {
    blurb: 'Guided dive trips, PADI courses, and the best dive sites across Taiwan and beyond.',
    contact: 'Contact', follow: 'Follow', rights: 'Fun Divers Taiwan. All rights reserved.', proudly: 'Proudly created with 🤿 ❤️ in Taipei', openSource: 'Open source',
    openSourceBlurb: 'We proudly develop FunDive, our open-source dive-shop management software.',
  },
  notFound: { code: '404', title: 'Page not found', text: 'That page has drifted off with the current.', back: 'Back to home' },
}

export type Dict = typeof en

const zhTW: Dict = {
  nav: { courses: '課程', sites: '潛點', map: '地圖', photos: '相片', travel: '旅遊', calendar: '行事曆', team: '團隊', gear: '裝備' },
  gear: {
    title: '裝備銷售、維修與租借',
    subtitle: '潛水所需的一切——優質的水肺與自由潛水裝備，可購買或租借，並提供專業維修保養，讓你的裝備隨時安全、隨時可下水。',
    salesTitle: '銷售',
    salesText: '從你的第一副面鏡與蛙鞋，到完整的技術潛水配置，我們協助你挑選最適合自己與潛水方式的裝備。可在店內試用，並由現役教練提供誠實建議，而非制式推銷。',
    salesItems: ['面鏡、呼吸管、蛙鞋與潛水靴', '防寒衣、頭套、手套與防磨衣', 'BCD、調節器與潛水電腦錶', '自由潛水裝備與配件', '氣瓶、配重與備用小物'],
    serviceTitle: '維修',
    serviceText: '讓你的生命支持裝備維持在最佳狀態。我們的技師維修調節器與 BCD，更換電池與 O 環，並檢測氣瓶壓力，讓小問題不會在水下變成大麻煩。',
    serviceItems: ['調節器年度保養與翻修', 'BCD 檢查與維修', '潛水電腦錶更換電池', '氣瓶目視檢查與充氣', '防寒衣與乾衣小修'],
    rentalTitle: '租借',
    rentalText: '輕裝旅行，或想在購買前先試用？可依天數或行程租借保養良好的裝備——整套或單件，出店前皆已調整尺寸並檢查完畢。',
    rentalItems: ['整套水肺裝備與單件租借', '各種尺寸的防寒衣', '潛水電腦錶與手電筒', '單日、週末與行程費率', '多數課程與帶領潛水已含裝備'],
    ctaTitle: '不確定需要什麼？',
    ctaText: '歡迎到店或傳訊給我們——我們會協助你找到、試穿或維修合適的裝備。',
  },
  map: {
    title: '台灣潛點地圖', hint: '點選標記或下方地區以放大。',
    back: '← 返回總覽', shore: '岸潛', boat: '船潛', diveSites: '潛點', close: '關閉',
  },
  common: {
    readMore: '了解更多', viewOnMap: '查看地圖', details: '詳情', book: '預約', bookNow: '立即預約',
    register: '報名', joinWaitlist: '加入候補', waitlist: '候補', viewAll: '查看全部',
    contactUs: '聯絡我們', from: '起', nothingScheduled: '目前尚未安排。', featured: '精選',
    dive: '潛水', course: '課程', loadingDetails: '載入詳情中…', pendingImage: '照片即將上架',
  },
  home: {
    featured: '精選', upcomingDives: '近期潛水', upcomingCourses: '近期課程',
    exploreServices: '探索我們的服務',
    exploreServicesIntro:
      '了解讓 Fun Divers TW 成為潛水愛好者首選的獨特之處。憑藉豐富的經驗與對顧客滿意度的堅持，我們提供出色的導潛行程、便捷的預約服務，以及全系列 PADI 休閒潛水課程。',
    services: [
      { title: 'PADI 課程', desc: 'Fun Divers TW 提供全系列 PADI 認證課程，從初學者到專業等級！在此查看可報名的課程！' },
      { title: '潛點', desc: 'Fun Divers TW 提供在地的岸潛與船潛行程。台灣東北角有許多美麗的潛點等你來探索。' },
      { title: '裝備銷售、保養與租借', desc: 'Fun Divers TW 提供各式水肺與自由潛水裝備銷售或租借，也可保養調節器與 BCD！歡迎洽詢了解更多！' },
      { title: '國際潛旅', desc: 'Fun Divers TW 規劃前往各個精彩目的地的團體行程！參加我們安排好的潛旅，或讓我們協助你規劃客製化行程！' },
      { title: '國內潛旅', desc: '與 Fun Divers TW 一起探索台灣周邊絕美的潛水勝地！參加既定行程，或讓我們協助你規劃客製化行程。' },
      { title: 'EFR 急救課程', desc: 'Fun Divers TW 提供全系列 EFR 課程，學習在緊急時刻幫助自己與他人。' },
    ],
    divingTitle: '在台灣潛水：探索波濤之下的世界',
    divingParas: [
      '台灣擁有豐富的文化底蘊與自然之美，為潛水愛好者提供深入碧藍海域的絕佳機會。台灣全年皆可潛水，各地區的潛水季節各有不同。一般將台灣分為三大潛水區域：北部（含台北、基隆、宜蘭）、南部（小琉球與墾丁），以及離島（澎湖、綠島與蘭嶼）。',
      '北部的潛水季從四月延續到十月初，最溫暖的月份為七月與八月。冬季雖仍可潛水，但水溫會降至 16–18°C，且海況難以預測，較難提前安排。',
      '南部則全年皆為潛水季，因為墾丁與小琉球都能避開大部分冬季強風與風浪。水溫也比北部溫暖，僅在一月至三月之間降至 22°C 以下。',
      '離島方面，澎湖位於西岸，綠島與蘭嶼則坐落於東南外海，各有專屬的潛水季節。旺季為四月至十一月，淡季則為十二月至三月。旺季水溫較暖（25–30°C）、海況更為平穩；淡季水溫較涼（18–24°C），海況也較難預測。',
      '在台灣之外，鄰近的菲律賓與印尼等潛水天堂擁有互補的潛水季節，讓水下探索的魅力永無止境。',
      '踏上一段穿越台灣潛水季節與更遠方的旅程，每一次下潛都是窺見波濤之下奇妙世界的機會。',
    ],
    taglineMain: '盡情探險', taglineSub: '安心潛水',
  },
  getInTouch: {
    title: '聯絡我們', seeCalendar: '查看完整行事曆', tryDive: '預約體驗潛水', requestCourse: '報名課程諮詢',
    name: '姓名', email: '電子郵件', request: '您的需求',
    requestPlaceholder: '您感興趣的日期、潛水經驗，或其他想讓我們知道的事…',
    cancel: '取消', send: '送出需求',
    sent: '您的郵件程式應已開啟並填好需求內容，等待寄出。若未開啟，請直接寄信至 {email}。',
    orMessage: '或直接傳訊給我們：',
  },
  courses: {
    title: 'PADI 課程', subtitle: '學習潛水、提升等級或邁向專業——台灣全系列 PADI 休閒潛水課程。',
    upcomingDates: '近期課程日期',
    noDates: '目前沒有排定的課程日期——課程亦可依需求安排。', getInTouch: '與我們聯絡', enroll: '報名',
  },
  courseDetail: {
    back: '← 所有課程', overview: '課程介紹', youWillLearn: '你將學到', quickFacts: '課程資訊',
    prerequisites: '先修資格', minAge: '最低年齡', duration: '時長', depth: '最大深度', certifies: '取得資格',
    upcoming: '近期日期', noDates: '目前沒有排定的日期——本課程亦可依需求安排。',
    next: '接下來', fullPage: '完整課程頁面', cta: '準備好開始了嗎？',
    ctaText: '預約日期，或詢問我們關於這門課程的任何問題。', contact: '與我們聯絡', notFound: '找不到這門課程。',
  },
  sites: {
    title: '潛點', subtitle: '從北部便利的岸潛到世界級的離島潛水——台灣水下的精華亮點。',
    none: '尚未列出任何潛點。', loadError: '無法載入潛點',
    areas: { Domestic: '國內' },
  },
  siteDetail: {
    back: '← 所有潛點', overview: '潛點介紹', highlights: '亮點', marineLife: '海洋生物',
    quickFacts: '重點資訊', depth: '深度', difficulty: '等級', season: '最佳季節', waterTemp: '水溫',
    visibility: '能見度', requirements: '潛水員資格', diveType: '潛水類型', region: '區域',
    directions: '在 Google 地圖開啟', morePage: '完整潛點頁面', cta: '來潛這個點',
    ctaText: '在行事曆上查看，或詢問我們的行程。', seeCalendar: '查看行事曆', contact: '聯絡我們',
    notFound: '找不到這個潛點。',
  },
  travel: {
    title: '潛旅', subtitle: '既定團體行程與完全客製化的旅程——台灣與更遠的地方。',
    aroundTaiwan: '台灣周邊', international: '國際潛旅', loadError: '無法載入目的地',
    ctaTitle: '準備好規劃下一趟旅程了嗎？',
    ctaText: '在行事曆查看近期出團，或與我們聯絡，協助你安排客製化行程。',
    seeCalendar: '查看行事曆', planCustom: '規劃客製化行程',
  },
  calendar: {
    title: '行事曆', subtitle: '潛水與課程行程一覽。點選任一活動查看詳情並預約名額。',
    all: '全部', dives: '潛水', courses: '課程', thisMonth: '本月', noEvents: '尚無排定的活動。',
    loadError: '無法載入行事曆', full: '此活動已額滿——請加入候補名單。',
    details: { about: '活動介紹', included: '費用包含', notIncluded: '費用不含', schedule: '行程／時程', transportation: '交通', prerequisites: '報名條件', minCert: '最低證照等級：', loggedDives: '潛水紀錄支數：' },
  },
  photos: {
    title: '相片', subtitle: '與 FunDivers TW 一起一窺波濤之下的精彩。',
    seeMore: '在社群看更多', follow: '追蹤我們，看行程回顧、海洋生物與幕後花絮。',
    sections: { nudibranchs: '海蛞蝓', reef: '珊瑚礁生態' },
    close: '關閉', prev: '上一張', next: '下一張',
  },
  team: {
    title: 'Fun Divers 團隊', subtitle: '專注。專業。熱情。', visitWebsite: '造訪網站 →',
    diveWithUs: '與我們一起潛水', diveWithUsText: '對課程或行程有任何疑問？我們很樂意協助。',
    roles: { idc: 'IDC 資深教練', instructor: '教練', divemaster: '潛水長' },
  },
  footer: {
    blurb: '導潛行程、PADI 課程，以及台灣與更遠方最棒的潛點。',
    contact: '聯絡', follow: '追蹤', rights: 'Fun Divers Taiwan 版權所有。', proudly: '在台北以 🤿 ❤️ 用心打造', openSource: '開源專案',
    openSourceBlurb: '我們自豪地開發 FunDive——我們的開源潛水店管理軟體。',
  },
  notFound: { code: '404', title: '找不到頁面', text: '這個頁面隨著洋流漂走了。', back: '回到首頁' },
}

const ja: Dict = {
  nav: { courses: 'コース', sites: 'ダイブサイト', map: 'マップ', photos: 'フォト', travel: 'ツアー', calendar: 'カレンダー', team: 'チーム', gear: 'ギア' },
  gear: {
    title: 'ギアの販売・メンテナンス・レンタル',
    subtitle: 'ダイビングに必要なものすべて——高品質なスキューバ＆フリーダイビング用品の販売とレンタル、そして装備を安全でいつでも潜れる状態に保つ専門メンテナンス。',
    salesTitle: '販売',
    salesText: '最初のマスクとフィンから本格的なテクニカル構成まで、あなたとダイビングスタイルに合ったギア選びをお手伝いします。店内で試してから購入でき、現役インストラクターが台本ではなく本音でアドバイスします。',
    salesItems: ['マスク・スノーケル・フィン・ブーツ', 'ウェットスーツ・フード・グローブ・ラッシュガード', 'BCD・レギュレーター・ダイブコンピューター', 'フリーダイビング用品・アクセサリー', 'タンク・ウェイト・予備パーツ'],
    serviceTitle: 'メンテナンス',
    serviceText: '生命維持装置であるギアを最適な状態に保ちます。レギュレーターやBCDのオーバーホール、電池やOリングの交換、タンクの圧力チェックを行い、小さな不具合が水中で大きな問題にならないようにします。',
    serviceItems: ['レギュレーターの年次点検・オーバーホール', 'BCDの点検・修理', 'ダイブコンピューターの電池交換', 'タンクの目視点検・充填', 'ウェット／ドライスーツの軽微な修理'],
    rentalTitle: 'レンタル',
    rentalText: '身軽に旅したい、購入前に試したい方へ。よく整備されたギアを日単位・ツアー単位でレンタルできます。フルセットも単品も、お渡し前にサイズ合わせと点検を行います。',
    rentalItems: ['スキューバフルセット・単品レンタル', '各サイズのウェットスーツ', 'ダイブコンピューター・ライト', '1日・週末・ツアー料金', '多くのコース・ガイドダイブに込み'],
    ctaTitle: '何が必要かお悩みですか？',
    ctaText: 'お店にお立ち寄りいただくか、メッセージをどうぞ——最適なギア選び・フィッティング・修理をお手伝いします。',
  },
  map: {
    title: '台湾のダイブサイト', hint: 'マーカーまたは下の地域をタップして拡大します。',
    back: '← 概要に戻る', shore: 'ビーチ', boat: 'ボート', diveSites: 'ダイブサイト', close: '閉じる',
  },
  common: {
    readMore: '詳しく見る', viewOnMap: '地図で見る', details: '詳細', book: '予約', bookNow: '今すぐ予約',
    register: '申し込む', joinWaitlist: 'キャンセル待ち', waitlist: 'キャンセル待ち', viewAll: 'すべて見る',
    contactUs: 'お問い合わせ', from: '〜', nothingScheduled: '現在予定はありません。', featured: 'おすすめ',
    dive: 'ダイブ', course: 'コース', loadingDetails: '詳細を読み込み中…', pendingImage: '写真は近日公開',
  },
  home: {
    featured: 'おすすめ', upcomingDives: '今後のダイビング', upcomingCourses: '今後のコース',
    exploreServices: 'サービス一覧',
    exploreServicesIntro:
      'Fun Divers TW がダイビング愛好家に選ばれる理由をご紹介します。豊富な経験とお客様満足への徹底したこだわりで、質の高いガイドツアーと便利な予約サービス、そして PADI レクリエーショナル・ダイビングコースの全種類をご提供します。',
    services: [
      { title: 'PADI コース', desc: 'Fun Divers TW は初心者からプロレベルまで、PADI 認定コースをフルラインナップでご用意！ご受講いただけるコースはこちらから！' },
      { title: 'ダイブサイト', desc: 'Fun Divers TW では地元のビーチダイブ・ボートダイブをご案内。台湾北東海岸には美しいダイブサイトが数多くあります。' },
      { title: '器材の販売・メンテナンス・レンタル', desc: 'Fun Divers TW ではスキューバ・フリーダイビング器材の販売やレンタルを行っています。レギュレーターや BCD のメンテナンスも可能です！詳しくはお問い合わせください。' },
      { title: '海外ダイブツアー', desc: 'Fun Divers TW は魅力的な各地へのグループツアーを企画しています！企画ツアーへの参加も、オーダーメイドの手配もおまかせください！' },
      { title: '国内ダイブツアー', desc: 'Fun Divers TW と一緒に台湾各地の素晴らしいダイブスポットへ！企画ツアーへの参加も、オーダーメイドの手配もおまかせください。' },
      { title: 'EFR コース', desc: 'Fun Divers TW は EFR コースをフルラインナップでご用意。緊急時に自分と周囲を助ける方法を学べます。' },
    ],
    divingTitle: '台湾でダイビング：波の下の世界を探検する',
    divingParas: [
      '豊かな文化遺産と自然の美しさを誇る台湾は、ダイバーに碧い海の奥深くへと潜る格別な機会を提供します。台湾は一年を通してダイビングが楽しめ、地域ごとにシーズンが異なります。台湾は大きく三つのダイブ地域に分けられます。北部（台北・基隆・宜蘭）、南部（小琉球・墾丁）、そして離島（澎湖・緑島・蘭嶼）です。',
      '北部のシーズンは4月から10月初旬まで続き、最も暖かいのは7月と8月です。冬季もダイビングは可能ですが、水温は16〜18℃まで下がり、波の状況も読みにくいため、事前の計画は難しくなります。',
      '一方、南部は一年中がシーズンです。墾丁と小琉球はほとんどの冬の強風や嵐から守られているためです。水温も北部より暖かく、1月から3月の間だけ22℃を下回ります。',
      '離島は、西岸に位置する澎湖、南東沖に浮かぶ緑島と蘭嶼が、それぞれ独自のシーズンでダイバーを迎えます。ハイシーズンは4月から11月、ローシーズンは12月から3月です。ハイシーズンは水温が暖かく（25〜30℃）、海況も穏やか。ローシーズンは水温が低め（18〜24℃）で、波の状況も読みにくくなります。',
      '台湾の海を越えれば、フィリピンやインドネシアといった近隣の楽園が補完的なシーズンを提供し、水中探検の魅力は尽きることがありません。',
      '台湾のダイブシーズン、そしてその先へと旅に出ましょう。一本一本のダイブが、波の下に広がる驚きの世界を垣間見せてくれます。',
    ],
    taglineMain: '冒険を呼吸しよう', taglineSub: '自信を持って潜ろう',
  },
  getInTouch: {
    title: 'お問い合わせ', seeCalendar: 'カレンダーを見る', tryDive: '体験ダイビングを予約', requestCourse: 'コースを相談する',
    name: 'お名前', email: 'メール', request: 'ご要望',
    requestPlaceholder: 'ご希望の日程、経験レベル、その他お伝えいただきたいこと…',
    cancel: 'キャンセル', send: '送信する',
    sent: 'メールアプリが開き、ご要望が入力された状態になっているはずです。開かない場合は {email} まで直接ご連絡ください。',
    orMessage: 'または直接メッセージでどうぞ：',
  },
  courses: {
    title: 'PADI コース', subtitle: 'これから始める方も、ステップアップやプロを目指す方も——台湾の PADI レクリエーショナルコース全種類。',
    upcomingDates: '今後のコース日程',
    noDates: '現在予定されているコース日程はありません——コースはリクエストでも開催します。', getInTouch: 'お問い合わせ', enroll: '申し込む',
  },
  courseDetail: {
    back: '← すべてのコース', overview: 'コース紹介', youWillLearn: '学べること', quickFacts: 'コース情報',
    prerequisites: '受講条件', minAge: '最低年齢', duration: '所要日数', depth: '最大水深', certifies: '取得資格',
    upcoming: '開催予定', noDates: '現在予定されている日程はありません——このコースはリクエストでも開催します。',
    next: '次のステップ', fullPage: 'コース詳細ページ', cta: '始めませんか？',
    ctaText: '日程を予約するか、このコースについてお気軽にお問い合わせください。', contact: 'お問い合わせ', notFound: 'そのコースが見つかりませんでした。',
  },
  sites: {
    title: 'ダイブサイト', subtitle: '北部の手軽なビーチダイブから世界クラスの離島ダイビングまで——台湾の水中ハイライト。',
    none: 'まだダイブサイトが登録されていません。', loadError: 'ダイブサイトを読み込めませんでした',
    areas: { Domestic: '国内' },
  },
  siteDetail: {
    back: '← すべてのダイブサイト', overview: 'サイト紹介', highlights: '見どころ', marineLife: '海の生き物',
    quickFacts: '基本情報', depth: '水深', difficulty: 'レベル', season: 'ベストシーズン', waterTemp: '水温',
    visibility: '透明度', requirements: 'ダイバー要件', diveType: 'ダイブタイプ', region: 'エリア',
    directions: 'Google マップで開く', morePage: 'サイト詳細ページ', cta: 'このサイトで潜る',
    ctaText: 'カレンダーで確認するか、ツアーについてお問い合わせください。', seeCalendar: 'カレンダーを見る', contact: 'お問い合わせ',
    notFound: 'そのダイブサイトが見つかりませんでした。',
  },
  travel: {
    title: 'ダイブツアー', subtitle: '企画グループツアーから完全オーダーメイドの旅まで——台湾、そしてその先へ。',
    aroundTaiwan: '台湾周辺', international: '海外ダイブツアー', loadError: '目的地を読み込めませんでした',
    ctaTitle: '次の旅の準備はできましたか？',
    ctaText: 'カレンダーで近日出発のツアーをチェック、またはお問い合わせください。オーダーメイドの旅もお手伝いします。',
    seeCalendar: 'カレンダーを見る', planCustom: 'オーダーメイドを相談',
  },
  calendar: {
    title: 'カレンダー', subtitle: 'ダイビングとコースの予定一覧。イベントをタップすると詳細と予約ができます。',
    all: 'すべて', dives: 'ダイブ', courses: 'コース', thisMonth: '今月', noEvents: '予定されているイベントはありません。',
    loadError: 'カレンダーを読み込めませんでした', full: 'このイベントは満席です——キャンセル待ちにご登録ください。',
    details: { about: 'イベントについて', included: '料金に含まれるもの', notIncluded: '料金に含まれないもの', schedule: 'スケジュール／行程', transportation: '交通', prerequisites: '参加条件', minCert: '必要な認定ランク：', loggedDives: 'ログダイブ本数：' },
  },
  photos: {
    title: 'フォト', subtitle: 'FunDivers TW と一緒に、波の下の世界をのぞいてみましょう。',
    seeMore: 'SNS でもっと見る', follow: 'ツアーの様子や海の生き物、舞台裏をフォローしてチェック。',
    sections: { nudibranchs: 'ウミウシ', reef: 'リーフの生き物' },
    close: '閉じる', prev: '前へ', next: '次へ',
  },
  team: {
    title: 'Fun Divers チーム', subtitle: '献身。専門性。情熱。', visitWebsite: 'ウェブサイトへ →',
    diveWithUs: '一緒に潜りましょう', diveWithUsText: 'コースやツアーについてのご質問は、お気軽にどうぞ。',
    roles: { idc: 'IDC スタッフインストラクター', instructor: 'インストラクター', divemaster: 'ダイブマスター' },
  },
  footer: {
    blurb: 'ガイド付きダイブツアー、PADI コース、そして台湾とその先の最高のダイブサイト。',
    contact: '連絡先', follow: 'フォロー', rights: 'Fun Divers Taiwan. All rights reserved.', proudly: '台北で 🤿 ❤️ を込めて制作', openSource: 'オープンソース',
    openSourceBlurb: 'オープンソースのダイビングショップ管理ソフト「FunDive」を開発しています。',
  },
  notFound: { code: '404', title: 'ページが見つかりません', text: 'そのページは潮に流されてしまったようです。', back: 'ホームへ戻る' },
}

const messages: Record<Locale, Dict> = { en, 'zh-TW': zhTW, ja }

export const t = derived(locale, ($l) => messages[$l])
