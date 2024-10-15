'use client'
import { useState, useEffect, useMemo, useCallback } from "react"
import Layout from "@/components/layout"
import ProfileCard from "@/components/ProfileCard"
import ExtendedLeaderboard from "@/components/ExtendedLeaderboard"
import { User } from "@prisma/client"
import { Loader2, LucideBoxSelect, LucideUser } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import BrandLogo from "@/components/brand-logo"
import Nav from "@/components/nav"

type UserWithVotes = User & {
  totalVotes: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<UserWithVotes[]>([])
  const [loading, setLoading] = useState(true)
  const [totalVotes, setTotalVotes] = useState(0)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 30, leaderboard: true }),
      })
      if (!response.ok) throw new Error('Failed to fetch users')
      const rawUsers = await response.json()
      const processedUsers = rawUsers.map((user: User & { votesReceived: any[] }) => ({
        ...user,
        totalVotes: user.votesReceived.reduce((sum, vote) => sum + vote.value, 0),
      }))
      setUsers(processedUsers.sort((a: { totalVotes: number }, b: { totalVotes: number }) => b.totalVotes - a.totalVotes))
      setTotalVotes(processedUsers.reduce((sum: any, user: { totalVotes: any }) => sum + user.totalVotes, 0))
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const top5Users = useMemo(() => users.slice(0, 5), [users])

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-2 mt-8">Coolest PFP of All Time</h1>
      <p className="text-xl text-center mb-2">🎉 {totalVotes.toLocaleString()} votes are in 🎉</p>
      <p className="text-center mb-12 text-gray-600">
        but you can still <a href="/" className="text-blue-600 hover:underline">vote</a> if you'd like
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-6">
              {top5Users.map((user, rank) => (
                <ProfileCard key={user.id} user={user} rank={rank + 1} />
              ))}
            </div>
          </div>
          <ExtendedLeaderboard users={users} />
        </>
      )}
      <BrandLogo />
      <Nav>
        <Button asChild className="rounded-xl">
          <Link href="/">
            <LucideBoxSelect size={14} className="mr-2" />
            Canvas
          </Link>
        </Button>
        <Button asChild className="rounded-xl">
          <Link href="/me">
            <LucideUser size={14} className="mr-2" />
            My Profile
          </Link>
        </Button>
      </Nav>
    </Layout>
  )
}