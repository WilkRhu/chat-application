// src/message/message.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UserService } from '@/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async createMessage(
    content: string,
    senderId: string,
    receiverId: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      content,
      senderId,
      receiverId,
    });
    return this.messageRepository.save(message);
  }

  async findMessagesByUserId(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      relations: ['sender', 'receiver'],
    });
  }
}
