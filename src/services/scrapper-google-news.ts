import { performance } from 'perf_hooks';
import puppeteer, { Browser, Page } from 'puppeteer';
import { Logger } from '../utils/log';

const log = new Logger('GoogleNewsScraper');

export interface GoogleNewsPost {
  title: string;
  description: string;
  link: string;
  image: string | null;
  source: string;
  publishedTime: string | null;
  category: string | null;
}

export interface GoogleNewsOptions {
  language?: string; // Language code (e.g., 'en-US', 'es-ES')
  country?: string; // Country code (e.g., 'US', 'ES')
  maxArticles?: number; // Maximum number of articles to return
  category?: string; // News category ('TECHNOLOGY', 'SPORTS', 'HEALTH', etc.)
  searchQuery?: string; // Search for specific topics
  timeRange?: string; // Time filter ('recent', 'today', 'week')
}

export const getAvailableCategories = (): string[] => {
  return [
    'TECHNOLOGY',
    'SPORTS',
    'HEALTH',
    'BUSINESS',
    'ENTERTAINMENT',
    'SCIENCE',
    'WORLD',
  ];
};

export const getAvailableLanguages = (): { [key: string]: string[] } => {
  return {
    'en-US': ['US'],
    'es-ES': ['ES'],
    'fr-FR': ['FR'],
    'de-DE': ['DE'],
    'it-IT': ['IT'],
    'pt-BR': ['BR'],
    'ja-JP': ['JP'],
    'ko-KR': ['KR'],
    'zh-CN': ['CN'],
    'ru-RU': ['RU'],
  };
};

export const showUsageExamples = (): void => {
  const examples = [
    {
      title: 'Basic usage (default parameters)',
      code: 'fetchGoogleNews()',
    },
    {
      title: 'Technology news in English',
      code: 'fetchGoogleNews({ category: "TECHNOLOGY", maxArticles: 10 })',
    },
    {
      title: 'Search for specific topic',
      code: 'fetchGoogleNews({ searchQuery: "climate change", maxArticles: 5 })',
    },
    {
      title: 'Spanish news',
      code: 'fetchGoogleNews({ language: "es-ES", country: "ES", maxArticles: 8 })',
    },
    {
      title: 'Multiple categories',
      code: 'fetchGoogleNews({ category: "SPORTS", language: "en-US", maxArticles: 15 })',
    },
  ];

  console.log('\n📚 Google News Scraper Usage Examples:');
  examples.forEach((example, index) => {
    console.log(`\n${index + 1}. ${example.title}:`);
    console.log(`   ${example.code}`);
  });

  console.log(
    '\n🌍 Available Languages:',
    Object.keys(getAvailableLanguages()).join(', '),
  );
  console.log('📂 Available Categories:', getAvailableCategories().join(', '));
};

