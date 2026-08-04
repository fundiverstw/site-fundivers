import type { NewsText } from './news'

// 中文 (繁體) translations of the news articles, keyed by slug — the bit of the
// folder name after the date.
//
// **This one is allowed to be incomplete.** Unlike dive sites and courses, a
// news post ships the moment it is written in English; an article with no entry
// here shows its English text to Chinese readers rather than blocking the post.
// `npm run test:unit` prints which articles are still waiting, so the backlog is
// visible instead of forgotten.
//
// What is *not* allowed is a wrong entry: a slug that matches no article, or an
// entry with a field left blank. Both fail the tests, because both mean a
// translation somebody wrote is not reaching a reader.

export const newsZhTW: Record<string, NewsText> = {}
