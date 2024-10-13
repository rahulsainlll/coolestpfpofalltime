import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = user.given_name || user.family_name || "Default Username";
  const pictureUrl = user.picture || "/fallbackAvatar.png";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists', currUser: existingUser }, { status: 200 });
    }

    const newUser = await prisma.user.create({
      data: {
        twitterId: user.id,
        username: username,
        pfpUrl: pictureUrl,
      },
    });

    return NextResponse.json({message: 'User created!', currUser: newUser}, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}