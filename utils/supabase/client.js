import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.YOUR_SUPABASE_URL,
    process.env.YOUR_SUPABASE_ANON_KEY
  )
}
