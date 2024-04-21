import { subSession } from '@prisma/client';

export const data = {
  message: 'Sub Session Updated',
  data: {
    id: 'fb022a21-1448-4c3e-93dc-6bc261e4441e',
    sessionType: 'OPENPLAY',
    coach: 'George',
    noofTeams: 10,
    maxPlayers: 30,
    maxperTeam: 5,
    createdAt: new Date('2024-04-08T10:03:41.266Z'),
    updatedAt: new Date('2024-04-08T10:03:41.266Z'),
    sessionId: 'f284ea28-d120-4beb-8475-9c590b15cfb4',
    status: 'ACTIVE',
    createdBy: '1ca37d58-4eb0-4f65-a144-298f2fb4a8ff',
  } as subSession,
};

export const mockUser = {
  id: '1ca37d58-4eb0-4f65-a144-298f2fb4a8ff',
  type: 'FOUNDER',
  email: 'mocked@email.com',
};
