import SessionsService from '../../../../src/modules/sessions/sessions.service';
import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import { mockUser, data } from './updateSubSession.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    subSession: {
      update: jest.fn(),
    },
  },
}));

describe('Update Sub Session', () => {
  let sessionService: SessionsService;

  beforeAll(() => {
    sessionService = new SessionsService();
  });

  it('Should Update Sub Session', async () => {
    data.data.coach = 'George';
    (prisma.subSession.update as jest.Mock).mockResolvedValue(data.data);
    const updatedResultData = await sessionService.updateSubSession(
      data.data,
      mockUser
    );
    expect(updatedResultData).toEqual(data.data);
  });

  it('should throw an error if the type is USER not FOUNDER', async () => {
    mockUser.type = 'USER';

    (prisma.subSession.update as jest.Mock).mockResolvedValue(data.data);

    try {
      await sessionService.updateSubSession(data.data, mockUser);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnAuthorizedError);
      expect(error.message).toEqual('Forbidden');
      expect(error.statusCode).toEqual(401);
    }
  });
});
