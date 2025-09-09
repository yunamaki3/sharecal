'use client'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

export default function GoogleOnboarding(){
    const supabase = createSupabaseBrowser()

    async function connectGoogle(){
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                scopes: 'openid email profile https://www.googleapis.com/auth/calendar',
                queryParams: { access_type: 'offline', prompt: 'consent' },
            }
        })
    }

    return (
        <main className="p-6 max-w-md mx-auto space-y-4">
            <h1 className="text-xl font-semibold">Googleと連携しますか？</h1>
            <p className="text-sm text-gray-600">後から設定画面でも連携できます。</p>
            <div className="space-x-2">
                <button className="border px-3 py-2" onClick={connectGoogle}>Googleに接続</button>
                <a className="underline" href="/">今はスキップ</a>
            </div>
        </main>
    )
}