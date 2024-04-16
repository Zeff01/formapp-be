/* eslint-disable */
import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    sessions: {
      findMany: jest.fn(),
    },
  },
}));

describe('Session Rates', () => {
  let sesionService: SessionsService;

  beforeAll(() => {
    const mockFindMany = jest.fn().mockResolvedValue(data.data);
  });
});
