import { Logger } from '@/utils/log';
import { performance } from 'perf_hooks';
import puppeteer, { Browser, Page } from 'puppeteer';

const log = new Logger('HackerNews Scrapper');

export interface HackerNewsPost {
  title: string;
  description: string;
  link: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  fullUrl: string;
  rank: number;
  points: number;
  comments: number;
  site: string;
}

export interface HackerNewsOptions {
  maxPosts?: number;
  page?: number;
}

export const fetchHackerNewsStories = async (
  options: HackerNewsOptions = {},
): Promise<HackerNewsPost[]> => {
  const start = performance.now();
  log.info('🚀 fetchHackerNewsStories started');

  const { maxPosts = 30, page = 1 } = options;

  let browser: Browser | null = null;
  const parsedPosts: HackerNewsPost[] = [];

  try {
    log.info('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    });

    const browserPage: Page = await browser.newPage();
    await browserPage.setViewport({ width: 1920, height: 1080 });

    // Set user agent
    await browserPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    // Navigate to Hacker News
    const url =
      page === 1
        ? 'https://news.ycombinator.com'
        : `https://news.ycombinator.com?p=${page}`;
    log.info(`Navigating to ${url}...`);
    await browserPage.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for the main content to load
    await browserPage.waitForSelector('#hnmain', { timeout: 15000 });
    log.info('Main content loaded');

    // Extract stories
    const stories = await browserPage.evaluate(() => {
      const extractedStories: any[] = [];

      // Find all story rows with class "athing submission"
      const doc = (globalThis as any).document;
      const storyElements = Array.from(
        doc.querySelectorAll('tr.athing.submission'),
      );

      for (const storyElement of storyElements) {
        try {
          const story = storyElement as any;
          const storyId = story.getAttribute('id');
          if (!storyId) continue;

          // Extract rank
          const rankElement = story.querySelector('.rank');
          const rank = rankElement
            ? parseInt(rankElement.textContent?.replace('.', '') || '0')
            : 0;

          // Extract title and link
          const titleElement = story.querySelector('.titleline > a');
          const title = titleElement
            ? titleElement.textContent?.trim() || ''
            : '';
          const link = titleElement
            ? titleElement.getAttribute('href') || ''
            : '';

          // Extract site domain
          const siteElement = story.querySelector('.sitebit .sitestr');
          const site = siteElement ? siteElement.textContent?.trim() || '' : '';

          // Find the corresponding subtext row (next sibling with subtext)
          const subtextRow = story.nextElementSibling;
          let points = 0;
          let author = '';
          let timeAgo = '';
          let comments = 0;

          if (subtextRow && (subtextRow as any).querySelector('.subtext')) {
            const subtext = subtextRow as any;
            // Extract points
            const pointsElement = subtext.querySelector('.score');
            if (pointsElement) {
              const pointsText = pointsElement.textContent || '';
              points = parseInt(pointsText.replace(/\D/g, '')) || 0;
            }

            // Extract author
            const authorElement = subtext.querySelector('.hnuser');
            author = authorElement
              ? authorElement.textContent?.trim() || ''
              : '';

            // Extract time
            const timeElement = subtext.querySelector('.age a');
            timeAgo = timeElement ? timeElement.textContent?.trim() || '' : '';

            // Extract comments count
            const commentsElement = subtext.querySelector(
              'a[href*="item?id="]',
            );
            if (
              commentsElement &&
              commentsElement.textContent?.includes('comment')
            ) {
              const commentsText = commentsElement.textContent || '';
              comments = parseInt(commentsText.replace(/\D/g, '')) || 0;
            }
          }

          // Build full URL
          let fullUrl = link;
          if (link.startsWith('item?id=')) {
            fullUrl = `https://news.ycombinator.com/${link}`;
          } else if (link.startsWith('/')) {
            fullUrl = `https://news.ycombinator.com${link}`;
          } else if (!link.startsWith('http')) {
            fullUrl = `https://news.ycombinator.com/${link}`;
          }

          extractedStories.push({
            title,
            description: '', // Hacker News doesn't provide descriptions on the main page
            link,
            image: '', // Hacker News doesn't use images
            author,
            date: timeAgo,
            tags: site ? [site] : [],
            fullUrl,
            rank,
            points,
            comments,
            site,
          });
        } catch (error) {
          console.error('Error parsing story:', error);
        }
      }

      return extractedStories;
    });

    // Apply maxPosts limit
    const limitedStories = stories.slice(0, maxPosts);
    parsedPosts.push(...limitedStories);

    log.success(
      `Successfully parsed ${parsedPosts.length}/${stories.length} stories`,
    );

    // Filter stories with missing critical data
    const storiesWithMissingData = parsedPosts.filter(
      post => !post.title || !post.fullUrl,
    );

    if (storiesWithMissingData.length > 0) {
      log.warn(
        `${storiesWithMissingData.length} stories missing critical data`,
      );
    }

    // Log some sample data for debugging
    if (parsedPosts.length > 0) {
      const topStory = parsedPosts[0];
      if (topStory) {
        log.info(`Top story: ${topStory.title}`);
        log.info(`Points: ${topStory.points}, Comments: ${topStory.comments}`);
        log.info(`Author: ${topStory.author}, Site: ${topStory.site}`);
      }
    }
  } catch (error) {
    log.error(
      `💥 Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      log.success('Browser closed');
    }
  }

  const end = performance.now();
  log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

  return parsedPosts;
};

export const fetchTopHackerNewsStories = async (
  count: number = 10,
): Promise<HackerNewsPost[]> => {
  const stories = await fetchHackerNewsStories({ maxPosts: count });
  return stories.filter(story => story.points > 0).slice(0, count);
};
