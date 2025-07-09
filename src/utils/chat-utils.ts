import OpenAI from 'openai';

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

type ChatCompletionMessage = OpenAI.ChatCompletionMessage;
type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

/**
 * ChatCompletionMessageParam is for API request
 * ChatCompletionMessage is for API response
 */

/** This is only a subset of the possible signals that can be used to end the chat */
const CHAT_END_SIGNALS = [
  'bye',
  'goodbye',
  'exit',
  'quit',
  'see you',
  'later',
  'farewell',
  'good night',
  'end chat',
  'close',
  "I'm done",
  'I am done',
  "that's all",
  'finish',
  'stop',
];

/**
 * This function checks if the chat is ending based on the `user` message.
 * It checks if the message contains any of the CHAT_END_SIGNALS
 * @param message - the message from the user
 * @returns true if the chat is ending, false otherwise
 */
export function isChatEnding(
  message: ChatCompletionMessageParam | undefined | null,
): boolean {
  if (!isDefined(message)) {
    throw new Error('Cannot find the message!');
  }

  // Only check user messages for end signals
  if (message.role !== 'user') {
    return false;
  }

  const { content } = message;

  return CHAT_END_SIGNALS.some(signal => {
    if (typeof content === 'string') {
      return content.toLowerCase().includes(signal);
    } else {
      // content has a typeof ChatCompletionContentPart, which can be either ChatCompletionContentPartText or ChatCompletionContentPartImage
      // If user attaches an image to the current message first, we assume they are not ending the chat
      const contentPart = content.at(0);
      if (contentPart?.type !== 'text') {
        return false;
      } else {
        return contentPart.text.toLowerCase().includes(signal);
      }
    }
  });
}

/**
 * This function processes the message from the API response.
 * If the message contains tool_calls, it extracts the function arguments.
 * Otherwise, it returns the content of the message.
 * @param message the message from the API response
 * @returns the content of the message (string or null) or the function arguments (object)
 */
export function processMessage(message: ChatCompletionMessage) {
  // Check if message has tool calls and extract function arguments
  if (isDefined(message.tool_calls) && message.tool_calls.length !== 0) {
    return message.tool_calls.map(toolCall => {
      if (!isDefined(toolCall.function)) {
        throw new Error('No function found in the tool call');
      }

      try {
        return {
          tool_call_id: toolCall.id,
          function_name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments),
        };
      } catch (error) {
        throw new Error('Invalid JSON in function arguments');
      }
    });
  }

  // Return message content if no tool calls
  return message.content;
}
