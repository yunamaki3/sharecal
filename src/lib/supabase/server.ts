import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

function required(name: string) {
    const v = process.env[name]?.trim()
    if (!v) throw new Error(`Missing env: ${name}`)
    return v
}

// Next.js 15 対応：async化 & await cookies()
export async function createSupabaseServer() {
    const cookieStore = await cookies()

    return createServerClient(
        required('NEXT_PUBLIC_SUPABASE_URL'),
        required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options, maxAge: 0 })
                },
            },
        }
    )
}
