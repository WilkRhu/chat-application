// src/chat/chat.entity.ts

import { ChatParticipant } from '@/chat_participants/entities/chat_participants.entity';
import { Message } from '@/message/entities/message.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'boolean', default: false })
  isGroup: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.chat)
  participants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chat_message)
  messages: Message[];
}
