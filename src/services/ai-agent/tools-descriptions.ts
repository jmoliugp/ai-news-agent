import OpenAI from 'openai';
import {
  ConvertTypeNameStringLiteralToType,
  JsonAcceptable,
} from '@/utils/type-utils.js';

type ChatCompletionTool = OpenAI.ChatCompletionTool;
type FunctionDefinition = OpenAI.FunctionDefinition;

/**
 * To add a new function description and its corresponding function, follow the steps below:
 * 1. Add a new enum value to DescribedFunctionName, e.g. DoNewThings
 * 2. Add Props type for the function parameters, e.g. DoNewThingsProps
 * 3. Add a new entry to FunctionDescription object
 * 4. Create a new function with the same name as the enum value under the function folder
 */
export enum ToolName {
  FetchTopNews = 'fetch_top_news',
}

type FunctionParametersNarrowed<
  T extends Record<string, PropBase<JsonAcceptable>>,
> = {
  type: JsonAcceptable;
  properties: T;
  required: (keyof T)[];
};

type PropBase<T extends JsonAcceptable = 'string'> = {
  type: T;
  description: string;
};

export type ConvertedFunctionParamProps<
  Props extends Record<string, PropBase<JsonAcceptable>>,
> = {
  [K in keyof Props]: ConvertTypeNameStringLiteralToType<Props[K]['type']>;
};

export type FetchNewsProps = {
  language: PropBase;
  country: PropBase;
  maxArticles: PropBase<'number'>;
  category: PropBase;
  searchQuery: PropBase;
};

export type GetFarmsProps = {
  location: PropBase;
};

export type GetActivitiesPerFarmProps = {
  farm_name: PropBase;
};

export type BookActivityProps = {
  farm_name: PropBase;
  activity_name: PropBase;
  datetime: PropBase;
  name: PropBase;
  email: PropBase;
  number_of_people: PropBase<'number'>;
};

// Define the tool descriptions
const ToolDescriptions: Record<ToolName, FunctionDefinition> = {
  [ToolName.FetchTopNews]: {
    name: ToolName.FetchTopNews,
    description:
      'Fetch the latest news from Google News with customizable parameters',
    parameters: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description:
            'Language code (e.g., "en-US", "es-ES", "fr-FR"). Default: "en-US"',
        },
        country: {
          type: 'string',
          description: 'Country code (e.g., "US", "ES", "FR"). Default: "US"',
        },
        maxArticles: {
          type: 'number',
          description: 'Maximum number of articles to return. Default: 10',
        },
        category: {
          type: 'string',
          description:
            'News category: "TECHNOLOGY", "SPORTS", "HEALTH", "BUSINESS", "ENTERTAINMENT", "SCIENCE", "WORLD"',
        },
        searchQuery: {
          type: 'string',
          description:
            'Search for specific topics (e.g., "artificial intelligence", "climate change")',
        },
      },
      required: [],
    } satisfies FunctionParametersNarrowed<FetchNewsProps>,
  },
};

// Format the function descriptions into tools and export them
export const tools = Object.values(ToolDescriptions).map<ChatCompletionTool>(
  description => ({
    type: 'function',
    function: description,
  }),
);
