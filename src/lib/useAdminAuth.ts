import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function useAdminAuth() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser?.email) {
          // Fetch admin role from admin_users table
          const response = await fetch('/api/admin/users', {
            headers: { 'x-user-email': currentUser.email },
          });

          if (response.ok) {
            const data = await response.json();
            // If user can access /api/admin/users, they're at least admin
            // Check role from backend
            setRole('admin'); // Fallback
            setAuthorized(true);
          } else if (response.status === 403) {
            setAuthorized(false);
          }
        }
      } catch (err) {
        console.error('Admin auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  return { user, role, loading, authorized };
}
