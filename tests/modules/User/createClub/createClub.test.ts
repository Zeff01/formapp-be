import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import UserService from '../../../../src/modules/users/users.service';
import { mockUser } from './createClub.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    clubs: {
      create: jest.fn(), // Mock create method of clubs object in Prisma
    },
  },
}));

describe('createClub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a club with provided data and authenticated user', async () => {
    const data = {
      name: 'Test Club',
    };

    (prisma.clubs.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        clubId: 'mocked-club-id',
        clubName: data.name,
      });
    });

    const userService = new UserService();

    const result = await userService.createClub(data, mockUser);

    expect(result).toBeDefined();
  });

  it('should throw an HttpUnAuthorizedError when user is not a founder', async () => {
    const data = {
      name: 'Test Club',
    };

    const userType = { ...mockUser, type: 'USER' };

    const userService = new UserService();

    await expect(userService.createClub(data, userType)).rejects.toThrow(
      HttpUnAuthorizedError
    );

    expect(prisma.clubs.create).not.toHaveBeenCalled();
  });
});
