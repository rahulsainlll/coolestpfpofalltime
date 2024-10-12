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
  const { userId } = await req.json() // Expecting userId of the selected profile picture
  console.log("Received userId:", userId);

  try {
    // Find the user in our database using the Kinde user ID
    const dbUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // Verify the selected user's profile picture exists
    const selectedUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) }, // Assuming userId is the ID of the profile picture's owner
      include: { profilePicture: true }, // Include profile pictures to get the related data
    })

    if (!selectedUser || selectedUser.profilePicture.length === 0) {
      return NextResponse.json({ error: 'Selected user has no profile picture' }, { status: 404 })
    }

    // Check if the user has already voted for this profile picture
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: dbUser.id,
        profilePictureId: selectedUser.profilePicture[0].id, // Assuming we take the first profile picture
      },
    })

    console.log(existingVote)

    if (existingVote) {
      return NextResponse.json({ error: 'User has already voted for this profile picture' }, { status: 400 })
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        userId: dbUser.id,
        profilePictureId: selectedUser.profilePicture[0].id, // Vote for the selected user's profile picture
        value: 1,
      },
    })

    // Update the vote count on the profile picture
    await prisma.profilePicture.update({
      where: { id: selectedUser.profilePicture[0].id },
      data: { voteCount: { increment: 1 } },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error casting vote:', error)
    return NextResponse.json({ error: 'Error casting vote' }, { status: 500 })
  }
}
