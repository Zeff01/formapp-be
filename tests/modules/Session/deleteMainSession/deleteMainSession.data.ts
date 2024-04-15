import { RecordStatus } from '@prisma/client';
import { JwtPayload } from '../../../../src/types/common.type';

export const mockUser: JwtPayload = {
  id: 'mocked-user-id',
  email: 'mocked-founder@example.com',
  type: 'FOUNDER', // User type is FOUNDER
};

export const data = {
  id: 'c5d57dec-1425-4272-ac09-4aebd7fb52ef',
  name: 'mocked name',
  location: 'mocked location',
  sessionDate: '2022-01-01',
  sessionTime: '10:00',
  status: 'ACTIVE' as RecordStatus,
  createdBy: null,
  createdAt: new Date('2024-03-01T14:11:35.440Z'),
  updatedAt: new Date('2024-03-02T11:10:30.147Z'),
};
