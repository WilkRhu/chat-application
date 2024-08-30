import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { ChatParticipantsModule } from './chat_participants/chat_participants.module';
import { ChatGateway } from './geteway/chat.gateway';
import { DatabaseModule } from './infrastructure/database/database.module';
import { EnvConfigModule } from './infrastructure/env-config/env-config.module';

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
    MessageModule,
    ChatModule,
    ChatParticipantsModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
