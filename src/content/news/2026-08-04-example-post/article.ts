import type { NewsArticleFile } from '$content/news'

// ─────────────────────────────────────────────────────────────────────────────
//  THIS IS A PLACEHOLDER. DELETE THIS WHOLE FOLDER once you write a real post.
//
//  It exists so the News page has something in it while you look at the design,
//  and so the tests have a post to check. It says what it is in its own text,
//  so nothing pretends to be a real event if it reaches the site by accident.
//
//  To write a real one: copy this folder, rename it `YYYY-MM-DD-your-slug`,
//  and edit the four fields below. See docs/adding-news.md.
// ─────────────────────────────────────────────────────────────────────────────

export const article: NewsArticleFile = {
  // One of: conference · volunteering · outreach · education
  kind: 'outreach',

  title: 'Example post — replace this with your first story',

  // One line. This is all that shows on the card in the feed.
  summary: 'A placeholder so the News page has something in it. Delete this folder.',

  // The write-up. Put a blank line between paragraphs by typing \n\n.
  body: `This is a placeholder post, not a real event. It is here so that the News page and its tests have something to work with before the first real story is written.

To replace it: copy the folder src/content/news/2026-08-04-example-post/, rename the copy to the date and title of your event — for example 2026-09-20-reef-cleanup — and edit article.ts. Drop up to three photos in beside it; they appear in filename order, so naming them 1-…, 2-…, 3-… puts them in the order you want.

Then delete this folder. Nothing else needs changing: the feed finds the new folder on its own and sorts it into place by date.`,

  // Optional, keyed by the exact filename. Shown under the photo, and used as
  // its alt text for screen readers. Leave a photo out and it simply has no
  // caption.
  captions: {
    '1-example.avif': 'Photos go in this folder beside article.ts — up to three of them.',
  },
}
