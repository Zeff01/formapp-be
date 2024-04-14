import prisma from '../../../../src/lib/prisma';
import UserService from '../../../../src/modules/users/users.service';
import { UserData } from './getClub.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    clubs: {
      findMany: jest.fn(),
    },
  },
}));

describe('getClub', () => {
  let userService: UserService;

  beforeAll(() => (userService = new UserService()));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it should return a club', async () => {
    const clubId = 'f9dde705-d301-4abe-8a5a-7ceef7a301d8';
    (prisma.clubs.findMany as jest.Mock).mockResolvedValue(UserData);

    const result = await userService.getClub(undefined, clubId);

    expect(prisma.clubs.findMany).toHaveBeenCalledWith({
      where: { clubId },
    });

    expect(result).toEqual(UserData);
  });
});
