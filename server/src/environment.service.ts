import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { LoggerService } from './utils/logger/logger.service';
import { Logger } from './utils/logger/logger.decorator';

export enum Environment {
    development = 'development',
    production = 'production',
    testing = 'testing',
}

@Injectable()
export class EnvironmentService {

    static frontendPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, '../../../client/build') : path.join(__dirname, '../../client/build');
    public readonly credentialsDir = this.env === 'production' ? path.join(__dirname, '../../../credentials') : path.join(__dirname, '../../../credentials');

    private readonly _env = process.env.NODE_ENV || Environment.development;
    private readonly _port = process.env.PORT || 4000;

    // private readonly _frontendPath = this.env === 'production' ? path.join(__dirname, '../client/build') : path.join(__dirname, './client/build');

    constructor(@Logger('EnvironmentService') private logger: LoggerService) {
        this.logger.log('EnvironmentService - Constructed!');
    }

    get env(): string {
        return this._env;
    }

    get port(): number {
        return Number(this._port);
    }

}
