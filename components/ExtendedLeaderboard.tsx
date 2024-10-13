'use client'

import Image from "next/image";
import { User } from "@prisma/client";
import { motion } from "framer-motion";

type UserWithVotes = User & {
  totalVotes: number;
};

function ExtendedProfileCard({ user, rank }: { user: UserWithVotes; rank: number }) {
  const isPremium = rank <= 3;
  const gradientClass = isPremium
    ? "from-yellow-200 via-sky-200 to-green-200"
    : "from-gray-200 via-gray-100 to-gray-200";

  return (
    <motion.div 
      className={`relative flex flex-col items-center justify-center p-4 border-[1px] rounded-2xl max-w-[200px] mx-auto bg-white overflow-hidden`}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div className={`absolute inset-0 bg-gradient-to-bl ${gradientClass} opacity-60 animate-gradient-diagonal-slow`}></div>
      <div className="relative z-10">
        <div className="relative">
          <Image
            src={user.pfpUrl || "/fallbackAvatar.png"}
            className="aspect-square w-full max-w-[200px] h-auto rounded-xl shadow mb-2"
            alt={`${user.username}'s pfp`}
            width={800}
            height={400}
          />
          
        </div>
        <h1 className="mb-2 font-mono text-[14px] font-bold text-center text-gray-800">{user.username}</h1>
        <p className="text-sm text-gray-600 text-center">Rank: #{rank}</p>
        <p className="text-sm text-green-600 font-mono text-center">Votes: {user.totalVotes}</p>
      </div>
    </motion.div>
  );
}

export default function ExtendedLeaderboard({ users }: { users: UserWithVotes[] }) {
  const extendedUsers = users.slice(3, 50); // Start from rank 4

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">Extended Leaderboard</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {extendedUsers.map((user, index) => (
          <ExtendedProfileCard 
            key={user.id} 
            user={user} 
            rank={index + 4} 
          />
        ))}
      </div>
    </div>
  );
}