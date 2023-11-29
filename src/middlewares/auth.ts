import { type NextFunction, type Request, type Response } from 'express';
import { HttpUnAuthorizedError } from '@/lib/errors';
import JwtUtil from '@/lib/jwt';
import UserService from '@/modules/users/users.service';

const userService = new UserService();

export const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers?.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    // If no Authorization header or it doesn't start with 'Bearer'
    next(new HttpUnAuthorizedError('Unauthorized - Missing or invalid token'));
    return;
  }

  const token = authorizationHeader.slice(7);
  const secretKey = process.env.JWT_SECRET;

  // Verify the token
  const decodedPayload = JwtUtil.verifyToken(token, secretKey);

  if (!decodedPayload) {
    next(new HttpUnAuthorizedError('Unauthorized - Invalid token'));
    return;
  }

  const user: any = await userService.getUser(
    { id: decodedPayload?.id }, // Use optional chain here
    { id: true, email: true, type: true }
  );

  // Token is valid, you can access the decoded payload in `decodedPayload`
  // For example, you can store it in the request for further middleware/routes
  req.user = user;

  // Proceed to the next middleware/route
  next();
};
