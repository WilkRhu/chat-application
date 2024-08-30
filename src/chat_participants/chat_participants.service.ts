/* eslint-disable @typescript-eslint/no-unused-vars */
// src/chat-participant/chat-participant.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatParticipant } from './entities/chat_participants.entity';

@Injectable()
export class ChatParticipantService {
  constructor(
    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
  ) {}

  async findParticipantsByIds(ids: string[]): Promise<ChatParticipant[]> {
    if (!ids || ids.length === 0) return [];
    return this.chatParticipantRepository.findByIds(ids);
  }

  async findAll(): Promise<ChatParticipant[]> {
    return this.chatParticipantRepository.find({ relations: ['chat', 'user'] });
  }

  async findOne(chatId: string, senderId: string): Promise<ChatParticipant> {
    return this.chatParticipantRepository.findOne({
      where: { chatId, senderId },
      relations: ['chat', 'user'],
    });
  }

  async create(chatId: string, senderId: string): Promise<ChatParticipant> {
    const participant = new ChatParticipant();
    participant.chatId = chatId;
    participant.senderId = senderId;
    participant.joinedAt = new Date();

    return this.chatParticipantRepository.save(participant);
  }

  async createMultiple(
    chatId: string,
    userIds: string[],
  ): Promise<ChatParticipant[]> {
    const participants = userIds.map((userId) => {
      const participant = new ChatParticipant();
      participant.chatId = chatId;
      participant.senderId = userId;
      participant.joinedAt = new Date();
      return participant;
    });

    return this.chatParticipantRepository.save(participants);
  }

  async remove(chatId: string, senderId: string): Promise<void> {
    await this.chatParticipantRepository.delete({ chatId, senderId });
  }

  async addParticipant(
    chatId: string,
    senderId: string,
  ): Promise<ChatParticipant> {
    const participant = this.chatParticipantRepository.create({
      chatId,
      senderId,
    });

    return await this.chatParticipantRepository.save(participant);
  }

  async isParticipant(chatId: string, senderId: string): Promise<boolean> {
    const participant = await this.chatParticipantRepository.findOne({
      where: { chat: { id: chatId }, user: { uuid: senderId } },
    });

    return !!participant;
  }
}
