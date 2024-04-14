import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { data } from './getSessions.data';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    sessions: {
      findMany: jest.fn(),
    },
  },
}));

describe('SessionService', () => {
  let sessionService: SessionsService;

  beforeAll(() => {
    // Create a mock function that returns a resolved promise with the data
    const mockFindMany = jest.fn().mockResolvedValue(data.data);

    // Replace the implementation of the sessions.findMany function with the mock function
    require('../../../../src/lib/prisma').default.sessions.findMany =
      mockFindMany;

    // Instantiate the session service
    sessionService = new SessionsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('should return all sessions', async () => {
  //   const sessions = await sessionService.getSessions('sampleId');
  //   console.log(sessions)
  //   expect(sessions).toBe(data.data);
  // });

  it('should return based on the date ', async () => {
    (prisma.sessions.findMany as jest.Mock).mockResolvedValue(data);
    const fromDate = new Date('2024-03-01');
    const toDate = new Date('2024-05-05');
    const sessions = await sessionService.getSessions(
      'sampleId',
      fromDate,
      toDate
    );

    return sessions;
    // TODO: It should behave as filter works as expected
    // console.log(sessions);
  });
});
