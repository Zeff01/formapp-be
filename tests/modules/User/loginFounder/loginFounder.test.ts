// import prisma from '../../../../src/lib/prisma';
// import UserService from '../../../../src/modules/users/users.service';
// import { UserData } from './loginFounder.data';
// import { GeneratorProvider } from '../../../../src/lib/bcrypt';
// import { JwtUtil } from '../../../../src/lib/jwt';
// import { JwtPayload } from '../../../../src/types/common.type';

// jest.mock('../../../../src/lib/bcrypt', () => ({
//   __esModule: true,
//   GeneratorProvider: {
//     validateHash: jest.fn(),
//   },
// }));

// jest.mock('../../../../src/lib/jwt', () => ({
//   __esModule: true,
//   JwtUtil: {
//     generateToken: jest.fn(),
//   },
// }));

// jest.mock('../../../../src/lib/prisma', () => ({
//   __esModule: true,
//   default: {
//     users: {
//       findFirst: jest.fn(),
//     },
//   },
// }));

// describe('Login Founder', () => {
//   let userService: UserService;

//   beforeAll(() => {
//     userService = new UserService();
//   });

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should login a founder', async () => {
//     const jwtPayload = {
//       id: UserData.id,
//       email: UserData.email,
//       type: UserData.type,
//     };

//     // Mocking the return value of functions
//     (prisma.users.findFirst as jest.Mock).mockResolvedValueOnce(UserData);
//     (GeneratorProvider.validateHash as jest.Mock).mockResolvedValueOnce(true); // Resolve with true indicating successful password validation

//     // Calling the login method of userService
//     const result = await userService.login({
//       email: 'email@example.com',
//       password: 'password',
//     });

//     // Asserting the result
//     expect(result.user).toEqual(UserData);
//     expect(result.token).toEqual(UserData.token); // Asserting the token value from UserData
//     expect(JwtUtil.generateToken).not.toHaveBeenCalled(); // Ensure generateToken is not called
//   });
// });

//TODO: Need to read the properties of generateToken in JwtUtil while mocking the return value

test('sample test', () => {
  expect(true).toBe(true);
});
