import OpenAI from 'openai';

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export const StaticPrompts = {
  welcome: `
🤖 Welcome to the AI News Agent!
I can help you find and analyze the latest news from various sources.

Ask me about:
- Latest technology news
- Sports updates
- Health and science news
- Business and market news
- Entertainment news
- World news

You can also search for specific topics or ask me to fetch news from different countries and languages.

How can I help you today?
`,

  fallback: `
I'm sorry, I couldn't process your request. Please try again or ask for help with news-related queries.
`,

  end: `
Thank you for using the AI News Agent! Stay informed! 📰
`,
};

export const SystemPrompts = {
  context: {
    role: 'system',
    content: `You are an AI News Agent specialized in fetching and analyzing recent news from various sources. 

Your capabilities include:
- Fetching latest news from Google News
- Filtering news by category (technology, sports, health, business, entertainment, science, world)
- Searching for specific topics
- Providing news in different languages and countries
- Summarizing and analyzing news content

Guidelines:
- Always provide accurate, up-to-date information
- Be helpful and informative
- If you need to fetch news, use the available tools
- Provide context and relevant details
- Be concise but comprehensive in your responses
- If a user asks for news, proactively fetch it using the appropriate tools

Remember to use the fetch_top_news function when users ask for news or specific topics.`,
  } as ChatCompletionMessageParam,
};

export const FunctionPrompts = {
  function_response: ({
    tool_call_id,
    content,
  }: {
    tool_call_id: string;
    content: string;
  }) =>
    ({
      role: 'tool',
      tool_call_id,
      content,
    }) as ChatCompletionMessageParam,
};
