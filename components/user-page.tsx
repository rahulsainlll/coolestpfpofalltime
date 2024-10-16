"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import Image from "next/image"
import { colorHash } from "@/lib/utils"
import VoteButton from "./vote-button"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Button } from "@/components/ui/button"
import ProfileShareButton from "./profile-share-button"
import Link from "next/link"
import { LucideBoxSelect, LucideListOrdered, LucideLogOut } from "lucide-react"
import Nav from "./nav"
import BrandLogo from "./brand-logo"
import Loader from "./Loader"
import { UserWithRelations } from "@/types/types"

export default function UserPage({ twitterId }: { twitterId: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserWithRelations | null>(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [timeSinceLastVote, setTimeSinceLastVote] = useState<number | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${twitterId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        setUserData(data.user)
        setIsUserAuthenticated(data.isUserAuthenticated)
        setCurrentUser(data.currentUser)
        setTimeSinceLastVote(data.timeSinceLastVote)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [twitterId])

  if (isLoading || error) {
    return <Loader error={error} loadingMessage="Loading user profile..." />
  }

  if (!userData) {
    return <Layout>User not found</Layout>
  }

  const bgClasses = colorHash(userData.pfpUrl || "coolestpfpofalltime")

  return (
    <Layout className="flex flex-col items-center justify-center h-dvh">
      <BrandLogo />
      <Nav>
        <Button asChild className="rounded-xl mt-4 font-mono">
          <Link href="/">
            <LucideBoxSelect size={14} className="mr-2" />
            Canvas
          </Link>
        </Button>
        <Button asChild className="rounded-xl mt-4 font-mono">
          <Link href="/leaderboard">
            <LucideListOrdered size={14} className="mr-2" />
            Leaderboard
          </Link>
        </Button>
        <LogoutLink>
          <Button className="rounded-xl mt-4 font-mono">
            <LucideLogOut size={14} className="sm:mr-2" />
            <span className="hidden sm:block">Log out</span>
          </Button>
        </LogoutLink>
      </Nav>

      <div className="relative flex flex-col items-center justify-center bg-gray-100 p-8 rounded-2xl max-w-lg w-full overflow-hidden cursor-default shadow">
        <div className={`h-40 w-full absolute top-0 ${bgClasses}`} />
        <div className="relative size-48 overflow-hidden object-contain rounded-[2rem] border-8 p-8 border-gray-100 bg-white/50 shadow mb-2">
          <Image className="border-8 border-transparent rounded-3xl" src={userData.pfpUrl || "/fallback.jpg"} fill alt={`${userData.username}'s PFP`} />
        </div>
        <h1 className="font-mono text-xl font-bold text-center mb-2">{userData.username}</h1>
        <div className="flex gap-2 mb-5">
          <p className="text-sm p-2 px-4 rounded-full bg-white border-2 font-mono">Voted For: {userData.votesGiven.length} Users</p>
          <p className="text-sm p-2 px-4 rounded-full bg-white border-2 font-mono">Votes By: {userData.votesReceived.length} Users</p>
        </div>

        {isUserAuthenticated && currentUser && currentUser.id !== userData.twitterId && timeSinceLastVote && timeSinceLastVote >= 3600000 && (
          <VoteButton username={userData.username || "User"} id={userData.id} />
        )}
        {isUserAuthenticated && currentUser && currentUser.id !== userData.twitterId && timeSinceLastVote && timeSinceLastVote < 3600000 && (
          <Button disabled className="rounded-xl mt-4 font-mono">You can vote again in {Math.ceil((3600000 - timeSinceLastVote) / 60000)} minutes</Button>
        )}
        {!isUserAuthenticated && (<LoginLink><Button className="rounded-xl mt-4 font-mono">Sign In To Vote</Button></LoginLink>)}

        <ProfileShareButton _username={userData.username} self={currentUser && currentUser.id ? currentUser.id === userData.twitterId : false} />
      </div>
    </Layout>
  )
}