"use client"

import { useAuth } from "@/lib/context/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const { login, register } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const loginValue = formData.get("login") as string
    const passwordValue = formData.get("password") as string

    if (!loginValue || !passwordValue) {
      setMessage({ text: "Введите логин и пароль", type: "error" })
      setLoading(false)
      return
    }

    try {
      const user = await login(loginValue, passwordValue)

      if (user?.role === "Администратор") {
        router.push("/admin")
      } else if (user?.role === "Организатор") {
        router.push("/organizer")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setMessage({ text: err.message ?? "Ошибка входа", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.target as HTMLFormElement)

    const loginValue = formData.get("login") as string
    const emailValue = formData.get("email") as string
    const passwordValue = formData.get("password") as string
    const nicknameValue = formData.get("nickname") as string

    if (!loginValue || !emailValue || !passwordValue) {
      setMessage({ text: "Заполните обязательные поля", type: "error" })
      setLoading(false)
      return
    }

    try {
      await register({
        login: loginValue,
        email: emailValue,
        nickname: nicknameValue || null,
        password: passwordValue,
      })

      const user = await login(loginValue, passwordValue)

      if (user?.role === "Администратор") {
        router.push("/admin")
      } else if (user?.role === "Организатор") {
        router.push("/organizer")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      setMessage({ text: err.message ?? "Ошибка регистрации", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden
      bg-gradient-to-br from-slate-100 via-white to-slate-200
    dark:from-slate-950 dark:via-slate-900 dark:to-black">

      {/* Фоновое неоновое пятно */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] 
     bg-purple-400/20 dark:bg-purple-600/20 
       blur-[120px] rounded-full" />

      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] 
      bg-cyan-400/20 dark:bg-cyan-600/20 
        blur-[120px] rounded-full" />

      <Card className="relative w-full max-w-md 
        backdrop-blur-xl
        bg-white/70 dark:bg-slate-900/70
        border border-white/30 dark:border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        rounded-2xl
        transition-all duration-300">

        <CardContent className="p-10">

          <h1 className="text-3xl font-bold text-center mb-2
            bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]
            bg-clip-text text-transparent">
            Up11 Esports
          </h1>

          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
            Система киберспортивной лиги
          </p>

          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm transition-all
            ${message.type === "error"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                }`}>
              {message.text}
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">

            <TabsList className="grid grid-cols-2 mb-6 
          bg-slate-200/60 dark:bg-slate-800/60
          rounded-lg p-1">

              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white 
                       dark:data-[state=active]:bg-slate-900
                       data-[state=active]:shadow-sm
                       rounded-md transition-all">
                Вход
              </TabsTrigger>

              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white 
                       dark:data-[state=active]:bg-slate-900
                       data-[state=active]:shadow-sm
                       rounded-md transition-all">
                Регистрация
              </TabsTrigger>

            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">

                <Input
                  name="login"
                  placeholder="Логин"
                  className="bg-white/80 dark:bg-slate-800/80 
                         focus-visible:ring-[var(--accent-purple)]
                         rounded-lg"
                />

                <Input
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  className="bg-white/80 dark:bg-slate-800/80 
                         focus-visible:ring-[var(--accent-purple)]
                         rounded-lg"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg
                    bg-gradient-to-r 
                    from-[var(--accent-purple)] 
                    to-[var(--accent-cyan)]
                    hover:opacity-90
                    hover:shadow-[0_0_25px_rgba(218,112,214,0.4)]
                    transition-all duration-300
                    font-medium">
                  {loading ? "Вход..." : "Войти"}
                </Button>

              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">

                <Input name="login" placeholder="Логин"
                  className="bg-white/80 dark:bg-slate-800/80 rounded-lg" />

                <Input name="email" placeholder="Email"
                  className="bg-white/80 dark:bg-slate-800/80 rounded-lg" />

                <Input name="nickname" placeholder="Игровой ник"
                  className="bg-white/80 dark:bg-slate-800/80 rounded-lg" />

                <Input name="password" type="password" placeholder="Пароль"
                  className="bg-white/80 dark:bg-slate-800/80 rounded-lg" />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg
                    bg-gradient-to-r 
                    from-[var(--accent-purple)] 
                    to-[var(--accent-cyan)]
                    hover:opacity-90
                    hover:shadow-[0_0_25px_rgba(218,112,214,0.4)]
                    transition-all duration-300
                    font-medium">
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>

              </form>
            </TabsContent>

          </Tabs>

        </CardContent>
      </Card>
    </div>
  )
}