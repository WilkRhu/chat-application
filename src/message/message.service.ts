/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({ relations: ['chat', 'user'] });
  }

  async findOne(id: string): Promise<Message> {
    return this.messageRepository.findOne({
      where: { id },
      relations: ['chat', 'user'],
    });
  }

  async create(
    content: string,
    senderId: string,
    chatId: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      content,
      senderId,
      chatId,
    } as DeepPartial<Message>);
    return await this.messageRepository.save(message);
  }

  async update(id: string, message: Partial<Message>): Promise<Message> {
    await this.messageRepository.update(id, message);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }

  async serachMessage(chatId: string): Promise<any> {
    const result = await this.messageRepository.find({
      where: { chatId: chatId },
    });
    return result;
  }
}
