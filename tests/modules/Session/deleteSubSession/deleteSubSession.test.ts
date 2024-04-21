import SessionsService from '../../../../src/modules/sessions/sessions.service';
import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import { data } from './deleteSubSession.data';
import { JwtPayload } from '../../../../src/types/common.type';
import { subSession } from '@prisma/client';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    subSession: {
      update: jest.fn(),
    },
  },
}));

describe('Delete Sub Session', () => {
  let sessionsService: SessionsService;

  beforeAll(() => {
    sessionsService = new SessionsService();
  });

  it('should delete the sub session', async () => {
    const deletedData = { ...data.data, status: 'DELETED' } as subSession;

    const user = {
      id: 'mockedId',
      email: 'mockedEmail',
      type: 'FOUNDER',
    } as JwtPayload;

    (prisma.subSession.update as jest.Mock).mockResolvedValue(deletedData);
    const result = await sessionsService.deleteSubSession(
      data.data as subSession,
      user
    );

    expect(result).toEqual(deletedData);
  });

  it('should throw an error if the user type is not FOUNDER', async () => {
    const user = {
      id: 'mockedId',
      email: 'mockedEmail',
      type: 'STAFF',
    } as JwtPayload;
    try {
      await sessionsService.deleteSubSession(data.data as subSession, user);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
    }
  });
});
