import OpenAI from 'openai';

import { config } from '@/utils/config';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: config.openaiApiKey,
  });
}

export const openaiClient = getOpenAIClient();
