// The shapes a course folder is written in.
//
// One folder per course, named after the course id: `card.ts` is the tile on
// /courses, `details.ts` is the write-up on /courses/<id>, and `photos/` holds the
// pictures its detail page staggers down the page. Both files carry all three
// languages, so everything about a course is in the one folder. See
// docs/adding-a-course.md.
//
// The folder name is the id. It is never written inside the files, so it cannot
// disagree with itself — the same trick the news section uses for dates.

import type { ResponsiveImage } from '$engine/responsive-image'

export type CourseText = { title: string; desc: string }

/** A course card as assembled for the pages: its folder name plus card.ts. */
export type CourseCard = {
  title: string
  id: string
  image: ResponsiveImage | null
  desc: string
  // The detail page staggers four images down the main content. When a course
  // supplies its own set here they're used verbatim; otherwise the page falls
  // back to [cover, …three from the course photo pool] (see CourseDetail).
  images?: [
    ResponsiveImage | null,
    ResponsiveImage | null,
    ResponsiveImage | null,
    ResponsiveImage | null,
  ]
}

/** What a course's `card.ts` exports. */
export type CourseCardFile = Omit<CourseCard, 'id'> & {
  // Where this card sits on the /courses grid. Folders come off the disk in
  // alphabetical order, which is not the order the shop wants to sell in, so
  // the sequence has to be stated. Spaced by ten to leave room to insert.
  order: number
  ja: CourseText
  'zh-TW': CourseText
}

export type CoursePhase = { name: string; text: string }

// The content blocks the detail page can lay out. The intro always leads
// (beside the first image); everything else is grouped into staggered
// subsections via `CourseDetails.subsections` (or a sensible default).
export type BlockKey =
  | 'overview'
  | 'topics' // the `youWillLearn` bullet list
  | 'reasons' // the numbered `reasons` list
  | 'prerequisites'
  | 'timeFrame' // the time-frame prose plus its `phases`
  | 'covers' // a "the course will cover" block: lead line, named cards, note
  | 'materials'
  | 'equipment'
  | 'notes'

export type CourseDetails = {
  // Short lead-in shown beside the first staggered image (falls back to the
  // course card's `desc` when absent).
  intro?: string
  overview: string
  // Optional "why take this" list shown as a numbered list, with its own title.
  reasonsTitle?: string
  reasons?: string[]
  // The "topics"/"what you'll learn" bullet list. `topicsTitle` overrides its
  // heading (some courses call it "Topics include" rather than the default).
  topicsTitle?: string
  youWillLearn: string[]
  prerequisites: string
  // Richer, itemised prerequisites for the staggered layout. When present these
  // replace the single-line `prerequisites` string in the page body.
  prereqList?: string[]
  // Optional prose that brackets the prerequisites list, a lead-in before it
  // and/or a note after it (e.g. "qualifying certifications may apply").
  prereqLead?: string
  prereqNote?: string
  minAge: string
  duration: string
  depth: string | null
  certifies: string
  timeFrame?: string
  phases?: CoursePhase[]
  // A "the course will cover" block: an optional lead line, named cards (like
  // phases), and an optional closing note. Rendered as its own subsection.
  coversLead?: string
  covers?: CoursePhase[]
  coversNote?: string
  materials?: string[]
  // Optional "Recommended" extras shown under the materials list.
  materialsRecommended?: string[]
  equipment?: string[]
  // Prose equipment, used instead of the `equipment` list when present.
  equipmentText?: string
  notes?: string[]
  // How to group the blocks above into staggered subsections (each inner array
  // is one subsection, rendered against its own image). The FIRST subsection
  // shares its row with the course title + intro, give it [] for just the
  // title/intro, or blocks to sit alongside them. Omit the whole field to use
  // the default grouping (see CourseDetail). Later empty subsections are
  // dropped, and blocks with no data are removed automatically.
  subsections?: BlockKey[][]
  matchCodes: string[] // event admin_title codes (lowercased) for upcoming sessions
  next: string[] // suggested next-course ids
}

// The translatable half of a course guide: everything except the structural
// fields (`subsections` layout, `matchCodes`, `next` ids) and `depth` (a bare
// figure like "18 m"). Those stay in the English and are merged in, so a
// translation cannot restate — and silently break — the course graph or the
// calendar join. $engine/i18n-details does the merging.
export type CourseDetailsText = Omit<CourseDetails, 'subsections' | 'matchCodes' | 'next' | 'depth'>

/** What a course's `details.ts` exports: the English guide, with each translation
 *  nested under its locale. */
export type CourseDetailsFile = CourseDetails & {
  ja: CourseDetailsText
  'zh-TW': CourseDetailsText
}
