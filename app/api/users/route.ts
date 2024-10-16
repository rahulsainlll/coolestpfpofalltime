import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const { limit, leaderboard, randomised } = await req.json();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const count = await prisma.user.count()
    const users = await prisma.user.findMany({
      where: {
        twitterId: leaderboard || !(user && user.id) ? undefined : {
          not: user.id,
        },
        votesReceived: leaderboard || !(user && user.id) ? undefined : 
        {
          none: {
            createdAt: { gt: oneHourAgo },
            voter: { twitterId: user.id },
          }
        },
      },
      select: {
        id: true,
        twitterId: true,
        username: true,
        pfpUrl: true,
        votesReceived: true,
      },
      take: limit || 100,
      skip: randomised ? Math.floor(Math.random() * (count - (limit || 30))) : undefined,
      orderBy: leaderboard ? {
        votesReceived: {
          _count: 'desc',
        },
      } : undefined,
    })

    // if (randomised) {
    //   users.sort(() => Math.random() - 0.5)
    // }

    // if (limit) {
    //   users.splice(limit)
    // } else {
    //   users.splice(30)
    // }
    

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
