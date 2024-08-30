// src/message/message.controller.spec.ts
import { MessageController } from '@/message/message.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { mockMessageService } from '../mocks/mock.message';
import { MessageService } from '@/message/message.service';

describe('MessageController', () => {
  let messageController: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    messageController = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(messageController).toBeDefined();
  });

  describe('serachMessage', () => {
    it('should return messages for the given chatId', async () => {
      const chatId = '123';
      const result = await messageController.serachMessage(chatId);
      expect(result).toEqual([{ id: '1', content: 'Test message', chatId }]);
      expect(mockMessageService.serachMessage).toHaveBeenCalledWith(chatId);
    });
  });
});
