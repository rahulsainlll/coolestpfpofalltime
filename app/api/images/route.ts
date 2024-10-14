import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        pfpUrl: true,
      },
    })

    const urls = users.map(
      (user) => user.pfpUrl?.replace('https://pbs.twimg.com/profile_images/', '')
        .replace('.jpg', '')
    )

    return NextResponse.json(urls)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
