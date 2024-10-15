import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        pfpUrl: true,
      },
    })

    const urls = users.map((user) => {
      if (user.pfpUrl) {
        // Return the full URL if it exists
        return user.pfpUrl
      } else {
        // Return a fallback image URL if pfpUrl is null or undefined
        return '/fallbackAvatar.png'
      }
    })

    return NextResponse.json(urls)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}