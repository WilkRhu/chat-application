// src/message/message.repository.ts
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

export class MessageRepository extends Repository<Message> {}
