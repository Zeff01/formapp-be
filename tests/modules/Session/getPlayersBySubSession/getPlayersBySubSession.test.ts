import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import { mockedUsers } from './getPlayersBySubSession.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    users: {
      findMany: jest.fn(),
    },
  },
}));
describe('SessionsService', () => {
  let sessionsService: SessionsService;

  beforeAll(() => {
    sessionsService = new SessionsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should throw HttpUnAuthorizedError if subSessionId is not provided', async () => {
    await expect(sessionsService.getPlayersPerSubSession()).rejects.toThrow(
      HttpUnAuthorizedError
    );
  });

  it('should return an array of users when subSessionId is provided', async () => {
    const subSessionId = 'mock-ID';

    (prisma.users.findMany as jest.Mock).mockResolvedValue(mockedUsers);

    const result = await sessionsService.getPlayersPerSubSession(subSessionId);
    expect(result).toEqual(mockedUsers);
  });
});
