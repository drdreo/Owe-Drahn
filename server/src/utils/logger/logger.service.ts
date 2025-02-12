import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({
    scope: Scope.TRANSIENT
})
export class LoggerService extends Logger {
    private prefix?: string;

    log(message: string) {
        super.verbose(message, this.prefix);
    }

    debug(data: string | object) {
        let formattedMessage = data;

        if (typeof data === 'string' || data instanceof String) {
            if (this.prefix) {
                formattedMessage = `[${this.prefix}] ${data}`;
            }
            console.log(formattedMessage);
        } else {
            console.log(`[${this.prefix}] : %j`, data);
        }
    }

    setPrefix(prefix: string) {
        this.prefix = prefix;
    }
}
