import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { data } from './getPlayersBySubSession.data';
import { HttpBadRequestError } from '../../../../src/lib/errors';
// import XenditService from '../../../../src/modules/sessions/xendit.service';

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
  // let xenditService: XenditService;

  beforeAll(() => {
    sessionService = new SessionsService();
    // xenditService = new XenditService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return players', async () => {
    // TODO: to fix unauthorized error

    (prisma.users.findMany as jest.Mock).mockResolvedValue(data.data);

    const players = await sessionService.getPlayersBySubSession('mocked ID');

    // expect(xenditService.getInvoices).toHaveBeenCalled();

    expect(players).toEqual(data.data);
  });

  it('should throw an error if no query id', async () => {
    try {
      await sessionService.getPlayersBySubSession('');
    } catch (e) {
      expect(e).toBeInstanceOf(HttpBadRequestError);
      expect(e.message).toEqual('Get Players');
      expect(e.rawErrors).toContain('Sub Session Id is undefined');
      expect(e.statusCode).toEqual(400);
    }
  });
});
