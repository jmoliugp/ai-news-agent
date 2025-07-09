import OpenAI from 'openai';
import { ChatCompletionMessage } from 'openai/resources/index';

type ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;

type UserPromptKey = 'task';
type UserPromptValue = (userInput?: string) => ChatCompletionUserMessageParam;

type ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;

type SystemPromptKey = 'context';

type ChatCompletionToolMessageParam = OpenAI.ChatCompletionToolMessageParam;

type FunctionPromptKey = 'function_response';

type FunctionPromptValue = (
  args: Omit<ChatCompletionToolMessageParam, 'role'>,
) => ChatCompletionToolMessageParam;

export const StaticPrompts = {
  welcome:
    'Welcome to the News Agent! I can help you read and query recent news. What would you like to know about current events?',
  fallback:
    "I'm sorry, I don't understand. Please ask me about recent news or current events.",
  end: 'Thanks for using the News Agent. Stay informed!',
} as const;

export const UserPrompts: Record<UserPromptKey, UserPromptValue> = {
  task: userInput => ({
    role: 'user',
    content: userInput || 'What can you do?',
  }),
};

export const SystemPrompts: Record<
  SystemPromptKey,
  ChatCompletionSystemMessageParam
> = {
  context: {
    role: 'system',
    content:
      "You are a news agent. You are professional and informative. You introduce yourself when first saying `Hello, I'm your News Agent!`. You help users read and query recent news articles. If you decide to call a function, you should retrieve the required fields for the function from the user. Your answer should be as precise as possible. If you have not yet retrieve the required fields of the function completely, you do not answer the question and inform the user you do not have enough information.",
  },
};

export const FunctionPrompts: Record<FunctionPromptKey, FunctionPromptValue> = {
  function_response: options => ({
    role: 'tool',
    ...options,
  }),
};

export const messages: ChatCompletionMessage[] = [];
