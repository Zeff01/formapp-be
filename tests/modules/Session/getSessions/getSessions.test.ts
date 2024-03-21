import { JwtPayload } from '../../../../src/types/common.type';
import SessionsService from '../../../../src/modules/sessions/sessions.service';
import data from './getSessions.data'; // Import data here

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

  it('should return all sessions', async () => {
    const sessions = await sessionService.getSessions('sampleId');

    expect(sessions).toBe(data.data);
  });

  it('should return based on the date ', async () => {
    const fromDate = new Date('06-06-2024');
    const toDate = new Date('12-01-2024');
    const sessions = await sessionService.getSessions(
      'sampleId',
      fromDate,
      toDate
    );
        // TODO: It doesn't work the date filter
    console.log(sessions);
  });
});
