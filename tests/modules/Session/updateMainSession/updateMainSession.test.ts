import SessionsService from '../../../../src/modules/sessions/sessions.service';
import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import { mockUser, data, sessionData } from './updateMainSession.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    sessions: {
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Update Main Session', () => {
  let sessionService: SessionsService;

  beforeAll(async () => {
    sessionService = new SessionsService();

    (prisma.sessions.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve(sessionData);
    });

    await sessionService.createSession(sessionData, mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the main session', async () => {
    (prisma.sessions.update as jest.Mock).mockImplementation(() => {
      return Promise.resolve(data);
    });

    const result = await sessionService.updateMainSession(data, mockUser);

    expect(result).toBeDefined();
  });

  it('should throw an error if the type is USER not FOUNDER', async () => {
    mockUser.type = 'USER';

    (prisma.sessions.update as jest.Mock).mockImplementation(() => {
      return Promise.resolve(data);
    });
    try {
      await sessionService.updateMainSession(data, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });

  it('should throw an error if one of the types are incorrect', async () => {
    (data as any).location = 1;

    (prisma.sessions.update as jest.Mock).mockImplementation(() => {
      return Promise.resolve(data);
    });
    try {
      await sessionService.updateMainSession(data, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });
});
