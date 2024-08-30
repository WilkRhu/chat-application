export const mockMessageService = {
  serachMessage: jest.fn((chatId: string) => {
    return [{ id: '1', content: 'Test message', chatId }];
  }),
};

export const mockMessageRepository = {
  find: jest.fn(() =>
    Promise.resolve([
      { id: '1', content: 'Hello', chatId: '123', senderId: 'user1' },
    ]),
  ),
  findOne: jest.fn((options) =>
    Promise.resolve({
      id: options.where.id,
      content: 'Hello',
      chatId: '123',
      senderId: 'user1',
    }),
  ),
  create: jest.fn((message) => message),
  save: jest.fn((message) => Promise.resolve({ ...message, id: '1' })),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
};
