'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { VoteModal } from "./VoteModal"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import { UserWithRelations } from "@/types/types"
import { Vote } from "@prisma/client"
import Link from "next/link"
import Loader from "./Loader"

interface PositionedUserWithRelations extends UserWithRelations {
  x: number
  y: number
}

const fetchUsers = async (setUsers: (arg0: any) => void, setError: (arg0: string | null) => void) => {
  try {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    setUsers(data)
    setError(null)
  } catch (error) {
    console.error('Error fetching users:', error)
    setError('Failed to fetch users. Please try again later.')
  }
}

export default function ProfilePictureCanvas({ fetchedUsers }: { fetchedUsers: UserWithRelations[] }) {
  const [users, setUsers] = useState<UserWithRelations[]>(fetchedUsers)
  const [currentUserData, setCurrentUserData] = useState<UserWithRelations | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [positionedUsers, setPositionedUsers] = useState<PositionedUserWithRelations[]>([])
  const [imageSize, setImageSize] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, getUser } = useKindeAuth()
  const currentUser = getUser()

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    const checkOrCreateUser = async () => {
      if (isAuthenticated && currentUser) {
        try {
          const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const data = await response.json()
          if (response.ok) {
            console.log(data.message)
            setCurrentUserData(data.currUser)
          } else {
            console.error('Error creating user:', data.error)
          }
        } catch (error) {
          console.error('Network error:', error)
        }
      }
    }

    const loadData = async () => {
      setIsLoading(true)
      await fetchUsers(setUsers, setError)
      await checkOrCreateUser()
      setIsLoading(false)
    }

    loadData()
  }, [isAuthenticated, currentUser])

  useEffect(() => {
    const calculateOptimalImageSize = (userCount: number, canvasWidth: number, canvasHeight: number): number => {
      const aspectRatio = canvasWidth / canvasHeight
      const columnsF = Math.sqrt(userCount * aspectRatio)
      const rowsF = userCount / columnsF
      
      const columns = Math.ceil(columnsF)
      const rows = Math.ceil(rowsF)
      
      const sizeByWidth = Math.floor(canvasWidth / columns)
      const sizeByHeight = Math.floor(canvasHeight / rows)
      
      return Math.floor(Math.min(sizeByWidth, sizeByHeight, 100))
    }

    const newImageSize = calculateOptimalImageSize(users.length, canvasSize.width, canvasSize.height)
    setImageSize(newImageSize)

    const columns = Math.floor(canvasSize.width / newImageSize)
    const positioned = users.map((user, index) => ({
      ...user,
      x: (index % columns) * newImageSize,
      y: Math.floor(index / columns) * newImageSize,
    }))

    setPositionedUsers(positioned)
  }, [users, canvasSize])

  const handleVote = async (votedUserId: number) => {
    if (!currentUser || !isAuthenticated) return
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votedUserId }),
      })
      if (!response.ok) throw new Error('Voting failed')
      fetchUsers(setUsers, setError)
      setIsVoteModalOpen(false)
    } catch (error) {
      console.error('Error voting:', error)
      setError('Failed to cast vote. Please try again.')
    }
  }

  const closeAndUpdate = () => {
    fetchUsers(setUsers, setError)
    setIsVoteModalOpen(false)
  }

  const voteOptions = (users: UserWithRelations[]) => {
    if (!currentUser) return []
    const candidates = users.filter(
      (user) =>
        user.twitterId !== currentUser.id 
        && user.pfpUrl !== currentUser.picture
        && !user.votesReceived.find((vote: Vote) => 
          vote.voterId === currentUserData?.id 
          && new Date().getTime() - new Date(vote.createdAt).getTime() < 3600000
        )
    )
    return candidates.sort(() => 0.5 - Math.random()).slice(0, 4)
  }

  return (
    <div ref={canvasRef} className="fixed inset-0 overflow-hidden bg-gray-100">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full">
            {positionedUsers.map((user) => (
              <div
                key={user.id}
                className="absolute overflow-hidden"
                style={{
                  left: `${user.x}px`,
                  top: `${user.y}px`,
                  width: `${imageSize}px`,
                  height: `${imageSize}px`,
                }}
              >
                <Image
                  src={user.pfpUrl || "/fallbackAvatar.png"}
                  alt={`${user.username || 'User'}'s profile picture`}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            ))}
          </div>

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
              </>
            )}
          </div>

          <VoteModal
            isOpen={isVoteModalOpen}
            onClose={closeAndUpdate}
            onVote={handleVote}
            users={voteOptions(users)}
          />
        </>
      )}
    </div>
  )
}