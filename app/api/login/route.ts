// /api/login
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { twitterId } = await req.json();
  
  const user = await prisma.user.findUnique({ where: { twitterId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Create a session token
  const token = sign({ userId: user.id, twitterId: user.twitterId }, JWT_SECRET, { expiresIn: '30d' });

  return NextResponse.json({ user, token });
}