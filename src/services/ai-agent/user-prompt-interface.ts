import OpenAI from 'openai';
import * as readline from 'readline';

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

/**
 * Creates a readline interface to get user input
 * @returns Promise<string> - The user's input
 */
const getUserInput = (): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question('You: ', answer => {
      rl.close();
      resolve(answer);
    });
  });
};

/**
 * Creates a user message for the chat completion
 * @returns Promise<ChatCompletionMessageParam> - The user message object
 */
export const createUserMessage =
  async (): Promise<ChatCompletionMessageParam> => {
    const userInput = await getUserInput();

    return {
      role: 'user',
      content: userInput,
    };
  };
