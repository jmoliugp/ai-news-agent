import { performance } from 'perf_hooks';
import OpenAI from 'openai';

import { Logger } from './utils/log';
import {
  StaticPrompts,
  SystemPrompts,
  FunctionPrompts,
} from './services/ai-agent/prompts';
import { createUserMessage } from './services/ai-agent/user-prompt-interface';
import AvailableFunctions from './services/ai-agent/tools';
import { isNonEmptyString } from './utils/type-utils';
import { startChat } from './services/ai-agent/chat';
import { isChatEnding } from './utils/chat-utils';

const log = new Logger('Main');

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

const startWorkFlow = async (): Promise<void> => {
  const start = performance.now();

  log.info('🚀 AI News Agent started!');

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

const main = async (): Promise<void> => {
  await startWorkFlow();
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error('💥 Fatal error in main:', error);
  process.exit(1);
});
