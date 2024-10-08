import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    YOUR_SUPABASE_URL,
    YOUR_SUPABASE_ANON_KEY
  )
}
