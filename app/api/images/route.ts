import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
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

    const res = NextResponse.json(urls)
    
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.headers.set('Pragma', 'no-cache')
    res.headers.set('Expires', '0')

    return res
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}