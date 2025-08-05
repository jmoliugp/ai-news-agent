import {
  ConvertedFunctionParamProps,
  FetchHackerNewsProps,
} from '../tools-descriptions';
import {
  fetchHackerNewsStories,
  HackerNewsPost,
} from '../../scrappers/scrapper-hacker-news';
import { Logger } from '../../../utils/log';
import { performance } from 'perf_hooks';

const log = new Logger('HackerNews Tool');

export async function fetchHackerNews(
  args: ConvertedFunctionParamProps<FetchHackerNewsProps>,
): Promise<string> {
  const start = performance.now();
  log.info('🚀 Started');

  try {
    const { maxPosts = 10, page = 1 } = args;

    // Fetch stories from Hacker News
    const stories = await fetchHackerNewsStories({ maxPosts, page });

    if (!stories || stories.length === 0) {
      log.warn('No stories found from Hacker News');
      return JSON.stringify({
        success: false,
        message: 'No stories found from Hacker News',
        data: [],
      });
    }

    // Format stories for better readability
    const formattedStories = stories.map((story: HackerNewsPost) => ({
      rank: story.rank,
      title: story.title,
      author: story.author,
      points: story.points,
      comments: story.comments,
      timeAgo: story.date,
      site: story.site,
      url: story.fullUrl,
      link: story.link,
      // Add summary for stories with high engagement
      summary:
        story.points > 100
          ? `High engagement story with ${story.points} points and ${story.comments} comments`
          : null,
    }));

    log.success(
      `Successfully fetched ${formattedStories.length} Hacker News stories`,
    );

    const result = {
      success: true,
      message: `Successfully fetched ${formattedStories.length} Hacker News stories`,
      data: formattedStories,
      metadata: {
        page,
        totalReturned: formattedStories.length,
        topStory: formattedStories[0]
          ? {
              title: formattedStories[0].title,
              points: formattedStories[0].points,
              comments: formattedStories[0].comments,
            }
          : null,
      },
    };

    const end = performance.now();
    log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

    return JSON.stringify(result, null, 2);
  } catch (error) {
    log.error(
      `💥 Error fetching Hacker News stories: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );

    const errorResult = {
      success: false,
      message: `Error fetching Hacker News stories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: [],
    };

    const end = performance.now();
    log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

    return JSON.stringify(errorResult, null, 2);
  }
}
