"use client";

import { Button } from "./ui/button";
import { LucideStar } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useState } from "react";

export default function VoteButton({username, id}: {username: string, id: number}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const voteForUser = async (id: number) => {
    setIsLoading(true)
    try {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ votedUserId: id }),
    });
    if (!response.ok) {
      throw new Error('Failed to vote')
    }
    router.refresh()
  } catch (error) {
    console.error('Error voting:', error)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <Button
      disabled={isLoading || !id}
      className="rounded-xl mt-4 font-mono"
      onClick={() => id && voteForUser(id)}
    >
     {isLoading ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Voting...
        </>
      ) : (
        <>
          <LucideStar size={14} className="mr-2" />
          Vote for {username}
        </>
      )}
    </Button>
  )
}