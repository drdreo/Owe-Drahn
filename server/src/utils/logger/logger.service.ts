import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService extends Logger {
  private prefix?: string;

  log(message: string) {
    let formattedMessage = message;

    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }

    super.verbose(message, this.prefix);
  }

  debug(message: string) {
    let formattedMessage = message;

    if (this.prefix) {
      formattedMessage = `[${this.prefix}] ${message}`;
    }

    console.log(formattedMessage);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
}