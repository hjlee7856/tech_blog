import { createContext, useContext } from 'react'
import type { SupabaseClient } from '@supabase/auth-helpers-react'

export const SupabaseContext = createContext<SupabaseClient | undefined>(undefined)

export function useSupabaseClient() {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('SupabaseClient is not provided')
  return context
}
