import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { votedUserId } = await req.json() // Expecting userId of the user being voted for
  
  try {
    // Find the voter in our database using the Kinde user ID
    const voter = await prisma.user.findUnique({
      where: { twitterId: user.id },
    })
    
    if (!voter) {
      return NextResponse.json({ error: 'Voter not found in database' }, { status: 404 })
    }
    
    // Verify the voted user exists
    const votedUser = await prisma.user.findUnique({
      where: { id: votedUserId },
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    })

    // check if existing vote exists and if it is atleast 1 hour old to allow revoting
    if (existingVote && new Date().getTime() - existingVote.createdAt.getTime() < 3600000) {
      return NextResponse.json({ error: 'You have already voted for this user' }, { status: 400 })
    }
    
    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        voterId: voter.id,
        votedUserId: votedUser.id,
        value: 1, // Adding the value field with a default of 1
      },
    })
    
    // Fetch updated vote count for the voted user
    const updatedVotedUser = await prisma.user.findUnique({
      where: { id: votedUser.id },
    })
    
    return NextResponse.json({ vote })
  } catch (error) {
    console.error('Error casting vote:', error)
    return NextResponse.json({ error: 'Error casting vote' }, { status: 500 })
  }
}