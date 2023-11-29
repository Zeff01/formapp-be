import { type JwtPayload } from '../common.type';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Assuming JwtPayload is the type of your decoded JWT payload
    }
  }
}
