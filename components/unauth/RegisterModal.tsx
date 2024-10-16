'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (token: string) => void
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [pfpUrl, setPfpUrl] = useState("")
  const [twitterId, setTwitterId] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch('/api/directcreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twitterId: username,
          username: name,
          pfpUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.message === 'User already exists') {
          setError('This username is already taken. Please choose a different one.')
        } else {
          localStorage.setItem('token', data.token)
          onAuthSuccess(data.token)
          onClose()
        }
      } else {
        setError(data.error || 'Failed to create user. Please try again.')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ twitterId }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        onAuthSuccess(data.token)
        onClose()
      } else {
        setError(data.error || 'Failed to log in. Please try again.')
      }
    } catch (error) {
      console.error('Error logging in:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Register or login to start voting.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="register">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pfpUrl" className="text-right">
                    PFP URL
                  </Label>
                  <Input
                    id="pfpUrl"
                    value={pfpUrl}
                    onChange={(e) => setPfpUrl(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type="submit">Register</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="twitterId" className="text-right">
                    Twitter ID
                  </Label>
                  <Input
                    id="twitterId"
                    value={twitterId}
                    onChange={(e) => setTwitterId(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type="submit">Login</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}