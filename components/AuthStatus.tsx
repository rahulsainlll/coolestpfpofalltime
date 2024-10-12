'use client'

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import { Button } from '@/components/ui/button'

export function AuthStatus() {
  const { isAuthenticated, isLoading, user, login, logout } = useKindeAuth() as unknown as { isAuthenticated: boolean, isLoading: boolean, user: any, login: () => void, logout: () => void }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.given_name}!</p>
        <Button onClick={() => logout()}>Log out</Button>
      </div>
    )
  }

  return <Button onClick={() => login()}>Log in</Button>
}