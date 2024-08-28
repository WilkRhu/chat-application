import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { ChatGateway } from './chat/chat.gateway';
import { MessageService } from './message/message.service';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    EnvConfigModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [],
  providers: [ChatGateway, MessageService],
})
export class AppModule {}
