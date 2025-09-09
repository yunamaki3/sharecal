import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request){
    const supabase = await createSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession()
    const url = new URL(error ? '/auth/register?error=oauth' : '/', request.url)
    return NextResponse.redirect(url)
}