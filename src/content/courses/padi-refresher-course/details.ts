import type { CourseDetailsFile } from '../types'

export const details: CourseDetailsFile = {
  intro:
    "Been a while since your last dive? Shake off the rust and rebuild your confidence. In a relaxed refresher with a PADI Instructor at your side, you'll revisit the key knowledge and practise the skills that matter, so you can get back beneath the surface feeling sharp, safe, and ready to explore again.",
  overview:
    "If you haven't dived in a while, the Refresher Course is exactly what you need. Together with a PADI Instructor you'll review the important knowledge points and run through the essential skills, mask clearing, regulator recovery, buoyancy and more, until they feel second nature again. It's the easiest way to trade any nerves for confidence and make sure your return to diving is a safe and enjoyable one.",
  youWillLearn: [
    'Refreshing core safety skills',
    'Reviewing dive planning and equipment',
    'Rebuilding comfort and buoyancy',
    'Updating on current best practice',
  ],
  prerequisites: 'Certified diver returning after a break',
  prereqList: ["Recommended for any certified diver who hasn't dived in more than 6 months."],
  minAge: '10+',
  duration: 'Half a day',
  depth: null,
  certifies: 'Skills refresh (PADI ReActivate)',
  timeFrame:
    "The Refresher Course starts with a brief knowledge review, then heads out for 2 dives where you'll put the skills back into practice. Your PADI Instructor watches over each dive and gives you personal feedback and tips to sharpen your diving, so you finish more capable and comfortable than when you arrived.",
  materials: ["No materials needed, we've got you covered."],
  equipment: [
    "Equipment isn't included in the course price, but we can provide rental gear as needed.",
  ],
  subsections: [[], ['overview'], ['prerequisites', 'timeFrame'], ['materials', 'equipment']],
  matchCodes: ['refresher'],
  next: ['padi-advanced-course', 'padi-enriched-air-specialty-course'],
  ja: {
    intro:
      '最後のダイブからしばらく経っていますか？ブランクを解消して、自信を取り戻しましょう。PADIインストラクターがそばに付いたリラックスしたリフレッシュで、大切な知識をおさらいし、重要なスキルを練習します。感覚を取り戻し、安全に、そしてまた探検する準備が整った状態で、水面下へ戻れます。',
    overview:
      'しばらく潜っていないなら、リフレッシュ・コースがまさに必要なものです。PADIインストラクターと一緒に、大切な知識のポイントを復習し、マスククリア、レギュレーターリカバリー、浮力などの基本スキルを、再び自然に感じられるようになるまで一通りおさらいします。不安を自信に変え、ダイビングへの復帰を安全で楽しいものにする、いちばん簡単な方法です。',
    youWillLearn: [
      '基本の安全スキルのリフレッシュ',
      'ダイブプランニングと器材の復習',
      '快適さと浮力の取り戻し',
      '最新のベストプラクティスへのアップデート',
    ],
    prerequisites: 'ブランクを経て復帰する認定ダイバー',
    prereqList: ['6か月以上潜っていないすべての認定ダイバーにおすすめします。'],
    minAge: '10歳以上',
    duration: '半日',
    certifies: 'スキルのリフレッシュ（PADI ReActivate）',
    timeFrame:
      'リフレッシュ・コースは、まず簡単な知識の復習から始まり、それからスキルを実践し直す2本のダイブへ出かけます。PADIインストラクターが各ダイブを見守り、ダイビングをより磨くための個別のフィードバックとアドバイスをお伝えします。到着したときよりも自信と快適さを持って終えられます。',
    materials: ['教材は必要ありません。すべてこちらでご用意します。'],
    equipment: ['器材はコース料金に含まれていませんが、必要に応じてレンタル器材をご用意できます。'],
  },
  'zh-TW': {
    intro:
      '距離上次潛水已經有段時間了嗎？揮別生疏，重建你的信心。在 PADI 教練的陪伴下，於一堂輕鬆的複習課程中重溫關鍵知識、練習重要技巧，讓你重回水下時依然敏銳、安全，隨時準備好再次探索。',
    overview:
      '如果你已有一段時間沒潛水，複習課程正是你需要的。你將與 PADI 教練一起複習重要的知識重點，並演練面鏡排水、調節器尋回、中性浮力等必備技巧，直到它們再次成為你的直覺反應。這是把緊張換成自信、確保你安全又愉快地重返潛水最輕鬆的方式。',
    youWillLearn: [
      '複習核心安全技巧',
      '重溫潛水規劃與裝備',
      '重建自在感與中性浮力',
      '更新目前的最佳實務做法',
    ],
    prerequisites: '休息一段時間後重返水域的持證潛水員',
    prereqList: ['建議任何超過 6 個月未潛水的持證潛水員參加。'],
    minAge: '10 歲以上',
    duration: '半天',
    certifies: '技巧複習（PADI ReActivate）',
    timeFrame:
      '複習課程先從簡短的知識複習開始，接著出海進行 2 支潛水，讓你重新運用這些技巧。你的 PADI 教練會全程留意每一支潛水，並給你個人化的回饋與建議來精進你的潛水，讓你結束時比抵達時更有能力也更自在。',
    materials: ['無需任何教材，一切都由我們為你準備。'],
    equipment: ['課程費用不含裝備，但我們可視需要提供租借裝備。'],
  },
}
