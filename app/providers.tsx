
'use client'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { SupabaseContext } from '@/lib/supabaseContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseClient())
  return (
    <SupabaseContext.Provider value={supabase}>
      <SessionContextProvider supabaseClient={supabase}>
        {children}
      </SessionContextProvider>
    </SupabaseContext.Provider>
  )
}
