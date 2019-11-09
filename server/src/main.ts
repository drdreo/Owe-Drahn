import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { EnvironmentService } from './environment.service';

const whitelistDomains = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://owe-drahn.herokuapp.com/',
    'http://owe-drahn.herokuapp.com/',
];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        credentials: true,
        origin: (origin: string, callback: Function) => {
            if (whitelistDomains.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
    });

    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    }));

    const envService = app.get<EnvironmentService>(EnvironmentService);
    await app.listen(envService.port);
    console.log('Server listening at port:' + envService.port);
}

bootstrap();
