import { createServerClient} from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    "https://onrlyldxtqwzyyccyisy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ucmx5bGR4dHF3enl5Y2N5aXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3MDk5NjMsImV4cCI6MjA0MTI4NTk2M30.f8WKTDbEU-iGGYNvXkSwnpo0C41zHCDMGioCffrqwhg",

    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}