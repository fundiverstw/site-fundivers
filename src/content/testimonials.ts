// What divers have said about us, shown at /testimonials.
//
// ── Placeholder copy ────────────────────────────────────────────────────────
//
// **Every entry below is invented.** They are here so the page has a shape to
// review, and they must be replaced with real quotes before this page goes
// live: attributing words to a named person who did not say them is not a
// placeholder, it is a fabrication. Either paste in real ones (with the
// diver's permission) or empty the list — the page handles the empty case and
// says so.
//
// One entry is one block holding all three languages, the same arrangement as
// team.ts: `quote` and `context` are the English, `ja` and `'zh-TW'` translate
// them. A person's `name` stays as written in every language.
//
// `context` is the one line under the name — what they did with us and when.

export type TestimonialText = {
  /** The quote itself, without surrounding quotation marks; the page adds them. */
  quote: string
  /** "Open Water student · June 2026" — what they did with us. */
  context: string
}

export type Testimonial = TestimonialText & {
  /** Keys the translations, so it must not change once written. */
  id: string
  name: string
  ja: TestimonialText
  'zh-TW': TestimonialText
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'placeholder-open-water',
    name: 'Placeholder Name',
    quote:
      'I could not put my face in the water on the first morning. By Sunday afternoon I was hanging at six metres watching a moray and forgetting to be frightened. Nobody rushed me once.',
    context: 'Open Water course · Longdong',
    ja: {
      quote:
        '初日の朝は顔を水につけることさえできませんでした。日曜の午後には水深 6 メートルでウツボを眺めながら、怖がるのを忘れていました。誰にも急かされませんでした。',
      context: 'オープンウォーターコース・龍洞',
    },
    'zh-TW': {
      quote:
        '第一天早上我連把臉放進水裡都做不到。到了星期天下午，我停在六米深看著一條海鰻，忘了要害怕。全程沒有人催我。',
      context: '開放水域課程・龍洞',
    },
  },
  {
    id: 'placeholder-penghu-trip',
    name: 'Placeholder Name',
    quote:
      'Three days, six dives, and the only decision I had to make was what to eat afterwards. Everything else was already sorted before we got on the boat.',
    context: 'Penghu group trip',
    ja: {
      quote:
        '3 日間で 6 ダイブ、私が決めたのは終わったあと何を食べるかだけでした。ほかはすべて、船に乗る前から整っていました。',
      context: '澎湖グループツアー',
    },
    'zh-TW': {
      quote: '三天六支氣瓶，我唯一要決定的是結束後要吃什麼。其他事在上船之前就全都安排好了。',
      context: '澎湖團體潛旅',
    },
  },
  {
    id: 'placeholder-rescue',
    name: 'Placeholder Name',
    quote:
      'The Rescue course was the hardest weekend I have had in years and the only one I would do again tomorrow. You leave it genuinely believing you could help someone.',
    context: 'Rescue Diver course',
    ja: {
      quote:
        'レスキューコースはここ数年でいちばんきつい週末でしたが、明日もう一度やってもいいと思える唯一の週末でもありました。人を助けられると本気で思えるようになります。',
      context: 'レスキューダイバーコース',
    },
    'zh-TW': {
      quote:
        '救援課程是我這幾年最累的一個週末，也是唯一一個我明天願意再上一次的。上完之後，你會真心相信自己有能力幫上忙。',
      context: '救援潛水員課程',
    },
  },
]

const text = (t: Testimonial): TestimonialText => ({ quote: t.quote, context: t.context })

export const TESTIMONIALS_TEXT_EN: Record<string, TestimonialText> = Object.fromEntries(
  TESTIMONIALS.map((t) => [t.id, text(t)]),
)

export const testimonialsJa: Record<string, TestimonialText> = Object.fromEntries(
  TESTIMONIALS.map((t) => [t.id, t.ja]),
)

export const testimonialsZhTW: Record<string, TestimonialText> = Object.fromEntries(
  TESTIMONIALS.map((t) => [t.id, t['zh-TW']]),
)
