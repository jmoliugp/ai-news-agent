import { Logger } from '@/utils/log';
import { performance } from 'perf_hooks';
import puppeteer from 'puppeteer';

const log = new Logger('YCombinator Scrapper');

export interface YCombinatorPost {
  title: string;
  description: string;
  link: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  fullUrl: string;
}

export const fetchRecentPosts = async (): Promise<YCombinatorPost[]> => {
  const start = performance.now();
  log.info('🚀 fetchRecentPosts started');

  let browser;
  const parsedPosts: YCombinatorPost[] = [];

  try {
    log.info('Launching browser...');
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.ycombinator.com/blog');
    await page.waitForSelector('::-p-text("Recent Posts")');

    const posts = await page.$$(
      'div.flex.flex-col.overflow-hidden.rounded.shadow',
    );
    log.info(`Found ${posts.length} posts to process`);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (!post) continue;

      try {
        // Extract title
        const titleElement = await post.$(
          'p.text-xl.font-semibold.text-gray-900',
        );
        const title = titleElement
          ? await titleElement.evaluate(el => el.textContent)
          : '';

        // Extract description/excerpt
        const descElement = await post.$('p.mt-3.text-base.text-gray-700');
        const description = descElement
          ? await descElement.evaluate(el => el.textContent)
          : '';

        // Extract post link
        const linkElement = await post.$('a[href*="/blog/"]');
        const link = linkElement
          ? await linkElement.evaluate(el => el.getAttribute('href'))
          : '';

        // Extract image
        const imageElement = await post.$('img');
        const image = imageElement
          ? await imageElement.evaluate(el => el.getAttribute('src'))
          : '';

        // Extract author
        const authorElement = await post.$(
          'p.text-sm.font-medium.text-gray-800 a',
        );
        const author = authorElement
          ? await authorElement.evaluate(el => el.textContent)
          : '';

        // Extract date
        const dateElement = await post.$(
          'div.flex.space-x-1.text-sm.text-gray-500 span',
        );
        const date = dateElement
          ? await dateElement.evaluate(el => el.textContent)
          : '';

        // Extract tags
        const tagElements = await post.$$(
          'span.mb-2.mr-4.inline-flex.items-center.rounded.bg-gray-200',
        );
        const tags = [];
        for (const tagElement of tagElements) {
          const tagText = await tagElement.evaluate(el => el.textContent);
          if (tagText) tags.push(tagText.trim());
        }

        // Create post object
        const postObject: YCombinatorPost = {
          title: title?.trim() || '',
          description: description?.trim() || '',
          link: link || '',
          image: image || '',
          author: author?.trim() || '',
          date: date?.trim() || '',
          tags: tags,
          fullUrl: link ? `https://www.ycombinator.com${link}` : '',
        };

        parsedPosts.push(postObject);
      } catch (error) {
        log.error(
          `Error parsing post ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    log.success(
      `Successfully parsed ${parsedPosts.length}/${posts.length} posts`,
    );

    const postsWithMissingData = parsedPosts.filter(
      post => !post.title || !post.description || !post.link,
    );

    if (postsWithMissingData.length > 0) {
      log.warn(`${postsWithMissingData.length} posts missing critical data`);
    }
  } catch (error) {
    log.error(
      `Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      log.info('Browser closed');
    }
  }

  const end = performance.now();
  log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

  return parsedPosts;
};
