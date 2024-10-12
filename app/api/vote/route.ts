import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function POST(req: Request) {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const isUserAuthenticated = await isAuthenticated()

  if (!isUserAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const currentUser = await getUser()
  const { votedUserId } = await req.json() // Expecting userId of the user being voted for
  console.log("Received votedUserId:", votedUserId);

  try {
    // Find the voter in our database using the Kinde user ID
    const voter = await prisma.user.findUnique({
      where: { twitterId: currentUser.id },
    })

    if (!voter) {
      return NextResponse.json({ error: 'Voter not found in database' }, { status: 404 })
    }

    // Verify the voted user exists
    const votedUser = await prisma.user.findUnique({
      where: { id: parseInt(votedUserId) },
    })

    if (!votedUser) {
      return NextResponse.json({ error: 'Voted user not found' }, { status: 404 })
    }

    if (votedUser.id === voter.id) {
      return NextResponse.json({ error: 'Cannot vote for yourself' }, { status: 400 })
    }

    // Check if the user has already voted for this user
    const existingVote = await prisma.vote.findFirst({
      where: {
        voterId: voter.id,
        votedUserId: votedUser.id,
      },
    })

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted for this user' }, { status: 400 })
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        voterId: voter.id,
        votedUserId: votedUser.id,
        value: 1, // Assuming all votes are upvotes with value 1
      },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error casting vote:', error)
    return NextResponse.json({ error: 'Error casting vote' }, { status: 500 })
  }
}