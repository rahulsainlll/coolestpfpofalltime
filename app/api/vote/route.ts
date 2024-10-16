import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
  const { votedUserId } = await req.json();
  const voterTwitterId = (req as any).user.twitterId;

  try {
    const voter = await prisma.user.findUnique({
      where: { twitterId: voterTwitterId },
    });

    if (!voter) {
      return NextResponse.json({ error: 'Voter not found in database' }, { status: 404 });
    }

    const votedUser = await prisma.user.findUnique({
      where: { id: votedUserId },
    });

    if (!votedUser) {
      return NextResponse.json({ error: 'Voted user not found' }, { status: 404 });
    }

    if (votedUser.id === voter.id) {
      return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        voterId: voter.id,
        votedUserId: votedUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    if (existingVote && new Date().getTime() - existingVote.createdAt.getTime() < 3600000) {
      return NextResponse.json({ error: 'You have already voted for this user within the last hour' }, { status: 400 });
    }

    const vote = await prisma.vote.create({
      data: {
        voterId: voter.id,
        votedUserId: votedUser.id,
        value: 1,
      },
    });

    // Get the updated vote count for the voted user
    const updatedVoteCount = await prisma.vote.count({
      where: { votedUserId: votedUser.id, value: 1 } // Count only upvotes (value: 1)
    });

    return NextResponse.json({ vote, updatedVoteCount });
  } catch (error) {
    console.error('Error casting vote:', error);
    return NextResponse.json({ error: 'Error casting vote' }, { status: 500 });
  }
}
