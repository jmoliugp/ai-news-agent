/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToolName } from '../tools-descriptions';
import { fetchTopNews } from './fetch-top-news';
import { fetchYCombinatorPosts } from './fetch-y-combinator-posts';
import { fetchHackerNews } from './fetch-hacker-news';

export default {
  fetch_top_news: fetchTopNews,
  fetch_y_combinator_posts: fetchYCombinatorPosts,
  fetch_hacker_news: fetchHackerNews,
} satisfies Record<ToolName, (...args: any[]) => Promise<string>>;
