/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatParticipantService } from '@/chat_participants/chat_participants.service';
import { ChatParticipant } from '@/chat_participants/entities/chat_participants.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ChatParticipantService', () => {
  let service: ChatParticipantService;
  let repository: Repository<ChatParticipant>;

  const mockRepository = {
    findByIds: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatParticipantService,
        {
          provide: getRepositoryToken(ChatParticipant),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ChatParticipantService>(ChatParticipantService);
    repository = module.get<Repository<ChatParticipant>>(
      getRepositoryToken(ChatParticipant),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findParticipantsByIds', () => {
    it('should return an array of participants', async () => {
      const ids = ['1', '2'];
      const participants = [{ id: '1' }, { id: '2' }] as ChatParticipant[];
      mockRepository.findByIds.mockResolvedValue(participants);

      const result = await service.findParticipantsByIds(ids);
      expect(result).toEqual(participants);
      expect(mockRepository.findByIds).toHaveBeenCalledWith(ids);
    });

    it('should return an empty array if no ids are provided', async () => {
      const result = await service.findParticipantsByIds([]);
      expect(result).toEqual([]);
      expect(mockRepository.findByIds).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of participants', async () => {
      const participants = [{ id: '1' }] as ChatParticipant[];
      mockRepository.find.mockResolvedValue(participants);

      const result = await service.findAll();
      expect(result).toEqual(participants);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['chat', 'user'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a participant', async () => {
      const participant = {
        id: '1',
        chatId: 'chat1',
        senderId: 'user1',
      } as ChatParticipant;
      mockRepository.findOne.mockResolvedValue(participant);

      const result = await service.findOne('chat1', 'user1');
      expect(result).toEqual(participant);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { chatId: 'chat1', senderId: 'user1' },
        relations: ['chat', 'user'],
      });
    });
  });

  describe('create', () => {
    it('should create a new participant', async () => {
      const participant = {
        chatId: 'chat1',
        senderId: 'user1',
      } as ChatParticipant;
      mockRepository.save.mockResolvedValue(participant);

      const result = await service.create('chat1', 'user1');
      expect(result).toEqual(participant);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a participant', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await service.remove('chat1', 'user1');
      expect(mockRepository.delete).toHaveBeenCalledWith({
        chatId: 'chat1',
        senderId: 'user1',
      });
    });
  });

  describe('isParticipant', () => {
    it('should return true if the user is a participant', async () => {
      const participant = {
        id: '1',
        chatId: 'chat1',
        senderId: 'user1',
      } as ChatParticipant;
      mockRepository.findOne.mockResolvedValue(participant);

      const result = await service.isParticipant('chat1', 'user1');
      expect(result).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { chat: { id: 'chat1' }, user: { uuid: 'user1' } },
      });
    });

    it('should return false if the user is not a participant', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.isParticipant('chat1', 'user1');
      expect(result).toBe(false);
    });
  });
});
