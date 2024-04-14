import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { UserData } from './getSubSession.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    subSession: {
      findMany: jest.fn(),
    },
  },
}));

describe('SessionService', () => {
  let sessionService: SessionsService;

  beforeAll(() => {
    sessionService = new SessionsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all subSession data ', async () => {
    (prisma.subSession.findMany as jest.Mock).mockResolvedValue(UserData);

    const res = await sessionService.getSubSessions();

    expect(res).toEqual(UserData);
  });
});
