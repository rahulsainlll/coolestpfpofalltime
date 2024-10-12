import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface User {
  id: string
  pfpUrl: string
  username: string
}

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (userId: string) => void
  users: User[]
}

export function VoteModal({ isOpen, onClose, onVote, users }: VoteModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const handleVote = () => {
    if (selectedUser) {
      onVote(selectedUser)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader >
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className={`p-2 border rounded-lg cursor-pointer ${
                selectedUser === user.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <Image
                src={user.pfpUrl || "/fallbackAvatar.png"}
                alt={`${user.username}'s profile picture`}
                width={100}
                height={100}
                className="w-full h-auto object-cover rounded-md"
              />
              <p className="mt-2 text-center text-sm">{user.username}</p>
            </div>
          ))}
        </div>
        <Button onClick={handleVote} disabled={!selectedUser} className="mt-4 w-full">
          Submit Vote
        </Button>
      </DialogContent>
    </Dialog>
  )
}