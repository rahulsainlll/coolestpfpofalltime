'use client'

import { ReactNode } from 'react'
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'

interface KindeSessionProviderProps {
  children: ReactNode
}

export function KindeSessionProvider({ children }: KindeSessionProviderProps) {
  return (
    <KindeProvider>
      {children}
    </KindeProvider>
  )
}