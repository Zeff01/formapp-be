import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { data } from './getPlayersPerSubSessionId.data';
import { users } from '@prisma/client';
import { HttpUnAuthorizedError } from '../../../../src/lib/errors';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    users: {
      findMany: jest.fn(),
    },
  },
}));

describe('Get Players By SubSession ID', () => {
  let sessionService: SessionsService;

  beforeAll(() => {
    sessionService = new SessionsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return players', async () => {
    const id = '757b39ea-c2a0-4bb2-bdec-4cf068de7d28';

    (prisma.users.findMany as jest.Mock).mockResolvedValue(data.data);

    const players = await sessionService.getPlayersPerSubSession(id);

    expect(players).toEqual(data.data);
  });

  it('should throw an error if no query id', async () => {
    try {
      await sessionService.getPlayersPerSubSession();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });
});
