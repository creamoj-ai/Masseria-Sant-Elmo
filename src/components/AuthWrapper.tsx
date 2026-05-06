'use client'

import { useAuth } from '@/lib/useAuth'
import Login from '@/app/auth/login/page'
import Unauthorized from '@/app/auth/unauthorized/page'
import { useEffect } from 'react'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, authorized } = useAuth()

  useEffect(() => {
    console.log('[AuthWrapper] State:', { user: user?.email, loading, authorized })
  }, [user, loading, authorized])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#556856] to-[#F5F3ED]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#556856] border-t-[#F5F3ED] rounded-full mx-auto mb-4"></div>
          <p className="text-[#556856]">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('[AuthWrapper] No user, showing login')
    return <Login />
  }

  if (!authorized) {
    console.log('[AuthWrapper] User not authorized, showing unauthorized page')
    return <Unauthorized />
  }

  console.log('[AuthWrapper] User authorized, showing content')
  return <>{children}</>
}
