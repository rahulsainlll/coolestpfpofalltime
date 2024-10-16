import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { verifyAuth } from '@/lib/auth';

interface AuthenticatedRequest extends NextRequest {
  user: {
    twitterId: string;
    username: string;
    pfpUrl: string;
  };
}

async function createUser(req: AuthenticatedRequest) {
  const { twitterId, username, pfpUrl } = req.user; // User data extracted from verified token

  try {
    const existingUser = await prisma.user.findUnique({
      where: { twitterId },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', currUser: existingUser }, { status: 200 });
    }

    const newUser = await prisma.user.create({
      data: {
        twitterId,
        username,
        pfpUrl,
      },
    });

    return NextResponse.json({ message: 'User created!', currUser: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

// Wrap the handler with verifyAuth
export async function POST(req: NextRequest) {
  return verifyAuth(createUser)(req);
}
