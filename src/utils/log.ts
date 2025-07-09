import chalk from 'chalk';

export class Logger {
  private context: string | undefined;

  constructor(context?: string) {
    this.context = context;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = chalk.gray(new Date().toISOString());
    const contextStr = this.context ? chalk.cyan(` ${this.context}`) : '';
    return `${timestamp} ${level}${contextStr}: ${message}`;
  }

  info(message: string): void {
    console.log(
      this.formatMessage(chalk.blue.bold('INFO|'), chalk.white(message)),
    );
  }

  error(message: string): void {
    console.error(
      this.formatMessage(chalk.red.bold('ERROR|'), chalk.white(message)),
    );
  }

  warn(message: string): void {
    console.warn(
      this.formatMessage(chalk.yellow.bold('WARN|'), chalk.white(message)),
    );
  }

  debug(message: string): void {
    console.debug(
      this.formatMessage(chalk.magenta.bold('DEBUG|'), chalk.gray(message)),
    );
  }

  success(message: string): void {
    console.log(
      this.formatMessage(chalk.green.bold('SUCCESS|'), chalk.white(message)),
    );
  }
}
