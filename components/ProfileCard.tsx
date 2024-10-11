import { User } from "@prisma/client";
import Image from "next/image";


export default function ProfileCard({user, rank}: {user: User, rank: number}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 rounded-2xl max-w-[200px] mx-auto">
      <Image src={user.pfpUrl || "/fallbackAvatar.png"} className="aspect-square w-full max-w-[200px] h-auto rounded-xl shadow mb-2" alt={`${user.username}'s pfp`} width={400} height={400} />
      <h1 className="text-xl font-bold font-mono">{user.username}</h1>
      <p className="text-sm">#{rank}</p>
    </div>
  )
}