export const fetchGoogleNews = async (
  options: GoogleNewsOptions = {},
): Promise<GoogleNewsPost[]> => {
  const start = performance.now();

  // Set default options
  const {
    language = 'en-US',
    country = 'US',
    maxArticles = 50,
    category,
    searchQuery,
    timeRange,
  } = options;

  log.info('🚀 Google News scraping started');
  log.info(`🌍 Language: ${language}, Country: ${country}`);
  if (category) log.info(`📂 Category: ${category}`);
  if (searchQuery) log.info(`🔍 Search: ${searchQuery}`);
  if (timeRange) log.info(`⏰ Time Range: ${timeRange}`);
  log.info(`📊 Max Articles: ${maxArticles}`);

  let browser: Browser | null = null;
  const posts: GoogleNewsPost[] = [];

  try {
    // Launch browser
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

    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    // Build URL with parameters
    const buildGoogleNewsUrl = (): string => {
      const baseUrl = 'https://news.google.com';

      if (searchQuery) {
        // Search URL
        return `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&hl=${language}&gl=${country}&ceid=${country}:${language.split('-')[0]}`;
      }

      if (category) {
        // Category URL
        const categoryMap: { [key: string]: string } = {
          TECHNOLOGY:
            'topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB',
          SPORTS:
            'topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB',
          HEALTH:
            'topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR3QwTlRFU0FtVnVHZ0pWVXlnQVAB',
          BUSINESS:
            'topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB',
          ENTERTAINMENT:
            'topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB',
          SCIENCE:
            'topics/CAAqKAgKIiJDQkFTRXdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB',
          WORLD:
            'topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB',
        };

        const topicId = categoryMap[category.toUpperCase()];
        if (topicId) {
          return `${baseUrl}/${topicId}?hl=${language}&gl=${country}&ceid=${country}:${language.split('-')[0]}`;
        }
      }

      // Default home URL
      return `${baseUrl}/home?hl=${language}&gl=${country}&ceid=${country}:${language.split('-')[0]}`;
    };

    const url = buildGoogleNewsUrl();
    log.info(`Navigating to ${url}...`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for content to load - try multiple selectors
    log.info('Waiting for articles to load...');
    try {
      await page.waitForSelector('article, [data-n-tid], .JtKRv', {
        timeout: 15000,
      });
    } catch (error) {
      log.warn('Primary selectors not found, trying alternative approach...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait a bit more for dynamic content
    }

    // Add debugging information
    const pageTitle = await page.title();
    log.info(`Page title: ${pageTitle}`);

    // Extract news articles with improved selectors
    log.info('Extracting news articles...');
    const articles = await page.evaluate(() => {
      const doc = (globalThis as any).document;
      const extractedArticles: any[] = [];

      // Try multiple selector strategies
      const selectorStrategies = [
        'article',
        '[data-n-tid]',
        '.JtKRv',
        '.xrnccd',
        '.Ft7HRd-LgbsSe',
        '.SoAPf',
        '.JtKRv',
        '.ipQwMb',
        '.mCBkyc',
        'a[href*="/articles/"]',
        'a[href*="/stories/"]',
      ];

      let articleElements: any[] = [];
      let usedSelector = '';

      // Find articles using any available selector
      for (const selector of selectorStrategies) {
        articleElements = Array.from(doc.querySelectorAll(selector));
        if (articleElements.length > 0) {
          console.log(
            `Found ${articleElements.length} articles using selector: ${selector}`,
          );
          usedSelector = selector;
          break;
        }
      }

      // If still no articles found, try finding all clickable elements that might be news
      if (articleElements.length === 0) {
        console.log(
          'No articles found with standard selectors, trying broader search...',
        );
        articleElements = Array.from(doc.querySelectorAll('a[href]')).filter(
          (el: any) => {
            const href = el.getAttribute('href');
            return (
              href &&
              (href.includes('/articles/') ||
                href.includes('/stories/') ||
                href.includes('news'))
            );
          },
        );
      }

      console.log(
        `Processing ${articleElements.length} potential articles using: ${usedSelector}`,
      );

      articleElements.forEach((article: any, index: number) => {
        try {
          // Multiple strategies for extracting title
          let title = '';
          const titleSelectors = [
            'h3',
            'h4',
            '[role="heading"]',
            '.ipQwMb',
            '.JtKRv',
            '.mCBkyc',
            '.DY5T1d',
            '.MQsxIb',
            '.RZIKme',
          ];

          for (const selector of titleSelectors) {
            const titleElement = article.querySelector(selector);
            if (titleElement && titleElement.textContent) {
              title = titleElement.textContent.trim();
              break;
            }
          }

          // If no title found in article, try parent elements
          if (!title) {
            const parentElement = article.closest('div, section, li');
            if (parentElement) {
              for (const selector of titleSelectors) {
                const titleElement = parentElement.querySelector(selector);
                if (titleElement && titleElement.textContent) {
                  title = titleElement.textContent.trim();
                  break;
                }
              }
            }
          }

          // If still no title, try the article's text content
          if (!title && article.textContent) {
            title = article.textContent.trim().slice(0, 100) + '...';
          }

          // Extract link
          let link = '';
          if (article.href) {
            link = article.href;
          } else {
            const linkElement = article.querySelector('a[href]');
            link = linkElement?.getAttribute('href') || '';
          }

          // Extract image
          const imageElement = article.querySelector('img');
          const image = imageElement?.getAttribute('src') || null;

          // Extract source with multiple selectors
          let source = '';
          const sourceSelectors = [
            '[data-n-tid]',
            '.QmrVtf',
            '.wEwyrc',
            '.SVJrMe',
            '.vr1PYe',
            '.CEMjEf',
            '.WlydOe',
          ];

          for (const selector of sourceSelectors) {
            const sourceElement = article.querySelector(selector);
            if (sourceElement && sourceElement.textContent) {
              source = sourceElement.textContent.trim();
              break;
            }
          }

          // Extract time
          const timeElement = article.querySelector('time, [datetime]');
          const publishedTime =
            timeElement?.getAttribute('datetime') ||
            timeElement?.textContent?.trim() ||
            null;

          // Extract description
          const descriptionSelectors = [
            '.GI74Re',
            '.st',
            '.Y3v8qd',
            '.xBjp9b',
            '.UOVeFe',
          ];
          let description = '';

          for (const selector of descriptionSelectors) {
            const descElement = article.querySelector(selector);
            if (descElement && descElement.textContent) {
              description = descElement.textContent.trim();
              break;
            }
          }

          // Only add if we have at least a title or link
          if (title || link) {
            extractedArticles.push({
              title: title || 'No title available',
              description,
              link: link.startsWith('/')
                ? `https://news.google.com${link}`
                : link,
              image,
              source,
              publishedTime,
              category: null,
            });
          }
        } catch (error) {
          console.error(`Error processing article ${index}:`, error);
        }
      });

      return extractedArticles;
    });

    // Apply maxArticles limit
    const limitedArticles = articles.slice(0, maxArticles);
    posts.push(...limitedArticles);

    log.success(`Successfully extracted ${posts.length} articles`);
    if (articles.length > maxArticles) {
      log.info(
        `📋 Limited to ${maxArticles} articles (found ${articles.length} total)`,
      );
    }

    // Log some sample data for debugging
    if (posts.length > 0) {
      const firstPost = posts[0];
      if (firstPost) {
        log.info(`Sample article: ${firstPost.title}`);
        log.info(`Sample source: ${firstPost.source}`);
        log.info(`Sample link: ${firstPost.link}`);
      }
    } else {
      log.warn('No articles were extracted - checking page structure...');

      // Additional debugging
      const allElements = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = (globalThis as any).document;
        const bodyText = doc.body.textContent.slice(0, 200);
        const hasArticles = !!doc.querySelector('article');
        const hasLinks = doc.querySelectorAll('a').length;
        return { bodyText, hasArticles, hasLinks };
      });

      log.info(`Page has articles: ${allElements.hasArticles}`);
      log.info(`Page has ${allElements.hasLinks} links`);
      log.info(`Page body preview: ${allElements.bodyText}...`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    log.error(`💥 Error during Google News scraping: ${errorMessage}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      log.success('Browser closed');
    }
  }

  const end = performance.now();
  log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);

  return posts;
};
