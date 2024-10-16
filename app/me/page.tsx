import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma'; // Make sure to import Prisma

const JWT_SECRET = process.env.JWT_SECRET as string;

interface UserPayload {
  twitterId: string;
  // Add other properties if needed
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Missing authentication token' }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as UserPayload; // Ensure you have UserPayload defined
    const user = await prisma.user.findUnique({
      where: { twitterId: decoded.twitterId },
    });

    if (!user) {
      console.error('User not found for Twitter ID:', decoded.twitterId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
