import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import SessionsService from '../../../../src/modules/sessions/sessions.service';
import { data, mockUser } from './deleteMainSession.data';
import { RecordStatus, sessions } from '@prisma/client';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    sessions: {
      update: jest.fn(),
    },
  },
}));

describe('Delete Main Session', () => {
  let sessionsService: SessionsService;

  beforeAll(() => (sessionsService = new SessionsService()));

  beforeEach(() => jest.clearAllMocks());

  it('should delete main session', async () => {
    const updateStatus = { ...data, status: RecordStatus.DELETED };

    (prisma.sessions.update as jest.Mock).mockImplementation(() => {
      return Promise.resolve(updateStatus);
    });

    const result: sessions = await sessionsService.deleteMainSession(
      updateStatus,
      mockUser
    );

    expect(result.status).toEqual(RecordStatus.DELETED);
  });

  it('should throw an error if user is not authorized', async () => {
    const updateStatus = { ...data, status: RecordStatus.DELETED };

    (mockUser as any).type = 'USER';

    (prisma.sessions.update as jest.Mock).mockImplementation(() => {
      return Promise.resolve(updateStatus);
    });

    try {
      await sessionsService.deleteMainSession(updateStatus, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });

  it('should throw an error if one of the types are incorrect', async () => {
    let updateStatus = { ...data, status: RecordStatus.DELETED };

    (data as any).name = 2;

    (mockUser as any).type = 'USER';

    (prisma.sessions.update as jest.Mock).mockImplementation(() => {
      return Promise.resolve(updateStatus);
    });

    try {
      await sessionsService.deleteMainSession(updateStatus, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });
});
