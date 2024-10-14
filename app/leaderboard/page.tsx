'use client'

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import ProfileCard from "@/components/ProfileCard"
import ExtendedLeaderboard from "@/components/ExtendedLeaderboard"
import { User } from "@prisma/client"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type UserWithVotes = User & {
  totalVotes: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<UserWithVotes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const rawUsers = await response.json()
        const processedUsers = rawUsers.map((user: User & { votesReceived: any[] }) => ({
          ...user,
          totalVotes: user.votesReceived.reduce((sum, vote) => sum + vote.value, 0),
        }))
        setUsers(processedUsers.sort((a: { totalVotes: number }, b: { totalVotes: number }) => b.totalVotes - a.totalVotes))
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const top3Users = users.slice(0, 3)

  return (
    <Layout>
      <h1 className="my-6 mb-12 text-2xl text-center font-mono font-bold">coolest pfp</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-6">
              {top3Users.map((user, rank) => (
                <ProfileCard key={user.id} user={user} rank={rank + 1} />
              ))}
            </div>
          </div>
          <ExtendedLeaderboard users={users} />
        </>
      )}

      <div className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow bottom-4 right-4 rounded-2xl">
        <Link href="/">
          <Button className="rounded-xl">Canvas</Button>
        </Link>
        <Link href="/me">
          <Button className="rounded-xl">My Profile</Button>
        </Link>
      </div>
    </Layout>
  )
}