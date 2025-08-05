import {
  ConvertedFunctionParamProps,
  FetchYCombinatorPostsProps,
} from '../tools-descriptions';
import {
  fetchRecentPosts,
  YCombinatorPost,
} from '../../scrappers/scrapper-y-combinator';
import { Logger } from '../../../utils/log';
import { performance } from 'perf_hooks';

const log = new Logger('YCombinator Tool');

export async function fetchYCombinatorPosts(
  args: ConvertedFunctionParamProps<FetchYCombinatorPostsProps>,
): Promise<string> {
  const start = performance.now();
  log.info('Started');

  try {
    const { maxPosts = 10 } = args;

    // Fetch posts from Y Combinator
    const posts = await fetchRecentPosts();

    if (!posts || posts.length === 0) {
      log.warn('No posts found from Y Combinator');
      return JSON.stringify({
        success: false,
        message: 'No posts found from Y Combinator',
        data: [],
      });
    }

    // Limit posts to maxPosts
    const limitedPosts = posts.slice(0, maxPosts);

    // Format posts for better readability
    const formattedPosts = limitedPosts.map((post: YCombinatorPost) => ({
      title: post.title,
      description: post.description,
      author: post.author,
      date: post.date,
      tags: post.tags,
      url: post.fullUrl,
      excerpt:
        post.description.length > 200
          ? post.description.substring(0, 200) + '...'
          : post.description,
    }));

    log.success(
      `Successfully fetched ${formattedPosts.length} Y Combinator posts`,
    );

    const result = {
      success: true,
      message: `Successfully fetched ${formattedPosts.length} Y Combinator posts`,
      data: formattedPosts,
      totalFound: posts.length,
      returned: formattedPosts.length,
    };

    const end = performance.now();
    log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

    return JSON.stringify(result, null, 2);
  } catch (error) {
    log.error(
      `💥 Error fetching Y Combinator posts: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );

    const errorResult = {
      success: false,
      message: `Error fetching Y Combinator posts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: [],
    };

    const end = performance.now();
    log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

    return JSON.stringify(errorResult, null, 2);
  }
}
