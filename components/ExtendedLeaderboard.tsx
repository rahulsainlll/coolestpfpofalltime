'use client'

import Image from "next/image";
import { User } from "@prisma/client";
import { motion } from "framer-motion";

type UserWithVotes = User & {
  totalVotes: number;
};

function ExtendedProfileCard({ user, rank }: { user: UserWithVotes; rank: number }) {
  return (
    <motion.a 
      className="relative flex flex-col items-center justify-center p-2 border-[1px] rounded-2xl max-w-[160px] mx-auto bg-[#f8f8f8] overflow-hidden"
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      href={`/u/${user.twitterId}`}
    >
      <div className="relative z-10">
        <div className="relative">
          <Image
            src={user.pfpUrl || "/fallbackAvatar.png"}
            className="aspect-square w-full max-w-[150px] h-auto rounded-xl shadow mb-2"
            alt={`${user.username}'s pfp`}
            width={150}
            height={150}
            objectFit="cover"
          />
        </div>
        <h1 className="mb-1 font-mono text-[12px] font-bold text-center text-gray-800 truncate w-full">{user.username}</h1>
        <p className="text-xs text-gray-600 text-center">Rank: #{rank}</p>
        <p className="text-xs text-green-600 font-mono text-center">Votes: {user.totalVotes}</p>
      </div>
    </motion.a>
  );
}

export default function ExtendedLeaderboard({ users }: { users: UserWithVotes[] }) {
  const extendedUsers = users.slice(5); // Start from rank 6

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">might overtake</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {extendedUsers.map((user, index) => (
          <ExtendedProfileCard 
            key={user.id} 
            user={user} 
            rank={index + 6} 
          />
        ))}
      </div>
    </div>
  );
}