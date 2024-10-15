'use client'

import Image from "next/image"
import { User } from "@prisma/client"
import { motion } from "framer-motion"

type UserWithVotes = User & {
  totalVotes: number
}

export default function ProfileCard({ user, rank }: { user: UserWithVotes; rank: number }) {
  const isPremium = rank <= 5
  const gradientClass = isPremium
    ? "from-yellow-200 via-sky-200 to-green-200"
    : "from-gray-200 via-gray-100 to-gray-200"

  return (
    <motion.div
      className="w-[150px] h-[210px]"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <a
        href={`/u/${user.twitterId}`}
        className={`relative flex flex-col items-center justify-center p-2 border-[1px] rounded-xl w-full h-full bg-white overflow-hidden`}
      >
        <div className={`absolute inset-0 bg-gradient-to-bl ${gradientClass} opacity-60 animate-gradient-diagonal-slow`}></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-[120px] h-[120px]">
            <Image
              src={user.pfpUrl || "/fallbackAvatar.png"}
              className="rounded-lg shadow"
              alt={`${user.username}'s pfp`}
              layout="fill"
              objectFit="cover"
            />
            {rank <= 3 && (
              <Image
                src={`/ribbons/${rank}.png`}
                className="absolute rounded-sm bottom-1 right-1 bg-white/80"
                alt={`Rank ${rank} ribbon`}
                width={20}
                height={20}
              />
            )}
          </div>
          <h1 className="mt-2 mb-1 font-mono text-[12px] font-bold text-center text-gray-800 truncate w-full">{user.username}</h1>
          <p className="text-xs text-gray-600 text-center">Rank: #{rank}</p>
          <p className="text-xs text-green-600 font-mono text-center">Votes: {user.totalVotes}</p>
        </div>
      </a>
    </motion.div>
  )
}