import prisma from '../../../../src/lib/prisma';
import UserService from '../../../../src/modules/users/users.service';
import { UserData } from './updateUser.data';
jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    users: {
      update: jest.fn(),
    },
  },
}));

describe('Update user info', () => {
  let userService: UserService;

  beforeAll(() => (userService = new UserService()));

  beforeEach(() => jest.clearAllMocks());

  it('should update user info', async () => {
    const updatedUserData = { ...UserData, email: 'newemail@example.com' };

    (prisma.users.update as jest.Mock).mockReturnValue(updatedUserData);

    const result = await userService.updateUser(updatedUserData);

    expect(result).toEqual(updatedUserData);
  });
});
