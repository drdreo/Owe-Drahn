import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { allowlist } from "./allow-list";
import { AppModule } from './app.module';
import { EnvironmentService } from './environment.service';

console.log('ENV: ' + process.env.NODE_ENV);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        credentials: true,
        origin: (origin: string, callback: Function) => {
            console.log(origin);
            if (allowlist.indexOf(origin) !== -1 || !origin) {
                callback(null, { origin: true });
            } else {
                callback(new Error('Not allowed by CORS'), { origin: false });
            }
        }
    });

    app.use(
        session({
            secret: 'secret',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            }
        })
    );

    const envService = app.get<EnvironmentService>(EnvironmentService);
    await app.listen(envService.port);
    console.log('Server listening at port:' + envService.port);
}

bootstrap();
