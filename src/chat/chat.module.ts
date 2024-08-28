// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from '../message/message.service';
import { UsersModule } from '@/users/users.module';
import { ChatGateway } from '@/chat/chat.gateway';
import { Message } from '@/message/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
  providers: [ChatGateway, MessageService],
  exports: [MessageService],
})
export class ChatModule {}
