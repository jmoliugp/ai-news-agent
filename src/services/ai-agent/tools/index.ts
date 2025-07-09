/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToolName } from '../tools-descriptions';
import { fetchTopNews } from './fetch-top-news';

export default {
  fetch_top_news: fetchTopNews,
} satisfies Record<ToolName, (...args: any[]) => Promise<string>>;
