import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { twitterId: string } }
) {
  const { twitterId } = params
  const { isAuthenticated, getUser } = getKindeServerSession()

  const isUserAuthenticated = await isAuthenticated()
  const currentUser = await getUser()

  const user = await prisma.user.findUnique({
    where: { twitterId: twitterId },
    include: {
      votesReceived: true,
      votesGiven: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let timeSinceLastVote = null
  if (currentUser && currentUser.id) {
    const currentUserData = await prisma.user.findUnique({
      where: { twitterId: currentUser.id },
    })

    if (currentUserData) {
      const votesFromCurrentUser = user.votesReceived
        .filter((vote) => vote.voterId === currentUserData.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      const lastVote = votesFromCurrentUser.find((vote) => vote.voterId === currentUserData.id)
      if (lastVote) {
        timeSinceLastVote = new Date().getTime() - lastVote.createdAt.getTime()
      } else {
        timeSinceLastVote = 3600001
      }
    }
  }

  return NextResponse.json({
    user,
    isUserAuthenticated,
    currentUser,
    timeSinceLastVote,
  })
}