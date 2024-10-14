import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function POST(req: NextRequest) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { limit, orderByTotalVotes } = await req.json();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const users = await prisma.user.findMany({
      where: {
        twitterId: {
          not: user.id,
        },
        votesReceived: orderByTotalVotes ? undefined : 
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
      take: limit || 4,
      orderBy: orderByTotalVotes ? {
        votesReceived: {
          _count: 'desc',
        },
      } : undefined,
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
