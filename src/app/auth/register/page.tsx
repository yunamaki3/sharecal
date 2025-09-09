'use client'
import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/browser'

console.log("ENV URL?", process.env.NEXT_PUBLIC_SUPABASE_URL);

// 画面ステップの型
type Step = 'email' | 'otp' | 'password' | 'profile' | 'done'

export default function RegisterPage(){
    const supabase = createSupabaseBrowser()

    const [step, setStep] = useState<Step>('email')
    const [msg, setMsg] = useState('')

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')

    const [userName, setUserName] = useState('')
    const [userHandle, setUserHandle] = useState('')

    async function sendOtp(){
        setMsg('')
        if(!email.includes('@')){ setMsg('メールアドレスの形式が正しくありません'); return }
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${location.origin}/auth/callback` }
        })
        if(error){ setMsg(error.message); return }
        setMsg('メールに6桁コードを送りました。届いたコードを入力してください。')
        setStep('otp')
    }

    async function verifyOtp(){
        setMsg('')
        const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
        if(error){ setMsg(error.message); return }
        // サインイン完了（Cookieがセット）→ 次はPW設定
        setStep('password')
    }

    async function setPw(){
        setMsg('')
        if(password.length < 6){ setMsg('パスワードは6文字以上にしてください'); return }
        const { error } = await supabase.auth.updateUser({ password })
        if(error){ setMsg(error.message); return }
        setStep('profile')
    }

    async function saveProfile(){
        setMsg('')
        const { data: { user } } = await supabase.auth.getUser()
        if(!user){ setMsg('セッションを確認できませんでした'); return }

        const { error } = await supabase.from('profiles').upsert({
            user_id: user.id,
            user_name: userName || null,
            user_handle: userHandle || null,
        })
        if(error){ setMsg(error.message); return }

        setStep('done')
        // 案内：Google連携へ
        location.href = '/onboarding/google'
    }

    return (
        <main className="p-6 max-w-md mx-auto space-y-4">
            <h1 className="text-xl font-semibold">新規登録</h1>
            {step === 'email' && (
                <div className="space-y-2">
                    <input className="border p-2 w-full" placeholder="メールアドレス" value={email} onChange={e=>setEmail(e.target.value)} />
                    <button className="border px-3 py-2" onClick={sendOtp}>6桁コードを送る</button>
                </div>
            )}

            {step === 'otp' && (
                <div className="space-y-2">
                    <input className="border p-2 w-full" placeholder="届いた6桁コード" value={otp} onChange={e=>setOtp(e.target.value)} />
                    <button className="border px-3 py-2" onClick={verifyOtp}>コードを確認</button>
                </div>
            )}

            {step === 'password' && (
                <div className="space-y-2">
                    <input type="password" className="border p-2 w-full" placeholder="パスワード（6文字以上）" value={password} onChange={e=>setPassword(e.target.value)} />
                    <button className="border px-3 py-2" onClick={setPw}>パスワードを設定</button>
                </div>
            )}

            {step === 'profile' && (
                <div className="space-y-2">
                    <input className="border p-2 w-full" placeholder="ユーザー名（表示名）" value={userName} onChange={e=>setUserName(e.target.value)} />
                    <input className="border p-2 w-full" placeholder="ユーザーID（@handle）" value={userHandle} onChange={e=>setUserHandle(e.target.value)} />
                    <button className="border px-3 py-2" onClick={saveProfile}>プロフィールを保存</button>
                </div>
            )}

            {step === 'done' && (
                <p>登録完了！ホームに戻ります…</p>
            )}

            {msg && <p className="text-sm text-gray-600">{msg}</p>}
        </main>
    )
}