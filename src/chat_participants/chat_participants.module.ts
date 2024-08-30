import { Module } from '@nestjs/common';
import { ChatParticipant } from './entities/chat_participants.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatParticipantService } from './chat_participants.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatParticipant])],
  providers: [ChatParticipantService],
  exports: [ChatParticipantService],
})
export class ChatParticipantsModule {}
