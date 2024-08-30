// src/chat-participant/chat-participant.entity.ts

import { Chat } from '@/chat/entities/chat.entity';
import { User } from '@/users/entities/user.entity';
import {
  Entity,
  CreateDateColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat_participants')
export class ChatParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @Column()
  senderId: string;

  @Column()
  reciverId: string;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => Chat, (chat) => chat.id, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.uuid, { onDelete: 'CASCADE' })
  user: User;
}
