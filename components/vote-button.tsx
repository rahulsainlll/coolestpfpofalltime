"use client";

import { Button } from "./ui/button";

export default function VoteButton({username, id}: {username: string, id: number}) {
  const voteForUser = async (id: number) => {
    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ votedUserId: id }),
    });

    if (response.ok) {
      console.log('Voted for user');
    } else {
      console.error('Failed to vote for user');
    }
  }

  return (
    <Button
      disabled={!id}
      className="rounded-xl mt-4 font-mono"
      onClick={() => id && voteForUser(id)}
    >
      Vote For {username}
    </Button>
  )
}