'use client'

import Image from "next/image";
import { User } from "@prisma/client";
import { motion } from "framer-motion";

type UserWithVotes = User & {
  totalVotes: number;
};

function ExtendedProfileCard({ user, rank }: { user: UserWithVotes; rank: number }) {
  return (
    <motion.div 
      className="w-[150px] h-[210px]"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <a 
        className="relative flex flex-col items-center justify-center p-2 border-[1px] rounded-xl w-full h-full bg-[#f8f8f8] overflow-hidden"
        href={`/u/${user.twitterId}`}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-[120px] h-[120px]">
            <Image
              src={user.pfpUrl || "/fallbackAvatar.png"}
              className="rounded-lg shadow"
              alt={`${user.username}'s pfp`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h1 className="mt-2 mb-1 font-mono text-[12px] font-bold text-center text-gray-800 truncate w-full">{user.username}</h1>
          <p className="text-xs text-gray-600 text-center">Rank: #{rank}</p>
          <p className="text-xs text-green-600 font-mono text-center">Votes: {user.totalVotes}</p>
        </div>
      </a>
    </motion.div>
  );
}

export default function ExtendedLeaderboard({ users }: { users: UserWithVotes[] }) {
  const extendedUsers = users.slice(5); // Start from rank 6

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold font-mono  mb-4">top-50 ~</h2>
      <div className="grid grid-cols-5 gap-6 justify-items-center max-w-[834px] mx-auto">
      {/* <h2 className="text-xl font-bold  mb-4">they can win</h2> */}
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