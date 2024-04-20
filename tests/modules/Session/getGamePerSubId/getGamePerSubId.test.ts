/* eslint-disable */

import SessionsService from '../../../../src/modules/sessions/sessions.service';
import prisma from '../../../../src/lib/prisma';
import { data } from './getGamePerSubId.data'; 
import { subSession } from '@prisma/client';

jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    subSession: {
      findFirst: jest.fn(),
    },
  },
}));


describe("Get Game by Sub Session ID" , () => {
    let sessionsService: SessionsService;

    beforeAll(() => {
        sessionsService = new SessionsService();
    })

    afterEach(() => {
        jest.clearAllMocks();
      });

    it("should return all games based on session ID", async () => { 
        (prisma.subSession.findFirst as jest.Mock).mockResolvedValue(data.data) 
        const game = await sessionsService.getGamePerSubId(data.data.id); 
        expect(game).toEqual(data.data)  
    })

    it("should return ", async () => {
        (prisma.subSession.findFirst as jest.Mock).mockResolvedValue(null)
        const mockedId = 'mockedId'
        const game  = await sessionsService.getGamePerSubId(mockedId); 
        expect(game).toBeNull() 
    })

})