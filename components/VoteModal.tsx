import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserWithRelations } from '@/types'

interface User extends UserWithRelations {
  _count: { votesReceived: number }
}

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (userId: number) => void
  users: User[]
}

export function VoteModal({ isOpen, onClose, onVote, users }: VoteModalProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  
  const handleVote = () => {
    if (selectedUser !== null) {
      onVote(selectedUser);
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white" aria-describedby="voting-modal">
        <DialogHeader>
          <DialogTitle>Vote for the Coolest PFP</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {users.length == 0 && <p>No more users available!</p>}
          {users && users.map((user) => (
            <div
              key={user.id}
              className={`p-2 border rounded-lg cursor-pointer ${
                selectedUser === user.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <Image
                src={user.pfpUrl || "/fallbackAvatar.png"}
                alt={`${user.username || 'User'}'s profile picture`}
                width={100}
                height={100}
                className="object-cover w-full h-auto rounded-md"
              />
              <p className="mt-2 text-sm text-center">{user.username || 'Anonymous'}</p>
              <p className="mt-1 text-xs text-center text-gray-500">Votes: {user._count.votesReceived}</p>
            </div>
          ))}
        </div>
        <Button onClick={handleVote} disabled={selectedUser === null} className="w-full mt-4">
          Submit Vote
        </Button>
      </DialogContent>
    </Dialog>
  )
}