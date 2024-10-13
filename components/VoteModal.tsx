'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserWithRelations } from '@/types'
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface User extends UserWithRelations {
  _count: { votesReceived: number }
}

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (userId: number) => Promise<void>
  users: User[]
}

export function VoteModal({ isOpen, onClose, onVote, users }: VoteModalProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  
  const handleVote = async () => {
    if (selectedUser !== null) {
      setIsVoting(true)
      try {
        await onVote(selectedUser)
      } finally {
        setIsVoting(false)
        onClose()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isVoting && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white" aria-describedby="voting-modal">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center font-mono">Vote for the Coolest PFP</DialogTitle>
        </DialogHeader>
        {users.length === 0 ? (
          <p className="text-center text-lg">No more users available!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {users.map((user) => (
              <motion.div
                key={user.id}
                className={`relative p-2 border rounded-lg cursor-pointer overflow-hidden ${
                  selectedUser === user.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                }`}
                onClick={() => !isVoting && setSelectedUser(user.id)}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className={`absolute inset-0 bg-gradient-to-bl from-gray-200 via-gray-100 to-gray-200 opacity-60 animate-gradient-diagonal-slow`}></div>
                <div className="relative z-10">
                  <div className="relative w-full pb-[100%] mb-1">
                    <Image
                      src={user.pfpUrl || "/fallbackAvatar.png"}
                      alt={`${user.username || 'User'}'s profile picture`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md shadow-sm"
                    />
                  </div>
                  <h2 className="text-xs font-semibold text-center text-gray-800 truncate">
                    {user.username || 'Anonymous'}
                  </h2>
                  <p className="text-xs text-center text-green-600">
                    Votes: {user._count.votesReceived}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <Button 
          onClick={handleVote} 
          disabled={selectedUser === null || isVoting}
          className="w-full mt-4 text-sm font-semibold"
        >
          {isVoting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Vote'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}