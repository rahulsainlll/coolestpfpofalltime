'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { VoteModal } from "./VoteModal"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useUser } from '@clerk/nextjs'
import { prisma } from "@/lib/prisma"
import { imgResize } from "@/lib/utils"

interface User {
  id: number
  twitterId: string
  pfpUrl: string | null
  username: string | null
  _count: { votesReceived: number }
}

interface PositionedUser extends User {
  x: number
  y: number
}

export default function ProfilePictureCanvas() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { isLoaded, isSignedIn, user } = useUser()

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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      console.log("Data fetched:", data)
      setUsers(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users. Please try again later.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Create a new user in the database if they don't already exist
  useEffect(() => {
    const checkOrCreateUser = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
          });

          console.log("################################",existingUser);
      
          if (!existingUser) {
            console.log("Creating new user in the database");
      
            const pictureUrl = imgResize(user.imageUrl) || "/fallbackAvatar.png"; 
      
            const newUser = await prisma.user.create({
              data: {
                clerkId: user.id,
                username: user.username || "Default Username",
                pfpUrl: pictureUrl,
              },
            });
      
            console.log("User created successfully");
          } else {
            console.log("User already exists:", existingUser);
          }
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    checkOrCreateUser();
  }, [isLoaded, isSignedIn, user]);

  const calculateUserPositions = (): PositionedUser[] => {
    const positionedUsers: PositionedUser[] = []
    const imageSize = 100 // Size of each profile picture
    const gap = 0 // Gap between images
    const totalSize = imageSize + gap
    const columns = Math.floor(canvasSize.width / totalSize)

    users.forEach((user, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const sizeCoeff = user._count.votesReceived + 1; // Add 1 to avoid size 0 for users with no votes
      positionedUsers.push({
        ...user,
        x: column * totalSize * sizeCoeff,
        y: row * totalSize * sizeCoeff,
      })
    })

    return positionedUsers
  }

  const handleVote = async (votedUserId: number) => {
    if (!user || !isSignedIn) return;
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votedUserId }),
      })
      if (!response.ok) throw new Error('Voting failed')
      const data = await response.json()
      // Update the specific user's vote count in the local state
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === votedUserId 
          ? { ...user, _count: { ...user._count, votesReceived: data.updatedVoteCount } }
          : user
      ))
      setIsVoteModalOpen(false);
    } catch (error) {
      console.error('Error voting:', error)
      setError('Failed to cast vote. Please try again.')
    }
  }

  const positionedUsers = calculateUserPositions()

  const voteOptions = (users: User[]) => {
    if (!user) return []
    const candidates = users.filter((_user) => _user.id.toString() !== user.id);
    return candidates.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  return (
    <div ref={canvasRef} className="fixed inset-0 p-4 overflow-auto bg-gray-100">
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
                alt={`${user.username || 'User'}'s profile picture`}
                width={100 * (user._count.votesReceived + 1)}
                height={100 * (user._count.votesReceived + 1)}
                className="object-cover rounded-md"
                priority
              />
            </div>
          </div>
        ))
      )}

      <div className="fixed bottom-4 right-4 flex items-center justify-center bg-white p-2 px-3 gap-2 rounded-2xl shadow">
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="rounded-xl">Sign In To Vote</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button onClick={() => setIsVoteModalOpen(true)} className="rounded-xl">Vote Profiles</Button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10 rounded-xl border-4 border-gray-400',
                userButtonBox: 'w-10 h-10 rounded-xl',
                userButtonTrigger: 'w-10 h-10 rounded-xl',
              },
            }}
          />
        </SignedIn>
      </div>

      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onVote={handleVote}
        users={voteOptions(users)}
      />
    </div>
  )
}