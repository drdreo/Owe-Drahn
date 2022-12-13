import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { EnvironmentService } from './environment.service';

const allowlistDomains = [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://owe-drahn.pages.dev/',
    'https://owe-drahn.pages.dev/'
];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        credentials: true,
        origin: corsOptionsDelegate
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
