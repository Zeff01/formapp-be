import prisma from '../../../../src/lib/prisma';
import UserService from '../../../../src/modules/users/users.service';
import { UserData } from './createStaff.data';
jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Create User', () => {
  let userService: UserService;
  beforeAll(() => {
    userService = new UserService();
  });
  beforeEach(() => jest.clearAllMocks());

  it('should create a new user', async () => {
    (prisma.users.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve(UserData);
    });

    const result = await userService.createStaff(UserData);

    expect(result).toEqual(UserData);
  });

  it('should error if user already existing email', async () => {
    (prisma.users.findUnique as jest.Mock).mockResolvedValue({
      email: UserData.email,
    });

    try {
      await userService.createUser(UserData);
    } catch (error) {
      expect(error.message).toEqual('Email already exist');
    }
  });
});
