// api/vote.ts
import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function POST(req: Request) {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const isUserAuthenticated = await isAuthenticated()

  if (!isUserAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await getUser()
  const { profilePictureId } = await req.json()

  try {
    // Find the user in our database using the Kinde user ID
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // Verify the ProfilePicture exists
    const profilePicture = await prisma.profilePicture.findUnique({
      where: { id: parseInt(profilePictureId) },
    })

    if (!profilePicture) {
      return NextResponse.json({ error: 'Profile picture not found' }, { status: 404 })
    }

    // Check if the user has already voted for this profile picture
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: dbUser.id,
        profilePictureId: profilePicture.id,
      },
    })

    if (existingVote) {
      return NextResponse.json({ error: 'User has already voted for this profile picture' }, { status: 400 })
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        userId: dbUser.id,
        profilePictureId: profilePicture.id,
        value: 1,
      },
    })

    // Update the vote count on the profile picture
    await prisma.profilePicture.update({
      where: { id: profilePicture.id },
      data: { voteCount: { increment: 1 } },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error casting vote:', error)
    return NextResponse.json({ error: 'Error casting vote' }, { status: 500 })
  }
}