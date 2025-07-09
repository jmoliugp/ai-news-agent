import { ChatCompletionMessage } from 'openai/resources/index';

export const StaticPrompts = {
  welcome:
    'Welcome to the farm assistant! What can I help you with today? You can ask me what I can do.',
  fallback: "I'm sorry, I don't understand.",
  end: 'I hope I was able to help you. Goodbye!',
} as const;

export const messages: ChatCompletionMessage[] = [];
