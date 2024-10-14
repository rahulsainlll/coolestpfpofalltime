import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        twitterId: true,
        username: true,
        pfpUrl: true,
        votesReceived: true,
      },
    })

    const usersWithTotalVotes = users.map(user => ({
      id: user.id,
      twitterId: user.twitterId,
      username: user.username,
      pfpUrl: user.pfpUrl,
      votesReceived: user.votesReceived,
    }))

    return NextResponse.json(usersWithTotalVotes)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
