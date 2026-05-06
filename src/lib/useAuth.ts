import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ALLOWED_EMAILS } from './allowlist'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      setUser(currentUser)
      setAuthorized(currentUser && ALLOWED_EMAILS.includes(currentUser.email || '') ? true : false)
      setLoading(false)
    }

    checkAuth()
  }, [])

  return { user, loading, authorized }
}
