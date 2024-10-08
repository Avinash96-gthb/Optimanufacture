import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://onrlyldxtqwzyyccyisy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ucmx5bGR4dHF3enl5Y2N5aXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3MDk5NjMsImV4cCI6MjA0MTI4NTk2M30.f8WKTDbEU-iGGYNvXkSwnpo0C41zHCDMGioCffrqwhg"
  )
}