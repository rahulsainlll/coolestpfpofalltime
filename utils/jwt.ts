import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(twitterId: string): string {
  return jwt.sign({ twitterId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): { twitterId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { twitterId: string };
  } catch (error) {
    return null;
  }
}
