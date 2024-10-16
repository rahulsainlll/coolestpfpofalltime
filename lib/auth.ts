// /lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Define a type for the user payload in the token
interface UserPayload {
  twitterId: string;
  username: string;
  pfpUrl: string;
}

// Extend the request type
interface AuthenticatedRequest extends NextRequest {
  user: UserPayload;
}

export function verifyAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Missing authentication token' }, { status: 401 });
    }

    try {
      const decoded = verify(token, JWT_SECRET) as UserPayload;
      (req as AuthenticatedRequest).user = decoded; // Cast req to AuthenticatedRequest
      return handler(req as AuthenticatedRequest); // Call the handler with the extended type
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
