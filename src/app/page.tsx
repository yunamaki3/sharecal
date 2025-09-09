import { createSupabaseServer } from '@/lib/supabase/server'

export default async function Home() {
    const supabase = await createSupabaseServer()  // ← await 忘れない
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <main className="p-6 space-y-2">
            <h1 className="text-2xl font-bold">sharecal – SSR Ready</h1>
            <p className="text-sm text-gray-600">
                現在の状態: {user ? `ログイン中（${user.email}）` : '未ログイン'}
            </p>
        </main>
    )
}
