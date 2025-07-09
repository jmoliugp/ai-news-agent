import 'dotenv/config';

interface Config {
  openaiApiKey: string;
}

const getConfig = (): Config => {
  const openaiApiKey = process.env['OPENAI_API_KEY'];

  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  return {
    openaiApiKey,
  };
};

export const config = getConfig();
