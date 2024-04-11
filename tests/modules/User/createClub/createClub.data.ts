import { JwtPayload } from "../../../../src/types/common.type";

export const mockUser: JwtPayload = {
    id: 'mocked-user-id',
    email: 'mocked-email@example.com',
    type: 'FOUNDER', // User type is FOUNDER
  };