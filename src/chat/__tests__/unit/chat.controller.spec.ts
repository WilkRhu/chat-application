import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ChatController } from '@/chat/chat.controller';
import { ChatService } from '@/chat/chat.service';
import { mockChatService } from '../mocks/chat.mock';

describe('ChatController', () => {
  let chatController: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    chatController = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(chatController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single chat', async () => {
      const uuid = '123';
      const result = await chatController.findOne(uuid);
      expect(result).toEqual({ id: uuid, name: 'Sample Chat' });
      expect(mockChatService.findOne).toHaveBeenCalledWith(uuid);
    });
  });

  describe('findAll', () => {
    it('should return an array of chats', async () => {
      const result = await chatController.findAll();
      expect(result).toEqual([
        { id: '1', name: 'Chat 1' },
        { id: '2', name: 'Chat 2' },
      ]);
      expect(mockChatService.findAll).toHaveBeenCalled();
    });
  });

  describe('closeChat', () => {
    it('should close a chat', async () => {
      const id = '1';
      await chatController.closeChat(id);
      expect(mockChatService.closeChat).toHaveBeenCalledWith(id);
    });
  });
});
