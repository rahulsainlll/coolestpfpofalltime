'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LucideStar, LucideCheck } from "lucide-react"

export default function VoteButton({ username, id }: { username: string, id: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const lastVoteTime = localStorage.getItem(`lastVoteTime_${id}`)
    if (lastVoteTime) {
      const timeElapsed = Date.now() - parseInt(lastVoteTime)
      if (timeElapsed < 3600000) {
        setHasVoted(true)
        setCooldownTime(3600000 - timeElapsed)
      }
    }
  }, [id])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer)
            setHasVoted(false)
            return 0
          }
          return prevTime - 1000
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownTime])

  const voteForUser = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ votedUserId: id }),
      })
      if (!response.ok) {
        throw new Error('Failed to vote')
      }
      setHasVoted(true)
      setCooldownTime(3600000) // 1 hour in milliseconds
      localStorage.setItem(`lastVoteTime_${id}`, Date.now().toString())
      router.refresh()
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Button
      disabled={isLoading || hasVoted}
      className="rounded-xl mt-4 font-mono"
      onClick={voteForUser}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Voting...
        </>
      ) : hasVoted ? (
        <>
          <LucideCheck size={14} className="mr-2" />
          Voted! ({formatTime(cooldownTime)})
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