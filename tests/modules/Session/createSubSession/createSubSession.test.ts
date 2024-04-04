import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import SessionsService from '../../../../src/modules/sessions/sessions.service';
import { mockUser, subSessionData } from './createSubSession.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    subSession: {
      create: jest.fn(),
    },
  },
}));

describe('Create Sub Session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new sub session', async () => {
    const sessionService = new SessionsService();
    (prisma.subSession.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve(subSessionData);
    });
    const result = await sessionService.createSubSession(
      subSessionData,
      mockUser
    );
    expect(result).toBeDefined();
  });

  it('should error if the input was not number in noofTeams, maxPlayers, maxperTeam', async () => {
    const sessionService = new SessionsService();
    (subSessionData as any).noofTeams = '1';
    (subSessionData as any).maxPlayer = '30';
    (subSessionData as any).maxperTeam = '10';
    (prisma.subSession.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve(subSessionData);
    });
    const result = await sessionService.createSubSession(
      subSessionData,
      mockUser
    );
    expect(result).toThrowError;
  });

  it('should error if the type is USER not FOUNDER', async () => {
    const sessionService = new SessionsService();
    mockUser.type = 'USER';

    try {
      (prisma.subSession.create as jest.Mock).mockImplementation(() => {
        return Promise.reject(HttpUnAuthorizedError);
      });
      await sessionService.createSubSession(subSessionData, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });
});
