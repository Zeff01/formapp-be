import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import SessionsService from '../../../../src/modules/sessions/sessions.service';
import { mockUser, sessionData } from './createSession.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    sessions: {
      create: jest.fn(),
    },
  },
}));

describe('Create Session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new session', async () => {
    const sessionService = new SessionsService();
    (prisma.sessions.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve(sessionData);
    });
    const result = await sessionService.createSession(sessionData, mockUser);
    expect(result).toBeDefined();
  });

  it('should throw an error if input was not a number in noofTeams, maxPlayers, maxperTeam', async () => {
    const sessionService = new SessionsService();
    (sessionData as any).noofTeams = '1';
    (sessionData as any).maxPlayers = '30';
    (sessionData as any).maxperTeam = '10';
    (prisma.sessions.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve(sessionData);
    });
    try {
      await sessionService.createSession(sessionData, mockUser);
    } catch (error) {
      expect(error).toThrowError;
    }
  });

  it('should throw an error if the type is USER not FOUNDER', async () => {
    const sessionService = new SessionsService();
    mockUser.type = 'USER';

    try {
      (prisma.sessions.create as jest.Mock).mockImplementation(() => {
        return Promise.reject(HttpUnAuthorizedError);
      });
      await sessionService.createSession(sessionData, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });
});
