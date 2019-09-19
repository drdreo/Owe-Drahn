import { Service } from 'typedi';
import * as path from 'path';

export enum Environment {
    development = 'development',
    production = 'production',
    testing = 'testing',
}

@Service()
export class EnvironmentService {

    private readonly _env = process.env.NODE_ENV || Environment.development;
    private readonly _port = process.env.PORT || 4000;
    private readonly _frontendPath = this.env === 'production' ? path.join(__dirname, '../client/build') : path.join(__dirname, './client/build');


    get env(): string {
        return this._env;
    }

    get port(): number {
        return Number(this._port);
    }

    get frontendPath(): string {
        return this._frontendPath;
    }
}
