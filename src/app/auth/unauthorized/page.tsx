'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Unauthorized() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUserEmail()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#556856] to-[#F5F3ED]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-3xl font-playfair text-[#556856] mb-4">
          Accesso Negato
        </h1>
        <p className="text-gray-600 mb-2">
          Spiacente, <span className="font-medium">{userEmail}</span>
        </p>
        <p className="text-gray-600 mb-6">
          Non hai i permessi per accedere a questa pagina durante la fase di sviluppo.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Contatta il team di sviluppo per richiedere l'accesso.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-[#556856] hover:bg-[#444444] text-white font-medium py-2 rounded-lg transition"
        >
          Esci
        </button>
      </div>
    </div>
  )
}
