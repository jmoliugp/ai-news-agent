import { performance } from 'perf_hooks';

import { runAgent } from '@/services/ai-agent';
import { Logger } from './utils/log';

const log = new Logger('Main');

const startWorkFlow = async (): Promise<void> => {
  const start = performance.now();

  log.info('🚀 AI News Agent started!');

  await runAgent();

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
