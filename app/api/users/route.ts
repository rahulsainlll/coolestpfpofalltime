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
        username: true,
        pfpUrl: true,
        votesReceived: {
          select: {
            value: true,
          },
        },
      },
    })

    // total votes for each user
    const usersWithTotalVotes = users.map(user => ({
      id: user.id,
      username: user.username,
      pfpUrl: user.pfpUrl,
      totalVotes: user.votesReceived.reduce((sum, vote) => sum + vote.value, 0),
    }))

    // sort 
    usersWithTotalVotes.sort((a, b) => b.totalVotes - a.totalVotes)

    return NextResponse.json(usersWithTotalVotes)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}