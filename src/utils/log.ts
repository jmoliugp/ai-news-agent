import chalk from 'chalk';

export class Logger {
  private readonly context: string;

  constructor(context: string = '') {
    this.context = context;
  }

  info(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `${chalk.gray(timestamp)} ${chalk.blue(`[${this.context}]`)} ${message}`,
    );
  }

  success(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `${chalk.gray(timestamp)} ${chalk.green(`[${this.context}]`)} ${message}`,
    );
  }

  error(message: string): void {
    const timestamp = new Date().toISOString();
    console.error(
      `${chalk.gray(timestamp)} ${chalk.red(`[${this.context}]`)} ${message}`,
    );
  }

  warn(message: string): void {
    const timestamp = new Date().toISOString();
    console.warn(
      `${chalk.gray(timestamp)} ${chalk.yellow(`[${this.context}]`)} ${message}`,
    );
  }
}
