// src/chat/chat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatParticipantService } from '@/chat_participants/chat_participants.service';
import { CreateChatDto } from './dto/crate-chat-dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private readonly chatParticipantService: ChatParticipantService,
  ) {}

  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Chat> {
    return this.chatRepository.findOneBy({ id });
  }

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create({
      name: createChatDto.name,
      isGroup: createChatDto.isGroup,
    });
    const savedChat = await this.chatRepository.save(chat);

    if (createChatDto.participants && createChatDto.participants.length > 0) {
      await this.chatParticipantService.createMultiple(
        savedChat.id,
        createChatDto.participants,
      );
    }

    return savedChat;
  }
  async addParticipantsToChat(
    chatId: string,
    participantIds: string[],
  ): Promise<void> {
    if (participantIds.length > 0) {
      await this.chatParticipantService.createMultiple(chatId, participantIds);
    }
  }

  async update(id: string, chat: Partial<Chat>): Promise<Chat> {
    await this.chatRepository.update(id, chat);
    return this.findOne(id);
  }

  async closeChat(id: string): Promise<void> {
    const chat = await this.findOne(id);

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    chat.isActive = false;
    await this.chatRepository.save(chat);
  }
}
