/* eslint-disable @typescript-eslint/no-unused-vars */
export const mockChatService = {
  findOne: jest.fn((uuid: string) => {
    return { id: uuid, name: 'Sample Chat' };
  }),
  findAll: jest.fn(() => {
    return [
      { id: '1', name: 'Chat 1' },
      { id: '2', name: 'Chat 2' },
    ];
  }),
  closeChat: jest.fn((id: string) => Promise.resolve()),
};

export const mockChatRepository = {
  find: jest.fn(() =>
    Promise.resolve([{ id: '1', name: 'Sample Chat', isActive: true }]),
  ),
  findOneBy: jest.fn((criteria) =>
    Promise.resolve({ id: criteria.id, name: 'Sample Chat', isActive: true }),
  ),
  create: jest.fn((chat) => chat),
  save: jest.fn((chat) => Promise.resolve({ ...chat, id: '1' })),
  update: jest.fn(() => Promise.resolve()),
};

export const mockChatParticipantService = {
  createMultiple: jest.fn(() => Promise.resolve()),
};
