export const mockUserService = {
  create: jest.fn().mockImplementation((user) =>
    Promise.resolve({
      uuid: '123',
      email: user.email || 'test@example.com',
      name: user.name || 'Test User',
      password: user.password || 'hashedPassword',
      roles: user.roles || 'admin',
      status: user.status || 'activated',
    }),
  ),
  findAll: jest.fn().mockResolvedValue([
    {
      uuid: '123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      roles: 'admin',
      status: 'activated',
    },
  ]),
  findOne: jest.fn().mockResolvedValue({
    uuid: '123',
    email: 'test@example.com',
    name: 'Test User',
    roles: 'admin',
    status: 'activated',
  }),
  findOneById: jest.fn().mockResolvedValue({
    uuid: '123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    roles: 'admin',
    status: 'activated',
  }),
  findOneByEmail: jest.fn().mockResolvedValue({
    uuid: '123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    roles: 'admin',
    status: 'activated',
  }),
  update: jest.fn().mockResolvedValue({
    uuid: '123',
    email: 'updated@example.com',
    name: 'Updated User',
    password: 'hashedPassword',
    roles: 'admin',
    status: 'activated',
  }),
  remove: jest
    .fn()
    .mockImplementation((uuid) =>
      Promise.resolve(uuid === '123' ? { affected: 1 } : { affected: 0 }),
    ),
};

export const mockUserRepository = {
  save: jest.fn().mockImplementation((user) =>
    Promise.resolve({
      ...user,
      uuid: '123',
      password: 'hashedPassword',
      roles: 'admin',
      status: 'activated',
    }),
  ),
  find: jest.fn().mockResolvedValue([
    {
      uuid: '123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      roles: 'admin',
      status: 'activated',
    },
  ]),
  findOne: jest.fn().mockImplementation(({ where }) => {
    if (where.uuid === '123') {
      return Promise.resolve({
        uuid: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        roles: 'admin',
        status: 'activated',
      });
    }
    return Promise.resolve(null);
  }),
  delete: jest
    .fn()
    .mockImplementation((uuid) =>
      Promise.resolve(uuid === '123' ? { affected: 1 } : { affected: 0 }),
    ),
};
