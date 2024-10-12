import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserWithRelations } from '@/types/types'

interface User {
  id: string
  pfpUrl: string
  username: string
}

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (userId: string) => void
  users: UserWithRelations[]
}

export function VoteModal({ isOpen, onClose, onVote, users }: VoteModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const handleVote = () => {
    if (selectedUser) {
      onVote(selectedUser);
      // setSelectedUser(null);
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white" aria-describedby="voting-modal" >
        <DialogTitle>Vote for the Coolest PFP</DialogTitle>
        <div className="grid grid-cols-2 gap-4">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className={`p-2 border rounded-lg cursor-pointer ${
                selectedUser === `${user.id}` ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedUser(`${user.id}`)}
            >
              <Image
                src={user.pfpUrl || "/fallbackAvatar.png"}
                alt={`${user.username}'s profile picture`}
                width={100}
                height={100}
                className="object-cover w-full h-auto rounded-md"
              />
              <p className="mt-2 text-sm text-center">{user.username}</p>
            </div>
          ))}
        </div>
        <Button onClick={handleVote} disabled={!selectedUser} className="w-full mt-4">
          Submit Vote
        </Button>
      </DialogContent>
    </Dialog>
  )
}
