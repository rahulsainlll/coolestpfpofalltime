'use client'

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { VoteModal } from "./VoteModal"
import Link from "next/link"
import Loader from "./Loader"
import { LucideListOrdered, LucideLogIn, LucideStar, LucideUser } from "lucide-react"
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import BrandLogo from "./brand-logo"
import Nav from "./nav"
import { Toaster } from "./ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { AuthModal } from "./unauth/RegisterModal"
import { UserWithRelations } from "@/types/types"

const CELL_SIZE = 70

const Cell = memo(({ columnIndex, rowIndex, style, data }: any) => {
  const index = rowIndex * data.columnCount + columnIndex
  const imageUrl = data.users[index]

  if (!imageUrl) return null

  return (
    <div style={style}>
      <Image
        src={imageUrl}
        alt={`Profile Image ${index}`}
        width={CELL_SIZE}
        height={CELL_SIZE}
        className="object-cover"
        priority={index < 20}
      />
    </div>
  )
})

Cell.displayName = 'Cell'

export default function ProfilePictureCanvas() {
  const [users, setUsers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<UserWithRelations | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    }
  }, [])

  const fetchUser = async (token: string) => {
    console.log('Fetching user with token:', token)
    try {
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        handleAuthError()
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      handleAuthError()
    }
  }

  const handleAuthError = () => {
    setToken(null)
    localStorage.removeItem('token')
    toast({ title: 'Error', description: 'Failed to fetch user. Please log in again.', variant: 'destructive' })
  }

  const fetchUsers = async (): Promise<string[]> => {
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/images?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const res = await response.json()
    return res
  }

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const intervalId = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [loadData])

  useEffect(() => {
    const tweetIntent = "https://twitter.com/intent/post?text=yoo%20%40voltycodes%20%26%20%40rahulsainlll%2C%20just%20saying%20hi%20from%20Coolest%20PFP%20of%20All%20Time!&url=https%3A%2F%2Fcoolestpfpofalltime.com%2F";
    toast({
      className: cn('top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-white'),
      title: "super happy to see you here anon <3",
      description: (
        <p>
          made with ❤️ by {` `}
          <Link href="https://twitter.com/voltycodes" target="_blank" className="text-sky-500 font-semibold font-mono">@voltycodes</Link> 
          {` `} & {` `}
          <Link href="https://twitter.com/rahulsainlll" target="_blank" className="text-sky-500 font-semibold font-mono">@rahulsainlll</Link>
        </p>
      ),
      action: (
        <Link className="border-2 p-1 px-3 text-sm rounded-xl" href={tweetIntent} target="_blank">say hello!</Link>
      ),
    })
  }, [toast])

  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
    fetchUser(newToken)
  }

  if (isLoading) return <Loader error={null} />
  if (error) return <div className="flex items-center justify-center h-full"><p className="text-red-500" role="alert">{error}</p></div>

  return (
    <main className="fixed inset-0 overflow-hidden bg-gray-100 pt-16 md:pt-0">
      <Toaster />
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = Math.floor(width / CELL_SIZE)
          const rowCount = Math.ceil(users.length / columnCount)

          return (
            <Grid
              className="List"
              columnCount={columnCount}
              columnWidth={CELL_SIZE}
              height={height}
              rowCount={rowCount}
              rowHeight={CELL_SIZE}
              width={width}
              itemData={{ users, columnCount }}
              key={users.length}
            >
              {Cell}
            </Grid>
          )
        }}
      </AutoSizer>

      <BrandLogo />

      <Nav>
        <Link href="/leaderboard">
          <Button className="rounded-xl">
            <LucideListOrdered size={14} className="mr-2" />
            Leaderboard
          </Button>
        </Link>
        {user ? (
          <>
            <Button onClick={() => setIsVoteModalOpen(true)} className="rounded-xl">
              <LucideStar size={14} className="mr-2" />
              Vote Profiles
            </Button>
            <Link href="/me">
              <Button className="rounded-xl">
                <LucideUser size={14} className="mr-2" />
                Me
              </Button>
            </Link>
          </>
        ) : (
          <Button onClick={() => setIsAuthModalOpen(true)} className="rounded-xl">
            <LucideLogIn size={14} className="mr-2" />
            Add your PFP
          </Button>
        )}
      </Nav>

      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        currentUser={user}
        token={token}
        onVoteComplete={loadData}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </main>
  )
}
