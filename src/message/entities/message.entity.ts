import { Chat } from '@/chat/entities/chat.entity';
import { User } from '@/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  senderId: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.uuid)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat_message: Chat;
}
