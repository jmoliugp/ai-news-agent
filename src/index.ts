import { performance } from 'perf_hooks';

import { Logger } from './utils/log';

const log = new Logger('Main');

const main = async (): Promise<void> => {
  const start = performance.now();

  log.info('🚀 Project started!');

  const end = performance.now();
  log.info(`⏱️  Execution time: ${(end - start).toFixed(2)}ms`);
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
  console.error('Error in main:', error);
  process.exit(1);
});
