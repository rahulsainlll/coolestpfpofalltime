import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

function isValidTwitterId(id: string): boolean {
  return id.startsWith('@') && id.length > 1;
}

function isValidPfpUrl(url: string): boolean {
  return url.startsWith('https://pbs.twimg.com/profile_images/');
}

export async function POST(req: Request) {
  try {
    const { twitterId, username, pfpUrl } = await req.json();

    // Check if all required fields are provided
    if (!twitterId || !username || !pfpUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate twitterId
    if (!isValidTwitterId(twitterId)) {
      return NextResponse.json({ error: 'Invalid Twitter ID. It should start with @' }, { status: 400 });
    }

    // Validate pfpUrl
    if (!isValidPfpUrl(pfpUrl)) {
      return NextResponse.json({ error: 'Invalid profile picture URL. It should start with https://pbs.twimg.com/profile_images/' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { twitterId },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', currUser: existingUser }, { status: 200 });
    }

    // Create new user
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