'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import Image from "next/image"
import { VoteModal } from "./VoteModal"

interface User {
  id: string
  pfpUrl: string
  username: string
}

interface PositionedUser extends User {
  x: number
  y: number
}

export default function ProfilePictureCanvas() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useKindeAuth()

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUsers(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to fetch users. Please try again later.')
      }
    }

    fetchUsers()
  }, [])

  const calculateUserPositions = (): PositionedUser[] => {
    const positionedUsers: PositionedUser[] = []
    const imageSize = 100 // Size of each profile picture
    const gap = 10 // Gap between images
    const totalSize = imageSize + gap
    const columns = Math.floor(canvasSize.width / totalSize)

    users.forEach((user, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      positionedUsers.push({
        ...user,
        x: column * totalSize,
        y: row * totalSize,
      })
    })

    return positionedUsers
  }

  const handleVote = (userId: string) => {
    console.log(`Voted for user: ${userId}`)
    // Here you would typically send a request to your API to record the vote
  }

  const positionedUsers = calculateUserPositions()

  return (
    <div ref={canvasRef} className="fixed inset-0 bg-gray-100 overflow-auto p-4">
      {error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        positionedUsers.map((user) => (
          <div
            key={user.id}
            className="absolute"
            style={{
              left: `${user.x}px`,
              top: `${user.y}px`,
            }}
          >
            <div className="relative">
              <Image
                src={user.pfpUrl || "/fallbackAvatar.png"}
                alt={`${user.username}'s profile picture`}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
            </div>
          </div>
        ))
      )}

      <div className="fixed bottom-4 right-4">
        {isAuthenticated ? (
          <>
            <Button onClick={() => setIsVoteModalOpen(true)} className="mr-2">Vote</Button>
            <LogoutLink>
              <Button>Log out</Button>
            </LogoutLink>
          </>
        ) : (
          <LoginLink>
            <Button>Sign in with X</Button>
          </LoginLink>
        )}
      </div>

      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onVote={handleVote}
        users={users}
      />
    </div>
  )
}