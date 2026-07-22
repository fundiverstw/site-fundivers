import type { CourseText } from './courses'

// 日本語（ja）— course card title + description, keyed by course route id
// (courseId(slug)). Merged over the English by $engine/i18n-content. Same keys
// as COURSES_TEXT_EN — a parity test enforces it.

export const coursesJa: Record<string, CourseText> = {
  'padi-open-water-course': {
    title: 'PADIオープン・ウォーター・コース',
    desc: 'スクーバの冒険はここから。世界中どこでも水深18mまで潜れる、あなたにとって最初の本格的な認定です。',
  },
  'padi-advanced-course': {
    title: 'PADIアドバンスド・オープン・ウォーター',
    desc: 'ディープとナビゲーションを含む5本のアドベンチャー・ダイブ。水深30mまでスキルと自信を高めます。',
  },
  'padi-rescue-diver-course': {
    title: 'PADIレスキュー・ダイバー',
    desc: '水中でのトラブルを未然に防ぎ、対処する方法を学びます。もっともやりがいのあるコースです。',
  },
  'padi-divemaster-course': {
    title: 'PADIダイブマスター',
    desc: '最初のプロ資格。認定ダイバーを引率し、コースをアシストします。',
  },
  'padi-master-scuba-diver': {
    title: 'PADIマスター・スクーバ・ダイバー',
    desc: 'レクリエーション最高位の資格。もっとも経験豊富なダイバーの仲間入りです。',
  },
  'padi-discover-scuba-diving-program': {
    title: 'PADIディスカバー・スクーバ・ダイビング',
    desc: '認定不要、1回のセッションでスクーバを体験。ダイビングの第一歩に最適です。',
  },
  'padi-refresher-course': {
    title: 'リフレッシュ・コース',
    desc: 'しばらく潜っていない？　水に戻る前にスキルと自信をリフレッシュしましょう。',
  },
  'padi-efr-course': {
    title: 'PADI EFRコース',
    desc: 'エマージェンシー・ファースト・レスポンス。CPRと一次・二次ケアを、ダイバーもそうでない方も学べます。',
  },
  'padi-o2-provider-course': {
    title: 'PADI酸素プロバイダー',
    desc: 'ダイビング事故の際に、ダイバーへ応急的に酸素を供給する方法を学びます。',
  },
  'padi-enriched-air-specialty-course': {
    title: 'PADIエンリッチド・エア（ナイトロックス）',
    desc: 'ナイトロックスでより長く。高濃度酸素を安全に使い、無減圧潜水時間を延ばします。',
  },
  'padi-deep-diver-specialty': {
    title: 'PADIディープ・ダイバー・スペシャルティ',
    desc: '限界を広げ、水深40mまでのダイビングを安全に計画して楽しむ方法を学びます。',
  },
  'padi-night-diver-specialty': {
    title: 'PADIナイト・ダイバー・スペシャルティ',
    desc: '暗闇に広がるまったく新しい世界へ。ライト、ナビゲーション、夜行性の生き物を楽しみます。',
  },
  'padi-search-recovery-specialty': {
    title: 'PADIサーチ＆リカバリー・スペシャルティ',
    desc: 'サーチ＆リカバリーのスキル、探索パターンやリフト法で、失くした物を見つけて回収します。',
  },
  'padi-drift-diver-specialty': {
    title: 'PADIドリフト・ダイバー・スペシャルティ',
    desc: '流れに身をまかせて。正しいテクニックと意識で、カレントのなかを楽に潜ります。',
  },
  'padi-peak-performance-buoyancy-specialty': {
    title: 'PADIピーク・パフォーマンス・ボイヤンシー',
    desc: '中性浮力をマスターして、楽に、優雅に、エア消費を抑えて潜りましょう。',
  },
  'padi-underwater-navigator-specialty': {
    title: 'PADI水中ナビゲーター',
    desc: 'コンパスと自然物ナビで自在に。もうボートを見失いません。',
  },
  'padi-boat-diver-specialty': {
    title: 'PADIボート・ダイバー・スペシャルティ',
    desc: 'RIBからリブアボードまで、あらゆるボートからのダイビングに慣れましょう。',
  },
  'padi-equipment-specialist': {
    title: 'PADI器材スペシャリスト',
    desc: '自分のダイビング器材を理解し、手入れし、ちょっとした調整ができるようになります。',
  },
  'padi-digital-underwater-photographer-specialty': {
    title: 'PADIデジタル水中フォトグラファー',
    desc: '水中世界を切り取ろう。ダイビングで素晴らしい写真や動画を撮影します。',
  },
  'padi-fish-identification-specialty': {
    title: 'PADI魚類識別スペシャルティ',
    desc: '毎回のダイビングで出会う魚の科や種を見分けられるようになります。',
  },
}
