import { performance } from 'perf_hooks';
import OpenAI from 'openai';

import { Logger } from '@/utils/log';
import { StaticPrompts, SystemPrompts, FunctionPrompts } from './prompts';
import { createUserMessage } from './user-prompt-interface';
import AvailableFunctions from './tools';
import { isNonEmptyString } from '@/utils/type-utils';
import { startChat } from './chat';
import { isChatEnding } from '@/utils/chat-utils';

const log = new Logger('AiAgent');

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export const runAgent = async (): Promise<void> => {
  const start = performance.now();

  log.info('🚀 AI Agent started');

  const messages: ChatCompletionMessageParam[] = [];

  console.log(StaticPrompts.welcome);

  messages.push(SystemPrompts.context);

  const userPrompt = await createUserMessage();
  messages.push(userPrompt);

  while (!isChatEnding(messages.at(-1))) {
    try {
      const result = await startChat(messages);

      // Handle different response types
      if (!result) {
        log.warn('No result from the AI agent');
        console.log(StaticPrompts.fallback);
      } else if (isNonEmptyString(result)) {
        console.log(`Assistant: ${result}`);

        const userPrompt = await createUserMessage();
        messages.push(userPrompt);
      } else {
        // Handle function calls
        // Warning: Use for loop instead of Promise.all to ensure the order of the messages
        // but can be optimized if multiple function calls are independent and parallelizable
        for (const item of result) {
          const {
            tool_call_id,
            function_name,
            arguments: function_arguments,
          } = item;

          log.info(
            `Calling function "${function_name}" with ${JSON.stringify(
              function_arguments,
            )}`,
          );

          const functionReturn =
            await AvailableFunctions[
              function_name as keyof typeof AvailableFunctions
            ](function_arguments);

          // Add the function output back to the messages with role "tool"
          messages.push(
            FunctionPrompts.function_response({
              tool_call_id,
              content: functionReturn,
            }),
          );
        }
      }
    } catch (error) {
      log.error(
        `Error during chat processing: ${error instanceof Error ? error.message : String(error)}`,
      );
      console.log(StaticPrompts.fallback);

      // Get user input to continue the conversation
      const userPrompt = await createUserMessage();
      messages.push(userPrompt);
    }
  }

  console.log(StaticPrompts.end);

  const end = performance.now();
  log.info(`⏱️  Total execution time: ${(end - start).toFixed(2)}ms`);
};
