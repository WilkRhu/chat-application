// src/chat/chat.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockChatRepository,
  mockChatParticipantService,
} from '../mocks/chat.mock';
import { ChatService } from '@/chat/chat.service';
import { Chat } from '@/chat/entities/chat.entity';
import { NotFoundException } from '@nestjs/common';
import { ChatParticipantService } from '@/chat_participants/chat_participants.service';

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Chat),
          useValue: mockChatRepository,
        },
        {
          provide: ChatParticipantService,
          useValue: mockChatParticipantService,
        },
      ],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of active chats', async () => {
      const result = await chatService.findAll();
      expect(result).toEqual([
        { id: '1', name: 'Sample Chat', isActive: true },
      ]);
      expect(mockChatRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a chat by id', async () => {
      const id = '1';
      const result = await chatService.findOne(id);
      expect(result).toEqual({ id, name: 'Sample Chat', isActive: true });
      expect(mockChatRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('create', () => {
    it('should create a new chat without participants', async () => {
      const createChatDto = {
        name: 'New Chat',
        isGroup: true,
        participants: [],
      };

      const result = await chatService.create(createChatDto);
      expect(result).toEqual({ id: '1', name: 'New Chat', isGroup: true });

      expect(mockChatRepository.create).toHaveBeenCalledWith({
        name: 'New Chat',
        isGroup: true,
      });
      expect(mockChatRepository.save).toHaveBeenCalled();
      expect(mockChatParticipantService.createMultiple).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a chat and return the updated chat', async () => {
      const id = '1';
      const chat = { name: 'Updated Chat' };

      const result = await chatService.update(id, chat);
      expect(mockChatRepository.update).toHaveBeenCalledWith(id, chat);
      expect(result).toEqual({ id, name: 'Sample Chat', isActive: true });
    });
  });

  describe('closeChat', () => {
    it('should close an active chat', async () => {
      const id = '1';

      await chatService.closeChat(id);
      expect(mockChatRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockChatRepository.save).toHaveBeenCalledWith({
        id,
        name: 'Sample Chat',
        isActive: false,
      });
    });

    it('should throw a NotFoundException if the chat does not exist', async () => {
      const id = 'non-existing-id';
      mockChatRepository.findOneBy.mockResolvedValueOnce(null);

      await expect(chatService.closeChat(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
