import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    content: string,
    senderId: string,
    receiverId: string,
  ): Promise<Message> {
    const sender = await this.messageRepository.manager.findOne(User, {
      where: { uuid: senderId },
    });
    const receiver = await this.messageRepository.manager.findOne(User, {
      where: { uuid: receiverId },
    });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = this.messageRepository.create({
      content,
      sender,
      receiver,
    });

    return this.messageRepository.save(message);
  }

  async findMessagesByUserId(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [{ sender: { uuid: userId } }, { receiver: { uuid: userId } }],
      relations: ['sender', 'receiver'],
    });
  }
}
