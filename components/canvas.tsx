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
import { debounce } from '@/utils/debounce'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

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

const CELL_SIZE = 70

const Cell = ({ columnIndex, rowIndex, style, data }: any) => {
  const index = rowIndex * data.columnCount + columnIndex
  const user = data.users[index]

  if (!user) return null

  return (
    <div style={style}>
      <Image
        src={user.pfpUrl || "/fallbackAvatar.png"}
        alt={`${user.username || 'User'}'s profile picture`}
        width={CELL_SIZE}
        height={CELL_SIZE}
        className="object-cover"
        priority={index < 20} // Prioritize loading for the first 20 images
      />
    </div>
  )
}

export default function ProfilePictureCanvas() {
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [currentUserData, setCurrentUserData] = useState<UserWithRelations | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, getUser } = useKindeAuth()
  const currentUser = getUser()

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
  if (error) return <div className="flex items-center justify-center h-full"><p className="text-red-500" role="alert">{error}</p></div>

  return (
    <main className="fixed inset-0 overflow-hidden bg-gray-100">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = Math.floor(width / CELL_SIZE)
          const rowCount = Math.ceil(users.length / columnCount)

          return (
            <Grid
              className="List"
              columnCount={columnCount}
              columnWidth={CELL_SIZE}
              height={height}
              rowCount={rowCount}
              rowHeight={CELL_SIZE}
              width={width}
              itemData={{ users, columnCount }}
            >
              {Cell}
            </Grid>
          )
        }}
      </AutoSizer>

      <div className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow bottom-4 right-4 rounded-2xl">
        {!isAuthenticated ? (
          <LoginLink>
            <Button className="rounded-xl">Sign In To Vote</Button>
          </LoginLink>
        ) : (
          <>
            <Button onClick={() => setIsVoteModalOpen(true)} className="rounded-xl">Vote Profiles</Button>
            <Link href="/leaderboard">
              <Button className="rounded-xl">Leaderboard</Button>
            </Link>
            <LogoutLink>
              <Button className="rounded-xl">Log out</Button>
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
    </main>
  )
}