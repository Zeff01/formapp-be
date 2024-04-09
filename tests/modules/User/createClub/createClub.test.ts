import { HttpUnAuthorizedError } from '../../../../src/lib/errors';
import prisma from '../../../../src/lib/prisma';
import UserService from '../../../../src/modules/users/users.service';
import { JwtPayload } from '../../../../src/types/common.type';

// Mock Prisma instance
jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    clubs: {
      create: jest.fn(), // Mock create method of clubs object in Prisma
    },
  },
}));

// Test suite for createClub function
describe('createClub', () => {
  beforeEach(() => {
    // Clear all mock calls between tests
    jest.clearAllMocks();
  });

  // Test case: should create a club with provided data and authenticated user
  it('should create a club with provided data and authenticated user', async () => {
    // Mocked data for testing
    const data = {
      name: 'Test Club',
    };

    // Mocked user payload
    const mockUser: JwtPayload = {
      id: 'mocked-user-id',
      email: 'mocked-email@example.com',
      type: 'FOUNDER', // User type is FOUNDER
    };

    // Mock implementation of Prisma create method
    (prisma.clubs.create as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        clubId: 'mocked-club-id',
        clubName: data.name,
      });
    });

    const userService = new UserService(); // Create instance of UserService

    // Call createClub function with mocked data and user
    const result = await userService.createClub(data, mockUser);

    // Expect the result to be defined
    expect(result).toBeDefined();
  });

  // Test case: should throw an HttpUnAuthorizedError when user is not a founder
  it('should throw an HttpUnAuthorizedError when user is not a founder', async () => {
    // Mocked data for testing
    const data = {
      name: 'Test Club',
    };

    // Mocked user payload with non-founder type
    const mockUser: JwtPayload = {
      id: 'mocked-user-id',
      email: 'mocked-email@example.com',
      type: 'USER', // User type is USER (not a founder)
    };

    const userService = new UserService(); // Create instance of UserService

    // Call createClub function with mocked data and user, expect it to throw HttpUnAuthorizedError
    await expect(userService.createClub(data, mockUser)).rejects.toThrow(
      HttpUnAuthorizedError
    );

    // Ensure that Prisma create method was not called
    expect(prisma.clubs.create).not.toHaveBeenCalled();
  });
});
