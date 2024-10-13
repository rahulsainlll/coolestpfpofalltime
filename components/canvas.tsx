'use client'

import { useState, useRef, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { VoteModal } from "./VoteModal"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import { UserWithRelations } from "@/types/types"
import { Vote } from "@prisma/client"

interface User extends UserWithRelations {
  _count: { votesReceived: number }
}

interface PositionedUser extends User {
  x: number
  y: number
}

const fetchUsers = async (setUsers: ((arg0: any) => void), setError: ((arg0: string | null) => void)) => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setUsers(data);
    setError(null);
  } catch (error) {
    console.error('Error fetching users:', error);
    setError('Failed to fetch users. Please try again later.');
  }
};

export default function ProfilePictureCanvas() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, getUser } = useKindeAuth();
  const currentUser = getUser();

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
    const checkOrCreateUser = async () => {
      if (isAuthenticated && currentUser) {
        try {
          const response = await fetch('/api/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
          if (response.ok) {
            console.log(data.message);
            setCurrentUserData(data.currUser);
          } else {
            console.error('Error creating user:', data.error);
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      }
    };
  
    fetchUsers(setUsers, setError);
    checkOrCreateUser();
  }, [isAuthenticated, currentUser]);

  const calculateUserPositions = (): PositionedUser[] => {
    const positionedUsers: PositionedUser[] = []
    const imageSize = 100 // Size of each profile picture
    const gap = 0 // Gap between images
    const totalSize = imageSize + gap
    const columns = Math.floor(canvasSize.width / totalSize)

    users.forEach((user, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      // const sizeCoeff = user._count.votesReceived + 1; // Add 1 to avoid size 0 for users with no votes
      positionedUsers.push({
        ...user,
        x: column * totalSize,
        y: row * totalSize,
      })
    })

    return positionedUsers
  }

  const handleVote = async (votedUserId: number) => {
    if (!currentUser || !isAuthenticated) return;
    try {
      // CAST VOTE API CALL
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votedUserId }),
      })
      if (!response.ok) throw new Error('Voting failed')
      const data = await response.json()
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === votedUserId 
          ? { ...user, _count: { ...user._count, votesReceived: data.updatedVoteCount } }
          : user
      ))
      fetchUsers(setUsers, setError)
      setIsVoteModalOpen(false);
    } catch (error) {
      console.error('Error voting:', error)
      setError('Failed to cast vote. Please try again.')
    }

  }

  const positionedUsers = calculateUserPositions()

  const closeAndUpdate = () => {
    fetchUsers(setUsers, setError)
    setIsVoteModalOpen(false)
  }

  const voteOptions = (users: User[]) => {
    console.log(users);
    if (!currentUser) return []
    const candidates = users.filter(
      (user) =>
        user.twitterId !== currentUser.id 
        && user.pfpUrl !== currentUser.picture // fallback check
        // check if currentUser has already voted for this user and if so check if it has been atleast 1 hour
        && !user.votesReceived.find((vote: Vote) => 
          vote.voterId === currentUserData?.id 
          && new Date().getTime() - new Date(vote.createdAt).getTime() < 3600000
        )
    );
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
              // width={100 * (user._count.votesReceived + 1)}
              // height={100 * (user._count.votesReceived + 1)}
              width={100 }
              height={100 }
              className="object-cover rounded-md"
              priority
            />
          </div>
        </div>
      ))
    )}

      <div className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow bottom-4 right-4 rounded-2xl">
        {!isAuthenticated ? (
          <LoginLink>
            <Button className="rounded-xl">Sign In To Vote</Button>
          </LoginLink>
        ) : (
          <>
            <Button onClick={() => setIsVoteModalOpen(true)} className="rounded-xl">Vote Profiles</Button>
            <LogoutLink>
              <Button className="rounded-xl">Log out</Button>
            </LogoutLink>
          </>
        )}
      </div>

      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={closeAndUpdate}
        onVote={handleVote}
        users={voteOptions(users)}
      />
    </div>
  )
}