import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: [
        {
          votesReceived: {
            _count: 'desc',
          },
        },
        {
          id: 'asc',
        },
      ],
      take: 10,
      select: {
        id: true,
        twitterId: true,
        username: true,
        pfpUrl: true,
        votesReceived: true,
        _count: {
          select: { votesReceived: true }
        },
      },
    })

    const usersWithTotalVotes = users.map(user => ({
      id: user.id,
      twitterId: user.twitterId,
      username: user.username,
      pfpUrl: user.pfpUrl,
      votesReceived: user.votesReceived,
      _count: {
        votesReceived: user._count.votesReceived
      },
    }))


    return NextResponse.json(usersWithTotalVotes)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}