'use client'
import { createBrowserClient } from '@supabase/ssr'

function required(name: string) {
    const v = process.env[name]?.trim()
    if (!v) throw new Error(`Missing env: ${name}`)
    return v
}

export function createSupabaseBrowser() {
    return createBrowserClient(
        required('NEXT_PUBLIC_SUPABASE_URL'),
        required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    )
}
