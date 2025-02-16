import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameController } from './game/game.controller';
import { UserController } from './user/user.controller';
import { DBService } from './db/db.service';
import { EnvironmentService } from './environment.service';
import { GameService } from './game/game.service';
import { SocketGateway } from './game/socket/socket.gateway';
import { SocketService } from './game/socket/socket.service';

console.log(EnvironmentService.frontendPath);

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: EnvironmentService.frontendPath
        })
    ],
    controllers: [AppController, UserController, GameController],
    providers: [
        AppService,
        EnvironmentService,
        DBService,
        SocketGateway,
        SocketService,
        GameService
    ]
})
export class AppModule {}
