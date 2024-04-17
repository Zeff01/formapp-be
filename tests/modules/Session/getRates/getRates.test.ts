import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { data } from './getRates.data';
import { rates } from '@prisma/client';
import dayjs from 'dayjs';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    rates: {
      findMany: jest.fn(),
    },
  },
}));

describe('Session Rates', () => {
  let sessionService: SessionsService;

  beforeAll(() => {
    sessionService = new SessionsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all rates if ', async () => {
    (prisma.rates.findMany as jest.Mock).mockResolvedValue(data.data);
    const rates = await sessionService.getRates();
    expect(rates).toBe(data.data);
  });

  it('should return based on the date ', async () => {
    const fromDate = new Date('2024-04-13');
    const toDate = new Date('2024-05-1');
    const fromUnix = dayjs(fromDate).unix();
    const toUnix = dayjs(toDate).unix();

    (prisma.rates.findMany as jest.Mock).mockResolvedValue(
      data.data.filter((rate) => {
        const createdAt = dayjs(rate.createdAt).unix();
        return createdAt >= fromUnix && createdAt <= toUnix;
      })
    );

    const rates: rates[] = await sessionService.getRates(fromDate, toDate);
    rates.forEach((rate) => {
      const createdAt = dayjs(rate.createdAt).unix();
      const isValid = createdAt >= fromUnix && createdAt <= toUnix;
      expect(isValid).toEqual(true);
    });
  });
});
