import jwt from 'jsonwebtoken';

/**
 * `JwtUtil` Represents a utility class for handling JSON Web Tokens.
 */
export class JwtUtil {
  /**
   * Generates a JWT token for the provided payload.
   *
   * @param payload - The data to be included in the token.
   * @param secret - The secret key for signing the token.
   * @param expiresIn - The expiration time for the token in seconds.
   * @returns - The generated JWT token.
   */
  public static generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   *
   * @param token - The JWT token to be verified.
   * @param secret - The secret key for verifying the token.
   * @returns - The decoded payload if the token is valid, otherwise null.
   */
  public static verifyToken(
    token: string,
    secret: string
  ): Record<string, any> | null {
    try {
      return jwt.verify(token, secret) as Record<string, any>;
    } catch (error) {
      // Token verification failed
      return null;
    }
  }
}

export default JwtUtil;
