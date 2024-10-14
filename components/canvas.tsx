'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { VoteModal } from "./VoteModal"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import { UserWithRelations } from "@/types/types"
import Link from "next/link"
import Loader from "./Loader"
import { LucideListOrdered, LucideLogIn, LucideLogOut, LucideStar } from "lucide-react"
import { debounce } from '@/utils/debounce'

const fetchUsers = async (): Promise<UserWithRelations[]> => {
  const response = await fetch('/api/users', { cache: 'no-store' })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

const checkOrCreateUser = async (): Promise<UserWithRelations> => {
  const response = await fetch('/api/create', { method: 'POST' })
  if (!response.ok) throw new Error('Failed to create or fetch user')
  const data = await response.json()
  return data.currUser
}

export default function ProfilePictureCanvas() {
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [currentUserData, setCurrentUserData] = useState<UserWithRelations | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, getUser } = useKindeAuth()
  const currentUser = getUser()

  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current) {
      setCanvasSize({
        width: canvasRef.current.offsetWidth,
        height: canvasRef.current.offsetHeight,
      })
    }
  }, [])

  useEffect(() => {
    updateCanvasSize()
    const debouncedResize = debounce(updateCanvasSize, 250)
    window.addEventListener("resize", debouncedResize)
    return () => window.removeEventListener("resize", debouncedResize)
  }, [updateCanvasSize])

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [fetchedUsers, userData] = await Promise.all([
          fetchUsers(),
          isAuthenticated && currentUser ? checkOrCreateUser() : null
        ])
        setUsers(fetchedUsers)
        setCurrentUserData(userData)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, currentUser])

  const handleVote = useCallback(async (votedUserId: number) => {
    if (!currentUser || !isAuthenticated) return
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votedUserId }),
      })
      if (!response.ok) throw new Error('Voting failed')
      const updatedUsers = await fetchUsers()
      setUsers(updatedUsers)
      setIsVoteModalOpen(false)
    } catch (error) {
      console.error('Error voting:', error)
      setError('Failed to cast vote. Please try again.')
    }
  }, [currentUser, isAuthenticated])

  if (isLoading) return <Loader />
  if (error) return <div className="flex items-center justify-center h-full"><p className="text-red-500">{error}</p></div>

  return (
    <div ref={canvasRef} className="fixed inset-0 overflow-auto bg-gray-100">
      <div className="flex flex-wrap">
        {users.map((user) => (
          <div key={user.id} className="w-[100px] h-[100px]">
            <Image
              src={user.pfpUrl || "/fallbackAvatar.png"}
              alt={`${user.username || 'User'}'s profile picture`}
              width={100}
              height={100}
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      <div className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow bottom-4 right-4 rounded-2xl">
        {!isAuthenticated ? (
          <LoginLink>
            <Button className="rounded-xl">
              <LucideLogIn size={14} className="mr-2" />
              Sign In To Vote
            </Button>
          </LoginLink>
        ) : (
          <>
            <Button onClick={() => setIsVoteModalOpen(true)} className="rounded-xl">
              <LucideStar size={14} className="mr-2" />
              Vote Profiles
            </Button>
            <Link href="/leaderboard">
              <Button className="rounded-xl">
                <LucideListOrdered size={14} className="mr-2" />
                Leaderboard
              </Button>
            </Link>
            <LogoutLink>
              <Button className="rounded-xl">
                <LucideLogOut size={14} className="mr-2" />
                Log out
              </Button>
            </LogoutLink>
          </>
        )}
      </div>

      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onVote={handleVote}
        users={users.filter(user => user.twitterId !== currentUser?.id)}
      />
    </div>
  )
}