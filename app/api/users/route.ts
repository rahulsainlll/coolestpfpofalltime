import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
      take: 10,
      include: {
        votes: true,
        profilePicture: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}