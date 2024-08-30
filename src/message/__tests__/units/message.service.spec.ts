// src/message/message.service.spec.ts
import { Message } from '@/message/entities/message.entity';
import { MessageService } from '@/message/message.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockMessageRepository } from '../mocks/mock.message';
describe('MessageService', () => {
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessageRepository,
        },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(messageService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of messages with relations', async () => {
      const result = await messageService.findAll();
      expect(result).toEqual([
        { id: '1', content: 'Hello', chatId: '123', senderId: 'user1' },
      ]);
      expect(mockMessageRepository.find).toHaveBeenCalledWith({
        relations: ['chat', 'user'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a message by id with relations', async () => {
      const id = '1';
      const result = await messageService.findOne(id);
      expect(result).toEqual({
        id: '1',
        content: 'Hello',
        chatId: '123',
        senderId: 'user1',
      });
      expect(mockMessageRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['chat', 'user'],
      });
    });
  });

  describe('create', () => {
    it('should create and return a new message', async () => {
      const content = 'Hello';
      const senderId = 'user1';
      const chatId = '123';

      const result = await messageService.create(content, senderId, chatId);
      expect(result).toEqual({ id: '1', content, senderId, chatId });
      expect(mockMessageRepository.create).toHaveBeenCalledWith({
        content,
        senderId,
        chatId,
      });
      expect(mockMessageRepository.save).toHaveBeenCalledWith({
        content,
        senderId,
        chatId,
      });
    });
  });

  describe('update', () => {
    it('should update a message and return the updated message', async () => {
      const id = '1';
      const message = { content: 'Updated Content' };

      const result = await messageService.update(id, message);
      expect(mockMessageRepository.update).toHaveBeenCalledWith(id, message);
      expect(result).toEqual({
        id: '1',
        content: 'Hello',
        chatId: '123',
        senderId: 'user1',
      });
    });
  });

  describe('remove', () => {
    it('should delete a message', async () => {
      const id = '1';
      await messageService.remove(id);
      expect(mockMessageRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('serachMessage', () => {
    it('should return messages by chatId', async () => {
      const chatId = '123';
      const result = await messageService.serachMessage(chatId);
      expect(result).toEqual([
        { id: '1', content: 'Hello', chatId, senderId: 'user1' },
      ]);
      expect(mockMessageRepository.find).toHaveBeenCalledWith({
        where: { chatId },
      });
    });
  });
});
