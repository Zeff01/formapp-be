import prisma from '../../../../src/lib/prisma';
import UserService from '../../../../src/modules/users/users.service';
import { UserData } from './deleteUser.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    users: {
      delete: jest.fn(),
    },
  },
}));

describe('Delete User', () => {
  let userService: UserService;

  beforeAll(() => (userService = new UserService()));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user', async () => {
    (prisma.users.delete as jest.Mock).mockImplementation(() => {
      return Promise.resolve(UserData);
    });

    const res = await userService.deleteUser(UserData);

    expect(res).toEqual(UserData);
  });
});
