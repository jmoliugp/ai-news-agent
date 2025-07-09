import {
  ConvertedFunctionParamProps,
  FetchNewsProps,
} from '../tools-descriptions';
import { fetchGoogleNews, GoogleNewsOptions } from '../../scrapper-google-news';

export async function fetchTopNews(
  args: ConvertedFunctionParamProps<FetchNewsProps>,
): Promise<string> {
  const { language, country, maxArticles, category, searchQuery } = args;

  try {
    // Build options for Google News scraper
    const options: GoogleNewsOptions = {
      language: language || 'en-US',
      country: country || 'US',
      maxArticles: maxArticles || 10,
      ...(category && { category }),
      ...(searchQuery && { searchQuery }),
    };

    // Fetch news articles
    const articles = await fetchGoogleNews(options);

    // Format the response for the AI agent
    const response = {
      success: true,
      totalArticles: articles.length,
      parameters: {
        language: options.language,
        country: options.country,
        maxArticles: options.maxArticles,
        category: options.category || 'general',
        searchQuery: options.searchQuery || 'none',
      },
      articles: articles.map((article, index) => ({
        id: index + 1,
        title: article.title,
        source: article.source,
        link: article.link,
        publishedTime: article.publishedTime,
        description: article.description,
        image: article.image,
        category: article.category,
      })),
    };

    return JSON.stringify(response, null, 2);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    const errorResponse = {
      success: false,
      error: errorMessage,
      parameters: {
        language: language || 'en-US',
        country: country || 'US',
        maxArticles: maxArticles || 10,
        category: category || 'general',
        searchQuery: searchQuery || 'none',
      },
      articles: [],
    };

    return JSON.stringify(errorResponse, null, 2);
  }
}
