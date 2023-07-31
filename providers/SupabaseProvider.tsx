"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from "@supabase/auth-helpers-react"

import { Database } from "@/types_db"

interface SupabaseProviderProps{
    children: React.ReactNode
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({children}) => {
    const supabase = createClientComponentClient<Database>()

    return (
        <SessionContextProvider supabaseClient={supabase}>
            {children}
        </SessionContextProvider>
    )
}

export default SupabaseProvider